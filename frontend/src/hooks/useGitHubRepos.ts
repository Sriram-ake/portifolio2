import { useCallback } from 'react'
import { ApiError, api } from '@/services/api'
import { useAsyncRetry } from '@/hooks/useAsyncRetry'
import type { GitHubRepo } from '@/types'

interface UseGitHubReposResult {
  repos: GitHubRepo[]
  loading: boolean
  waking: boolean
  error: string | null
  attempt: number
  refetch: () => void
}

/**
 * Fetches the latest public repositories from the backend (cached), auto-
 * retrying through a Render cold start. A 200 response that reports a non-"ok"
 * status is a real upstream failure, not a cold start, so it's thrown with a
 * non-transient status code — surfaced immediately with a Retry button rather
 * than retried in a loop.
 */
export function useGitHubRepos(): UseGitHubReposResult {
  const fn = useCallback(async () => {
    const res = await api.githubRepos()
    if (res.status !== 'ok') {
      throw new ApiError(res.message ?? 'Repositories are unavailable right now.', 200)
    }
    return res.repos
  }, [])
  const { data, loading, waking, error, attempt, retry } = useAsyncRetry(fn)
  return { repos: data ?? [], loading, waking, error, attempt, refetch: retry }
}
