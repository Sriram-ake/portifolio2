import { useEffect, useRef, useState } from 'react'
import { api } from '@/services/api'

/**
 * Live service status shown inside the Command Center.
 *
 * Every indicator reflects a REAL request to the existing backend — nothing is
 * hardcoded to "Online". Checks run only while the palette is open (no polling
 * loop) and are throttled so re-opening reuses a recent result. Failures are
 * caught and surfaced as "unavailable"; they never bubble up or block the UI.
 */
export type ServiceState = 'loading' | 'online' | 'degraded' | 'unavailable'

export interface ServiceStatus {
  key: string
  label: string
  state: ServiceState
  note?: string
}

interface HealthResponse {
  status: string
  services?: { chat?: string; email?: string }
}

const TTL_MS = 60_000

function initialStatuses(): ServiceStatus[] {
  return [
    { key: 'api', label: 'Portfolio API', state: 'loading' },
    { key: 'github', label: 'GitHub Data', state: 'loading' },
    { key: 'coding', label: 'Coding Data', state: 'loading' },
    { key: 'assistant', label: 'AI Assistant', state: 'loading' },
    { key: 'contact', label: 'Contact Service', state: 'loading' },
  ]
}

export function useSystemStatus(enabled: boolean): ServiceStatus[] {
  const [statuses, setStatuses] = useState<ServiceStatus[]>(initialStatuses)
  const lastRun = useRef(0)

  useEffect(() => {
    if (!enabled) return
    const now = Date.now()
    if (lastRun.current !== 0 && now - lastRun.current < TTL_MS) return
    lastRun.current = now

    let cancelled = false
    setStatuses(initialStatuses())
    const patch = (key: string, next: Partial<ServiceStatus>) =>
      setStatuses((prev) => prev.map((s) => (s.key === key ? { ...s, ...next } : s)))

    // Portfolio API + services derived from a single /health request.
    api
      .health()
      .then((res) => {
        if (cancelled) return
        const h = res as HealthResponse
        patch('api', { state: 'online' })
        const chat = h.services?.chat
        patch(
          'assistant',
          chat
            ? { state: 'online', note: chat === 'configured' ? 'AI model' : 'Rule-based' }
            : { state: 'unavailable', note: 'Temporarily unavailable' },
        )
        const email = h.services?.email
        patch(
          'contact',
          email === 'configured'
            ? { state: 'online' }
            : { state: 'degraded', note: 'Not configured' },
        )
      })
      .catch(() => {
        if (cancelled) return
        patch('api', { state: 'unavailable', note: 'Temporarily unavailable' })
        patch('assistant', { state: 'unavailable', note: 'Temporarily unavailable' })
        patch('contact', { state: 'unavailable', note: 'Temporarily unavailable' })
      })

    api
      .githubActivity()
      .then((r) => {
        if (cancelled) return
        patch(
          'github',
          r.status === 'ok'
            ? { state: 'online' }
            : { state: 'unavailable', note: 'Temporarily unavailable' },
        )
      })
      .catch(() => {
        if (!cancelled) patch('github', { state: 'unavailable', note: 'Temporarily unavailable' })
      })

    api
      .coding()
      .then((r) => {
        if (cancelled) return
        const ok = r.platforms?.some((p) => p.status === 'ok')
        patch(
          'coding',
          ok ? { state: 'online' } : { state: 'unavailable', note: 'Temporarily unavailable' },
        )
      })
      .catch(() => {
        if (!cancelled) patch('coding', { state: 'unavailable', note: 'Temporarily unavailable' })
      })

    return () => {
      cancelled = true
    }
  }, [enabled])

  return statuses
}
