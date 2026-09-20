import { motion } from 'framer-motion'
import { Section } from '@/components/ui/Section'
import { journey } from '@/data/journey'
import { fadeUp, staggerContainer, viewportOnce } from '@/animations/variants'

/** Developer journey shown as a connected horizontal (desktop) / vertical (mobile) path. */
export function Journey() {
  if (journey.length === 0) return null

  return (
    <Section
      id="journey"
      eyebrow="Developer Journey"
      title="The path so far"
      description="Direction and focus over time — described honestly, without invented milestones."
    >
      <motion.ol
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="relative grid gap-6 md:grid-cols-4"
      >
        {/* connecting line (desktop) */}
        <span
          aria-hidden="true"
          className="absolute left-0 right-0 top-3 hidden h-px bg-border md:block"
        />
        {journey.map((m) => (
          <motion.li key={m.id} variants={fadeUp} className="relative">
            <span
              className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border border-accent/50 bg-background"
              aria-hidden="true"
            >
              <span className="h-2 w-2 rounded-full bg-accent" />
            </span>
            <div className="mt-4">
              <p className="font-mono text-xs uppercase tracking-widest text-accent">{m.year}</p>
              <h3 className="mt-1 font-display font-semibold">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.description}</p>
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </Section>
  )
}
