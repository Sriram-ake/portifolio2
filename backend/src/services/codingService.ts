/** Orchestrates coding-platform fetchers with caching and failure isolation. */

import { TTLCache } from '../cache'
import { settings } from '../config'
import { USERNAMES } from '../data'
import { FETCHERS, HEATMAP_FETCHERS, github } from '../scrapers'
import { heatmapUnavailable, nowIso, unavailable } from '../scrapers/base'
import type {
  CodingPlatformStats,
  CodingSummary,
  GitHubActivityResponse,
  GitHubReposResponse,
  Heatmap,
  RepoCommitsResponse,
} from '../types'

const statsCache = new TTLCache<CodingPlatformStats>(settings.codingCacheTtl)
const heatmapCache = new TTLCache<Heatmap>(settings.codingCacheTtl)
const reposCache = new TTLCache<GitHubReposResponse>(settings.codingCacheTtl)
const activityCache = new TTLCache<GitHubActivityResponse>(settings.codingCacheTtl)
const commitsCache = new TTLCache<RepoCommitsResponse>(settings.codingCacheTtl)

// Preserve a stable card order in the UI.
export const PLATFORM_ORDER = [
  'github',
  'leetcode',
  'codechef',
  'hackerrank',
  'geeksforgeeks',
  'codeforces',
]

export const HEATMAP_PLATFORMS = Object.keys(HEATMAP_FETCHERS)

async function fetchOne(platform: string, force = false): Promise<CodingPlatformStats> {
  const username = USERNAMES[platform]
  if (!force) {
    const cached = statsCache.get(platform)
    if (cached) return cached
  }

  let result: CodingPlatformStats
  try {
    result = await FETCHERS[platform](username)
  } catch {
    // Never let one platform crash the request.
    result = unavailable(platform, username)
  }

  // Only cache successful results so a transient failure doesn't stick.
  if (result.status === 'ok') statsCache.set(platform, result)
  return result
}

export async function getPlatform(platform: string, force = false): Promise<CodingPlatformStats> {
  if (!(platform in FETCHERS)) throw new Error(`Unknown platform: ${platform}`)
  return fetchOne(platform, force)
}

export async function getSummary(force = false): Promise<CodingSummary> {
  const results = await Promise.all(PLATFORM_ORDER.map((p) => fetchOne(p, force)))
  results.sort((a, b) => PLATFORM_ORDER.indexOf(a.platform) - PLATFORM_ORDER.indexOf(b.platform))
  return { platforms: results, updatedAt: nowIso() }
}

export async function getHeatmap(platform: string, force = false): Promise<Heatmap> {
  if (!(platform in HEATMAP_FETCHERS)) throw new Error(`No heatmap for platform: ${platform}`)
  const username = USERNAMES[platform]
  if (!force) {
    const cached = heatmapCache.get(platform)
    if (cached) return cached
  }
  let result: Heatmap
  try {
    result = await HEATMAP_FETCHERS[platform](username)
  } catch {
    result = heatmapUnavailable(platform, username)
  }
  if (result.status === 'ok') heatmapCache.set(platform, result)
  return result
}

export async function getRepos(force = false): Promise<GitHubReposResponse> {
  if (!force) {
    const cached = reposCache.get('repos')
    if (cached) return cached
  }
  let result: GitHubReposResponse
  try {
    result = await github.fetchRepos(settings.githubUsername)
  } catch {
    result = { status: 'unavailable', repos: [], message: 'Could not load repositories.' }
  }
  if (result.status === 'ok') reposCache.set('repos', result)
  return result
}

export async function getActivity(force = false): Promise<GitHubActivityResponse> {
  if (!force) {
    const cached = activityCache.get('activity')
    if (cached) return cached
  }
  let result: GitHubActivityResponse
  try {
    result = await github.fetchActivity(settings.githubUsername)
  } catch {
    result = { status: 'unavailable', items: [], message: 'Could not load activity.' }
  }
  if (result.status === 'ok') activityCache.set('activity', result)
  return result
}

export async function getCommits(
  owner: string,
  repo: string,
  force = false,
): Promise<RepoCommitsResponse> {
  const key = `${owner}/${repo}`
  if (!force) {
    const cached = commitsCache.get(key)
    if (cached) return cached
  }
  let result: RepoCommitsResponse
  try {
    result = await github.fetchCommits(owner, repo)
  } catch {
    result = { status: 'unavailable', commits: [], message: 'Could not load commits.' }
  }
  if (result.status === 'ok') commitsCache.set(key, result)
  return result
}

export function clearCache(): void {
  statsCache.clear()
  heatmapCache.clear()
  reposCache.clear()
  activityCache.clear()
  commitsCache.clear()
}
