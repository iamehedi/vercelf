import { useEffect, useState } from 'react'
import { Save, CheckCircle2, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function MusicSettingsForm() {
  const [form, setForm] = useState({ vibe: '', spotify_embed_url: '' })
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    supabase
      .from('music_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error && data) {
          setForm({
            vibe: data.vibe ?? '',
            spotify_embed_url: data.spotify_embed_url ?? '',
          })
        }
        setLoading(false)
      })
  }, [])

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  // Only allow official Spotify embed URLs — this is rendered as an <iframe> on the site
  const EMBED_RE = /^https:\/\/open\.spotify\.com\/embed\//i

  const save = async (e) => {
    e.preventDefault()
    setBusy(true)
    setNotice(null)
    const vibe = form.vibe.trim().slice(0, 300)
    const embed = form.spotify_embed_url.trim().slice(0, 500)
    if (embed && !EMBED_RE.test(embed)) {
      setNotice({
        type: 'error',
        text: 'Spotify embed URL must be an https://open.spotify.com/embed/… link (Share → Embed on Spotify).',
      })
      setBusy(false)
      return
    }
    const { error } = await supabase
      .from('music_settings')
      .upsert({ id: 1, vibe, spotify_embed_url: embed })
    if (error) setNotice({ type: 'error', text: error.message })
    else setNotice({ type: 'ok', text: 'Music settings saved — live on the site now.' })
    setBusy(false)
  }

  const base =
    'w-full rounded-2xl border-3 border-ink bg-cream px-4 py-2.5 font-semibold outline-none transition-shadow focus:shadow-[4px_4px_0_#ffc24b] dark:border-nightline dark:bg-night dark:text-bone dark:placeholder:text-bone/40'

  return (
    <div>
      <h2 className="font-display text-2xl font-extrabold">Music</h2>
      <p className="mt-1 text-sm font-semibold text-ink/55 dark:text-bone/55">
        The vibe line shown in the player card, plus an optional Spotify embed under the playlist.
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
            <span className="mb-1.5 block text-sm font-extrabold">Vibe text</span>
            <input
              type="text"
              maxLength={300}
              value={form.vibe}
              onChange={(e) => set('vibe', e.target.value)}
              placeholder="Lo-fi, indie & synthwave while I build"
              className={base}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-extrabold">Spotify embed URL (optional)</span>
            <input
              type="url"
              value={form.spotify_embed_url}
              onChange={(e) => set('spotify_embed_url', e.target.value)}
              placeholder="https://open.spotify.com/embed/playlist/…"
              className={base}
            />
            <span className="mt-1.5 block text-xs font-semibold text-ink/50 dark:text-bone/50">
              Tip: on Spotify, use Share → Embed → copy the <code className="font-mono">open.spotify.com/embed/…</code> URL.
            </span>
          </label>
          <button
            type="submit"
            disabled={busy}
            className="sticker inline-flex items-center gap-2 rounded-full bg-punch px-7 py-3 text-base font-extrabold text-cream disabled:opacity-60"
          >
            <Save className="size-5" /> {busy ? 'Saving…' : 'Save music settings'}
          </button>
        </form>
      )}
    </div>
  )
}
