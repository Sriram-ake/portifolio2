/**
 * HackerRank statistics.
 *
 * HackerRank exposes a public REST endpoint for badges on profiles. This reads
 * that public JSON where available and falls back gracefully otherwise. No
 * authentication or anti-bot mechanism is bypassed.
 */

import { httpGet, ok, unavailable } from './base'
import type { CodingPlatformStats, CodingStatItem } from '../types'

const PLATFORM = 'hackerrank'

interface Badge {
  stars?: number | string
  badge_name?: string
}

export async function fetch_(username: string): Promise<CodingPlatformStats> {
  try {
    const resp = await httpGet(`https://www.hackerrank.com/rest/hackers/${username}/badges`, {
      headers: { Accept: 'application/json' },
    })
    if (resp.status === 404) return unavailable(PLATFORM, username, 'Profile not found.')
    if (!resp.ok) return unavailable(PLATFORM, username)
    const payload = (await resp.json()) as { models?: Badge[] }

    const models = Array.isArray(payload.models) ? payload.models : []
    if (models.length === 0) return unavailable(PLATFORM, username, 'No public badges available.')

    const starsOf = (m: Badge) => Number.parseInt(String(m.stars ?? 0), 10) || 0
    const badgeCount = models.length
    const totalStars = models.reduce((sum, m) => sum + starsOf(m), 0)
    const top = models.reduce<Badge | null>((best, m) => (!best || starsOf(m) > starsOf(best) ? m : best), null)

    const stats: CodingStatItem[] = [
      { label: 'Badges', value: badgeCount },
      { label: 'Total Stars', value: totalStars },
    ]
    if (top && top.badge_name) stats.push({ label: 'Top Badge', value: String(top.badge_name) })
    return ok(PLATFORM, username, stats)
  } catch {
    return unavailable(PLATFORM, username)
  }
}
