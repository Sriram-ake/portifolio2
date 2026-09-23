import { useCallback } from 'react'
import { ApiError, api } from '@/services/api'
import { useAsyncRetry } from '@/hooks/useAsyncRetry'
import type { Heatmap } from '@/types'

const PLATFORMS: ('github' | 'leetcode')[] = ['github', 'leetcode']

interface UseHeatmapsResult {
  heatmaps: Heatmap[]
  loading: boolean
  waking: boolean
  error: string | null
  attempt: number
  refetch: () => void
}

/**
 * Fetches GitHub + LeetCode activity heatmaps in parallel, each isolated. If
 * every request fails (e.g. during a Render cold start) the first rejection is
 * re-thrown so useAsyncRetry can auto-retry; a partial success still renders.
 */
export function useHeatmaps(): UseHeatmapsResult {
  const fn = useCallback(async () => {
    const results = await Promise.allSettled(PLATFORMS.map((p) => api.heatmap(p)))
    const ok = results
      .filter((r): r is PromiseFulfilledResult<Heatmap> => r.status === 'fulfilled')
      .map((r) => r.value)
    if (ok.length === 0) {
      const rejected = results.find((r) => r.status === 'rejected') as
        | PromiseRejectedResult
        | undefined
      throw rejected?.reason ?? new ApiError('Activity data is unavailable right now.', 0)
    }
    return ok
  }, [])
  const { data, loading, waking, error, attempt, retry } = useAsyncRetry(fn)
  return { heatmaps: data ?? [], loading, waking, error, attempt, refetch: retry }
}
