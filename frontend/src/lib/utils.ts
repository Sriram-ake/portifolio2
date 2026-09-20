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

export function isExternalUrl(url: string | null | undefined): url is string {
  return typeof url === 'string' && /^https?:\/\//i.test(url)
}
