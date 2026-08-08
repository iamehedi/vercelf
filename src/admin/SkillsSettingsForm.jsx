import { useEffect, useState } from 'react'
import { Save, CheckCircle2, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function SkillsSettingsForm() {
  const [marquee, setMarquee] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    supabase
      .from('skills_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error && data) setMarquee(data.marquee ?? '')
        setLoading(false)
      })
  }, [])

  const save = async (e) => {
    e.preventDefault()
    const clean = marquee.slice(0, 6000)
    setBusy(true)
    setNotice(null)
    const { error } = await supabase
      .from('skills_settings')
      .upsert({ id: 1, marquee: clean })
    if (error) setNotice({ type: 'error', text: error.message })
    else setNotice({ type: 'ok', text: 'Marquee saved — live on the site now.' })
    setBusy(false)
  }

  const base =
    'w-full rounded-2xl border-3 border-ink bg-cream px-4 py-2.5 font-semibold outline-none transition-shadow focus:shadow-[4px_4px_0_#ffc24b] dark:border-nightline dark:bg-night dark:text-bone dark:placeholder:text-bone/40'

  return (
    <div>
      <h2 className="font-display text-2xl font-extrabold">Skills</h2>
      <p className="mt-1 text-sm font-semibold text-ink/55 dark:text-bone/55">
        The scrolling marquee strip between About and Skills — one item per line.
      </p>

      {notice && (
        <p
          className={`mt-4 flex items-center gap-2 rounded-2xl border-2 px-4 py-3 text-sm font-bold ${
            notice.type === 'error'
              ? 'border-punch/30 bg-punch/10 text-punch'
              : 'border-mint/30 bg-mint/10 text-mint'
          }`}
        >
          {notice.type === 'error' ? <AlertCircle className="size-4" /> : <CheckCircle2 className="size-4" />}
          {notice.text}
        </p>
      )}

      {loading ? (
        <p className="py-8 text-center text-sm font-bold text-ink/50 dark:text-bone/50">Loading…</p>
      ) : (
        <form onSubmit={save} className="mt-5 max-w-3xl space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-extrabold">Marquee items</span>
            <textarea
              rows={6}
              maxLength={6000}
              value={marquee}
              onChange={(e) => setMarquee(e.target.value)}
              placeholder={'React\nNode.js\nTypeScript\n…'}
              className={`${base} resize-y`}
            />
            <span className="mt-1.5 block text-xs font-semibold text-ink/50 dark:text-bone/50">
              One technology per line — they scroll in the yellow strip.
            </span>
          </label>
          <button
            type="submit"
            disabled={busy}
            className="sticker inline-flex items-center gap-2 rounded-full bg-punch px-7 py-3 text-base font-extrabold text-cream disabled:opacity-60"
          >
            <Save className="size-5" /> {busy ? 'Saving…' : 'Save marquee'}
          </button>
        </form>
      )}
    </div>
  )
}
