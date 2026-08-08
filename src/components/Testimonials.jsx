import { Quote } from 'lucide-react'
import { useContent } from '../lib/useContent'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

export default function Testimonials() {
  const { testimonials } = useContent()
  // Nothing to show — hide the whole section instead of an empty heading
  if (!testimonials || testimonials.length === 0) return null
  return (
    <section id="testimonials" className="relative scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          kicker="Kind words"
          title={
            <>
              What people <span className="text-punch">say</span>
            </>
          }
        />

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 120}>
              <figure className="sticker flex h-full flex-col rounded-[2rem] bg-white p-7 dark:bg-nightcard">
                <Quote className="size-8 -rotate-6 fill-punch text-punch" />
                <blockquote className="mt-4 flex-1 leading-relaxed text-ink/75 dark:text-bone/80">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t-2 border-dashed border-ink/15 dark:border-nightline pt-5">
                  <span className="flex size-12 items-center justify-center rounded-full border-3 border-ink bg-sun text-2xl">
                    {t.emoji}
                  </span>
                  <div>
                    <p className="font-extrabold">{t.name}</p>
                    <p className="text-sm font-semibold text-ink/55 dark:text-bone/60">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
