/** Shared helpers for platform fetchers. */

import { settings } from '../config'
import type {
  CodingBreakdownItem,
  CodingPlatformStats,
  CodingStatItem,
  Heatmap,
  HeatmapDay,
} from '../types'

export const DEFAULT_TIMEOUT_MS = 10_000
export const USER_AGENT = 'AkeSriRamPortfolio/1.0 (+https://akesriram.dev)'

const PROFILE_URLS: Record<string, (u: string) => string> = {
  github: (u) => `https://github.com/${u}`,
  leetcode: (u) => `https://leetcode.com/u/${u}/`,
  codechef: (u) => `https://www.codechef.com/users/${u}`,
  hackerrank: (u) => `https://www.hackerrank.com/profile/${u}`,
  geeksforgeeks: (u) => `https://www.geeksforgeeks.org/user/${u}/`,
  codeforces: (u) => `https://codeforces.com/profile/${u}`,
}

const DISPLAY_NAMES: Record<string, string> = {
  github: 'GitHub',
  leetcode: 'LeetCode',
  codechef: 'CodeChef',
  hackerrank: 'HackerRank',
  geeksforgeeks: 'GeeksforGeeks',
  codeforces: 'Codeforces',
}

export function nowIso(): string {
  return new Date().toISOString()
}

export function profileUrl(platform: string, username: string): string {
  const fn = PROFILE_URLS[platform]
  return fn ? fn(username) : ''
}

/**
 * fetch() with a timeout, default headers, and redirect following. Throws on
 * network/timeout so callers can degrade gracefully.
 */
export async function httpGet(
  url: string,
  opts: { headers?: Record<string, string>; timeoutMs?: number } = {},
): Promise<Response> {
  return httpRequest(url, { method: 'GET', ...opts })
}

export async function httpPost(
  url: string,
  body: unknown,
  opts: { headers?: Record<string, string>; timeoutMs?: number } = {},
): Promise<Response> {
  return httpRequest(url, {
    method: 'POST',
    body: JSON.stringify(body),
    ...opts,
  })
}

async function httpRequest(
  url: string,
  opts: {
    method: string
    body?: string
    headers?: Record<string, string>
    timeoutMs?: number
  },
): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), opts.timeoutMs ?? DEFAULT_TIMEOUT_MS)
  try {
    return await fetch(url, {
      method: opts.method,
      body: opts.body,
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/json',
        ...(opts.headers ?? {}),
      },
    })
  } finally {
    clearTimeout(timeout)
  }
}

export function ok(
  platform: string,
  username: string,
  stats: CodingStatItem[],
  breakdown: CodingBreakdownItem[] | null = null,
): CodingPlatformStats {
  return {
    platform,
    displayName: DISPLAY_NAMES[platform] ?? platform,
    profileUrl: profileUrl(platform, username),
    username,
    status: 'ok',
    updatedAt: nowIso(),
    stats,
    breakdown,
  }
}

export function unavailable(
  platform: string,
  username: string,
  message = 'Statistics unavailable right now.',
): CodingPlatformStats {
  return {
    platform,
    displayName: DISPLAY_NAMES[platform] ?? platform,
    profileUrl: profileUrl(platform, username),
    username,
    status: 'unavailable',
    updatedAt: nowIso(),
    stats: [],
    message,
  }
}

/** Map a daily contribution count to a 0-4 intensity bucket. */
export function levelFromCount(
  count: number,
  thresholds: [number, number, number, number] = [1, 3, 6, 10],
): number {
  if (count <= 0) return 0
  for (let i = 0; i < thresholds.length; i++) {
    if (count < thresholds[i]) return i
  }
  return 4
}

export function heatmapOk(platform: string, username: string, days: HeatmapDay[]): Heatmap {
  return {
    platform,
    displayName: DISPLAY_NAMES[platform] ?? platform,
    profileUrl: profileUrl(platform, username),
    status: 'ok',
    total: days.reduce((sum, d) => sum + d.count, 0),
    days,
    updatedAt: nowIso(),
  }
}

export function heatmapUnavailable(
  platform: string,
  username: string,
  message = 'Activity data unavailable right now.',
): Heatmap {
  return {
    platform,
    displayName: DISPLAY_NAMES[platform] ?? platform,
    profileUrl: profileUrl(platform, username),
    status: 'unavailable',
    total: 0,
    days: [],
    updatedAt: nowIso(),
    message,
  }
}

export function githubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': USER_AGENT,
  }
  if (settings.githubToken) {
    headers.Authorization = `Bearer ${settings.githubToken}`
  }
  return headers
}
