import { motion } from 'framer-motion'
import {
  BookOpen,
  Braces,
  Database,
  LayoutTemplate,
  MessagesSquare,
  Puzzle,
  Server,
  Shuffle,
  Sparkles,
  Flag,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { TechIcon } from '@/components/ui/TechIcon'
import { TiltedCard } from '@/components/ui/TiltedCard'
import { GradientText } from '@/components/ui/GradientText'
import { skillCategories, softSkills } from '@/data/skills'
import type { Skill } from '@/types'
import { fadeUp, staggerContainer } from '@/animations/variants'
import { useReveal } from '@/animations/useReveal'
import { cn } from '@/lib/utils'

const categoryIcons: Record<string, LucideIcon> = {
  programming: Braces,
  frontend: LayoutTemplate,
  backend: Server,
  database: Database,
  tools: Wrench,
}

const softIcons: Record<string, LucideIcon> = {
  puzzle: Puzzle,
  book: BookOpen,
  message: MessagesSquare,
  users: Users,
  flag: Flag,
  shuffle: Shuffle,
}

// Bento column spans so categories form a balanced grid on large screens
// (3 + 3, then 2 + 2 + 2) and stack cleanly on smaller ones.
const cardSpan: Record<string, string> = {
  programming: 'md:col-span-2 lg:col-span-3',
  frontend: 'md:col-span-2 lg:col-span-3',
  backend: 'lg:col-span-2',
  database: 'lg:col-span-2',
  tools: 'md:col-span-2 lg:col-span-2',
}

/** A compact technology badge: brand logo + name. */
function SkillBadge({ skill }: { skill: Skill }) {
  return (
    <motion.li variants={fadeUp}>
      <span className="group/skill inline-flex items-center gap-2 rounded-lg border border-border/70 bg-background/40 py-1.5 pl-2 pr-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:bg-accent/5">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center transition-transform duration-200 group-hover/skill:scale-110">
          <TechIcon name={skill.name} size={18} />
        </span>
        {skill.name}
      </span>
    </motion.li>
  )
}

export function Skills() {
  const reveal = useReveal(staggerContainer)
  return (
    <Section
      id="skills"
      eyebrow="Skills"
      title={
        <>
          What I <GradientText>work with</GradientText>
        </>
      }
      description="A full-stack toolkit — the languages, frameworks and tools I build with, grouped by where they fit, plus the strengths behind them."
    >
      <motion.div {...reveal} className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-6">
        {skillCategories.map((category) => {
          const Icon = categoryIcons[category.id] ?? Braces
          return (
            <motion.div key={category.id} variants={fadeUp} className={cn(cardSpan[category.id])}>
              <TiltedCard className="h-full p-6" max={6}>
                {/* subtle accent wash at the top of each card */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-accent/[0.07] to-transparent"
                />
                <div className="relative mb-5 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold leading-tight text-foreground">
                      {category.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {category.skills.length}{' '}
                      {category.skills.length === 1 ? 'technology' : 'technologies'}
                    </p>
                  </div>
                </div>
                <motion.ul variants={staggerContainer} className="relative flex flex-wrap gap-2.5">
                  {category.skills.map((skill) => (
                    <SkillBadge key={skill.name} skill={skill} />
                  ))}
                </motion.ul>
              </TiltedCard>
            </motion.div>
          )
        })}

        {/* Soft skills & strengths — distinct cyan-accented band. */}
        <motion.div variants={fadeUp} className="md:col-span-2 lg:col-span-6">
          <TiltedCard className="p-6" max={4}>
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent-secondary/30 bg-accent-secondary/10 text-accent-secondary">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold leading-tight text-foreground">
                  Soft Skills &amp; Strengths
                </h3>
                <p className="text-xs text-muted-foreground">How I work alongside the tech</p>
              </div>
            </div>
            <motion.ul
              variants={staggerContainer}
              className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6"
            >
              {softSkills.map((skill) => {
                const SoftIcon = softIcons[skill.icon] ?? Sparkles
                return (
                  <motion.li key={skill.name} variants={fadeUp}>
                    <div className="group/soft flex h-full items-center gap-3 rounded-xl border border-border/70 bg-background/40 px-3 py-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-secondary/50 hover:bg-accent-secondary/5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-accent-secondary transition-transform duration-200 group-hover/soft:scale-110">
                        <SoftIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 text-sm font-medium leading-snug text-foreground">
                        {skill.name}
                      </span>
                    </div>
                  </motion.li>
                )
              })}
            </motion.ul>
          </TiltedCard>
        </motion.div>
      </motion.div>
    </Section>
  )
}
