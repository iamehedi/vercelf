import Reveal from './Reveal'

export default function SectionHeading({ kicker, title, className = '' }) {
  return (
    <Reveal className={`mb-12 text-center ${className}`}>
      <span className="sticker inline-block rounded-full bg-sun px-4 py-1.5 text-sm font-extrabold uppercase tracking-widest text-ink">
        {kicker}
      </span>
      <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
        {title}
      </h2>
    </Reveal>
  )
}
