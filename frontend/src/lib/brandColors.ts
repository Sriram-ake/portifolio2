import type { BrandKey } from '@/components/ui/BrandIcon'

/**
 * Official-ish brand colors, tuned for legibility on dark/light cards.
 * Used only where brand recognition helps (the coding dashboard); elsewhere
 * icons inherit `currentColor` for a clean, uniform look.
 */
export const BRAND_COLORS: Partial<Record<BrandKey, string>> = {
  leetcode: '#FFA116',
  codechef: '#A97142',
  hackerrank: '#00EA64',
  geeksforgeeks: '#2F8D46',
  codeforces: '#1F8ACB',
  linkedin: '#0A66C2',
  instagram: '#E4405F',
}
