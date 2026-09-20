import { useRef, type ReactNode, type MouseEvent } from 'react'
import { cn } from '@/lib/utils'

interface SpotlightCardProps {
  children: ReactNode
  className?: string
  /** Radius of the spotlight glow in px. */
  radius?: number
}

/**
 * Card with a cursor-following radial spotlight and a thin animated border.
 * A ReactBits-style effect, implemented in-house to match the design system.
 * Pointer-only enhancement — the card is fully usable without it.
 */
export function SpotlightCard({ children, className, radius = 280 }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`)
    el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`)
    el.style.setProperty('--spot-opacity', '1')
  }

  const handleLeave = () => {
    ref.current?.style.setProperty('--spot-opacity', '0')
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn(
        'group relative overflow-hidden rounded-card border border-border bg-card transition-colors duration-300 hover:border-accent/40',
        className,
      )}
      style={
        {
          '--spot-x': '50%',
          '--spot-y': '50%',
          '--spot-opacity': '0',
        } as React.CSSProperties
      }
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: 'var(--spot-opacity)',
          background: `radial-gradient(${radius}px circle at var(--spot-x) var(--spot-y), rgb(var(--color-accent) / 0.14), transparent 70%)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  )
}
