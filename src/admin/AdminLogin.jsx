import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Mail, KeyRound, ArrowLeft, LogIn, AlertCircle } from 'lucide-react'

export default function AdminLogin({ onAuthed }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      if (data.session) onAuthed(data.session)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 dark:bg-night">
      <div className="w-full max-w-md">
        <a href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-ink/60 hover:text-ink dark:text-bone/60 dark:hover:text-bone">
          <ArrowLeft className="size-4" /> Back to site
        </a>
        <div className="sticker rounded-[2rem] bg-white p-8 dark:bg-nightcard">
          <span className="text-4xl">🛠️</span>
          <h1 className="mt-3 font-display text-2xl font-extrabold">Admin panel</h1>
          <p className="mt-1 text-sm font-semibold text-ink/60 dark:text-bone/60">
            Welcome back — sign in to edit your portfolio.
          </p>

          {error && (
            <p className="mt-4 flex items-start gap-2 rounded-2xl border-2 border-punch/30 bg-punch/10 px-4 py-3 text-sm font-bold text-punch">
              <AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}
            </p>
          )}

          <form onSubmit={submit} className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-extrabold">Email</span>
              <div className="relative">
                <Mail className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink/40 dark:text-bone/40" />
                <input
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="username"
                  className="w-full rounded-2xl border-3 border-ink bg-cream py-3 pr-4 pl-11 font-semibold outline-none transition-shadow focus:shadow-[4px_4px_0_#ffc24b] dark:border-nightline dark:bg-night dark:text-bone dark:placeholder:text-bone/40"
                />
              </div>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-extrabold">Password</span>
              <div className="relative">
                <KeyRound className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink/40 dark:text-bone/40" />
                <input
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-2xl border-3 border-ink bg-cream py-3 pr-4 pl-11 font-semibold outline-none transition-shadow focus:shadow-[4px_4px_0_#ffc24b] dark:border-nightline dark:bg-night dark:text-bone dark:placeholder:text-bone/40"
                />
              </div>
            </label>
            <button
              type="submit"
              disabled={busy}
              className="sticker w-full rounded-full bg-punch px-6 py-3.5 text-base font-extrabold text-cream disabled:opacity-60"
            >
              <span className="inline-flex items-center justify-center gap-2">
                <LogIn className="size-5" /> {busy ? 'Signing in…' : 'Sign in'}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
