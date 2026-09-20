import { ArrowUpRight, CircleSlash } from 'lucide-react'
import type { CodingPlatformStats } from '@/types'
import { codingPlatforms } from '@/data/codingPlatforms'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { BrandIcon, type BrandKey } from '@/components/ui/BrandIcon'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { cn } from '@/lib/utils'

interface PlatformCardProps {
  data: CodingPlatformStats
}

/** Parse a stat value into a number for the animated counter, when possible. */
function numericValue(value: string | number): number | null {
  if (typeof value === 'number') return value
  const cleaned = value.replace(/[, ]/g, '')
  const n = Number(cleaned)
  return Number.isFinite(n) && /^\d/.test(cleaned) ? n : null
}

export function PlatformCard({ data }: PlatformCardProps) {
  const config = codingPlatforms.find((p) => p.key === data.platform)
  const unavailable = data.status !== 'ok'

  return (
    <SpotlightCard className={cn('h-full p-6', unavailable && 'opacity-90')}>
      {/* accent wash */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b',
          config?.accent ?? 'from-accent/10 to-transparent',
        )}
      />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-foreground">
            <BrandIcon name={data.platform as BrandKey} size={20} />
          </span>
          <div>
            <h3 className="font-display font-semibold">{data.displayName}</h3>
            <p className="font-mono text-xs text-muted-foreground">@{data.username}</p>
          </div>
        </div>
        <a
          href={data.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${data.displayName} profile`}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-accent"
        >
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>

      {unavailable ? (
        <div className="relative mt-6 flex items-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          <CircleSlash className="h-4 w-4" aria-hidden="true" />
          {data.message ?? 'Statistics unavailable right now.'}
        </div>
      ) : (
        <dl className="relative mt-6 grid grid-cols-2 gap-4">
          {data.stats.slice(0, 4).map((stat) => {
            const n = numericValue(stat.value)
            return (
              <div key={stat.label}>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  {stat.label}
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold tabular-nums">
                  {n !== null ? <AnimatedCounter value={n} compact={n >= 10000} /> : stat.value}
                </dd>
              </div>
            )
          })}
        </dl>
      )}
    </SpotlightCard>
  )
}
