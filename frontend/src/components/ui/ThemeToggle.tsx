import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
}

/** Accessible light/dark toggle with an animated icon swap. */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggle } = useTheme()
  const isLight = theme === 'light'

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={isLight}
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      title={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      className={cn(
        'relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-border bg-card text-foreground transition-colors hover:border-accent/50 hover:text-accent',
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isLight ? 'sun' : 'moon'}
          initial={{ y: 12, opacity: 0, rotate: -30 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -12, opacity: 0, rotate: 30 }}
          transition={{ duration: 0.18 }}
        >
          {isLight ? (
            <Sun className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Moon className="h-5 w-5" aria-hidden="true" />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
