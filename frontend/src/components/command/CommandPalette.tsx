import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CornerDownLeft } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { profile } from '@/data/profile'
import { OPEN_ASSISTANT_EVENT } from '@/components/chatbot/ChatWidget'
import { cn } from '@/lib/utils'
import {
  buildCommands,
  filterCommands,
  type Command,
  type CommandActions,
  type CommandGroup,
} from './commands'
import { useSystemStatus, type ServiceState } from './useSystemStatus'

const GROUP_ORDER: CommandGroup[] = ['Navigation', 'Actions', 'Projects']

function dotClass(state: ServiceState): string {
  return cn(
    'h-2 w-2 shrink-0 rounded-full',
    state === 'online' && 'bg-success',
    state === 'degraded' && 'bg-amber-400',
    state === 'loading' && 'bg-muted-foreground/40 motion-safe:animate-pulse',
    state === 'unavailable' && 'border border-muted-foreground/50',
  )
}

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const { toggle: toggleTheme } = useTheme()
  const reduce = useReducedMotion()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [copied, setCopied] = useState<string | null>(null)

  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const copyTimer = useRef<number | undefined>(undefined)

  const statuses = useSystemStatus(open)

  const actions = useMemo<CommandActions>(
    () => ({
      navigate: (href) => {
        const el = document.querySelector(href)
        el?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
      },
      toggleTheme,
      openAssistant: () => window.dispatchEvent(new Event(OPEN_ASSISTANT_EVENT)),
      openExternal: (url) => window.open(url, '_blank', 'noopener,noreferrer'),
      copyEmail: () => {
        void navigator.clipboard?.writeText(profile.email).catch(() => {})
        return 'Email copied to clipboard'
      },
    }),
    [reduce, toggleTheme],
  )

  const commands = useMemo(() => buildCommands(actions), [actions])
  const filtered = useMemo(() => filterCommands(commands, query), [commands, query])

  // Reset transient state each time the palette opens.
  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
      setCopied(null)
    }
  }, [open])

  // Focus the input on open; lock scroll; restore focus to the trigger on close.
  useEffect(() => {
    if (!open) return
    previouslyFocused.current = document.activeElement as HTMLElement
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => inputRef.current?.focus(), 20)
    return () => {
      window.clearTimeout(t)
      document.body.style.overflow = ''
      previouslyFocused.current?.focus({ preventScroll: true })
    }
  }, [open])

  // Escape to close + Tab focus trap kept inside the dialog.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key === 'Tab' && panelRef.current) {
        const items = panelRef.current.querySelectorAll<HTMLElement>(
          'input, button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        )
        if (items.length === 0) return
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  // Keep the active option scrolled into view.
  useEffect(() => {
    if (!open) return
    document.getElementById(`cmd-opt-${activeIndex}`)?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open])

  useEffect(() => () => window.clearTimeout(copyTimer.current), [])

  const runCommand = (cmd: Command) => {
    const feedback = cmd.run()
    if (typeof feedback === 'string') {
      // String return = keep the palette open and flash a confirmation.
      setCopied(feedback)
      window.clearTimeout(copyTimer.current)
      copyTimer.current = window.setTimeout(() => setCopied(null), 1400)
      return
    }
    onClose()
  }

  const onInputKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (filtered.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % filtered.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const cmd = filtered[activeIndex]
      if (cmd) runCommand(cmd)
    } else if (e.key === 'Home') {
      e.preventDefault()
      setActiveIndex(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setActiveIndex(filtered.length - 1)
    }
  }

  const withIndex = filtered.map((cmd, i) => ({ cmd, i }))
  const grouped = GROUP_ORDER.map((group) => ({
    group,
    items: withIndex.filter((x) => x.cmd.group === group),
  })).filter((g) => g.items.length > 0)

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[95] flex items-start justify-center p-4 pt-24 sm:pt-[14vh]">
          <motion.div
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Command Center"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border bg-card/95 shadow-card ring-1 ring-accent/15 backdrop-blur-xl"
          >
            {/* Terminal-style prompt row — the single signature interaction. */}
            <div className="flex items-center gap-2 border-b border-border px-4">
              <span
                className={cn(
                  'select-none font-mono text-base font-semibold text-accent',
                  query === '' && 'motion-safe:animate-pulse',
                )}
                aria-hidden="true"
              >
                {'❯'}
              </span>
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-controls="cmd-listbox"
                aria-activedescendant={filtered.length ? `cmd-opt-${activeIndex}` : undefined}
                aria-label="Search commands and sections"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setActiveIndex(0)
                }}
                onKeyDown={onInputKeyDown}
                placeholder="Type a command or search…"
                className="h-14 flex-1 bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/70 sm:text-base"
              />
              <kbd className="hidden shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-block">
                ESC
              </kbd>
            </div>
            {/* Results (combobox listbox) */}
            <div
              id="cmd-listbox"
              role="listbox"
              aria-label="Commands"
              className="flex-1 overflow-y-auto overscroll-contain px-2 py-2"
            >
              {filtered.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                  No matching commands. Try a different term.
                </p>
              ) : (
                grouped.map(({ group, items }) => (
                  <div key={group} className="mb-1 last:mb-0">
                    <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {group}
                    </p>
                    <ul>
                      {items.map(({ cmd, i }) => {
                        const Icon = cmd.icon
                        const active = i === activeIndex
                        return (
                          <li key={cmd.id}>
                            <div
                              id={`cmd-opt-${i}`}
                              role="option"
                              aria-selected={active}
                              onMouseMove={() => setActiveIndex(i)}
                              onClick={() => runCommand(cmd)}
                              className={cn(
                                'flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                                active ? 'bg-accent/12' : '',
                              )}
                            >
                              <Icon
                                className={cn(
                                  'h-4 w-4 shrink-0',
                                  active ? 'text-accent' : 'text-muted-foreground',
                                )}
                                aria-hidden="true"
                              />
                              <span className="flex-1 truncate text-foreground/90">{cmd.title}</span>
                              {cmd.hint && (
                                <span className="shrink-0 truncate font-mono text-[11px] text-muted-foreground/80">
                                  {cmd.hint}
                                </span>
                              )}
                              {active && (
                                <CornerDownLeft
                                  className="h-3.5 w-3.5 shrink-0 text-accent"
                                  aria-hidden="true"
                                />
                              )}
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))
              )}
            </div>
            {/* Live system status — real request state, never hardcoded. */}
            <div className="border-t border-border px-4 py-2.5">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  System status
                </p>
                {copied && (
                  <span role="status" className="font-mono text-[11px] text-success">
                    {copied}
                  </span>
                )}
              </div>
              <ul className="mt-1.5 grid grid-cols-1 gap-y-1 sm:grid-cols-2 sm:gap-x-6">
                {statuses.map((s) => (
                  <li key={s.key} className="flex items-center gap-2">
                    <span className={dotClass(s.state)} aria-hidden="true" />
                    <span className="text-[11px] text-muted-foreground">{s.label}</span>
                    {s.note && (
                      <span className="ml-auto truncate font-mono text-[10px] text-muted-foreground/70">
                        {s.note}
                      </span>
                    )}
                    <span className="sr-only">
                      {s.state === 'online'
                        ? 'online'
                        : s.state === 'loading'
                          ? 'checking'
                          : (s.note ?? s.state)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer hints */}
            <div className="flex items-center gap-3 border-t border-border bg-muted/30 px-4 py-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Hint>↑</Hint>
                <Hint>↓</Hint>
                navigate
              </span>
              <span className="flex items-center gap-1">
                <Hint>↵</Hint>
                open
              </span>
              <span className="flex items-center gap-1">
                <Hint>esc</Hint>
                close
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

function Hint({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
      {children}
    </kbd>
  )
}
