import { useCallback, useEffect, useState } from 'react'
import { api } from '@/services/api'
import type { Heatmap } from '@/types'

const PLATFORMS: ('github' | 'leetcode')[] = ['github', 'leetcode']

interface UseHeatmapsResult {
  heatmaps: Heatmap[]
  loading: boolean
  error: string | null
  refetch: () => void
}

/** Fetches GitHub + LeetCode activity heatmaps in parallel, each isolated. */
export function useHeatmaps(): UseHeatmapsResult {
  const [heatmaps, setHeatmaps] = useState<Heatmap[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const results = await Promise.allSettled(PLATFORMS.map((p) => api.heatmap(p)))
      const ok = results
        .filter((r): r is PromiseFulfilledResult<Heatmap> => r.status === 'fulfilled')
        .map((r) => r.value)
      if (ok.length === 0) {
        setError('Activity data is unavailable right now.')
      }
      setHeatmaps(ok)
    } catch {
      setError('Activity data is unavailable right now.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return { heatmaps, loading, error, refetch: load }
}
