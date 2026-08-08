import { useContent } from '../lib/useContent'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

const cardTints = [
  'from-sun/25',
  'from-ocean/25',
  'from-mint/25',
  'from-grape/25',
  'from-punch/20',
]

export default function Skills() {
  const { skills } = useContent()
  return (
    <section id="skills" className="relative scroll-mt-24 bg-white py-24 dark:bg-night">
      <div
        aria-hidden
        className="dots pointer-events-none absolute inset-0 opacity-[0.06]"
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          kicker="Skills"
          title={
            <>
              My <span className="text-punch">toolbox</span>
            </>
          }
        />

        <div className="grid gap-6 md:grid-cols-3">
          {skills.groups.map((group, gi) => (
            <Reveal key={group.title} delay={gi * 120}>
              <div
                className={`sticker h-full rounded-[2rem] bg-white bg-gradient-to-b to-transparent p-7 dark:bg-nightcard ${cardTints[gi % cardTints.length]}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{group.emoji}</span>
                  <h3 className="font-display text-xl font-extrabold">{group.title}</h3>
                </div>
                <ul className="mt-6 space-y-5">
                  {group.items.map((item) => (
                    <li key={item.name}>
                      <div className="mb-1.5 flex items-baseline justify-between text-sm font-bold">
                        <span>{item.name}</span>
                        <span className="text-ink/50 dark:text-bone/50">{item.level}%</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full border-2 border-ink bg-cream dark:border-nightline dark:bg-night">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-punch to-sun"
                          style={{ width: `${item.level}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-10">
          <p className="sticker mx-auto max-w-2xl rounded-3xl bg-sun px-6 py-5 text-center text-lg font-bold text-ink">
            Always learning — currently deep-diving into Rust 🦀 and edge computing.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
