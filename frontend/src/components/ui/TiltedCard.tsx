import { useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TiltedCardProps {
  children: ReactNode
  className?: string
  /** Max rotation on each axis, in degrees. */
  max?: number
  /** Adds a moving glare highlight across the surface. */
  glare?: boolean
}

/**
 * 3D tilt-on-hover card that follows the cursor with a subtle parallax and an
 * optional glare sweep (React Bits "Tilted Card"). Pointer-only — touch and
 * reduced-motion users get a normal flat card.
 */
export function TiltedCard({ children, className, max = 10, glare = true }: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const rotY = (px - 0.5) * 2 * max
    const rotX = -(py - 0.5) * 2 * max
    el.style.setProperty('--rx', `${rotX}deg`)
    el.style.setProperty('--ry', `${rotY}deg`)
    el.style.setProperty('--glare-x', `${px * 100}%`)
    el.style.setProperty('--glare-y', `${py * 100}%`)
    el.style.setProperty('--glare-opacity', '1')
  }

  const handleLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
    el.style.setProperty('--glare-opacity', '0')
  }

  return (
    <div style={{ perspective: 900 }} className="h-full">
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className={cn(
          'group relative h-full overflow-hidden rounded-card border border-border bg-card transition-[transform,border-color] duration-200 ease-out hover:border-accent/40',
          className,
        )}
        style={
          {
            transform:
              'rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))',
            transformStyle: 'preserve-3d',
            '--glare-opacity': '0',
          } as React.CSSProperties
        }
      >
        <div className="relative z-10 h-full [transform:translateZ(40px)]">{children}</div>
        {glare && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 transition-opacity duration-200"
            style={{
              opacity: 'var(--glare-opacity)',
              background:
                'radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgb(255 255 255 / 0.12), transparent 55%)',
            }}
          />
        )}
      </div>
    </div>
  )
}
