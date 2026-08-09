import { useEffect, useRef, useState } from 'react'

// Seamless, full-width marquee.
//
// Automatically duplicates its content until the strip is wide enough to span
// the entire viewport edge-to-edge on any screen (ultrawide included), while:
//   • keeping the -50% translate loop seamless (even copy count), and
//   • scaling the animation duration with the copy count so the visible scroll
//     speed stays exactly the same no matter how many copies are rendered.
//
// Only the first copy is exposed to assistive tech (aria-hidden duplicates).
export default function Marquee({ children, className = '', copyClass = '' }) {
  const stripRef = useRef(null)
  const [copies, setCopies] = useState(2)

  useEffect(() => {
    const strip = stripRef.current
    if (!strip) return
    let timer

    const measure = () => {
      const first = strip.firstElementChild
      if (!first) return
      const one = first.getBoundingClientRect().width
      if (one <= 0) return
      const viewport = window.innerWidth
      // Even count keeps the -50% keyframe seamless; the extra copy is a buffer
      // so the strip always covers the viewport at every point of the loop.
      const needed = Math.max(2, 2 * (Math.ceil(viewport / one) + 1))
      setCopies((c) => (c === needed ? c : needed))
    }

    measure()
    window.addEventListener('resize', measure)
    // Re-measure once webfonts / layout have settled
    timer = setTimeout(measure, 500)
    return () => {
      window.removeEventListener('resize', measure)
      clearTimeout(timer)
    }
  }, [])

  return (
    <div
      ref={stripRef}
      className={`animate-marquee flex w-max ${className}`}
      style={{ animationDuration: `${(copies / 2) * 28}s` }}
    >
      {Array.from({ length: copies }, (_, i) => (
        <div key={i} aria-hidden={i > 0 ? 'true' : undefined} className={`flex ${copyClass}`}>
          {children}
        </div>
      ))}
    </div>
  )
}
