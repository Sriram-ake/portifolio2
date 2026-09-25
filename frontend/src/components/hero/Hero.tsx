import { ArrowRight, Download, Github, Mail } from 'lucide-react'
import { profile } from '@/data/profile'
import { socialLinks } from '@/data/socialLinks'
import { Button } from '@/components/ui/Button'
import { SocialLinks } from '@/components/ui/SocialLinks'
import { RotatingText } from './RotatingText'
import { HeroVisual } from './HeroVisual'

const nameChars = profile.name.split('')

/**
 * Signature hero. Entrance motion is CSS-driven (`animate-*` utilities with
 * `both` fill), never framer-controlled opacity, so the content is NEVER
 * dependent on JavaScript or rAF to become visible: if animations don't run,
 * elements sit at their natural (visible) state, and the reduced-motion
 * killswitch collapses every delay/duration to ~0.
 */
export function Hero() {
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
          <p className="eyebrow animate-fade-up" style={{ animationDelay: '0.05s' }}>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Available for opportunities &amp; collaboration
          </p>

          <h1 id="hero-title" className="mt-6 font-display text-display font-bold text-balance">
            <span className="sr-only">{profile.name}</span>
            <span aria-hidden="true" className="block">
              {nameChars.map((char, i) => (
                <span
                  key={`${char}-${i}`}
                  className="inline-block animate-name-reveal"
                  style={{ animationDelay: `${0.2 + i * 0.045}s`, whiteSpace: 'pre' }}
                >
                  {char === ' ' ? ' ' : char}
                </span>
              ))}
            </span>
          </h1>

          <p
            className="mt-4 text-subheading font-medium text-muted-foreground animate-fade-up"
            style={{ animationDelay: '0.62s' }}
          >
            {profile.role}
          </p>

          <p
            className="mt-3 font-display text-2xl font-semibold sm:text-3xl animate-fade-up"
            style={{ animationDelay: '0.72s' }}
          >
            <RotatingText words={profile.taglines} className="text-gradient" />
          </p>

          <p
            className="mt-6 max-w-prose leading-relaxed text-muted-foreground animate-fade-up"
            style={{ animationDelay: '0.82s' }}
          >
            I build ideas into working software — full-stack apps with Java, Spring Boot and modern
            frontends, backed by a serious focus on DSA and AI.
          </p>

          {/* CTAs */}
          <div
            className="mt-8 flex flex-wrap items-center gap-3 animate-fade-up"
            style={{ animationDelay: '0.92s' }}
          >
            <Button onClick={() => scrollTo('#projects')}>
              Explore Projects
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            {socialLinks.github && (
              <Button as="a" href={socialLinks.github} target="_blank" rel="noopener noreferrer" variant="secondary">
                <Github className="h-4 w-4" aria-hidden="true" />
                View GitHub
              </Button>
            )}
            <Button variant="ghost" onClick={() => scrollTo('#contact')}>
              <Mail className="h-4 w-4" aria-hidden="true" />
              Contact
            </Button>
            {profile.resumeUrl && (
              <Button as="a" href={profile.resumeUrl} download variant="ghost">
                <Download className="h-4 w-4" aria-hidden="true" />
                Resume
              </Button>
            )}
          </div>

          <div className="mt-8 animate-fade-up" style={{ animationDelay: '1s' }}>
            <SocialLinks />
          </div>
        </div>

        {/* Right: portrait visual */}
        <div className="mt-4 lg:mt-0">
          <HeroVisual />
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="absolute inset-x-0 bottom-6 flex justify-center animate-fade-up"
        style={{ animationDelay: '1.2s' }}
        aria-hidden="true"
      >
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-border p-1">
          <span className="h-2 w-1 rounded-full bg-accent animate-scroll-cue" />
        </div>
      </div>
    </section>
  )
}
