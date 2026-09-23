import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError } from '@/services/api'

/** Max automatic retries before giving up and surfacing an error. */
export const MAX_RETRIES = 6

const BASE_DELAY = 1500
const MAX_DELAY = 10_000

export interface AsyncRetryState<T> {
  data: T | null
  /** First load (or a reset) is in flight and no data/error is settled yet. */
  loading: boolean
  /** A transient failure occurred and we're auto-retrying (e.g. Render cold start). */
  waking: boolean
  /** Set only after retries are exhausted or a non-transient failure occurs. */
  error: string | null
  /** Number of failed attempts so far (drives "attempt X of N" messaging). */
  attempt: number
  /** Manually restart the whole load (resets attempts). Used by Retry buttons. */
  retry: () => void
}

/**
 * A failure is transient — and worth retrying — when it's a transport-level
 * problem rather than a definitive answer from the API. Render free instances
 * sleep when idle, so the first request after inactivity fails to connect (0)
 * or times out (408) while the server wakes; 429/5xx are also temporary. Any
 * other 4xx is a real error we should surface immediately.
 */
function isTransient(err: unknown): boolean {
  if (err instanceof ApiError) {
    return err.status === 0 || err.status === 408 || err.status === 429 || err.status >= 500
  }
  // Unknown/unexpected errors are treated as transient so a fluke doesn't
  // permanently break the section — the retry cap still bounds the attempts.
  return true
}

/** Exponential backoff with a ceiling: 1.5s, 3s, 6s, 10s, 10s, … */
function backoff(attempt: number): number {
  return Math.min(BASE_DELAY * 2 ** attempt, MAX_DELAY)
}

/**
 * Runs an async loader with bounded automatic retries for transient failures.
 * Keeps the caller in a loading/"waking" state across cold-start retries and
 * recovers automatically once the backend responds — no manual retry needed
 * until the (finite) retry budget is spent.
 */
export function useAsyncRetry<T>(fn: () => Promise<T>): AsyncRetryState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [waking, setWaking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  // Keep the latest loader without making it an effect dependency, so the
  // fetch runs once on mount (and on manual retry) rather than every render.
  const fnRef = useRef(fn)
  fnRef.current = fn

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const runId = useRef(0)
  const mounted = useRef(true)

  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
  }

  const attemptLoad = useCallback((tries: number, id: number) => {
    fnRef.current().then(
      (result) => {
        if (!mounted.current || id !== runId.current) return
        setData(result)
        setError(null)
        setWaking(false)
        setLoading(false)
      },
      (err: unknown) => {
        if (!mounted.current || id !== runId.current) return
        if (isTransient(err) && tries < MAX_RETRIES) {
          setWaking(true)
          setAttempt(tries + 1)
          clearTimer()
          timer.current = setTimeout(() => attemptLoad(tries + 1, id), backoff(tries))
        } else {
          setError(err instanceof Error ? err.message : 'Something went wrong.')
          setWaking(false)
          setLoading(false)
        }
      },
    )
  }, [])

  const start = useCallback(() => {
    clearTimer()
    const id = ++runId.current
    setLoading(true)
    setWaking(false)
    setError(null)
    setAttempt(0)
    attemptLoad(0, id)
  }, [attemptLoad])

  useEffect(() => {
    mounted.current = true
    start()
    return () => {
      mounted.current = false
      clearTimer()
    }
  }, [start])

  return { data, loading, waking, error, attempt, retry: start }
}
