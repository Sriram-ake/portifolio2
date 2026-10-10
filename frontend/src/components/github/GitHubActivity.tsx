import { motion } from 'framer-motion'
import { ArrowUpRight, Github, RefreshCw } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { StateBlock } from '@/components/ui/StateBlock'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { ActivityHeatmap } from '@/components/coding/ActivityHeatmap'
import { RepoCard } from './RepoCard'
import { useGitHubRepos } from '@/hooks/useGitHubRepos'
import { useHeatmaps } from '@/hooks/useHeatmaps'
import { MAX_RETRIES } from '@/hooks/useAsyncRetry'
import { socialLinks } from '@/data/socialLinks'
import { fadeUp, staggerContainer } from '@/animations/variants'
import { useReveal } from '@/animations/useReveal'
import { cn } from '@/lib/utils'
import type { Heatmap } from '@/types'

// GitHub handle, derived from the verified profile URL — never invented.
const githubHandle = socialLinks.github.replace(/\/+$/, '').split('/').pop() ?? 'github'

interface ContributionMetrics {
  total: number
  activeDays: number
  longestStreak: number
}

/**
 * Derive honest headline metrics from the real contribution calendar. Every
 * value is computed from the same `days` the heatmap renders — nothing here is
 * hardcoded or estimated.
 */
function metricsFromHeatmap(heatmap: Heatmap | undefined): ContributionMetrics | null {
  if (!heatmap || heatmap.status !== 'ok' || heatmap.days.length === 0) return null
  let activeDays = 0
  let longest = 0
  let run = 0
  for (const d of heatmap.days) {
    if (d.count > 0) {
      activeDays += 1
      run += 1
      if (run > longest) longest = run
    } else {
      run = 0
    }
  }
  return { total: heatmap.total, activeDays, longestStreak: longest }
}

export function GitHubActivity() {
  const repos = useGitHubRepos()
  const heatmapState = useHeatmaps(['github'])
  const revealHeader = useReveal(fadeUp)
  const revealRepos = useReveal(staggerContainer)

  const heatmap = heatmapState.heatmaps[0]
  const heatmapReady = heatmap?.status === 'ok' && heatmap.days.length > 0
  const metrics = metricsFromHeatmap(heatmap)

  const refreshing = repos.loading || heatmapState.loading
  const refreshAll = () => {
    repos.refetch()
    heatmapState.refetch()
  }

  const tiles: { label: string; value: number | undefined }[] = [
    { label: 'Contributions', value: metrics?.total },
    { label: 'Active days', value: metrics?.activeDays },
    { label: 'Longest streak', value: metrics?.longestStreak },
  ]

  return (
    <Section
      id="github"
      eyebrow="Codebase Intelligence"
      title="Development activity"
      description="A live view of my open-source work — contribution history and featured repositories, pulled straight from GitHub."
    >
      {/* Console / identity header — the section's distinctive surface. */}
      <motion.div {...revealHeader} className="card-surface overflow-hidden">
        {/* Faux terminal title bar */}
        <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-4 py-3">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-3 w-3 rounded-full bg-border" />
            <span className="h-3 w-3 rounded-full bg-border" />
            <span className="h-3 w-3 rounded-full bg-border" />
          </span>
          <span className="flex min-w-0 items-center gap-2 font-mono text-xs text-muted-foreground">
            <Github className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">github.com/{githubHandle}</span>
          </span>
          <span className="ml-auto inline-flex flex-shrink-0 items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
            <span
              className={cn('h-1.5 w-1.5 rounded-full', metrics ? 'bg-success' : 'bg-muted-foreground')}
              aria-hidden="true"
            />
            {metrics ? 'live' : 'syncing'}
          </span>
        </div>

        {/* Metrics + primary actions */}
        <div className="flex flex-col gap-6 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <dl className="grid grid-cols-3 gap-3 sm:gap-10">
            {tiles.map((tile) => (
              <div key={tile.label}>
                <dd className="font-display text-2xl font-bold tabular-nums sm:text-3xl">
                  {tile.value != null ? (
                    <AnimatedCounter value={tile.value} />
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </dd>
                <dt className="mt-1 text-[10px] uppercase leading-tight tracking-wide text-muted-foreground sm:text-xs">
                  {tile.label}
                </dt>
              </div>
            ))}
          </dl>
          <div className="flex items-center gap-2">
            <Button
              as="a"
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="sm"
            >
              View GitHub profile
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshAll}
              disabled={refreshing}
              aria-label="Refresh GitHub data"
            >
              <RefreshCw className={refreshing ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Contribution graph — full-width centrepiece */}
      <motion.div {...revealHeader} className="mt-6 min-w-0">
        {heatmapState.loading && !heatmapReady ? (
          <div className="card-surface flex min-h-[232px] items-center justify-center p-6 text-sm text-muted-foreground">
            Loading contribution graph…
          </div>
        ) : heatmapReady ? (
          <ActivityHeatmap data={heatmap} />
        ) : (
          <div className="card-surface flex min-h-[232px] flex-col items-center justify-center gap-2 p-6 text-center">
            <p className="font-medium text-foreground">Contribution graph unavailable</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              GitHub&rsquo;s contribution data couldn&rsquo;t be reached right now. The rest of the
              section is unaffected.
            </p>
          </div>
        )}
      </motion.div>

      {/* Featured repositories */}
      <div className="mt-10">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h3 className="font-display text-subheading font-semibold">Featured repositories</h3>
          <Button
            as="a"
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            variant="ghost"
            size="sm"
          >
            All repositories
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        {repos.loading && repos.repos.length === 0 ? (
          <StateBlock
            variant="loading"
            title={repos.waking ? 'Waking the GitHub service…' : undefined}
            message={
              repos.waking
                ? `The backend sleeps when idle and is spinning back up — this can take up to a minute. Retrying automatically (attempt ${repos.attempt} of ${MAX_RETRIES})…`
                : 'Fetching repositories…'
            }
          />
        ) : repos.error && repos.repos.length === 0 ? (
          <StateBlock
            variant="error"
            title="Repositories unavailable"
            message="Couldn't reach GitHub right now. Try again in a moment."
            onRetry={repos.refetch}
          />
        ) : (
          <motion.div {...revealRepos} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {repos.repos.map((repo) => (
              <motion.div key={repo.name} variants={fadeUp}>
                <RepoCard repo={repo} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </Section>
  )
}

