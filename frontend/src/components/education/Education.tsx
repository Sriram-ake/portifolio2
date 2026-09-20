import { motion } from 'framer-motion'
import { GraduationCap } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { Badge } from '@/components/ui/Badge'
import { education } from '@/data/education'
import { fadeUp, viewportOnce } from '@/animations/variants'

export function Education() {
  return (
    <Section
      id="education"
      eyebrow="Education"
      title="Academic journey"
      description="My education timeline — from school to a B.Tech in Information Technology."
    >
      <ol className="relative ml-3 border-l border-border pl-8 sm:ml-4">
        {education.map((item, i) => (
          <motion.li
            key={item.id}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            custom={i}
            className="relative pb-10 last:pb-0"
          >
            {/* Node */}
            <span
              className="absolute -left-[2.65rem] flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-accent sm:-left-[2.9rem]"
              aria-hidden="true"
            >
              <GraduationCap className="h-4 w-4" />
            </span>

            <div className="card-surface p-6 transition-colors hover:border-accent/40">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="font-display text-lg font-semibold">{item.level}</h3>
                {item.score && <Badge variant="accent">{item.score}</Badge>}
              </div>
              <p className="mt-1 text-foreground/90">{item.institution}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {item.location && <span>{item.location}</span>}
                {item.detail && <span>{item.detail}</span>}
              </div>
            </div>
          </motion.li>
        ))}
      </ol>
    </Section>
  )
}
