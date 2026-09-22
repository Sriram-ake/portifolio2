import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MarqueeProps {
  children: ReactNode
  className?: string
  /** Seconds for one full loop. */
  speed?: number
  /** Scroll direction. */
  reverse?: boolean
  /** Fade the left/right edges into the background. */
  fade?: boolean
}

/**
 * Infinite horizontal marquee (React Bits style). The children are duplicated
 * once and translated -50% so the loop is seamless. Pauses on hover, and the
 * animation halts under prefers-reduced-motion via the global killswitch —
 * leaving the first (static) copy readable.
 */
export function Marquee({
  children,
  className,
  speed = 40,
  reverse = false,
  fade = true,
}: MarqueeProps) {
  return (
    <div
      className={cn('group relative flex overflow-hidden', className)}
      style={
        fade
          ? {
              maskImage:
                'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
            }
          : undefined
      }
    >
      <div
        className="flex animate-marquee group-hover:[animation-play-state:paused]"
        style={
          {
            '--marquee-duration': `${speed}s`,
            animationDirection: reverse ? 'reverse' : 'normal',
          } as React.CSSProperties
        }
      >
        <div className="flex shrink-0 items-center gap-8 pr-8">{children}</div>
        <div aria-hidden="true" className="flex shrink-0 items-center gap-8 pr-8">
          {children}
        </div>
      </div>
    </div>
  )
}
