import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Section } from '@/components/ui/Section'
import { StateBlock } from '@/components/ui/StateBlock'
import { projects, projectCategories } from '@/data/projects'
import type { Project } from '@/types'
import { staggerContainer, viewportOnce } from '@/animations/variants'
import { cn } from '@/lib/utils'
import { ProjectCard } from './ProjectCard'
import { ProjectModal } from './ProjectModal'

export function Projects() {
  const [active, setActive] = useState<Project | null>(null)
  const [filter, setFilter] = useState<string>('All')

  const categories = useMemo(() => ['All', ...projectCategories()], [])
  const visible = useMemo(
    () =>
      filter === 'All'
        ? [...projects].sort((a, b) => Number(b.featured) - Number(a.featured))
        : projects.filter((p) => p.category === filter),
    [filter],
  )

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
          {categories.length > 1 && (
            <div className="mb-8 flex flex-wrap gap-2">
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

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {visible.map((project) => (
              <ProjectCard key={project.id} project={project} onOpen={setActive} />
            ))}
          </motion.div>
        </>
      )}

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </Section>
  )
}
