import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { achievements } from '@/data/achievements'
import { fadeUp, staggerContainer, viewportOnce } from '@/animations/variants'

/** Hidden entirely until there are verified achievements to show. */
export function Achievements() {
  if (achievements.length === 0) return null

  return (
    <Section
      id="achievements"
      eyebrow="Achievements"
      title="Recognitions & milestones"
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {achievements.map((item) => (
          <motion.div key={item.id} variants={fadeUp}>
            <SpotlightCard className="h-full p-6">
              <Trophy className="h-5 w-5 text-accent" aria-hidden="true" />
              <h3 className="mt-3 font-display font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              {(item.date || item.source) && (
                <p className="mt-3 text-xs text-muted-foreground">
                  {[item.source, item.date].filter(Boolean).join(' · ')}
                </p>
              )}
            </SpotlightCard>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}
