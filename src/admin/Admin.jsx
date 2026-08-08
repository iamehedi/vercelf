import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import AdminLogin from './AdminLogin'
import AdminPanel from './AdminPanel'

// Only this account may use the admin panel (set in .env.local).
// Fail-closed: if VITE_ADMIN_EMAIL is missing, no signed-in user is allowed in.
const adminEmail = import.meta.env.VITE_ADMIN_EMAIL

function NotConfigured() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 dark:bg-night">
      <div className="sticker max-w-lg rounded-3xl bg-white p-8 text-center dark:bg-nightcard">
        <span className="text-5xl">🔐</span>
        <h1 className="mt-4 font-display text-2xl font-extrabold">Supabase not configured</h1>
        <p className="mt-3 leading-relaxed text-ink/70 dark:text-bone/75">
          Add your <code className="rounded bg-sun/30 px-1.5 py-0.5 font-mono">VITE_SUPABASE_URL</code> and{' '}
          <code className="rounded bg-sun/30 px-1.5 py-0.5 font-mono">VITE_SUPABASE_ANON_KEY</code> to{' '}
          <code className="rounded bg-sun/30 px-1.5 py-0.5 font-mono">.env.local</code>, then apply the migrations in{' '}
          <code className="rounded bg-sun/30 px-1.5 py-0.5 font-mono">supabase/migrations/</code> with{' '}
          <code className="rounded bg-sun/30 px-1.5 py-0.5 font-mono">supabase link</code> +{' '}
          <code className="rounded bg-sun/30 px-1.5 py-0.5 font-mono">supabase db push</code> (or paste them in the Supabase SQL editor).
        </p>
        <a
          href="/"
          className="sticker mt-6 inline-block rounded-full bg-punch px-6 py-3 font-extrabold text-cream"
        >
          Back to site
        </a>
      </div>
    </div>
  )
}

export default function Admin() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    setLoading(false)
    return () => sub?.subscription.unsubscribe()
  }, [])

  if (!isSupabaseConfigured) return <NotConfigured />
  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream dark:bg-night">
        <span className="text-4xl">⏳</span>
      </div>
    )
  // Security gate: only the configured admin account gets through (fail-closed)
  if (session && (!adminEmail || session.user?.email !== adminEmail)) {
    return <Navigate to="/" replace />
  }
  if (!session) return <AdminLogin onAuthed={setSession} />
  return <AdminPanel session={session} />
}
