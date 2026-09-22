import { cn } from '@/lib/utils'

interface ShinyTextProps {
  children: string
  className?: string
  /** Disable the sweep (renders plain, still styled). */
  disabled?: boolean
}

/**
 * Text with a soft light sweep travelling across it (React Bits "Shiny Text").
 * The shimmer animation is paused globally under prefers-reduced-motion via the
 * app's motion killswitch, leaving legible static text.
 */
export function ShinyText({ children, className, disabled = false }: ShinyTextProps) {
  return (
    <span
      className={cn(
        'inline-block bg-clip-text text-transparent',
        !disabled && 'animate-shine',
        className,
      )}
      style={{
        backgroundImage:
          'linear-gradient(110deg, rgb(var(--color-muted-foreground)) 40%, rgb(var(--color-foreground)) 50%, rgb(var(--color-muted-foreground)) 60%)',
        backgroundSize: '200% auto',
      }}
    >
      {children}
    </span>
  )
}
