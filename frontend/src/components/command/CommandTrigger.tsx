import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCommandCenter } from './commandCenterContext'

/** True on Apple platforms, so we can show ⌘K instead of Ctrl K. */
function useIsMac(): boolean {
  const [isMac, setIsMac] = useState(false)
  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent))
  }, [])
  return isMac
}

interface CommandTriggerProps {
  /** 'bar' = discoverable desktop pill; 'icon' = compact button for mobile. */
  variant?: 'bar' | 'icon'
  className?: string
}

export function CommandTrigger({ variant = 'bar', className }: CommandTriggerProps) {
  const { setOpen } = useCommandCenter()
  const isMac = useIsMac()
  const combo = isMac ? '⌘K' : 'Ctrl K'

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open command center"
        aria-keyshortcuts="Meta+K Control+K"
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground',
          className,
        )}
      >
        <Search className="h-5 w-5" aria-hidden="true" />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Open command center"
      aria-keyshortcuts="Meta+K Control+K"
      className={cn(
        'group flex items-center gap-2 rounded-full border border-border bg-card/60 py-1.5 pl-3 pr-1.5 text-[13px] text-muted-foreground transition-colors hover:border-accent/40 hover:text-foreground',
        className,
      )}
    >
      <Search className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="hidden xl:inline">Search…</span>
      <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground transition-colors group-hover:border-accent/40">
        {combo}
      </kbd>
    </button>
  )
}
