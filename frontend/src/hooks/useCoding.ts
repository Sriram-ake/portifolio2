import { useCallback, useEffect, useState } from 'react'
import { api } from '@/services/api'
import type { CodingSummary } from '@/types'

interface UseCodingResult {
  data: CodingSummary | null
  loading: boolean
  error: string | null
  refetch: () => void
}

/** Fetches the aggregated coding summary from the backend with retry support. */
export function useCoding(): UseCodingResult {
  const [data, setData] = useState<CodingSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await api.coding()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load coding statistics.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return { data, loading, error, refetch: load }
}
