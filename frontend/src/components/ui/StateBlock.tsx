import type { ReactNode } from 'react'
import { AlertTriangle, Inbox, Loader2 } from 'lucide-react'
import { Button } from './Button'

interface StateBlockProps {
  variant: 'loading' | 'empty' | 'error'
  title?: string
  message?: string
  onRetry?: () => void
  children?: ReactNode
}

/** Consistent loading / empty / error states for API-driven components. */
export function StateBlock({ variant, title, message, onRetry }: StateBlockProps) {
  const config = {
    loading: {
      icon: <Loader2 className="h-6 w-6 animate-spin text-accent" aria-hidden="true" />,
      defaultTitle: 'Loading…',
      defaultMessage: 'Fetching the latest data.',
    },
    empty: {
      icon: <Inbox className="h-6 w-6 text-muted-foreground" aria-hidden="true" />,
      defaultTitle: 'Nothing here yet',
      defaultMessage: 'This content will appear once it is available.',
    },
    error: {
      icon: <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden="true" />,
      defaultTitle: 'Something went wrong',
      defaultMessage: 'The data is unavailable right now.',
    },
  }[variant]

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-border bg-card/50 px-6 py-12 text-center"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        {config.icon}
      </div>
      <p className="font-medium text-foreground">{title ?? config.defaultTitle}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{message ?? config.defaultMessage}</p>
      {variant === 'error' && onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-2">
          Retry
        </Button>
      )}
    </div>
  )
}
