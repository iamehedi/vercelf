import { useContent } from '../lib/useContent'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

export default function Faq() {
  const { socials, projects } = useContent()
  const github =
    socials?.find((s) => s.label === 'GitHub')?.url || 'https://github.com/iamehedi'
  // Derived from the live project list so the answer stays truthful and current.
  const projectNames = (Array.isArray(projects) ? projects : [])
    .map((p) => p.title)
    .filter(Boolean)
  const projectsAnswer = projectNames.length
    ? `Recent work includes ${projectNames.join(', ')} — all showcased in the Work section.`
    : 'A selection of recent work is showcased in the Work section.'

  const items = [
    {
      q: 'Who is Mehedi Hasan?',
      a: 'Mehedi Hasan is an AI-assisted full-stack developer from Rajshahi, Bangladesh. He builds modern web applications, software products, APIs and AI-powered digital experiences.',
    },
    {
      q: 'What does Mehedi Hasan do?',
      a: 'He designs and builds full-stack products end-to-end — responsive React frontends, API design, databases and cloud deployment — using AI tooling to move faster without cutting corners.',
    },
    {
      q: 'Where is Mehedi Hasan based?',
      a: `Rajshahi, Bangladesh. He is open to remote work and freelance projects.`,
    },
    {
      q: 'What technologies does Mehedi Hasan use?',
      a: 'React, TypeScript, Node.js, Next.js, Tailwind CSS, Supabase, PostgreSQL and Firebase — the full list is in the Skills section.',
    },
    {
      q: 'What projects has Mehedi Hasan built?',
      a: projectsAnswer,
    },
    {
      q: "Where can I see Mehedi Hasan's work?",
      a: 'Everything lives on this portfolio, and the source code is on the GitHub profile.',
    },
  ]

  return (
    <section id="faq" className="relative scroll-mt-24 py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading
          kicker="FAQ"
          title={
            <>
              Good to <span className="text-punch">know</span>
            </>
          }
        />

        <Reveal>
          <div className="space-y-4">
            {items.map((item) => (
              <details
                key={item.q}
                className="sticker group rounded-3xl bg-white p-6 open:bg-sun/10 dark:bg-nightcard"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-extrabold select-none">
                  {item.q}
                  <span
                    aria-hidden
                    className="text-2xl text-punch transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 leading-relaxed text-ink/70 dark:text-bone/75">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120} className="mt-8 text-center">
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-extrabold text-punch underline decoration-2 underline-offset-4 hover:text-ink dark:hover:text-bone"
          >
            Mehedi Hasan's GitHub profile
          </a>
        </Reveal>
      </div>
    </section>
  )
}
