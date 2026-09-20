import type { SocialLinks } from '@/types'

/**
 * Verified social & coding profile URLs.
 * Instagram is intentionally null until the real profile URL is provided —
 * never invent it.
 */
export const socialLinks: SocialLinks = {
  github: 'https://github.com/Sriram-ake',
  linkedin: 'https://www.linkedin.com/in/sriram-ake-23514633/',
  leetcode: 'https://leetcode.com/u/akesriram/',
  codechef: 'https://www.codechef.com/users/akesriram_2007',
  geeksforgeeks: 'https://www.geeksforgeeks.org/user/akesriram/',
  hackerrank: 'https://www.hackerrank.com/profile/akesurekha',
  codeforces: 'https://codeforces.com/profile/Sriram_2007',
  instagram: null,
}

export interface SocialLinkMeta {
  key: keyof SocialLinks
  label: string
  url: string | null
}

/** Ordered list used by the hero, footer and contact sections. */
export const socialLinkList: SocialLinkMeta[] = [
  { key: 'github', label: 'GitHub', url: socialLinks.github },
  { key: 'linkedin', label: 'LinkedIn', url: socialLinks.linkedin },
  { key: 'leetcode', label: 'LeetCode', url: socialLinks.leetcode },
  { key: 'codechef', label: 'CodeChef', url: socialLinks.codechef },
  { key: 'geeksforgeeks', label: 'GeeksforGeeks', url: socialLinks.geeksforgeeks },
  { key: 'hackerrank', label: 'HackerRank', url: socialLinks.hackerrank },
  { key: 'codeforces', label: 'Codeforces', url: socialLinks.codeforces },
]
