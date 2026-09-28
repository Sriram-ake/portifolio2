import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  Bird,
  Blocks,
  Calculator,
  Code2,
  Gamepad2,
  Github,
  GraduationCap,
  Plane,
  Star,
  Terminal,
  type LucideIcon,
} from 'lucide-react'
import type { Project } from '@/types'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { fadeUp } from '@/animations/variants'
import { cn, projectThumbnail } from '@/lib/utils'

interface ProjectCardProps {
  project: Project
  onOpen: (project: Project) => void
}

const projectIcons: Record<string, LucideIcon> = {
  calculator: Calculator,
  gamepad: Gamepad2,
  bird: Bird,
  plane: Plane,
  blocks: Blocks,
  graduation: GraduationCap,
  terminal: Terminal,
}

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const Icon = (project.icon && projectIcons[project.icon]) || Code2
  const [imgFailed, setImgFailed] = useState(false)
  const thumb = projectThumbnail(project)
  const featured = Boolean(project.featured)
  const maxTech = featured ? 6 : 4

  const cover = (
    <div
      className={cn(
        'group/cover relative overflow-hidden bg-muted',
        featured
          ? 'aspect-[16/10] rounded-t-card lg:aspect-auto lg:h-full lg:rounded-l-card lg:rounded-tr-none'
          : 'aspect-[16/10] rounded-t-card',
      )}
    >
      {thumb && !imgFailed ? (
        <img
          src={thumb}
          alt={`${project.title} preview`}
          loading="lazy"
          onError={() => setImgFailed(true)}
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover/cover:scale-105"
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center"
          style={{
            background:
              'radial-gradient(circle at 30% 25%, rgb(var(--color-accent) / 0.16), transparent 60%), linear-gradient(135deg, rgb(var(--color-muted)), rgb(var(--color-card)))',
          }}
        >
          <Icon
            className={cn(
              'text-accent/70 transition-transform duration-500 group-hover/cover:scale-110',
              featured ? 'h-20 w-20' : 'h-14 w-14',
            )}
            aria-hidden="true"
          />
        </div>
      )}
      {featured && (
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium text-accent backdrop-blur">
          <Star className="h-3 w-3 fill-accent" aria-hidden="true" />
          Featured
        </span>
      )}
      {project.inProgress && (
        <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden="true" />
          In progress
        </span>
      )}
    </div>
  )

  const body = (
    <div className={cn('flex flex-1 flex-col', featured ? 'p-6 lg:p-8' : 'p-6')}>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {project.category && <span>{project.category}</span>}
        {project.year && (
          <>
            <span aria-hidden="true">·</span>
            <span>{project.year}</span>
          </>
        )}
      </div>
      <h3
        className={cn(
          'mt-2 font-display font-semibold',
          featured ? 'text-2xl lg:text-3xl' : 'text-xl',
        )}
      >
        {project.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {project.description}
      </p>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {project.technologies.slice(0, maxTech).map((tech) => (
          <li key={tech}>
            <Badge>{tech}</Badge>
          </li>
        ))}
        {project.technologies.length > maxTech && (
          <li>
            <Badge>+{project.technologies.length - maxTech}</Badge>
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
  )

  return (
    <motion.div
      variants={fadeUp}
      className={cn('h-full', featured && 'lg:col-span-2')}
    >
      <SpotlightCard className="h-full">
        <div className={cn('flex h-full flex-col', featured && 'lg:flex-row')}>
          {featured ? (
            <>
              <div className="lg:w-[46%] lg:shrink-0">{cover}</div>
              {body}
            </>
          ) : (
            <>
              {cover}
              {body}
            </>
          )}
        </div>
      </SpotlightCard>
    </motion.div>
  )
}
