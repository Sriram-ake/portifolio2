import { ArrowUpRight, Github } from 'lucide-react'
import type { Project } from '@/types'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </h4>
      <div className="mt-2 text-sm leading-relaxed text-foreground/90">{children}</div>
    </div>
  )
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  return (
    <Modal open={project !== null} onClose={onClose} title={project?.title}>
      {project && (
        <div className="space-y-6">
          {project.image && (
            <img
              src={project.image}
              alt={`${project.title} preview`}
              className="w-full rounded-lg border border-border"
            />
          )}

          <p className="leading-relaxed text-foreground/90">
            {project.detailedDescription ?? project.description}
          </p>

          {project.problem && <Field label="Problem">{project.problem}</Field>}
          {project.solution && <Field label="Solution">{project.solution}</Field>}

          {project.features && project.features.length > 0 && (
            <Field label="Features">
              <ul className="list-inside list-disc space-y-1">
                {project.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </Field>
          )}

          <Field label="Technologies">
            <ul className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <li key={tech}>
                  <Badge variant="accent">{tech}</Badge>
                </li>
              ))}
            </ul>
          </Field>

          {project.screenshots && project.screenshots.length > 0 && (
            <Field label="Screenshots">
              <div className="grid gap-3 sm:grid-cols-2">
                {project.screenshots.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt={`${project.title} screenshot ${i + 1}`}
                    loading="lazy"
                    className="w-full rounded-lg border border-border"
                  />
                ))}
              </div>
            </Field>
          )}

          <div className="flex flex-wrap gap-3 border-t border-border pt-5">
            {project.githubUrl && (
              <Button as="a" href={project.githubUrl} target="_blank" rel="noopener noreferrer" variant="secondary">
                <Github className="h-4 w-4" aria-hidden="true" />
                View Code
              </Button>
            )}
            {project.liveUrl && (
              <Button as="a" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                Live Demo
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>
      )}
    </Modal>
  )
}
