import { useCallback } from 'react'
import { ApiError, api } from '@/services/api'
import { useAsyncRetry } from '@/hooks/useAsyncRetry'
import type { Heatmap } from '@/types'

type HeatmapPlatform = 'github' | 'leetcode'

const DEFAULT_PLATFORMS: HeatmapPlatform[] = ['github', 'leetcode']

interface UseHeatmapsResult {
  heatmaps: Heatmap[]
  loading: boolean
  waking: boolean
  error: string | null
  attempt: number
  refetch: () => void
}

/**
 * Fetches the requested activity heatmaps in parallel, each isolated. If every
 * request fails (e.g. during a Render cold start) the first rejection is
 * re-thrown so useAsyncRetry can auto-retry; a partial success still renders.
 *
 * Callers scope the platforms they own so each heatmap is fetched exactly once
 * across the page: the GitHub section requests `['github']`, the Coding section
 * requests `['leetcode']`.
 */
export function useHeatmaps(platforms: HeatmapPlatform[] = DEFAULT_PLATFORMS): UseHeatmapsResult {
  const key = platforms.join(',')
  const fn = useCallback(async () => {
    const list = key.split(',') as HeatmapPlatform[]
    const results = await Promise.allSettled(list.map((p) => api.heatmap(p)))
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
  }, [key])
  const { data, loading, waking, error, attempt, retry } = useAsyncRetry(fn)
  return { heatmaps: data ?? [], loading, waking, error, attempt, refetch: retry }
}
