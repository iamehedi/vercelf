import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { useContent } from '../lib/useContent'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

// How far (px) a swipe must travel before the card flips
const SWIPE_THRESHOLD = 90

// Tinder-style stacked photo cards — one big photo, next ones peek behind.
// Tap, swipe or press ♥ to flip to the next one, looping forever.
export default function Gallery() {
  const { gallery } = useContent()
  const [index, setIndex] = useState(0)
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [liked, setLiked] = useState(() => new Set())

  const dragStart = useRef(null) // { x, y } while a pointer is down on the card
  const suppressClick = useRef(false) // true after a real drag — ignore the follow-up click

  const len = gallery?.length || 0

  useEffect(() => {
    if (len < 2) return
    const onKey = (e) => {
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % len)
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + len) % len)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [len])

  // Nothing to show — hide the whole section instead of an empty heading
  if (len === 0) return null

  const next = () => setIndex((i) => (i + 1) % len)
  const prev = () => setIndex((i) => (i - 1 + len) % len)

  // Toggle love on the current photo — the button turns red instantly
  const toggleLike = () => {
    const src = gallery[index].src
    setLiked((prev) => {
      const n = new Set(prev)
      if (n.has(src)) n.delete(src)
      else n.add(src)
      return n
    })
  }

  const activeSrc = gallery[index].src
  const isActiveLiked = liked.has(activeSrc)

  // Stack position for photo i: 0 = front, 1/2 = peeking behind, rest hidden
  const stackFor = (i) => {
    const offset = (i - index + len) % len
    if (offset === 0) return { z: 30, opacity: 1, transform: 'translate(0,0) rotate(0deg) scale(1)' }
    if (offset === 1)
      return { z: 20, opacity: 0.55, transform: 'translate(14px, 10px) rotate(2.5deg) scale(0.94)' }
    if (offset === 2)
      return { z: 10, opacity: 0.28, transform: 'translate(28px, 20px) rotate(5deg) scale(0.88)' }
    return { z: 0, opacity: 0, transform: 'translate(0,0)' }
  }

  // ---- Drag/swipe handlers (front card) ----
  const onPointerDown = (e) => {
    if (len < 2) return
    if (e.pointerType === 'mouse' && e.button !== 0) return // primary button only
    dragStart.current = { x: e.clientX, y: e.clientY }
    suppressClick.current = false
    setDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (!dragStart.current) return
    const dx = e.clientX - dragStart.current.x
    if (Math.abs(dx) > 10) suppressClick.current = true
    setDragX(dx)
  }

  const endDrag = (e) => {
    if (!dragStart.current) return
    const dx = e.clientX - dragStart.current.x
    dragStart.current = null
    setDragging(false)
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      // Tinder-style: a strong swipe flips to the next photo (loops)
      suppressClick.current = true
      setIndex((i) => (i + 1) % len)
    }
    setDragX(0) // otherwise the card animates back to rest
  }

  const cancelDrag = () => {
    dragStart.current = null
    setDragging(false)
    setDragX(0)
  }

  // Follow the finger with a playful Tinder tilt
  const rotate = Math.max(-14, Math.min(14, dragX / 22))
  const stampOpacity = (dir) => Math.max(0, Math.min(1, (dir * dragX) / SWIPE_THRESHOLD))

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

        <Reveal className="mx-auto max-w-xl">
          {/* ---- Card stack ---- */}
          <div
            className="relative select-none"
            style={{ height: 'min(64vh, 540px)' }}
            role="group"
            aria-roledescription="carousel"
            aria-label="Photo diary"
          >
            <p className="sr-only" aria-live="polite">
              Photo {index + 1} of {len}
            </p>
            {gallery.map((photo, i) => {
              const s = stackFor(i)
              const isFront = i === index
              return (
                <button
                  key={photo.src}
                  type="button"
                  aria-label={isFront ? 'Next photo' : `Go to photo ${i + 1}`}
                  onClick={() => {
                    if (suppressClick.current) {
                      suppressClick.current = false
                      return
                    }
                    if (isFront) next()
                    else setIndex(i)
                  }}
                  onPointerDown={isFront ? onPointerDown : undefined}
                  onPointerMove={isFront ? onPointerMove : undefined}
                  onPointerUp={isFront ? endDrag : undefined}
                  onPointerCancel={isFront ? cancelDrag : undefined}
                  className={`absolute inset-0 h-full w-full overflow-hidden rounded-[2rem] border-3 focus:outline-none focus-visible:ring-4 focus-visible:ring-punch/50 ${
                    isFront
                      ? 'cursor-grab active:cursor-grabbing touch-pan-y border-ink bg-white shadow-[0_24px_70px_-18px_rgba(0,0,0,0.45)] dark:border-nightline dark:bg-nightcard dark:shadow-[0_24px_70px_-18px_rgba(0,0,0,0.75)]'
                      : 'cursor-pointer border-ink/25 bg-white dark:border-nightline dark:bg-nightcard'
                  } ${isFront && dragging ? 'transition-none' : 'transition-all duration-500 ease-out'}`}
                  style={
                    isFront && dragging
                      ? {
                          zIndex: s.z,
                          opacity: 1,
                          transform: `translate(${dragX}px, 0) rotate(${rotate}deg)`,
                          willChange: 'transform',
                        }
                      : { zIndex: s.z, opacity: s.opacity, transform: s.transform }
                  }
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading={isFront ? 'eager' : 'lazy'}
                    draggable={false}
                    className="pointer-events-none size-full object-cover"
                  />

                  {/* Tinder-style LIKE / NOPE stamps while swiping */}
                  {isFront && dragging && (
                    <>
                      <span
                        className="pointer-events-none absolute top-6 left-6 -rotate-12 rounded-xl border-4 border-punch bg-night/45 px-3 py-1 font-display text-2xl font-extrabold tracking-widest text-punch backdrop-blur-sm"
                        style={{ opacity: stampOpacity(-1) }}
                      >
                        NOPE
                      </span>
                      <span
                        className="pointer-events-none absolute top-6 right-6 rotate-12 rounded-xl border-4 border-mint bg-night/45 px-3 py-1 font-display text-2xl font-extrabold tracking-widest text-mint backdrop-blur-sm"
                        style={{ opacity: stampOpacity(1) }}
                      >
                        LIKE
                      </span>
                    </>
                  )}

                  {/* Liked heart badge (top-right, where the counter used to be) */}
                  {liked.has(photo.src) && (
                    <span className="pointer-events-none absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-punch text-cream shadow-lg">
                      <Heart className="size-4" fill="currentColor" />
                    </span>
                  )}

                  {/* Tinder-style caption scrim */}
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 block bg-gradient-to-t from-night/95 via-night/45 to-transparent px-6 pb-5 pt-16 text-left">
                    <span className="block font-display text-xl font-extrabold text-cream sm:text-2xl">
                      {photo.caption}
                    </span>
                    {photo.alt && (
                      <span className="mt-1 block text-sm font-semibold text-cream/75">{photo.alt}</span>
                    )}
                  </span>
                </button>
              )
            })}

            {/* Love button — bottom-right of the photo */}
            <button
              type="button"
              aria-label={isActiveLiked ? 'Remove love from this photo' : 'Love this photo'}
              onClick={toggleLike}
              className={`sticker absolute right-5 bottom-5 z-40 flex size-12 items-center justify-center rounded-full shadow-[0_10px_30px_-8px_rgba(0,0,0,0.5)] transition-all duration-300 active:scale-90 sm:size-14 ${
                isActiveLiked
                  ? 'scale-110 bg-punch text-cream'
                  : 'bg-white text-punch hover:scale-110 dark:bg-nightcard'
              }`}
            >
              <Heart className="size-6 sm:size-7" fill={isActiveLiked ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* ---- Action buttons ---- */}
          <div className="mt-7 flex items-center justify-center gap-4 sm:gap-5">
            <button
              type="button"
              aria-label="Previous photo"
              onClick={prev}
              className="sticker flex size-12 items-center justify-center rounded-full bg-white text-ink transition-transform hover:-rotate-6 dark:bg-nightcard dark:text-bone"
            >
              <ChevronLeft className="size-6" />
            </button>

            <button
              type="button"
              aria-label="Next photo"
              onClick={next}
              className="sticker flex size-12 items-center justify-center rounded-full bg-white text-ink transition-transform hover:rotate-6 dark:bg-nightcard dark:text-bone"
            >
              <ChevronRight className="size-6" />
            </button>
          </div>

          {/* ---- Progress dots ---- */}
          <div className="mt-5 flex items-center justify-center gap-2">
            {gallery.map((photo, i) => (
              <button
                key={photo.src}
                type="button"
                aria-label={`Go to photo ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === index
                    ? 'w-7 bg-punch'
                    : 'w-2.5 bg-ink/25 hover:bg-ink/50 dark:bg-bone/25 dark:hover:bg-bone/50'
                }`}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
