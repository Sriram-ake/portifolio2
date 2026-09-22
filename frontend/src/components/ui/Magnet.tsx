import { useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MagnetProps {
  children: ReactNode
  className?: string
  /** How far the element is allowed to travel toward the cursor, in px. */
  strength?: number
  /** Distance from the element at which the pull begins, in px. */
  radius?: number
}

/**
 * Magnetic hover: the element eases toward the cursor while it's nearby, then
 * springs back on leave (React Bits "Magnet"). Pointer-only enhancement — falls
 * back to a normal static element for touch/keyboard and reduced-motion users.
 */
export function Magnet({ children, className, strength = 18, radius = 120 }: MagnetProps) {
  const ref = useRef<HTMLSpanElement>(null)

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.hypot(dx, dy)
    const pull = Math.max(0, 1 - dist / (radius + rect.width / 2))
    el.style.transform = `translate(${(dx / (radius + rect.width / 2)) * strength * pull}px, ${
      (dy / (radius + rect.height / 2)) * strength * pull
    }px)`
  }

  const handleLeave = () => {
    const el = ref.current
    if (el) el.style.transform = 'translate(0, 0)'
  }

  return (
    <span
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn('inline-block transition-transform duration-300 ease-out will-change-transform', className)}
      style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      {children}
    </span>
  )
}
