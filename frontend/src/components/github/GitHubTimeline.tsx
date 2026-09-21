import { motion } from 'framer-motion'
import {
  GitBranch,
  GitCommit,
  GitFork,
  GitPullRequest,
  CircleDot,
  Package,
  Star,
  Radio,
  type LucideIcon,
} from 'lucide-react'
import { StateBlock } from '@/components/ui/StateBlock'
import { useGitHubActivity } from '@/hooks/useGitHubActivity'
import { timeAgo } from '@/lib/utils'
import { fadeUp, staggerContainer, viewportOnce } from '@/animations/variants'
import type { GitHubActivityItem } from '@/types'

/** Pick an icon for an activity action label produced by the backend. */
function iconFor(type: string): LucideIcon {
  const t = type.toLowerCase()
  if (t.startsWith('pushed')) return GitCommit
  if (t.startsWith('created')) return GitBranch
  if (t.includes('pull request')) return GitPullRequest
  if (t.includes('issue')) return CircleDot
  if (t.startsWith('starred')) return Star
  if (t.startsWith('forked')) return GitFork
  if (t.startsWith('released')) return Package
  return Radio
}

/** Short "owner/repo" → "repo" for a tighter label; keeps the full name accessible. */
function repoShort(fullName: string): string {
  const parts = fullName.split('/')
  return parts[parts.length - 1] || fullName
}

function TimelineRow({ item, last }: { item: GitHubActivityItem; last: boolean }) {
  const Icon = iconFor(item.type)
  return (
    <motion.li variants={fadeUp} className="relative flex gap-4 pb-8 last:pb-0">
      {/* Connector line */}
      {!last && (
        <span
          className="absolute left-[15px] top-9 h-[calc(100%-1.5rem)] w-px bg-border"
          aria-hidden="true"
        />
      )}
      {/* Node */}
      <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-accent">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      {/* Content */}
      <div className="min-w-0 flex-1 pt-1">
        <p className="text-sm text-foreground">
          <span className="font-medium">{item.type}</span>{' '}
          <a
            href={item.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-accent hover:underline"
            title={item.repo}
          >
            {repoShort(item.repo)}
          </a>
        </p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
          {item.detail && <span>{item.detail}</span>}
          {item.detail && <span aria-hidden="true">·</span>}
          <time dateTime={item.createdAt}>{timeAgo(item.createdAt)}</time>
        </p>
      </div>
    </motion.li>
  )
}

/** Vertical timeline of the most recent public GitHub activity (newest first). */
export function GitHubTimeline() {
  const { items, loading, error, refetch } = useGitHubActivity()

  if (loading && items.length === 0) {
    return <StateBlock variant="loading" message="Fetching recent activity…" />
  }
  if (error && items.length === 0) {
    return (
      <StateBlock
        variant="error"
        title="Activity unavailable"
        message="Couldn't load recent GitHub activity right now."
        onRetry={refetch}
      />
    )
  }
  if (items.length === 0) {
    return <StateBlock variant="empty" title="No recent activity" />
  }

  return (
    <motion.ol
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className="relative"
    >
      {items.map((item, i) => (
        <TimelineRow key={item.id} item={item} last={i === items.length - 1} />
      ))}
    </motion.ol>
  )
}
