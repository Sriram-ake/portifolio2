import { useCallback, useEffect, useState } from 'react'
import { api } from '@/services/api'
import type { GitHubRepo } from '@/types'

interface UseGitHubReposResult {
  repos: GitHubRepo[]
  loading: boolean
  error: string | null
  refetch: () => void
}

/** Fetches the latest public repositories from the backend (cached). */
export function useGitHubRepos(): UseGitHubReposResult {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.githubRepos()
      if (res.status === 'ok') {
        setRepos(res.repos)
      } else {
        setError(res.message ?? 'Repositories are unavailable right now.')
      }
    } catch {
      setError('Repositories are unavailable right now.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return { repos, loading, error, refetch: load }
}
