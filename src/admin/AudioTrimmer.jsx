import { useEffect, useRef, useState } from 'react'
import { Play, Pause, Scissors, RotateCcw } from 'lucide-react'

const fmt = (t) => {
  if (t == null || Number.isNaN(t)) return '0:00'
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  const d = Math.floor((t % 1) * 10)
  return `${m}:${String(s).padStart(2, '0')}.${d}`
}

export default function AudioTrimmer({ src, start = 0, end = 0, onChange }) {
  const canvasRef = useRef(null)
  const audioRef = useRef(null)
  const wrapRef = useRef(null)
  const [peaks, setPeaks] = useState(null)
  const [duration, setDuration] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [pos, setPos] = useState(0)
  const dragRef = useRef(null)

  // Decode the file and compute waveform peaks (works for blob: and Supabase URLs)
  useEffect(() => {
    if (!src) return
    let cancelled = false
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    setPeaks(null)
    ;(async () => {
      try {
        const res = await fetch(src)
        if (!res.ok) throw new Error('fetch failed')
        const buf = await res.arrayBuffer()
        const audio = await ctx.decodeAudioData(buf)
        if (cancelled) return
        const ch = audio.getChannelData(0)
        const n = 900
        const block = Math.max(1, Math.floor(ch.length / n))
        const out = []
        for (let i = 0; i < n; i++) {
          let max = 0
          for (let j = 0; j < block; j++) {
            const v = Math.abs(ch[i * block + j] || 0)
            if (v > max) max = v
          }
          out.push(max)
        }
        setPeaks(out)
        setDuration(audio.duration)
      } catch {
        // fall back to <audio> metadata duration (e.g. CORS-restricted source)
        if (!cancelled && audioRef.current && !Number.isNaN(audioRef.current.duration)) {
          setDuration(audioRef.current.duration)
        }
      }
      ctx.close()
    })()
    return () => {
      cancelled = true
      ctx.close()
    }
  }, [src])

  // Draw waveform + trim shading
  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const w = wrap.clientWidth || 600
    const h = 76
    const dpr = window.devicePixelRatio || 1
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    const c = canvas.getContext('2d')
    c.setTransform(dpr, 0, 0, dpr, 0, 0)
    c.clearRect(0, 0, w, h)

    const dur = duration || 0
    const sx = dur ? (start / dur) * w : 0
    const ex = dur ? (end / dur) * w : w

    if (peaks && peaks.length) {
      const n = peaks.length
      const gap = w / n
      const barW = Math.max(1, gap * 0.62)
      peaks.forEach((p, i) => {
        const x = i * gap
        const inside = x >= sx && x <= ex
        c.fillStyle = inside ? '#ff4d6d' : 'rgba(25,26,35,0.16)'
        const hh = Math.max(1.5, p * (h - 14))
        c.fillRect(x + (gap - barW) / 2, (h - hh) / 2, barW, hh)
      })
    } else {
      // placeholder bars when decode is unavailable
      c.fillStyle = 'rgba(25,26,35,0.12)'
      for (let x = 0; x < w; x += 8) {
        const hh = 10 + ((x * 7) % 26)
        c.fillRect(x, (h - hh) / 2, 3, hh)
      }
    }

    // tint the kept region
    if (dur) {
      c.fillStyle = 'rgba(255,77,109,0.10)'
      c.fillRect(sx, 0, ex - sx, h)
    }
  }, [peaks, duration, start, end])

  // Playback listeners
  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const onTime = () => setPos(a.currentTime)
    const onEnded = () => {
      setPlaying(false)
      setPos(0)
    }
    const onMeta = () => {
      if (!duration && !Number.isNaN(a.duration)) setDuration(a.duration)
    }
    a.addEventListener('timeupdate', onTime)
    a.addEventListener('ended', onEnded)
    a.addEventListener('loadedmetadata', onMeta)
    return () => {
      a.removeEventListener('timeupdate', onTime)
      a.removeEventListener('ended', onEnded)
      a.removeEventListener('loadedmetadata', onMeta)
    }
  }, [duration])

  // Pause at the trim end during preview
  useEffect(() => {
    const a = audioRef.current
    if (!a || !playing) return
    const id = window.setInterval(() => {
      const e = Number(end) || 0
      if (e > (Number(start) || 0) && a.currentTime >= e) {
        a.pause()
        setPlaying(false)
      }
    }, 120)
    return () => window.clearInterval(id)
  }, [playing, start, end])

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (playing) {
      a.pause()
      setPlaying(false)
      return
    }
    a.currentTime = Number(start) || 0
    a.play().catch(() => setPlaying(false))
    setPlaying(true)
  }

  // Drag handles via window-level pointer events
  useEffect(() => {
    const move = (e) => {
      if (!dragRef.current || !wrapRef.current || !duration) return
      const rect = wrapRef.current.getBoundingClientRect()
      const frac = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
      const t = frac * duration
      if (dragRef.current === 'start') {
        onChange(Math.max(0, Math.min(t, Number(end) || duration)), end)
      } else {
        onChange(start, Math.max(Number(start) || 0, Math.min(t, duration)))
      }
    }
    const up = () => {
      dragRef.current = null
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [duration, start, end, onChange])

  const pct = (t) => (duration ? `${(t / duration) * 100}%` : '0%')

  if (!src) return null

  return (
    <div className="rounded-xl border-2 border-ink/10 bg-white p-3 dark:border-nightline dark:bg-nightcard">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-ink/60 dark:text-bone/60">
          <Scissors className="size-3.5" /> Trim
        </span>
        <div className="flex items-center gap-2 text-xs font-bold text-ink/70 dark:text-bone/75">
          <button
            type="button"
            onClick={toggle}
            className="sticker flex size-8 items-center justify-center rounded-full bg-sun text-ink"
            aria-label={playing ? 'Pause preview' : 'Play trimmed preview'}
          >
            {playing ? <Pause className="size-4 fill-current" /> : <Play className="ml-0.5 size-4 fill-current" />}
          </button>
          <span>
            <span className="text-punch">{fmt(Number(start) || 0)}</span> —{' '}
            <span className="text-punch">{fmt(Number(end) || 0)}</span> / {fmt(duration)}
          </span>
          {(Number(start) || 0) > 0 || (Number(end) || 0) > 0 ? (
            <button
              type="button"
              onClick={() => onChange(0, 0)}
              className="inline-flex items-center gap-1 rounded-full bg-ink/10 px-2 py-1 font-extrabold text-ink/70 hover:bg-punch/15 hover:text-punch dark:bg-bone/10 dark:text-bone/70"
            >
              <RotateCcw className="size-3" /> Clear
            </button>
          ) : null}
        </div>
      </div>

      <div ref={wrapRef} className="relative w-full select-none">
        <canvas ref={canvasRef} className="block w-full cursor-pointer rounded-lg" />
        {/* playhead */}
        <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-punch" style={{ left: pct(pos) }} />
        {/* start handle */}
        {duration > 0 && (
          <div
            onPointerDown={(e) => {
              e.preventDefault()
              dragRef.current = 'start'
            }}
            className="absolute top-0 bottom-0 z-10 -ml-1.5 flex w-3 cursor-ew-resize touch-none items-center"
            style={{ left: pct(Number(start) || 0) }}
            title="Drag to set trim start"
          >
            <span className="h-full w-1 rounded-full bg-punch" />
            <span className="absolute -top-1 left-1/2 size-3 -translate-x-1/2 rounded-full border-2 border-white bg-punch" />
          </div>
        )}
        {/* end handle */}
        {duration > 0 && (
          <div
            onPointerDown={(e) => {
              e.preventDefault()
              dragRef.current = 'end'
            }}
            className="absolute top-0 bottom-0 z-10 -ml-1.5 flex w-3 cursor-ew-resize touch-none items-center"
            style={{ left: pct(Number(end) || 0) }}
            title="Drag to set trim end"
          >
            <span className="h-full w-1 rounded-full bg-punch" />
            <span className="absolute -top-1 left-1/2 size-3 -translate-x-1/2 rounded-full border-2 border-white bg-punch" />
          </div>
        )}
      </div>
      <audio ref={audioRef} src={src} preload="metadata" className="hidden" />
    </div>
  )
}
