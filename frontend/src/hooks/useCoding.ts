import { useCallback } from 'react'
import { api } from '@/services/api'
import { useAsyncRetry } from '@/hooks/useAsyncRetry'
import type { CodingSummary } from '@/types'

interface UseCodingResult {
  data: CodingSummary | null
  loading: boolean
  waking: boolean
  error: string | null
  attempt: number
  refetch: () => void
}

/**
 * Fetches the aggregated coding summary from the backend, auto-retrying through
 * a Render cold start before surfacing an error (see useAsyncRetry).
 */
export function useCoding(): UseCodingResult {
  const fn = useCallback(() => api.coding(), [])
  const { data, loading, waking, error, attempt, retry } = useAsyncRetry(fn)
  return { data, loading, waking, error, attempt, refetch: retry }
}
