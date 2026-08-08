import { useState } from 'react'
import { Send } from 'lucide-react'
import { useContent } from '../lib/useContent'
import Reveal from './Reveal'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Contact() {
  const { profile } = useContent()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  // Deliver submissions straight to the owner's inbox via FormSubmit.co.
  // Note: we deliberately do NOT pass _captcha=false — FormSubmit's default
  // spam protection stays enabled on this public form.
  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      name: form.name.trim().slice(0, 80),
      email: form.email.trim().slice(0, 254),
      message: form.message.trim().slice(0, 2000),
    }
    setSending(true)
    setError(null)
    try {
      if (!payload.name || !payload.email || !payload.message) {
        throw new Error('Please fill in every field.')
      }
      if (!EMAIL_RE.test(payload.email)) {
        throw new Error('Please enter a valid email address.')
      }
      // Never POST to a malformed owner address — fail closed with a safe message
      if (!EMAIL_RE.test(profile.email || '')) {
        throw new Error('This form is not configured yet — please email me directly instead.')
      }
      const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(profile.email)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...payload,
          _subject: 'New portfolio message ✨',
          _template: 'table',
        }),
      })
      const data = await res.json()
      const ok = data && (data.success === 'true' || data.success === true)
      if (!res.ok || !ok) {
        throw new Error(data?.message || 'Could not send the message.')
      }
      setSent(true)
    } catch (err) {
      setError(err.message || 'Could not send — please email me directly instead.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden bg-ink py-24 text-cream dark:border-y-4 dark:border-nightline dark:bg-nightcard"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="animate-blob absolute -top-24 right-0 size-96 rounded-full bg-punch/25 blur-3xl" />
        <div className="animate-blob absolute bottom-0 -left-24 size-96 rounded-full bg-ocean/20 blur-3xl [animation-delay:-6s]" />
      </div>

      <div className="relative mx-auto w-full max-w-xl px-4 sm:px-6">
        <Reveal delay={200}>
          <form
            onSubmit={handleSubmit}
            className="sticker rounded-[2rem] border-cream/50 bg-cream p-7 text-ink shadow-[8px_8px_0_rgba(255,248,239,0.4)] sm:p-9 dark:border-bone/25 dark:bg-night dark:text-bone dark:shadow-[8px_8px_0_var(--color-nightline)]"
          >
            {sent ? (
              <div className="flex h-full min-h-72 flex-col items-center justify-center text-center">
                <span className="text-6xl">🎉</span>
                <h3 className="mt-4 font-display text-2xl font-extrabold">Thanks, {form.name}!</h3>
                <p className="mt-2 text-ink/70 dark:text-bone/70">
                  Your message is on its way — I'll get back to you soon. Prefer to write
                  directly? <span className="font-bold text-punch">{profile.email}</span>
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-extrabold dark:text-bone">Your name</span>
                    <input
                      name="name"
                      required
                      maxLength={80}
                      value={form.name}
                      onChange={update}
                      placeholder="Ada Lovelace"
                      className="w-full rounded-2xl border-3 border-ink bg-white px-4 py-3 font-semibold outline-none transition-shadow focus:shadow-[4px_4px_0_#ffc24b] dark:border-nightline dark:bg-nightcard dark:text-bone dark:placeholder:text-bone/40"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-extrabold dark:text-bone">Your email</span>
                    <input
                      name="email"
                      type="email"
                      required
                      maxLength={254}
                      value={form.email}
                      onChange={update}
                      placeholder="ada@example.com"
                      className="w-full rounded-2xl border-3 border-ink bg-white px-4 py-3 font-semibold outline-none transition-shadow focus:shadow-[4px_4px_0_#ffc24b] dark:border-nightline dark:bg-nightcard dark:text-bone dark:placeholder:text-bone/40"
                    />
                  </label>
                </div>
                <label className="mt-5 block">
                  <span className="mb-1.5 block text-sm font-extrabold dark:text-bone">Message</span>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    maxLength={2000}
                    value={form.message}
                    onChange={update}
                    placeholder="Tell me about your project…"
                    className="w-full resize-none rounded-2xl border-3 border-ink bg-white px-4 py-3 font-semibold outline-none transition-shadow focus:shadow-[4px_4px_0_#ffc24b] dark:border-nightline dark:bg-nightcard dark:text-bone dark:placeholder:text-bone/40"
                  />
                </label>
                {error && (
                  <p className="mt-5 rounded-2xl border-2 border-punch/40 bg-punch/10 px-4 py-3 text-sm font-bold text-punch">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  className="sticker mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-punch px-7 py-3.5 text-base font-extrabold text-cream disabled:opacity-60 sm:w-auto"
                >
                  <Send className="size-5" /> {sending ? 'Sending…' : 'Send message'}
                </button>
              </>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  )
}
