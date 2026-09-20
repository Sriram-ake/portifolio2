import { motion } from 'framer-motion'
import { GraduationCap, MapPin, Music, Sparkles } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { profile } from '@/data/profile'
import { fadeUp, staggerContainer, viewportOnce } from '@/animations/variants'

const highlights = [
  { icon: GraduationCap, label: 'Education', value: `${profile.branch}, ${profile.year}` },
  { icon: Sparkles, label: 'CGPA', value: profile.cgpa },
  { icon: MapPin, label: 'Based in', value: profile.location },
  { icon: Music, label: 'Interests', value: profile.interests.join(', ') },
]

export function About() {
  return (
    <Section
      id="about"
      eyebrow="About"
      title="Who I am"
      description="A concise look at where I study, what I focus on, and how I approach building software."
    >
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="card-surface p-7 sm:p-9"
        >
          <p className="text-lg leading-relaxed text-foreground/90">{profile.summary}</p>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            I care about clean architecture, readable code, and shipping things that actually work.
            Outside of coursework, I sharpen fundamentals through consistent problem solving and
            hands-on projects.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid grid-cols-2 gap-4"
        >
          {highlights.map(({ icon: Icon, label, value }) => (
            <motion.div key={label} variants={fadeUp}>
              <SpotlightCard className="h-full p-5">
                <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
                  {label}
                </p>
                <p className="mt-1 font-medium text-foreground">{value}</p>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  )
}
