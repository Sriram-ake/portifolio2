import { motion } from 'framer-motion'
import { ArrowUpRight, Code2, GitFork, RefreshCw, Star } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { StateBlock } from '@/components/ui/StateBlock'
import { Button } from '@/components/ui/Button'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { Badge } from '@/components/ui/Badge'
import { useGitHubRepos } from '@/hooks/useGitHubRepos'
import { socialLinks } from '@/data/socialLinks'
import { formatDate, githubOgImage } from '@/lib/utils'
import { fadeUp, staggerContainer, viewportOnce } from '@/animations/variants'

export function GitHubActivity() {
  const { repos, loading, error, refetch } = useGitHubRepos()

  return (
    <Section
      id="github"
      eyebrow="Open Source"
      title="Live GitHub activity"
      description="Public repositories synced directly from my GitHub profile."
    >
      <div className="mb-8 flex items-center justify-between gap-4">
        <Button
          as="a"
          href={socialLinks.github}
          target="_blank"
          rel="noopener noreferrer"
          variant="secondary"
          size="sm"
        >
          View GitHub profile
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button variant="ghost" size="sm" onClick={refetch} disabled={loading} aria-label="Refresh repositories">
          <RefreshCw className={loading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} aria-hidden="true" />
          Refresh
        </Button>
      </div>

      {loading && repos.length === 0 ? (
        <StateBlock variant="loading" message="Fetching repositories…" />
      ) : error && repos.length === 0 ? (
        <StateBlock
          variant="error"
          title="Repositories unavailable"
          message="Couldn't reach GitHub right now. Try again in a moment."
          onRetry={refetch}
        />
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {repos.map((repo) => (
            <motion.div key={repo.name} variants={fadeUp}>
              <SpotlightCard className="flex h-full flex-col">
                {/* Repo preview image (GitHub's Open Graph card) */}
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${repo.name} on GitHub`}
                  className="block overflow-hidden rounded-t-card border-b border-border bg-muted"
                >
                  <img
                    src={githubOgImage(repo.url) ?? ''}
                    alt={`${repo.name} repository preview`}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                    className="aspect-[2/1] w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                  />
                </a>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-accent">
                      <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
                      {repo.language ?? 'Code'}
                    </span>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${repo.name} on GitHub`}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-accent"
                    >
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>

                  <h3 className="mt-3 font-display text-lg font-semibold">{repo.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
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

                <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5" aria-hidden="true" />
                      {repo.stars}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <GitFork className="h-3.5 w-3.5" aria-hidden="true" />
                      {repo.forks}
                    </span>
                  </div>
                  {repo.updatedAt && (
                    <Badge>{formatDate(repo.updatedAt.slice(0, 10))}</Badge>
                  )}
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      )}
    </Section>
  )
}
