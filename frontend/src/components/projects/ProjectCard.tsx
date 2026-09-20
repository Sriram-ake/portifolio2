import { motion } from 'framer-motion'
import { ArrowUpRight, Github, Star } from 'lucide-react'
import type { Project } from '@/types'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { fadeUp } from '@/animations/variants'

interface ProjectCardProps {
  project: Project
  onOpen: (project: Project) => void
}

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  return (
    <motion.div variants={fadeUp} className="h-full">
      <SpotlightCard className="flex h-full flex-col">
        {/* Cover */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-t-card bg-muted">
          {project.image ? (
            <img
              src={project.image}
              alt={`${project.title} preview`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-card">
              <span className="font-mono text-4xl font-bold text-border">
                {project.title.charAt(0)}
              </span>
            </div>
          )}
          {project.featured && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium text-accent backdrop-blur">
              <Star className="h-3 w-3 fill-accent" aria-hidden="true" />
              Featured
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {project.category && <span>{project.category}</span>}
            {project.year && (
              <>
                <span aria-hidden="true">·</span>
                <span>{project.year}</span>
              </>
            )}
          </div>
          <h3 className="mt-2 font-display text-xl font-semibold">{project.title}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
            {project.description}
          </p>

          <ul className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech) => (
              <li key={tech}>
                <Badge>{tech}</Badge>
              </li>
            ))}
            {project.technologies.length > 4 && (
              <li>
                <Badge>+{project.technologies.length - 4}</Badge>
              </li>
            )}
          </ul>

          <div className="mt-5 flex items-center gap-2">
            <Button size="sm" onClick={() => onOpen(project)}>
              View Details
            </Button>
            {project.githubUrl && (
              <Button
                as="a"
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
                variant="ghost"
                aria-label={`${project.title} on GitHub`}
              >
                <Github className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
            {project.liveUrl && (
              <Button
                as="a"
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
                variant="ghost"
                aria-label={`${project.title} live demo`}
              >
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  )
}
