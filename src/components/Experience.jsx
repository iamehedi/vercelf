import { useContent } from '../lib/useContent'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

export default function Experience() {
  const { experience } = useContent()
  if (!experience || experience.length === 0) return null
  return (
    <section id="experience" className="relative scroll-mt-24 bg-white py-24 dark:bg-night">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading
          kicker="Career"
          title={
            <>
              My <span className="text-punch">journey</span> so far
            </>
          }
        />

        <div className="relative ml-4 border-l-4 border-dashed border-ink/20 dark:border-nightline pl-8 sm:ml-8">
          {experience.map((job, i) => (
            <Reveal key={`${job.company}-${job.period}`} delay={i * 120} className="relative pb-12 last:pb-0">
              <span className="absolute -left-[2.6rem] top-1 flex size-9 items-center justify-center rounded-full border-3 border-ink bg-white dark:border-nightline dark:bg-nightcard text-lg">
                {job.emoji}
              </span>

              <div className="sticker rounded-[1.75rem] bg-cream p-6 sm:p-8 dark:bg-nightcard">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-xl font-extrabold sm:text-2xl">{job.role}</h3>
                  <span className="rounded-full border-2 border-ink bg-sun px-3 py-1 text-xs font-extrabold text-ink">
                    {job.period}
                  </span>
                </div>
                <p className="mt-1 font-bold text-grape">{job.company}</p>
                <ul className="mt-4 space-y-2">
                  {job.points.map((point) => (
                    <li key={point} className="flex gap-2.5 text-ink/75 dark:text-bone/75">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-punch" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
