/**
 * Coding platform data clients / scrapers.
 *
 * Each fetcher: uses official/public APIs where available, applies a timeout,
 * handles failure gracefully (returns status !== "ok"), never bypasses
 * authentication or anti-bot mechanisms, and never fabricates statistics.
 */

import type { CodingPlatformStats, Heatmap } from '../types'
import * as codechef from './codechef'
import * as codeforces from './codeforces'
import * as geeksforgeeks from './geeksforgeeks'
import * as github from './github'
import * as hackerrank from './hackerrank'
import * as leetcode from './leetcode'

export type Fetcher = (username: string) => Promise<CodingPlatformStats>
export type HeatmapFetcher = (username: string) => Promise<Heatmap>

export const FETCHERS: Record<string, Fetcher> = {
  github: github.fetch_,
  leetcode: leetcode.fetch_,
  codechef: codechef.fetch_,
  hackerrank: hackerrank.fetch_,
  geeksforgeeks: geeksforgeeks.fetch_,
  codeforces: codeforces.fetch_,
}

// Platforms that expose a daily contribution/submission calendar.
export const HEATMAP_FETCHERS: Record<string, HeatmapFetcher> = {
  github: github.fetchHeatmap,
  leetcode: leetcode.fetchHeatmap,
}

export { github }
