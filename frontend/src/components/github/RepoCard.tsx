import { ArrowUpRight, GitFork, Star } from 'lucide-react'
import type { GitHubRepo } from '@/types'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { languageColor } from '@/lib/languageColors'
import { timeAgo } from '@/lib/utils'

interface RepoCardProps {
  repo: GitHubRepo
}

/**
 * Compact, code-flavoured repository card. Deliberately avoids GitHub's
 * Open Graph preview image so the section reads as a bespoke "codebase" surface
 * rather than an embedded GitHub widget.
 */
export function RepoCard({ repo }: RepoCardProps) {
  const color = languageColor(repo.language)

  return (
    <SpotlightCard className="flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="h-2.5 w-2.5 flex-shrink-0 rounded-full ring-1 ring-inset ring-border"
            style={{ background: color }}
            aria-hidden="true"
          />
          <h4 className="truncate font-mono text-sm font-semibold text-foreground">{repo.name}</h4>
        </div>
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${repo.name} on GitHub`}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-accent"
        >
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>

      <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {repo.description ?? 'Public GitHub repository.'}
      </p>

      {repo.homepage && (
        <a
          href={repo.homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex w-fit items-center gap-1 text-xs font-medium text-accent hover:underline"
        >
          Live demo
          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
        </a>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          {repo.language && (
            <span className="inline-flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: color }}
                aria-hidden="true"
              />
              {repo.language}
            </span>
          )}
          <span className="inline-flex items-center gap-1" aria-label={`${repo.stars} stars`}>
            <Star className="h-3.5 w-3.5" aria-hidden="true" />
            {repo.stars}
          </span>
          <span className="inline-flex items-center gap-1" aria-label={`${repo.forks} forks`}>
            <GitFork className="h-3.5 w-3.5" aria-hidden="true" />
            {repo.forks}
          </span>
        </div>
        {repo.updatedAt && <span className="font-mono">{timeAgo(repo.updatedAt)}</span>}
      </div>
    </SpotlightCard>
  )
}
