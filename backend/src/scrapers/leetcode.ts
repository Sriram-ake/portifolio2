/** LeetCode statistics via the public GraphQL endpoint. */

import {
  heatmapOk,
  heatmapUnavailable,
  httpPost,
  levelFromCount,
  ok,
  unavailable,
} from './base'
import type { CodingBreakdownItem, CodingPlatformStats, CodingStatItem, Heatmap, HeatmapDay } from '../types'

const PLATFORM = 'leetcode'
const GRAPHQL = 'https://leetcode.com/graphql'

const CALENDAR_QUERY = `
query userCalendar($username: String!) {
  matchedUser(username: $username) {
    submissionCalendar
  }
}`

const QUERY = `
query userStats($username: String!) {
  matchedUser(username: $username) {
    submitStatsGlobal {
      acSubmissionNum { difficulty count }
    }
  }
  userContestRanking(username: $username) {
    rating
    globalRanking
    attendedContestsCount
  }
}`

const LC_HEADERS = { 'Content-Type': 'application/json', Referer: 'https://leetcode.com' }

export async function fetch_(username: string): Promise<CodingPlatformStats> {
  try {
    const resp = await httpPost(
      GRAPHQL,
      { query: QUERY, variables: { username } },
      { headers: LC_HEADERS },
    )
    if (!resp.ok) return unavailable(PLATFORM, username)
    const payload = (await resp.json()) as {
      data?: {
        matchedUser?: { submitStatsGlobal?: { acSubmissionNum?: { difficulty: string; count: number }[] } }
        userContestRanking?: { rating?: number } | null
      }
    }

    const data = payload.data ?? {}
    const matched = data.matchedUser
    if (!matched) return unavailable(PLATFORM, username, 'Profile not found.')

    const submissions = matched.submitStatsGlobal?.acSubmissionNum ?? []
    const byDiff = new Map(submissions.map((row) => [row.difficulty, row.count]))
    const total = byDiff.get('All') ?? 0

    const stats: CodingStatItem[] = [{ label: 'Solved', value: total }]
    const contest = data.userContestRanking
    if (contest && contest.rating) {
      stats.push({ label: 'Contest Rating', value: Math.round(contest.rating) })
    }

    const breakdown: CodingBreakdownItem[] = [
      { name: 'Easy', value: byDiff.get('Easy') ?? 0 },
      { name: 'Medium', value: byDiff.get('Medium') ?? 0 },
      { name: 'Hard', value: byDiff.get('Hard') ?? 0 },
    ]
    return ok(PLATFORM, username, stats, breakdown)
  } catch {
    return unavailable(PLATFORM, username)
  }
}

export async function fetchHeatmap(username: string): Promise<Heatmap> {
  try {
    const resp = await httpPost(
      GRAPHQL,
      { query: CALENDAR_QUERY, variables: { username } },
      { headers: LC_HEADERS },
    )
    if (!resp.ok) return heatmapUnavailable(PLATFORM, username)
    const payload = (await resp.json()) as {
      data?: { matchedUser?: { submissionCalendar?: string } }
    }

    const matched = payload.data?.matchedUser
    if (!matched) return heatmapUnavailable(PLATFORM, username, 'Profile not found.')

    const rawCalendar = matched.submissionCalendar
    if (!rawCalendar) return heatmapUnavailable(PLATFORM, username, 'No activity data available.')

    // submissionCalendar is a JSON string: {"<unix_seconds>": count, ...}
    const calendar = JSON.parse(rawCalendar) as Record<string, number>
    const days: HeatmapDay[] = []
    for (const [ts, count] of Object.entries(calendar)) {
      const date = new Date(Number.parseInt(ts, 10) * 1000).toISOString().slice(0, 10)
      const c = Number(count)
      days.push({ date, count: c, level: levelFromCount(c) })
    }

    if (days.length === 0) return heatmapUnavailable(PLATFORM, username, 'No activity data available.')
    days.sort((a, b) => a.date.localeCompare(b.date))
    return heatmapOk(PLATFORM, username, days)
  } catch {
    return heatmapUnavailable(PLATFORM, username)
  }
}
