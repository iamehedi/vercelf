import { useEffect } from 'react'

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page not found | Mehedi Hasan'
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 dark:bg-night">
      <div className="sticker w-full max-w-md rounded-[2rem] bg-white p-10 text-center dark:bg-nightcard">
        <span className="text-6xl">🛸</span>
        <h1 className="mt-4 font-display text-6xl font-extrabold tracking-tight">404</h1>
        <p className="mt-3 text-lg font-semibold text-ink/70 dark:text-bone/70">
          This page drifted off into space — it doesn't exist (or never did).
        </p>
        <a
          href="/"
          className="sticker mt-7 inline-block rounded-full bg-punch px-7 py-3.5 text-base font-extrabold text-cream hover:-rotate-1"
        >
          Back to the homepage
        </a>
      </div>
    </div>
  )
}
