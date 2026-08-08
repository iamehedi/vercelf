import { useEffect, useRef, useState } from 'react'
import { Play, Pause, Music2, ExternalLink } from 'lucide-react'
import { useContent } from '../lib/useContent'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

const fmtTime = (s) => {
  if (!Number.isFinite(s) || s < 0) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${String(sec).padStart(2, '0')}`
}

export default function Music() {
  const { music } = useContent()
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState({ current: 0, duration: 0 })
  const audioRef = useRef(null)
  const track = music.playlist[active] ?? {}
  const progress = time.duration > 0 ? Math.min(100, (time.current / time.duration) * 100) : 0

  const toggle = (i) => {
    if (i === active) setPlaying((p) => !p)
    else {
      setActive(i)
      setPlaying(true)
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    if (playing && track.audioUrl) {
      audio.src = track.audioUrl
      audio.play().catch(() => setPlaying(false))
    }
  }, [active, playing, track.audioUrl])

  // Trim: jump to audioStart when the file loads, stop at audioEnd
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onMetadata = () => {
      const start = Number(track.audioStart) || 0
      if (start > 0 && start < (audio.duration || Infinity)) {
        audio.currentTime = start
      }
    }
    const onTime = () => {
      const start = Number(track.audioStart) || 0
      const end = Number(track.audioEnd)
      const fileEnd = end > start ? Math.min(end, audio.duration || Infinity) : audio.duration
      const total = fileEnd - start
      setTime({
        current: Math.max(0, audio.currentTime - start),
        duration: total > 0 ? total : 0,
      })
      if (end > start && audio.currentTime >= end) {
        audio.pause()
        setPlaying(false)
      }
    }
    const onEnded = () => setPlaying(false)
    audio.addEventListener('loadedmetadata', onMetadata)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('loadedmetadata', onMetadata)
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('ended', onEnded)
    }
  }, [track.audioStart, track.audioEnd, active, playing])

  // Reset the indicator whenever a new track is selected
  useEffect(() => {
    setTime({ current: 0, duration: 0 })
  }, [active, track.audioUrl])

  // Nothing to show — hide the whole section instead of an empty player
  if (!music?.playlist?.length) return null

  return (
    <section id="music" className="relative scroll-mt-24 bg-white py-24 dark:bg-night">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          kicker="Tune in"
          title={
            <>
              My <span className="text-punch">vibe</span> 🎧
            </>
          }
        />

        <div className="grid gap-8 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <div
              className={`sticker relative flex h-full flex-col items-center justify-center overflow-hidden rounded-[2rem] p-8 text-center text-cream ${
                track.coverUrl ? '' : 'bg-gradient-to-br from-grape to-punch'
              }`}
              style={
                track.coverUrl
                  ? {
                      backgroundImage: `url("${track.coverUrl}")`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }
                  : undefined
              }
            >
              {track.coverUrl && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-b from-night/30 via-night/45 to-night/75"
                />
              )}
              <div className="relative flex flex-col items-center">
                <div
                  className={`flex size-40 items-center justify-center rounded-full bg-night ring-4 ring-cream/30 ${
                    playing ? 'animate-spin-slow' : ''
                  }`}
                >
                  <span className="text-7xl">💿</span>
                </div>
                <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.25em] text-cream/70">
                  {playing ? 'Now playing' : 'Paused'}
                </p>
                <h3 className="mt-1 font-display text-2xl font-extrabold">{track.title}</h3>
                <p className="font-semibold text-cream/80">{track.artist}</p>

                <div className="mt-5 flex h-8 items-end gap-1.5">
                  {[0, 1, 2, 3, 4].map((b) => (
                    <span
                      key={b}
                      className={`eq-bar w-2 rounded-full bg-sun ${playing ? 'animate-eq' : 'h-1.5'}`}
                      style={{ height: playing ? `${40 + b * 12}%` : '6px' }}
                    />
                  ))}
                </div>

                <div className="mt-6 w-full max-w-xs">
                  <div className="h-3 overflow-hidden rounded-full border-2 border-cream/40 bg-white/10">
                    <div
                      className="h-full rounded-full bg-sun transition-[width] duration-300 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-1.5 flex justify-between text-xs font-bold tabular-nums text-cream/70">
                    <span>{fmtTime(time.current)}</span>
                    <span>{time.duration > 0 ? fmtTime(time.duration) : '--:--'}</span>
                  </div>
                </div>
                <p className="mt-4 text-sm font-semibold text-cream/80">{music.vibe}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150} className="lg:col-span-3">
            <ul className="sticker overflow-hidden rounded-[2rem] bg-white dark:bg-nightcard">
              {music.playlist.map((item, i) => {
                const isActive = i === active
                return (
                  <li
                    key={item.title}
                    className={`flex items-center gap-4 border-b-2 border-dashed border-ink/10 px-5 py-4 last:border-b-0 dark:border-nightline ${
                      isActive ? 'bg-sun/20 dark:bg-grape/20' : ''
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      aria-label={`${isActive && playing ? 'Pause' : 'Play'} ${item.title}`}
                      className="sticker flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-ink dark:bg-nightcard dark:text-bone"
                    >
                      {isActive && playing ? (
                        <Pause className="size-5 fill-current" />
                      ) : (
                        <Play className="ml-0.5 size-5 fill-current" />
                      )}
                    </button>
                    <span className="text-2xl">{item.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-extrabold">{item.title}</p>
                      <p className="truncate text-sm font-semibold text-ink/55 dark:text-bone/60">
                        {item.artist}
                      </p>
                    </div>
                    {item.audioUrl ? (
                      <span className="hidden items-center gap-1 rounded-full bg-mint/20 px-3 py-1 text-xs font-extrabold text-mint sm:flex">
                        <Music2 className="size-3.5" /> playable
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-ink/45 dark:text-bone/50">
                        {item.duration}
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
            <audio ref={audioRef} preload="metadata" />
          </Reveal>
        </div>

        {music.spotifyEmbedUrl && (
          <Reveal delay={200} className="mt-10">
            <iframe
              src={music.spotifyEmbedUrl}
              title="My favourite playlist on Spotify"
              className="h-24 w-full rounded-3xl border-0"
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            />
          </Reveal>
        )}

        <Reveal delay={250} className="mt-10 text-center">
          <a
            href="https://open.spotify.com/"
            target="_blank"
            rel="noreferrer"
            className="sticker inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-base font-extrabold text-cream hover:-rotate-1 dark:bg-bone dark:text-night"
          >
            <ExternalLink className="size-5" /> Follow my playlists
          </a>
        </Reveal>
      </div>
    </section>
  )
}
