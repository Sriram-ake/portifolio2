/** GitHub statistics via the official public REST API. */

import {
  githubHeaders,
  heatmapOk,
  heatmapUnavailable,
  httpGet,
  nowIso,
  ok,
  unavailable,
} from './base'
import type {
  CodingPlatformStats,
  GitHubActivityItem,
  GitHubActivityResponse,
  GitHubRepo,
  GitHubReposResponse,
  Heatmap,
  HeatmapDay,
  RepoCommit,
  RepoCommitsResponse,
} from '../types'

const PLATFORM = 'github'
const API = 'https://api.github.com'

// Contribution-calendar HTML parsing (public page, no token required).
const DAY_RE =
  /data-date="(\d{4}-\d{2}-\d{2})"\s+id="(contribution-day-component-[\d-]+)"[^>]*?data-level="(\d)"/g
const TIP_RE =
  /for="(contribution-day-component-[\d-]+)"[^>]*?>(No|[\d,]+)\s+contribution/g

interface RawRepo {
  name: string
  description: string | null
  language: string | null
  html_url: string
  homepage: string | null
  stargazers_count?: number
  forks_count?: number
  updated_at?: string
  fork?: boolean
}

export async function fetch_(username: string): Promise<CodingPlatformStats> {
  try {
    const userResp = await httpGet(`${API}/users/${username}`, { headers: githubHeaders() })
    if (userResp.status === 404) return unavailable(PLATFORM, username, 'Profile not found.')
    if (!userResp.ok) return unavailable(PLATFORM, username)
    const user = (await userResp.json()) as {
      public_repos?: number
      followers?: number
      following?: number
    }

    // Sum stars across public repos (first 100 — sufficient for most users).
    let stars = 0
    const reposResp = await httpGet(
      `${API}/users/${username}/repos?per_page=100&type=owner&sort=updated`,
      { headers: githubHeaders() },
    )
    if (reposResp.status === 200) {
      const repos = (await reposResp.json()) as RawRepo[]
      stars = repos.reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0)
    }

    return ok(PLATFORM, username, [
      { label: 'Repositories', value: user.public_repos ?? 0 },
      { label: 'Followers', value: user.followers ?? 0 },
      { label: 'Following', value: user.following ?? 0 },
      { label: 'Stars', value: stars },
    ])
  } catch {
    return unavailable(PLATFORM, username)
  }
}

export async function fetchRepos(username: string, limit = 6): Promise<GitHubReposResponse> {
  try {
    const resp = await httpGet(
      `${API}/users/${username}/repos?per_page=100&type=owner&sort=updated`,
      { headers: githubHeaders() },
    )
    if (resp.status === 404) return { status: 'unavailable', repos: [], message: 'Profile not found.' }
    if (!resp.ok) return { status: 'unavailable', repos: [], message: 'Could not load repositories.' }
    const raw = (await resp.json()) as RawRepo[]

    const repos: GitHubRepo[] = raw
      // Skip forks and the special profile-README repo (named after the user).
      .filter((r) => !r.fork && (r.name ?? '').toLowerCase() !== username.toLowerCase())
      .map((r) => ({
        name: r.name,
        description: r.description ?? null,
        language: r.language ?? null,
        url: r.html_url,
        homepage: r.homepage || null,
        stars: r.stargazers_count ?? 0,
        forks: r.forks_count ?? 0,
        updatedAt: r.updated_at ?? null,
      }))
    // Rank: stars first (already sorted by update for ties).
    repos.sort((a, b) => b.stars - a.stars)
    return { status: 'ok', repos: repos.slice(0, limit), updatedAt: nowIso() }
  } catch {
    return { status: 'unavailable', repos: [], message: 'Could not load repositories.' }
  }
}

interface RawEvent {
  id?: string | number
  type?: string
  payload?: Record<string, unknown>
  repo?: { name?: string }
  created_at?: string
}

