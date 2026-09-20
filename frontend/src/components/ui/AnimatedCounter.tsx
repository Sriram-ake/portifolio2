import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { formatCompact } from '@/lib/utils'

interface AnimatedCounterProps {
  value: number
  /** Use compact notation (1.2k) for large numbers. */
  compact?: boolean
  durationMs?: number
  className?: string
}

/** Counts up to `value` when scrolled into view. Respects reduced motion. */
export function AnimatedCounter({
  value,
  compact = false,
  durationMs = 1200,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setDisplay(value)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1)
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setDisplay(Math.round(eased * value))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, durationMs, reduce])

  const formatted = compact ? formatCompact(display) : display.toLocaleString('en-US')

  return (
    <span ref={ref} className={className}>
      {formatted}
    </span>
  )
}
