import { createContext, useContext } from 'react'

/**
 * Command Center context — split from the provider component so the module
 * only exports non-components (keeps react-refresh / fast-refresh happy).
 */
export interface CommandCenterContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
}

export const CommandCenterContext = createContext<CommandCenterContextValue | null>(null)

export function useCommandCenter(): CommandCenterContextValue {
  const ctx = useContext(CommandCenterContext)
  if (!ctx) throw new Error('useCommandCenter must be used within a CommandCenterProvider')
  return ctx
}