/** Map a GitHub event to [action, detail]. Returns null to skip the event. */
export function describeEvent(ev: RawEvent): [string, string | null] | null {
  const etype = ev.type
  const payload = ev.payload ?? {}
  switch (etype) {
    case 'PushEvent': {
      const commits = (payload.commits as unknown[]) ?? []
      const n = (payload.size as number) || commits.length
      return ['Pushed', `${n} commit${n !== 1 ? 's' : ''}`]
    }
    case 'CreateEvent': {
      const refType = (payload.ref_type as string) ?? 'repository'
      return [`Created ${refType}`, (payload.ref as string) ?? null]
    }
    case 'PullRequestEvent': {
      const action = (payload.action as string) ?? 'updated'
      return [`${capitalize(action)} pull request`, null]
    }
    case 'IssuesEvent': {
      const action = (payload.action as string) ?? 'updated'
      return [`${capitalize(action)} issue`, null]
    }
    case 'WatchEvent':
      return ['Starred', null]
    case 'ForkEvent':
      return ['Forked', null]
    case 'ReleaseEvent': {
      const release = (payload.release as { tag_name?: string }) ?? {}
      return ['Released', release.tag_name ?? null]
    }
    case 'PublicEvent':
      return ['Made public', null]
    default:
      return null
  }
}

function capitalize(s: string): string {
  return s ? s[0].toUpperCase() + s.slice(1) : s
}

export async function fetchActivity(username: string, limit = 12): Promise<GitHubActivityResponse> {
  try {
    const resp = await httpGet(`${API}/users/${username}/events/public?per_page=50`, {
      headers: githubHeaders(),
    })
    if (resp.status === 404) return { status: 'unavailable', items: [], message: 'Profile not found.' }
    if (!resp.ok) return { status: 'unavailable', items: [], message: 'Could not load activity.' }
    const events = (await resp.json()) as RawEvent[]

    const items: GitHubActivityItem[] = []
    for (const ev of events) {
      const described = describeEvent(ev)
      if (!described) continue
      const [action, detail] = described
      const repoName = ev.repo?.name ?? ''
      items.push({
        id: String(ev.id),
        type: action,
        repo: repoName,
        repoUrl: `https://github.com/${repoName}`,
        detail,
        createdAt: ev.created_at ?? '',
      })
      if (items.length >= limit) break
    }
    return { status: 'ok', items, updatedAt: nowIso() }
  } catch {
    return { status: 'unavailable', items: [], message: 'Could not load activity.' }
  }
}

interface RawCommit {
  sha?: string
  html_url?: string
  commit?: { message?: string; author?: { date?: string } }
}

export async function fetchCommits(
  owner: string,
  repo: string,
  limit = 5,
): Promise<RepoCommitsResponse> {
  try {
    const resp = await httpGet(`${API}/repos/${owner}/${repo}/commits?per_page=${limit}`, {
      headers: githubHeaders(),
    })
    if (resp.status === 404 || resp.status === 409) {
      return { status: 'unavailable', commits: [], message: 'No commits available.' }
    }
    if (!resp.ok) return { status: 'unavailable', commits: [], message: 'Could not load commits.' }
    const raw = (await resp.json()) as RawCommit[]

    const commits: RepoCommit[] = raw.map((c) => ({
      sha: (c.sha ?? '').slice(0, 7),
      message: (c.commit?.message ?? '').split('\n')[0].slice(0, 120),
      url: c.html_url ?? '',
      date: c.commit?.author?.date ?? null,
    }))
    return { status: 'ok', commits }
  } catch {
    return { status: 'unavailable', commits: [], message: 'Could not load commits.' }
  }
}

export async function fetchHeatmap(username: string): Promise<Heatmap> {
  try {
    const resp = await httpGet(`https://github.com/users/${username}/contributions`, {
      headers: { Accept: 'text/html' },
    })
    if (resp.status === 404) return heatmapUnavailable(PLATFORM, username, 'Profile not found.')
    if (!resp.ok) return heatmapUnavailable(PLATFORM, username)
    const html = await resp.text()

    // Map cell id -> exact count from the accessible tooltips.
    const counts = new Map<string, number>()
    for (const m of html.matchAll(TIP_RE)) {
      const raw = m[2]
      counts.set(m[1], raw === 'No' ? 0 : Number.parseInt(raw.replace(/,/g, ''), 10))
    }

    const days: HeatmapDay[] = []
    for (const m of html.matchAll(DAY_RE)) {
      const [, date, cellId, level] = m
      days.push({ date, count: counts.get(cellId) ?? 0, level: Number.parseInt(level, 10) })
    }

    if (days.length === 0) {
      return heatmapUnavailable(PLATFORM, username, 'Could not read the contribution graph.')
    }
    days.sort((a, b) => a.date.localeCompare(b.date))
    return heatmapOk(PLATFORM, username, days)
  } catch {
    return heatmapUnavailable(PLATFORM, username)
  }
}
