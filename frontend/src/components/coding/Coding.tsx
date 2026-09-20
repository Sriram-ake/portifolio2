import { motion } from 'framer-motion'
import { ArrowUpRight, RefreshCw, Target } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { StateBlock } from '@/components/ui/StateBlock'
import { Button } from '@/components/ui/Button'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { useCoding } from '@/hooks/useCoding'
import { useHeatmaps } from '@/hooks/useHeatmaps'
import { socialLinks } from '@/data/socialLinks'
import { staggerContainer, fadeUp, viewportOnce } from '@/animations/variants'
import { PlatformCard } from './PlatformCard'
import { BreakdownChart } from './BreakdownChart'
import { ActivityHeatmap } from './ActivityHeatmap'

/** Sum "solved" counts reported across platforms into one total. */
function totalSolved(platforms: { status: string; stats: { label: string; value: string | number }[] }[]): number {
  let total = 0
  for (const p of platforms) {
    if (p.status !== 'ok') continue
    for (const s of p.stats) {
      if (/solved/i.test(s.label)) {
        const n = typeof s.value === 'number' ? s.value : Number(String(s.value).replace(/[, ]/g, ''))
        if (Number.isFinite(n)) total += n
      }
    }
  }
  return total
}

export function Coding() {
  const { data, loading, error, refetch } = useCoding()
  const { heatmaps, loading: heatmapsLoading } = useHeatmaps()

  const platforms = data?.platforms ?? []
  const chartsAvailable = platforms.filter((p) => p.status === 'ok' && p.breakdown?.length)
  const activeHeatmaps = heatmaps.filter((h) => h.status === 'ok' && h.days.length > 0)
  const solved = totalSolved(platforms)

  return (
    <Section
      id="coding"
      eyebrow="Coding Activity"
      title="How I code"
      description="Live-ish statistics pulled from my public coding profiles, cached on the backend and refreshed periodically."
    >
      {/* Header actions */}
      <div className="mb-8 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {data?.updatedAt
            ? `Last updated ${new Date(data.updatedAt).toLocaleString()}`
            : 'Aggregated across six platforms'}
        </p>
        <Button variant="ghost" size="sm" onClick={refetch} disabled={loading} aria-label="Refresh statistics">
          <RefreshCw className={loading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} aria-hidden="true" />
          Refresh
        </Button>
      </div>

      {loading && !data ? (
        <StateBlock variant="loading" message="Fetching coding statistics…" />
      ) : error && !data ? (
        <StateBlock
          variant="error"
          title="Coding statistics unavailable"
          message="Couldn't reach the statistics service. Your profiles are still linked below."
          onRetry={refetch}
        />
      ) : (
        <>
          {/* Aggregate: total problems solved across platforms */}
          {solved > 0 && (
            <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-card border border-border bg-gradient-to-br from-accent/10 to-transparent p-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <Target className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-display text-3xl font-bold tabular-nums">
                    <AnimatedCounter value={solved} />
                    <span className="text-accent">+</span>
                  </p>
                  <p className="text-sm text-muted-foreground">Problems solved across platforms</p>
                </div>
              </div>
              {socialLinks.codolio && (
                <Button
                  as="a"
                  href={socialLinks.codolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  size="sm"
                >
                  Full stats on Codolio
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              )}
            </div>
          )}

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {platforms.map((platform) => (
              <motion.div key={platform.platform} variants={fadeUp}>
                <PlatformCard data={platform} />
              </motion.div>
            ))}
          </motion.div>

          {/* Activity heatmaps (GitHub contributions + LeetCode submissions) */}
          {(activeHeatmaps.length > 0 || heatmapsLoading) && (
            <div className="mt-6 space-y-5">
              {heatmapsLoading && activeHeatmaps.length === 0 ? (
                <div className="rounded-card border border-dashed border-border bg-card/50 px-6 py-10 text-center text-sm text-muted-foreground">
                  Loading activity heatmaps…
                </div>
              ) : (
                activeHeatmaps.map((h) => <ActivityHeatmap key={h.platform} data={h} />)
              )}
            </div>
          )}

          {chartsAvailable.length > 0 && (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {chartsAvailable.map((platform) => (
                <BreakdownChart key={platform.platform} data={platform} />
              ))}
            </div>
          )}
        </>
      )}
    </Section>
  )
}
