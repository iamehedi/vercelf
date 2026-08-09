import { ArrowUpRight, ExternalLink } from 'lucide-react'
import { GithubIcon } from './icons'
import { useContent } from '../lib/useContent'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

export default function Projects() {
  const { projects } = useContent()
  // Nothing to show — hide the section (also avoids projects[0] crashing)
  if (!projects || projects.length === 0) return null
  return (
    <section id="work" className="relative scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          kicker="Selected work"
          title={
            <>
              Things I've <span className="text-punch">built</span>
            </>
          }
        />

        <div className="grid gap-7 sm:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal key={project.title} delay={(i % 2) * 120} className={i === 0 ? 'sm:col-span-2' : ''}>
              <article
                className={`sticker group flex h-full flex-col rounded-[2rem] bg-white p-7 transition-colors sm:p-8 dark:bg-nightcard ${
                  i === 0 ? 'sm:flex-row sm:items-center sm:gap-8' : ''
                }`}
              >
                {project.coverUrl ? (
                  <div
                    className={`relative aspect-[16/10] overflow-hidden rounded-3xl border-3 border-ink bg-ink/10 transition-transform duration-300 group-hover:-rotate-2 group-hover:scale-[1.03] ${
                      i === 0 ? 'sm:w-1/2' : ''
                    }`}
                  >
                    <img
                      src={project.coverUrl}
                      alt={`${project.title} cover`}
                      loading="lazy"
                      className="size-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className={`flex aspect-[16/10] items-center justify-center rounded-3xl border-3 border-ink text-7xl transition-transform duration-300 group-hover:-rotate-2 group-hover:scale-[1.03] ${project.accent} ${
                      i === 0 ? 'sm:w-1/2' : ''
                    }`}
                  >
                    {project.emoji}
                  </div>
                )}

                <div className={i === 0 ? 'mt-6 flex-1 sm:mt-0' : 'mt-6 flex flex-1 flex-col'}>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-2xl font-extrabold">{project.title}</h3>
                    <div className="flex gap-2">
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${project.title} source code`}
                        className="sticker flex size-9 items-center justify-center rounded-xl bg-white dark:bg-nightcard"
                      >
                        <GithubIcon />
                      </a>
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${project.title} live demo`}
                        className="sticker flex size-9 items-center justify-center rounded-xl bg-sun"
                      >
                        <ExternalLink className="size-4" />
                      </a>
                    </div>
                  </div>
                  <p className="mt-3 leading-relaxed text-ink/70 dark:text-bone/75">{project.description}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border-2 border-ink/10 bg-cream px-3 py-1 text-xs font-bold dark:border-nightline dark:bg-night"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                  {project.featured && (
                    <p className="mt-4 inline-flex w-max items-center gap-1 text-sm font-extrabold text-punch">
                      Featured project <ArrowUpRight className="size-4" />
                    </p>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={150} className="mt-12 text-center">
          <a
            href={projects[0].repo}
            target="_blank"
            rel="noreferrer"
            className="sticker inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-base font-extrabold text-cream hover:-rotate-1"
          >
            View all on GitHub <GithubIcon className="size-5" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
