import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { CommandPalette } from './CommandPalette'
import { CommandCenterContext } from './commandCenterContext'

/**
 * Global Command Center state.
 *
 * A single provider owns the palette's open/close state, wires the global
 * Ctrl/⌘+K chord, and renders the palette once at the app root. Any component
 * (triggers, status bar) reads/controls it through `useCommandCenter()`
 * (exported from ./commandCenterContext).
 */
export function CommandCenterProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const toggle = useCallback(() => setOpen((v) => !v), [])

  // Ctrl+K (Windows/Linux) or ⌘K (macOS). Treated as a deliberate command
  // chord, so it fires even from inside inputs; the browser default is stopped.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.altKey && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const value = useMemo(() => ({ open, setOpen, toggle }), [open, toggle])

  return (
    <CommandCenterContext.Provider value={value}>
      {children}
      <CommandPalette open={open} onClose={() => setOpen(false)} />
    </CommandCenterContext.Provider>
  )
}
