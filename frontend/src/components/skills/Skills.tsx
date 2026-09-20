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
import { skillCategories, softSkills } from '@/data/skills'
import { fadeUp, staggerContainer, viewportOnce } from '@/animations/variants'

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

function CategoryHeader({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-accent">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground">
        {title}
      </h3>
    </div>
  )
}

export function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="Skills"
      title="What I work with"
      description="Technologies and strengths across the stack. Hover a skill to see my current level."
    >
      <div className="space-y-10">
        {skillCategories.map((category) => (
          <motion.div
            key={category.id}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            <CategoryHeader icon={categoryIcons[category.id] ?? Braces} title={category.title} />
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
            >
              {category.skills.map((skill) => (
                <motion.li key={skill.name} variants={fadeUp}>
                  <div
                    title={skill.level}
                    className="group flex items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-3 text-accent transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center">
                      <TechIcon name={skill.name} size={22} />
                    </span>
                    <span className="truncate text-sm font-medium text-foreground">
                      {skill.name}
                    </span>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        ))}

        {/* Soft skills & strengths */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <CategoryHeader icon={Sparkles} title="Soft Skills & Strengths" />
          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
          >
            {softSkills.map((skill) => {
              const Icon = softIcons[skill.icon]
              return (
                <motion.li key={skill.name} variants={fadeUp}>
                  <div className="group flex items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center text-accent-secondary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="truncate text-sm font-medium text-foreground">
                      {skill.name}
                    </span>
                  </div>
                </motion.li>
              )
            })}
          </motion.ul>
        </motion.div>
      </div>
    </Section>
  )
}
