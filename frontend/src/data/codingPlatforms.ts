import type { CodingPlatformKey } from '@/types'
import { socialLinks } from './socialLinks'

export interface CodingPlatformConfig {
  key: CodingPlatformKey
  displayName: string
  username: string
  profileUrl: string
  /** Short accent hint used for the platform card (Tailwind class fragments). */
  accent: string
}

/**
 * Static configuration for coding platforms. Usernames are parsed from the
 * verified profile URLs. NO statistics are stored here — all live/cached stats
 * come from the backend so nothing is fabricated on the client.
 */
export const codingPlatforms: CodingPlatformConfig[] = [
  {
    key: 'github',
    displayName: 'GitHub',
    username: 'Sriram-ake',
    profileUrl: socialLinks.github,
    accent: 'from-slate-400/20 to-slate-600/10',
  },
  {
    key: 'leetcode',
    displayName: 'LeetCode',
    username: 'akesriram',
    profileUrl: socialLinks.leetcode,
    accent: 'from-amber-400/20 to-orange-500/10',
  },
  {
    key: 'codechef',
    displayName: 'CodeChef',
    username: 'akesriram_2007',
    profileUrl: socialLinks.codechef,
    accent: 'from-amber-700/20 to-yellow-800/10',
  },
  {
    key: 'hackerrank',
    displayName: 'HackerRank',
    username: 'akesurekha',
    profileUrl: socialLinks.hackerrank,
    accent: 'from-emerald-400/20 to-green-500/10',
  },
  {
    key: 'geeksforgeeks',
    displayName: 'GeeksforGeeks',
    username: 'akesriram',
    profileUrl: socialLinks.geeksforgeeks,
    accent: 'from-green-500/20 to-emerald-700/10',
  },
  {
    key: 'codeforces',
    displayName: 'Codeforces',
    username: 'Sriram_2007',
    profileUrl: socialLinks.codeforces,
    accent: 'from-sky-400/20 to-blue-600/10',
  },
]
