import { useEffect, useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useContent } from '../lib/useContent'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

export default function Gallery() {
  const { gallery } = useContent()
  const [active, setActive] = useState(null)

  useEffect(() => {
    if (active === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') setActive(null)
      if (e.key === 'ArrowRight') setActive((a) => (a + 1) % gallery.length)
      if (e.key === 'ArrowLeft') setActive((a) => (a - 1 + gallery.length) % gallery.length)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [active, gallery.length])

  // Nothing to show — hide the whole section instead of an empty heading
  if (!gallery || gallery.length === 0) return null

  return (
    <section id="gallery" className="relative scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          kicker="Photo diary"
          title={
            <>
              A peek into <span className="text-punch">my world</span>
            </>
          }
        />

        <div className="columns-2 gap-4 sm:columns-3 lg:gap-5">
          {gallery.map((photo, i) => (
            <Reveal key={photo.src} delay={(i % 3) * 100} className="mb-4 break-inside-avoid lg:mb-5">
              <figure
                className="sticker group cursor-zoom-in overflow-hidden rounded-3xl bg-white dark:bg-nightcard"
                onClick={() => setActive(i)}
              >
                <div className="overflow-hidden">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    className="w-full transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <figcaption className="px-4 py-3 text-sm font-bold text-ink/80 dark:text-bone/85">
                  {photo.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-night/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setActive(null)}
            className="sticker absolute top-5 right-5 flex size-11 items-center justify-center rounded-xl bg-white text-ink dark:bg-nightcard dark:text-bone"
          >
            <X className="size-5" />
          </button>

          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => {
              e.stopPropagation()
              setActive((a) => (a - 1 + gallery.length) % gallery.length)
            }}
            className="sticker absolute left-3 z-10 flex size-11 items-center justify-center rounded-full bg-white text-ink sm:left-6 dark:bg-nightcard dark:text-bone"
          >
            <ChevronLeft className="size-6" />
          </button>

          <figure className="max-h-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={gallery[active].src.replace('/600/', '/1000/')}
              alt={gallery[active].alt}
              className="sticker max-h-[75vh] w-auto rounded-3xl bg-white object-contain"
            />
            <figcaption className="mt-4 text-center text-base font-bold text-cream">
              {gallery[active].caption}
            </figcaption>
          </figure>

          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => {
              e.stopPropagation()
              setActive((a) => (a + 1) % gallery.length)
            }}
            className="sticker absolute right-3 z-10 flex size-11 items-center justify-center rounded-full bg-white text-ink sm:right-6 dark:bg-nightcard dark:text-bone"
          >
            <ChevronRight className="size-6" />
          </button>
        </div>
      )}
    </section>
  )
}
