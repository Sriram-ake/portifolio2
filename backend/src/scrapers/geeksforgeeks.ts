/**
 * GeeksforGeeks statistics.
 *
 * GeeksforGeeks has no official public API. This reads the public profile page
 * and extracts visible counts conservatively, failing gracefully on any change.
 * No protection is bypassed.
 */

import { httpGet, ok, unavailable } from './base'
import type { CodingPlatformStats, CodingStatItem } from '../types'

const PLATFORM = 'geeksforgeeks'

// The modern GFG profile is a Next.js app that embeds stats as escaped JSON in
// the server flight data, e.g.  \"score\":35 , \"total_problems_solved\":25 .
// Match both escaped and plain forms so the parser is resilient.
const SCORE_RE = /\\?"score\\?"\s*:\s*(\d+)/
const SOLVED_RE = /\\?"total_problems_solved\\?"\s*:\s*(\d+)/
const RANK_RE = /\\?"institute_rank\\?"\s*:\s*(\d+)/

export async function fetch_(username: string): Promise<CodingPlatformStats> {
  try {
    // fetch follows the /user/ -> /profile/ redirect automatically.
    const resp = await httpGet(`https://www.geeksforgeeks.org/user/${username}/`, {
      headers: { Accept: 'text/html' },
    })
    if (resp.status === 404) return unavailable(PLATFORM, username, 'Profile not found.')
    if (!resp.ok) return unavailable(PLATFORM, username)
    const html = await resp.text()

    const stats: CodingStatItem[] = []
    let m: RegExpMatchArray | null
    if ((m = html.match(SCORE_RE))) stats.push({ label: 'Coding Score', value: Number.parseInt(m[1], 10) })
    if ((m = html.match(SOLVED_RE)))
      stats.push({ label: 'Problems Solved', value: Number.parseInt(m[1], 10) })
    if ((m = html.match(RANK_RE)))
      stats.push({ label: 'Institute Rank', value: Number.parseInt(m[1], 10) })

    if (stats.length === 0)
      return unavailable(PLATFORM, username, 'Statistics could not be read right now.')
    return ok(PLATFORM, username, stats)
  } catch {
    return unavailable(PLATFORM, username)
  }
}
