import { motion } from 'framer-motion'
import { GraduationCap, Languages, MapPin, Music, Sparkles } from 'lucide-react'
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
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        {/* Left: photo + quick identity */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="flex flex-col items-center gap-5"
        >
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-3xl opacity-70 blur-2xl"
              style={{
                background:
                  'radial-gradient(circle at 30% 20%, rgb(var(--color-accent) / 0.35), transparent 60%), radial-gradient(circle at 70% 80%, rgb(var(--color-accent-secondary) / 0.3), transparent 60%)',
              }}
            />
            {profile.avatarUrl && (
              <img
                src={profile.avatarUrl}
                alt={`Portrait of ${profile.name}`}
                loading="lazy"
                width={288}
                height={360}
                className="relative w-64 rounded-2xl border border-border object-cover shadow-card sm:w-72"
              />
            )}
          </div>
          <div className="text-center">
            <p className="font-display text-xl font-semibold">{profile.name}</p>
            <p className="text-sm text-muted-foreground">{profile.role}</p>
          </div>
          {profile.languages && profile.languages.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Languages className="h-4 w-4 text-accent" aria-hidden="true" />
              {profile.languages.map((lang) => (
                <span
                  key={lang}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                >
                  {lang}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right: bio + highlights */}
        <div className="flex flex-col gap-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="card-surface p-7 sm:p-9"
          >
            <p className="text-lg leading-relaxed text-foreground/90">{profile.summary}</p>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Outside of coursework, I sharpen fundamentals through consistent problem solving on
              competitive programming platforms and hands-on projects — with a growing focus on
              writing clean, maintainable software.
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
      </div>
    </Section>
  )
}
