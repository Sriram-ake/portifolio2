import type { IconType } from 'react-icons'
import {
  SiCodechef,
  SiCodeforces,
  SiGeeksforgeeks,
  SiGithub,
  SiHackerrank,
  SiInstagram,
  SiLeetcode,
} from 'react-icons/si'
import { FaLinkedinIn } from 'react-icons/fa6'
import { Boxes, type LucideIcon } from 'lucide-react'

export type BrandKey =
  | 'github'
  | 'linkedin'
  | 'leetcode'
  | 'codechef'
  | 'geeksforgeeks'
  | 'hackerrank'
  | 'codeforces'
  | 'codolio'
  | 'instagram'

/**
 * Accurate brand marks from Simple Icons (react-icons), one consistent set.
 * Codolio has no official logo, so it uses a neutral lucide "aggregate" glyph.
 */
const icons: Record<BrandKey, IconType | LucideIcon> = {
  github: SiGithub,
  linkedin: FaLinkedinIn,
  leetcode: SiLeetcode,
  codechef: SiCodechef,
  geeksforgeeks: SiGeeksforgeeks,
  hackerrank: SiHackerrank,
  codeforces: SiCodeforces,
  codolio: Boxes,
  instagram: SiInstagram,
}

interface BrandIconProps {
  name: BrandKey
  size?: number
  className?: string
  /** Override color; defaults to currentColor. */
  color?: string
  title?: string
}

export function BrandIcon({ name, size = 20, className, color, title }: BrandIconProps) {
  const Icon = icons[name]
  return (
    <Icon
      size={size}
      className={className}
      color={color}
      title={title}
      aria-hidden={title ? undefined : true}
    />
  )
}
