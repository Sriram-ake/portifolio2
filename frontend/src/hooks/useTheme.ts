import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

function currentTheme(): Theme {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.classList.contains('light') ? 'light' : 'dark'
}

/**
 * Light/dark theme manager.
 * The initial theme is applied by an inline script in index.html (no flash);
 * this hook keeps React state in sync, persists the choice, and updates the
 * browser theme-color.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(currentTheme)

  const apply = useCallback((next: Theme) => {
    const isLight = next === 'light'
    document.documentElement.classList.toggle('light', isLight)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // storage unavailable — ignore
    }
    const meta = document.querySelector('meta[name="theme-color"]')
    meta?.setAttribute('content', isLight ? '#faf9f6' : '#0a0805')
    setThemeState(next)
  }, [])

  const toggle = useCallback(() => {
    apply(currentTheme() === 'light' ? 'dark' : 'light')
  }, [apply])

  // Keep in sync if the OS preference changes and the user hasn't chosen one.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem(STORAGE_KEY)) apply(e.matches ? 'light' : 'dark')
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [apply])

  return { theme, toggle, setTheme: apply }
}
