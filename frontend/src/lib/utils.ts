/** Tiny className combiner (avoids pulling in clsx/tailwind-merge for a small app). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

/** Format an ISO date (YYYY-MM or YYYY-MM-DD) into a readable label. */
export function formatDate(value: string): string {
  if (!value) return ''
  const parts = value.split('-')
  const year = Number(parts[0])
  const month = parts[1] ? Number(parts[1]) : undefined
  if (!month) return String(year)
  const date = new Date(year, month - 1, parts[2] ? Number(parts[2]) : 1)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    ...(parts[2] ? { day: 'numeric' } : {}),
  })
}

/** Compact number formatting (1200 -> 1.2k). */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(
    value,
  )
}

/** Relative time from an ISO timestamp ("just now", "3h ago", "2d ago"). */
export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return ''
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const seconds = Math.round((Date.now() - then) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.round(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.round(months / 12)}y ago`
}

export function isExternalUrl(url: string | null | undefined): url is string {
  return typeof url === 'string' && /^https?:\/\//i.test(url)
}

/** GitHub's auto-generated Open Graph card image for a repo URL. */
export function githubOgImage(githubUrl: string | null | undefined): string | null {
  if (!githubUrl) return null
  const match = /github\.com\/([^/]+)\/([^/?#]+)/i.exec(githubUrl)
  if (!match) return null
  return `https://opengraph.githubassets.com/1/${match[1]}/${match[2]}`
}

/** On-demand screenshot of a live site (thum.io — free, cached). */
export function liveScreenshot(url: string | null | undefined): string | null {
  if (!url) return null
  return `https://image.thum.io/get/width/1200/crop/900/noanimate/${url}`
}

/**
 * Best available thumbnail for a project:
 * explicit image → live-site screenshot → GitHub repo card → null (icon).
 */
export function projectThumbnail(project: {
  image?: string | null
  liveUrl?: string | null
  githubUrl?: string | null
}): string | null {
  return (
    project.image ??
    liveScreenshot(project.liveUrl) ??
    githubOgImage(project.githubUrl) ??
    null
  )
}
