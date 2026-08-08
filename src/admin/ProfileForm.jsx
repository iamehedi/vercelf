import { useEffect, useState } from 'react'
import { Save, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { uploadResume } from './hooks'

const FIELDS = [
  { key: 'name', label: 'Full name' },
  { key: 'first_name', label: 'First name' },
  { key: 'role', label: 'Role / title' },
  { key: 'tagline', label: 'Tagline' },
  { key: 'bio', label: 'Bio', type: 'textarea' },
  { key: 'location', label: 'Location' },
  { key: 'email', label: 'Contact email' },
  { key: 'resume_url', label: 'Résumé URL' },
  { key: 'avatar_emoji', label: 'Avatar emoji' },
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_LEN = {
  name: 120, first_name: 80, role: 200, tagline: 300, bio: 6000,
  location: 200, email: 254, resume_url: 500, avatar_emoji: 32,
}

export default function ProfileForm() {
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    supabase
      .from('profile')
      .select('*')
      .eq('id', 1)
      .single()
      .then(({ data, error }) => {
        if (!error && data) setForm(data)
        setLoading(false)
      })
  }, [])

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const pickResume = async (file) => {
    if (!file) return
    setUploading(true)
    setNotice(null)
    try {
      const url = await uploadResume(file)
      set('resume_url', url)
      setNotice({ type: 'ok', text: 'Résumé uploaded — hit “Save profile” to publish it.' })
    } catch (err) {
      setNotice({ type: 'error', text: err.message })
    } finally {
      setUploading(false)
    }
  }

  const save = async (e) => {
    e.preventDefault()
    setBusy(true)
    setNotice(null)
    const payload = {}
    for (const field of FIELDS) {
      const value = (form[field.key] ?? '').trim()
      const limit = MAX_LEN[field.key]
      if (limit && value.length > limit) {
        setNotice({ type: 'error', text: `${field.label} is too long (max ${limit} chars).` })
        setBusy(false)
        return
      }
      payload[field.key] = value
    }
    const email = payload.email
    if (email && !EMAIL_RE.test(email)) {
      setNotice({ type: 'error', text: 'Contact email must be a valid email address.' })
      setBusy(false)
      return
    }
    const resume = payload.resume_url
    if (resume && resume !== '#' && !/^https?:\/\//i.test(resume)) {
      setNotice({ type: 'error', text: 'Résumé URL must start with http(s)://.' })
      setBusy(false)
      return
    }
    const { error } = await supabase.from('profile').update(payload).eq('id', 1)
    if (error) setNotice({ type: 'error', text: error.message })
    else setNotice({ type: 'ok', text: 'Profile saved — live on the site now.' })
    setBusy(false)
  }

  const base =
    'w-full rounded-2xl border-3 border-ink bg-cream px-4 py-2.5 font-semibold outline-none transition-shadow focus:shadow-[4px_4px_0_#ffc24b] dark:border-nightline dark:bg-night dark:text-bone dark:placeholder:text-bone/40'

  return (
    <div>
      <h2 className="font-display text-2xl font-extrabold">Profile</h2>
      <p className="mt-1 text-sm font-semibold text-ink/55 dark:text-bone/55">
        Name, bio, contact info — shown in the hero, about and contact sections.
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
        <form onSubmit={save} className="mt-5 max-w-3xl">
          <div className="grid gap-4 sm:grid-cols-2">
            {FIELDS.filter((f) => f.key !== 'resume_url').map((field) => (
              <label
                key={field.key}
                className={field.type === 'textarea' ? 'sm:col-span-2' : ''}
              >
                <span className="mb-1.5 block text-sm font-extrabold">{field.label}</span>
                {field.type === 'textarea' ? (
                  <textarea
                    rows={4}
                    maxLength={MAX_LEN[field.key] ?? 2000}
                    value={form[field.key] ?? ''}
                    onChange={(e) => set(field.key, e.target.value)}
                    className={`${base} resize-y`}
                  />
                ) : (
                  <input
                    type="text"
                    maxLength={MAX_LEN[field.key] ?? 2000}
                    value={form[field.key] ?? ''}
                    onChange={(e) => set(field.key, e.target.value)}
                    className={base}
                  />
                )}
              </label>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border-2 border-ink/10 bg-white p-4 dark:border-nightline dark:bg-nightcard">
            <span className="mb-1.5 block text-sm font-extrabold">Résumé</span>
            <div className="flex flex-wrap items-center gap-3">
              {form.resume_url ? (
                <a
                  href={form.resume_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-mint/15 px-3 py-2 text-sm font-extrabold text-mint hover:bg-mint/25"
                >
                  <FileText className="size-4" /> View current résumé
                </a>
              ) : (
                <span className="rounded-xl bg-ink/5 px-3 py-2 text-sm font-bold text-ink/50 dark:bg-bone/10 dark:text-bone/50">
                  No résumé yet
                </span>
              )}
              <label className="sticker inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-extrabold dark:bg-nightcard">
                <Upload className="size-4" />
                {uploading ? 'Uploading…' : 'Upload PDF'}
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    pickResume(e.target.files[0])
                    e.target.value = ''
                  }}
                />
              </label>
            </div>
            <input
              type="text"
              maxLength={500}
              value={form.resume_url ?? ''}
              onChange={(e) => set('resume_url', e.target.value)}
              placeholder="…or paste a résumé link (Google Drive, etc.)"
              className={`${base} mt-2`}
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="sticker mt-6 inline-flex items-center gap-2 rounded-full bg-punch px-7 py-3 text-base font-extrabold text-cream disabled:opacity-60"
          >
            <Save className="size-5" /> {busy ? 'Saving…' : 'Save profile'}
          </button>
        </form>
      )}
    </div>
  )
}
