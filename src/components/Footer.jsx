import { useEffect, useState } from 'react'
import { Mail, ArrowUp, ArrowUpRight, Briefcase } from 'lucide-react'
import { useContent } from '../lib/useContent'
import { links } from '../lib/navLinks'
import { socialIcons, socialUrl } from '../lib/socials'
import Reveal from './Reveal'

const STATUS_WORDS = ['Open to work', 'Open to collabs', 'Open to noodles 🍜']

export default function Footer() {
  const { profile, socials } = useContent()
  const [status, setStatus] = useState(0)

  // Tiny easter egg — the availability badge cycles through statuses
  useEffect(() => {
    const id = setInterval(() => setStatus((s) => (s + 1) % STATUS_WORDS.length), 2400)
    return () => clearInterval(id)
  }, [])

  return (
    <footer className="relative overflow-hidden bg-ink text-cream dark:bg-night">
      {/* Texture: dots (dark mode) + coloured blobs */}
      <div aria-hidden className="dots pointer-events-none absolute inset-0 opacity-[0.05]" />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="animate-blob absolute -top-24 left-1/4 size-80 rounded-full bg-grape/25 blur-3xl" />
        <div className="animate-blob absolute -bottom-24 right-0 size-80 rounded-full bg-punch/20 blur-3xl [animation-delay:-8s]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-8 sm:px-6">
        {/* CTA band */}
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-8 rounded-[2rem] border-2 border-cream/20 bg-white/5 p-8 sm:p-10 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-mint/40 bg-mint/15 px-3 py-1.5 text-xs font-extrabold uppercase tracking-widest text-mint">
                <Briefcase className="size-3.5" />
                <span key={status} className="inline-block animate-wiggle">
                  {STATUS_WORDS[status]}
                </span>
              </span>
              <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl lg:text-5xl">
                Got a wild idea? <span className="text-punch">Let's build it.</span>
              </h2>
              <p className="mt-3 text-cream/70">My inbox is always open — let's turn it into something people love.</p>
            </div>
            <a
              href={`mailto:${profile.email}`}
              className="sticker inline-flex shrink-0 items-center gap-2 rounded-full border-cream/50 bg-sun px-7 py-4 text-base font-extrabold text-ink shadow-[5px_5px_0_rgba(255,248,239,0.4)] hover:-rotate-2 sm:text-lg dark:border-bone/25 dark:shadow-[5px_5px_0_var(--color-nightline)]"
            >
              <Mail className="size-5" /> {profile.email}
            </a>
          </div>
        </Reveal>

        {/* Giant scrolling marquee */}
        <div className="mt-14 -mx-4 overflow-hidden border-y-2 border-cream/10 py-5 sm:-mx-6">
          <div className="flex w-max animate-marquee">
            {[0, 1].map((n) => (
              <div key={n} aria-hidden={n === 1} className="flex items-center whitespace-nowrap">
                <span className="font-display text-6xl font-extrabold uppercase tracking-tight text-cream/85 sm:text-7xl">
                  Let's build something awesome
                </span>
                <span className="mx-8 text-5xl text-punch sm:text-6xl">✦</span>
              </div>
            ))}
          </div>
        </div>

        {/* Link columns */}
        <Reveal delay={120}>
          <div className="mt-14 grid gap-10 sm:grid-cols-2">
            {/* Navigate — arrow-link pills (21st.dev style) */}
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-cream/50">Navigate</p>
              <ul className="mt-4 grid gap-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="group inline-flex w-full items-center justify-between gap-3 rounded-full border-2 border-cream/20 bg-white/5 px-4 py-2.5 font-bold text-cream/85 transition-all duration-300 hover:-rotate-1 hover:border-sun/70 hover:bg-sun/10 hover:text-sun"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight
                        className="size-4 -translate-x-1 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                        strokeWidth={2.5}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-cream/50">Connect</p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {(socials ?? []).map((social) => {
                  const Icon = socialIcons[social.label] ?? socialIcons.GitHub
                  return (
                    <a
                      key={social.label}
                      href={socialUrl(social.url)}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      title={social.label}
                      className="sticker flex size-10 items-center justify-center rounded-xl border-cream/50 bg-white text-ink shadow-[4px_4px_0_rgba(255,248,239,0.35)] transition-transform hover:-rotate-3 hover:scale-110 dark:border-bone/25 dark:bg-bone dark:text-night dark:shadow-[4px_4px_0_var(--color-nightline)]"
                    >
                      <Icon className="size-4" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t-2 border-cream/10 pt-6 text-sm font-semibold text-cream/55 sm:flex-row">
          <p>
            © {new Date().getFullYear()} — Crafted with <span className="text-punch">♥</span>, noodles & a sprinkle of{' '}
            <span className="text-sun">✦</span>.
          </p>
          <p className="text-cream/45">Made with 🍜 & a little bit of chaos</p>
          <a href="#top" className="group inline-flex items-center gap-1.5 font-extrabold text-cream/70 transition-colors hover:text-sun">
            Back to top
            <ArrowUp className="size-4 transition-transform group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  )
}
