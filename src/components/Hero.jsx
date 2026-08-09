import { ArrowDown, Download } from 'lucide-react'
import { useContent } from '../lib/useContent'
import Reveal from './Reveal'

export default function Hero() {
  const { profile } = useContent()
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-blob absolute -top-20 -left-20 size-80 rounded-full bg-punch/30 blur-3xl" />
        <div className="animate-blob absolute top-40 -right-24 size-96 rounded-full bg-ocean/30 blur-3xl [animation-delay:-5s]" />
        <div className="animate-blob absolute bottom-0 left-1/3 size-72 rounded-full bg-grape/25 blur-3xl [animation-delay:-10s]" />
        <div className="dots absolute top-24 right-8 hidden size-64 opacity-20 lg:block" />
        <div className="dots absolute bottom-10 left-6 hidden size-56 opacity-20 lg:block" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <Reveal>
            <span className="sticker inline-flex items-center gap-2 rounded-full bg-sun px-4 py-2 text-sm font-extrabold dark:text-ink">
              <span className="size-2 animate-pulse rounded-full bg-ink" />
              Open to work & freelance
            </span>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="mt-6 font-display text-[clamp(1.9rem,7vw,3rem)] leading-[0.95] font-extrabold tracking-tight sm:text-6xl xl:text-7xl">
              Hey, I'm{' '}
              <span className="text-punch">
                {profile.name}
                <span className="animate-wiggle inline-block">👋</span>
              </span>
              <br />
              <span className="scribble text-ink dark:text-bone">{profile.role}</span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="mx-auto mt-6 max-w-xl text-lg font-medium text-ink/70 dark:text-bone/70 lg:mx-0">
              {profile.tagline}
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <a
                href="#work"
                className="sticker inline-flex items-center gap-2 rounded-full bg-punch px-7 py-3.5 text-base font-extrabold text-cream hover:bg-punch"
              >
                See my work <ArrowDown className="size-5" />
              </a>
              <a
                href={profile.resumeUrl}
                className="sticker inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-extrabold hover:bg-sun/40 dark:bg-bone dark:text-night dark:hover:bg-sun"
              >
                <Download className="size-5" /> Résumé
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={250} className="mx-auto">
          <div className="group relative mx-auto w-64 sm:w-80">
            {/* Attention ripples radiating out from the card */}
            <span
              aria-hidden
              className="animate-ring absolute -inset-3 z-0 rounded-[3rem] border-4 border-punch/35"
            />
            <span
              aria-hidden
              className="animate-ring absolute -inset-3 z-0 rounded-[3rem] border-4 border-ocean/35 [animation-delay:1.4s]"
            />

            <div className="animate-float relative z-10 flex aspect-square items-center justify-center rounded-[2.5rem] bg-white transition-transform duration-500 ease-out sticker group-hover:rotate-3 group-hover:scale-[1.04] dark:bg-nightcard">
              <span className="inline-block text-[7rem] transition-transform duration-500 group-hover:animate-wiggle sm:text-[9rem]">
                {profile.avatarEmoji}
              </span>
              <span className="sticker absolute -top-4 -right-4 rounded-2xl bg-sun px-3 py-1.5 text-sm font-extrabold animate-float [animation-duration:5s]">
                code 💻
              </span>
              <span className="sticker absolute -bottom-3 -left-4 rounded-2xl bg-mint px-3 py-1.5 text-sm font-extrabold animate-float [animation-duration:6.5s] [animation-delay:-2s]">
                coffee ☕
              </span>
              <span className="sticker absolute -bottom-2 right-2 rounded-2xl bg-ocean px-3 py-1.5 text-sm font-extrabold animate-float [animation-duration:5.5s] [animation-delay:-3.5s]">
                noodles 🍜
              </span>
            </div>
            <div
              aria-hidden
              className="animate-float-slow absolute top-10 -right-6 z-0 size-24 rounded-full bg-punch/40"
            />
            <div
              aria-hidden
              className="animate-spin-slow absolute -bottom-4 -left-8 z-0 size-28 rounded-2xl border-4 border-dashed border-grape"
            />
          </div>
        </Reveal>
      </div>

      <Reveal delay={400} className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {profile.stats.map((stat) => (
            <div
              key={stat.label}
              className="sticker rounded-3xl bg-white px-4 py-6 text-center hover:bg-sun/20 dark:bg-nightcard"
            >
              <dt className="order-2 mt-1 block text-sm font-semibold text-ink/60 dark:text-bone/60">{stat.label}</dt>
              <dd className="font-display text-4xl font-extrabold text-punch">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  )
}
