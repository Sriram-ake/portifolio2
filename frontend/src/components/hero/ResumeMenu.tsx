import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Download, FileText } from 'lucide-react'
import { resumeOptions } from '@/data/resumes'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

interface ResumeMenuProps {
  className?: string
}

/**
 * Accessible résumé picker: a disclosure button that reveals the two real PDF
 * variants, each with its own download link. Keyboard-operable (Enter/Space to
 * open, Arrow keys to move, Escape to close and restore focus) and closes on
 * outside click. The expand/collapse is a subtle Framer transition that is
 * flattened to an instant fade when the user prefers reduced motion.
 */
export function ResumeMenu({ className }: ResumeMenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([])
  const menuId = useId()
  const count = resumeOptions.length
  const reduce = useReducedMotion()

  // Close on outside click or Escape (Escape restores focus to the trigger).
  useEffect(() => {
    if (!open) return
    const onPointer = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Move focus into the menu once it opens.
  useEffect(() => {
    if (open) itemsRef.current[0]?.focus()
  }, [open])

  const onItemKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      itemsRef.current[(index + 1) % count]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      itemsRef.current[(index - 1 + count) % count]?.focus()
    }
  }

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] [touch-action:manipulation]"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        Resume
        <ChevronDown
          className={cn('h-4 w-4 transition-transform duration-200', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            role="menu"
            aria-label="Choose a résumé to download"
            initial={reduce ? false : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: reduce ? 0 : 0.16, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'top left' }}
            className="absolute left-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-card border border-border bg-card p-1.5 shadow-card"
          >
            {resumeOptions.map((option, i) => (
              <a
                key={option.id}
                ref={(el) => {
                  itemsRef.current[i] = el
                }}
                role="menuitem"
                href={option.file}
                download={option.downloadName}
                aria-label={`Download ${option.label} (PDF) — ${option.description}`}
                onClick={() => setOpen(false)}
                onKeyDown={(e) => onItemKeyDown(e, i)}
                className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-accent/10 focus-visible:bg-accent/10 focus-visible:outline-none"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-accent transition-colors group-hover:border-accent/50">
                  <FileText className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {option.label}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {option.description}
                  </span>
                </span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors group-hover:bg-accent/10 group-hover:text-accent">
                  <Download className="h-4 w-4" aria-hidden="true" />
                </span>
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
