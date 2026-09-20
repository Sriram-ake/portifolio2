import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'accent' | 'outline'
}

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  const variants = {
    default: 'bg-muted text-muted-foreground',
    accent: 'bg-accent/10 text-accent ring-1 ring-inset ring-accent/20',
    outline: 'border border-border text-foreground',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-xs font-medium',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
