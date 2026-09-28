import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { StateBlock } from '@/components/ui/StateBlock'
import { projects, projectCategories } from '@/data/projects'
import type { Project } from '@/types'
import { staggerContainer } from '@/animations/variants'
import { useReveal } from '@/animations/useReveal'
import { cn } from '@/lib/utils'
import { ProjectCard } from './ProjectCard'
import { ProjectModal } from './ProjectModal'

export function Projects() {
  const [active, setActive] = useState<Project | null>(null)
  const [filter, setFilter] = useState<string>('All')
  const [query, setQuery] = useState('')
  const reveal = useReveal(staggerContainer)

  const categories = useMemo(() => ['All', ...projectCategories()], [])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const byCategory =
      filter === 'All' ? projects : projects.filter((p) => p.category === filter)
    const matched = !q
      ? byCategory
      : byCategory.filter((p) => {
          const haystack = [
            p.title,
            p.description,
            p.category ?? '',
            p.year ?? '',
            ...p.technologies,
          ]
            .join(' ')
            .toLowerCase()
          return haystack.includes(q)
        })
    // Featured projects always float to the top within the current view.
    return [...matched].sort((a, b) => Number(b.featured) - Number(a.featured))
  }, [filter, query])

  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Things I've built"
      description="Selected work. Detailed case studies live behind each card."
    >
      {projects.length === 0 ? (
        <StateBlock
          variant="empty"
          title="Projects coming soon"
          message="Real projects will be published here as they're completed. No placeholders — only genuine work."
        />
      ) : (
        <>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative w-full max-w-xs">
              <span className="sr-only">Search projects</span>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or tech"
                className="h-10 w-full rounded-full border border-border bg-card pl-9 pr-4 text-sm outline-none transition-colors focus:border-accent"
              />
            </label>

            {categories.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    aria-pressed={filter === cat}
                    className={cn(
                      'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                      filter === cat
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-border text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {visible.length === 0 ? (
            <StateBlock
              variant="empty"
              title="No matches"
              message="Try a different search term or category."
            />
          ) : (
            <motion.div
              {...reveal}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {visible.map((project) => (
                <ProjectCard key={project.id} project={project} onOpen={setActive} />
              ))}
            </motion.div>
          )}
        </>
      )}

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </Section>
  )
}
