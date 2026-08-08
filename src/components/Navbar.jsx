import { useEffect, useState } from 'react'
import { Menu, X, Sparkles } from 'lucide-react'
import useTheme from '../hooks/useTheme'
import ThemeToggle from './ThemeToggle'
import { links } from '../lib/navLinks'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dark, setDark] = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-2' : 'py-4'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <a
          href="#top"
          className={`sticker flex items-center gap-2 rounded-full bg-white px-4 py-2 text-base font-extrabold tracking-tight dark:bg-bone dark:text-night ${
            scrolled ? 'scale-95' : ''
          }`}
        >
          <span className="flex size-6 items-center justify-center rounded-full bg-sun text-ink">
            <Sparkles className="size-4" strokeWidth={2.5} />
          </span>
          mehedi<span className="text-punch">.</span>dev
        </a>

        <ul className="hidden items-center gap-1 rounded-full border-2 border-ink/10 bg-white/80 px-2 py-2 backdrop-blur-md dark:border-nightline dark:bg-nightcard/80 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-full px-3 py-2 text-sm font-semibold text-ink/70 transition-colors hover:bg-sun/40 hover:text-ink dark:text-bone/70 dark:hover:text-bone lg:px-4"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="ml-1 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-cream transition-transform hover:rotate-[-2deg] hover:scale-105 dark:bg-bone dark:text-night"
            >
              Hire me
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <ThemeToggle dark={dark} onToggle={() => setDark((v) => !v)} compact />
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="sticker flex size-11 items-center justify-center rounded-xl bg-white dark:bg-nightcard md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="mx-4 mt-2 rounded-3xl border-2 border-ink/10 bg-white p-4 shadow-xl dark:border-nightline dark:bg-nightcard md:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-base font-bold text-ink/80 transition-colors hover:bg-sun/40 dark:text-bone/85 dark:hover:text-bone"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="mt-2">
              <div className="flex items-center gap-2">
                <ThemeToggle dark={dark} onToggle={() => setDark((v) => !v)} />
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-xl bg-punch px-4 py-3 text-center text-base font-bold text-cream"
                >
                  Hire me
                </a>
              </div>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
