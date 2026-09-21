import { useCallback, useEffect, useState } from 'react'
import { api } from '@/services/api'
import type { GitHubActivityItem } from '@/types'

interface UseGitHubActivityResult {
  items: GitHubActivityItem[]
  loading: boolean
  error: string | null
  refetch: () => void
}

/** Fetches recent public GitHub activity from the backend (cached, newest first). */
export function useGitHubActivity(): UseGitHubActivityResult {
  const [items, setItems] = useState<GitHubActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.githubActivity()
      if (res.status === 'ok') {
        setItems(res.items)
      } else {
        setError(res.message ?? 'Activity is unavailable right now.')
      }
    } catch {
      setError('Activity is unavailable right now.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return { items, loading, error, refetch: load }
}
