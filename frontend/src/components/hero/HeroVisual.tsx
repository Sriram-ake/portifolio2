import { useRef, type MouseEvent } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Sparkles } from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { profile } from '@/data/profile'

/**
 * Hero portrait: the profile photo in a glassy frame that tilts subtly toward
 * the cursor, with two floating fact chips. Pointer-only enhancement; renders
 * flat and static under reduced motion.
 */
export function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduce) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(1000px) rotateY(${px * 8}deg) rotateX(${py * -8}deg)`
  }

  const handleLeave = () => {
    const el = ref.current
    if (el) el.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-sm"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="absolute -inset-8 rounded-[2.5rem] opacity-70 blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 30% 20%, rgb(var(--color-accent) / 0.3), transparent 60%), radial-gradient(circle at 70% 80%, rgb(var(--color-accent-secondary) / 0.25), transparent 60%)',
        }}
      />

      {/* Portrait frame */}
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
        className="relative"
      >
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-card">
          {profile.avatarUrl && (
            <img
              src={profile.avatarUrl}
              alt={`Portrait of ${profile.name}`}
              width={384}
              height={480}
              className="aspect-[4/5] w-full object-cover"
            />
          )}
          {/* Subtle gradient scrim for depth + name plate */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgb(var(--color-background) / 0.85) 2%, transparent 40%)',
            }}
          />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="font-display text-lg font-semibold text-foreground">{profile.name}</p>
            <p className="font-mono text-xs text-accent">{profile.role}</p>
          </div>
        </div>

        {/* Floating chips */}
        <motion.div
          animate={reduce ? {} : { y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-4 top-8 flex items-center gap-2 rounded-xl border border-border bg-card/90 px-3 py-2 shadow-card backdrop-blur sm:-left-8"
        >
          <GraduationCap className="h-4 w-4 text-accent" aria-hidden="true" />
          <span className="text-xs font-medium">{profile.branch} · {profile.year}</span>
        </motion.div>

        <motion.div
          animate={reduce ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute -right-3 bottom-24 flex items-center gap-2 rounded-xl border border-border bg-card/90 px-3 py-2 shadow-card backdrop-blur sm:-right-6"
        >
          <Sparkles className="h-4 w-4 text-accent-secondary" aria-hidden="true" />
          <span className="text-xs font-medium">CGPA {profile.cgpa}</span>
        </motion.div>
      </div>
    </motion.div>
  )
}
