import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GradientTextProps {
  children: ReactNode
  className?: string
  /** Animate the gradient position (flowing accent). */
  animate?: boolean
}

/**
 * Accent gradient text (violet → cyan). Optionally animates the gradient
 * position for a living, flowing look (React Bits "Gradient Text"). The flow
 * animation is paused under prefers-reduced-motion by the global killswitch.
 */
export function GradientText({ children, className, animate = false }: GradientTextProps) {
  return (
    <span
      className={cn(
        'inline-block bg-clip-text text-transparent',
        animate && 'animate-border-flow',
        className,
      )}
      style={{
        backgroundImage:
          'linear-gradient(100deg, rgb(var(--color-accent)), rgb(var(--color-accent-secondary)), rgb(var(--color-accent)))',
        backgroundSize: animate ? '200% auto' : '100% auto',
      }}
    >
      {children}
    </span>
  )
}
