import { MapPin, PartyPopper } from 'lucide-react'
import { useContent } from '../lib/useContent'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import Marquee from './Marquee'

export default function About() {
  const { profile, skills } = useContent()
  return (
    <section id="about" className="relative scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          kicker="About me"
          title={
            <>
              A developer with a{' '}
              <span className="text-punch">playful streak</span>
            </>
          }
        />

        <div className="grid gap-8 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <div className="sticker h-full rounded-[2rem] bg-white p-8 sm:p-10 dark:bg-nightcard">
              <h3 className="font-display text-2xl font-extrabold">
                Turning <span className="text-punch">ideas</span> into{' '}
                <span className="text-punch">products</span> 🪄
              </h3>
              <p className="mt-5 text-lg leading-relaxed text-ink/75 dark:text-bone/80">{profile.bio}</p>
              <p className="mt-4 text-lg leading-relaxed text-ink/75 dark:text-bone/80">
                When I'm not shipping features, you'll find me sketching UI concepts,
                contributing to open source, or exploring the city for the perfect bowl of noodles.
              </p>
              <p className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-sun/30 px-4 py-2.5 font-bold dark:bg-sun/20">
                <MapPin className="size-5" /> Based in {profile.location}
              </p>
            </div>
          </Reveal>

          <Reveal delay={150} className="lg:col-span-2">
            <div className="sticker h-full rounded-[2rem] bg-gradient-to-br from-punch to-sun p-8 text-cream sm:p-10">
              <h3 className="font-display text-2xl font-extrabold">
                Why work with me? <PartyPopper className="inline size-6 text-sun" />
              </h3>
              <ul className="mt-6 space-y-4">
                {[
                  ['🚀', 'Ships fast, ships often — momentum matters'],
                  ['🎯', 'Product thinking, not just code'],
                  ['🧩', 'Whole-stack: frontend to infrastructure'],
                  ['💬', 'Clear, honest communication'],
                  ['✨', 'Pixel-obsessed, accessibility-aware UI'],
                ].map(([emoji, text]) => (
                  <li key={text} className="flex items-start gap-3">
                    <span className="mt-0.5 text-xl">{emoji}</span>
                    <span className="font-medium text-cream/90">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Skill marquee — clipped so the tilt + wide strip never overflow the viewport */}
      <div className="mt-16 overflow-hidden">
        <div className="-rotate-1 border-y-4 border-ink bg-sun py-4 dark:border-bone">
          <Marquee copyClass="gap-8 pr-8 whitespace-nowrap">
            {skills.marquee.map((skill, i) => (
              <span key={i} className="flex items-center gap-3 text-lg font-extrabold uppercase text-ink">
                <span className="text-2xl">{['💛','💜','💙','💚'][i % 4]}</span>
                {skill}
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  )
}
