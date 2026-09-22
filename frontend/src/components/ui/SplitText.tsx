import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type SplitBy = 'chars' | 'words'

interface SplitTextProps {
  text: string
  className?: string
  /** Split into individual characters or whole words. */
  by?: SplitBy
  /** Delay before the reveal starts (seconds). */
  delay?: number
  /** Per-item stagger (seconds). */
  stagger?: number
  /** Trigger on scroll into view instead of immediately on mount. */
  onScroll?: boolean
  as?: 'span' | 'div' | 'h1' | 'h2' | 'p'
}

/**
 * Lightweight SplitText-style entrance animation. Splits copy into spans and
 * reveals them with a staggered rise + fade (React Bits "Split Text" feel),
 * without depending on GSAP's premium SplitText plugin.
 *
 * Accessibility: the full text is exposed to screen readers via aria-label and
 * the split spans are aria-hidden; under prefers-reduced-motion the text simply
 * renders in its final state.
 */
export function SplitText({
  text,
  className = '',
  by = 'chars',
  delay = 0,
  stagger = 0.02,
  onScroll = false,
  as = 'span',
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null)
  const Tag = as

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const parts = el.querySelectorAll<HTMLElement>('[data-split-part]')
    if (!parts.length) return

    const ctx = gsap.context(() => {
      gsap.set(parts, { display: 'inline-block', willChange: 'transform, opacity' })
      gsap.from(parts, {
        yPercent: 120,
        opacity: 0,
        rotateX: -45,
        duration: 0.7,
        ease: 'expo.out',
        stagger,
        delay,
        ...(onScroll
          ? { scrollTrigger: { trigger: el, start: 'top 85%', once: true } }
          : {}),
        onComplete: () => gsap.set(parts, { willChange: 'auto' }),
      })
    }, el)

    return () => ctx.revert()
  }, [text, by, delay, stagger, onScroll])

  const tokens = by === 'words' ? text.split(/(\s+)/) : Array.from(text)

  return (
    <Tag
      ref={ref as never}
      className={className}
      aria-label={text}
      style={{ display: 'inline-block', perspective: 600 }}
    >
      {tokens.map((token, i) => {
        if (/^\s+$/.test(token)) {
          return (
            <span key={i} aria-hidden="true">
              {token === ' ' ? ' ' : token}
            </span>
          )
        }
        return (
          <span
            key={i}
            data-split-part
            aria-hidden="true"
            style={{ display: 'inline-block', whiteSpace: 'pre' }}
          >
            {token}
          </span>
        )
      })}
    </Tag>
  )
}
