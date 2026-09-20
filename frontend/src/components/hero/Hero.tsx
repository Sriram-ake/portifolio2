import { motion } from 'framer-motion'
import { ArrowRight, Download, Mail } from 'lucide-react'
import { profile } from '@/data/profile'
import { Button } from '@/components/ui/Button'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { SocialLinks } from '@/components/ui/SocialLinks'
import { RotatingText } from './RotatingText'
import { HeroVisual } from './HeroVisual'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const nameChars = profile.name.split('')

export function Hero() {
  const reduce = useReducedMotion()

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section
      id="home"
      className="relative flex min-h-dvh items-center overflow-hidden pt-24 pb-16"
      aria-labelledby="hero-title"
    >
      <div className="container-px grid w-full items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left: copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Available for opportunities &amp; collaboration
          </motion.div>

          <h1 id="hero-title" className="mt-6 font-display text-display font-bold text-balance">
            <span className="sr-only">{profile.name}</span>
            <span aria-hidden="true" className="block">
              {nameChars.map((char, i) => (
                <motion.span
                  key={`${char}-${i}`}
                  initial={reduce ? false : { opacity: 0, y: '0.4em' }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.03, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                >
                  {char === ' ' ? ' ' : char}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-4 text-subheading font-medium text-muted-foreground"
          >
            {profile.role}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-3 font-display text-2xl font-semibold sm:text-3xl"
          >
            <RotatingText words={profile.taglines} className="text-gradient" />
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-6 max-w-prose leading-relaxed text-muted-foreground"
          >
            Developer, problem solver, and continuous learner focused on building practical,
            well-crafted software.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <MagneticButton>
              <Button onClick={() => scrollTo('#projects')}>
                View Projects
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </MagneticButton>
            <Button variant="secondary" onClick={() => scrollTo('#contact')}>
              <Mail className="h-4 w-4" aria-hidden="true" />
              Contact Me
            </Button>
            {profile.resumeUrl ? (
              <Button as="a" href={profile.resumeUrl} download variant="ghost">
                <Download className="h-4 w-4" aria-hidden="true" />
                Download Resume
              </Button>
            ) : (
              <Button
                variant="ghost"
                disabled
                title="Resume will be available soon"
                aria-label="Resume coming soon"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Resume — coming soon
              </Button>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-8"
          >
            <SocialLinks />
          </motion.div>
        </div>

        {/* Right: portrait visual */}
        <div className="mt-4 lg:mt-0">
          <HeroVisual />
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute inset-x-0 bottom-6 flex justify-center"
        aria-hidden="true"
      >
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-border p-1">
          <motion.span
            className="h-2 w-1 rounded-full bg-accent"
            animate={reduce ? {} : { y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  )
}
