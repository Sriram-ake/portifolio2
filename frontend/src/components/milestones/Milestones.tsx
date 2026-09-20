import { motion } from 'framer-motion'
import {
  Bot,
  Boxes,
  Coffee,
  Flame,
  Globe,
  GraduationCap,
  Rocket,
  Star,
  Trophy,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { milestones, type Milestone } from '@/data/milestones'
import { fadeUp, staggerContainer, viewportOnce } from '@/animations/variants'

const iconMap: Record<Milestone['icon'], LucideIcon> = {
  trophy: Trophy,
  flame: Flame,
  star: Star,
  boxes: Boxes,
  coffee: Coffee,
  rocket: Rocket,
  bot: Bot,
  globe: Globe,
  wrench: Wrench,
  graduation: GraduationCap,
}

export function Milestones() {
  if (milestones.length === 0) return null

  return (
    <Section
      id="milestones"
      eyebrow="Milestones"
      title="Highlights & achievements"
      description="Concrete markers from an ongoing journey in problem solving and building."
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {milestones.map((m) => {
          const Icon = iconMap[m.icon]
          return (
            <motion.div key={m.id} variants={fadeUp}>
              <SpotlightCard className="flex h-full items-start gap-4 p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-inset ring-accent/20">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display font-semibold leading-snug">{m.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {m.description}
                  </p>
                </div>
              </SpotlightCard>
            </motion.div>
          )
        })}
      </motion.div>
    </Section>
  )
}
