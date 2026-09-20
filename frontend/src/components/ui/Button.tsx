import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap [touch-action:manipulation]'

const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-accent-foreground hover:brightness-110 hover:shadow-[0_8px_30px_-8px_rgb(var(--color-accent)/0.5)] active:scale-[0.98]',
  secondary:
    'border border-border bg-card text-foreground hover:border-accent/60 hover:bg-muted active:scale-[0.98]',
  ghost: 'text-muted-foreground hover:text-foreground hover:bg-muted active:scale-[0.98]',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-12 px-7 text-base',
}

interface CommonProps {
  variant?: Variant
  size?: Size
  children: ReactNode
  className?: string
}

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & { as?: 'button' }
type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & { as: 'a' }

export type ButtonProps = ButtonAsButton | ButtonAsLink

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button({ variant = 'primary', size = 'md', className, children, ...props }, ref) {
    const classes = cn(base, variants[variant], sizes[size], className)
    if (props.as === 'a') {
      const { as: _as, ...anchorProps } = props
      return (
        <a ref={ref as React.Ref<HTMLAnchorElement>} className={classes} {...anchorProps}>
          {children}
        </a>
      )
    }
    const { as: _as, ...buttonProps } = props as ButtonAsButton
    return (
      <button ref={ref as React.Ref<HTMLButtonElement>} className={classes} {...buttonProps}>
        {children}
      </button>
    )
  },
)
