/** Codeforces statistics via the official public API (codeforces.com/api). */

import { httpGet, ok, unavailable } from './base'
import type { CodingPlatformStats, CodingStatItem } from '../types'

const PLATFORM = 'codeforces'
const API = 'https://codeforces.com/api'

interface CfUser {
  rating?: number
  maxRating?: number
  rank?: string
}

interface CfSubmission {
  verdict?: string
  problem?: { contestId?: number; index?: string }
}

function titleCase(s: string): string {
  return s.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
}

export async function fetch_(username: string): Promise<CodingPlatformStats> {
  try {
    const infoResp = await httpGet(`${API}/user.info?handles=${encodeURIComponent(username)}`)
    if (!infoResp.ok) return unavailable(PLATFORM, username)
    const info = (await infoResp.json()) as { status?: string; result?: CfUser[] }
    if (info.status !== 'OK' || !info.result || info.result.length === 0) {
      return unavailable(PLATFORM, username, 'Profile not found.')
    }
    const user = info.result[0]

    // Count distinct solved problems from submission history.
    const solved = new Set<string>()
    const statusResp = await httpGet(
      `${API}/user.status?handle=${encodeURIComponent(username)}&from=1&count=10000`,
    )
    if (statusResp.status === 200) {
      const sdata = (await statusResp.json()) as { status?: string; result?: CfSubmission[] }
      if (sdata.status === 'OK' && sdata.result) {
        for (const sub of sdata.result) {
          if (sub.verdict === 'OK') {
            const p = sub.problem ?? {}
            solved.add(`${p.contestId}-${p.index}`)
          }
        }
      }
    }

    const stats: CodingStatItem[] = []
    if (user.rating != null) stats.push({ label: 'Rating', value: user.rating })
    if (user.maxRating != null) stats.push({ label: 'Max Rating', value: user.maxRating })
    if (user.rank) stats.push({ label: 'Rank', value: titleCase(String(user.rank)) })
    if (solved.size > 0) stats.push({ label: 'Problems Solved', value: solved.size })

    if (stats.length === 0) return unavailable(PLATFORM, username, 'No public statistics available.')
    return ok(PLATFORM, username, stats)
  } catch {
    return unavailable(PLATFORM, username)
  }
}
