/**
 * CodeChef statistics.
 *
 * CodeChef has no official public API, so this reads the public profile page and
 * extracts a few visible fields with conservative regexes. It respects a timeout,
 * does not bypass any protection, and fails gracefully if the page structure
 * changes or the profile is unavailable.
 */

import { httpGet, ok, unavailable } from './base'
import type { CodingPlatformStats, CodingStatItem } from '../types'

const PLATFORM = 'codechef'

const RATING_RE = /class="rating-number"[^>]*>(\d+)/
const STARS_RE = /class="rating"[^>]*>\s*(\d+)\s*★/
const SOLVED_RE = /Total Problems Solved:\s*(\d+)/

export async function fetch_(username: string): Promise<CodingPlatformStats> {
  try {
    const resp = await httpGet(`https://www.codechef.com/users/${username}`, {
      headers: { Accept: 'text/html' },
    })
    if (resp.status === 404) return unavailable(PLATFORM, username, 'Profile not found.')
    if (!resp.ok) return unavailable(PLATFORM, username)
    const html = await resp.text()

    const stats: CodingStatItem[] = []
    let m: RegExpMatchArray | null
    if ((m = html.match(RATING_RE))) stats.push({ label: 'Rating', value: Number.parseInt(m[1], 10) })
    if ((m = html.match(STARS_RE))) stats.push({ label: 'Stars', value: `${m[1]}★` })
    if ((m = html.match(SOLVED_RE)))
      stats.push({ label: 'Problems Solved', value: Number.parseInt(m[1], 10) })

    if (stats.length === 0)
      return unavailable(PLATFORM, username, 'Statistics could not be read right now.')
    return ok(PLATFORM, username, stats)
  } catch {
    return unavailable(PLATFORM, username)
  }
}
