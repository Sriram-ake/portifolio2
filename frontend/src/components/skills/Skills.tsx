import { motion } from 'framer-motion'
import { Section } from '@/components/ui/Section'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { skillCategories } from '@/data/skills'
import type { SkillProficiency } from '@/types'
import { fadeUp, staggerContainer, viewportOnce } from '@/animations/variants'
import { cn } from '@/lib/utils'

const levelStyles: Record<SkillProficiency, string> = {
  'Working Knowledge': 'bg-accent/15 text-accent ring-accent/25',
  Familiar: 'bg-accent-secondary/15 text-accent-secondary ring-accent-secondary/25',
  Learning: 'bg-muted text-muted-foreground ring-border',
}

export function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="Skills"
      title="What I work with"
      description="Technologies I use, grouped by area. Labels reflect honest, current proficiency."
    >
      {/* Legend */}
      <div className="mb-8 flex flex-wrap gap-2 text-xs">
        {(Object.keys(levelStyles) as SkillProficiency[]).map((level) => (
          <span
            key={level}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono ring-1 ring-inset',
              levelStyles[level],
            )}
          >
            {level}
          </span>
        ))}
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {skillCategories.map((category) => (
          <motion.div key={category.id} variants={fadeUp}>
            <SpotlightCard className="h-full p-6">
              <h3 className="font-display text-lg font-semibold">{category.title}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <li key={skill.name}>
                    <span
                      className={cn(
                        'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ring-1 ring-inset transition-colors',
                        levelStyles[skill.level],
                      )}
                      title={skill.level}
                    >
                      {skill.name}
                    </span>
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}
