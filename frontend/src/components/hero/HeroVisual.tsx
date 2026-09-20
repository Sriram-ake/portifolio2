import { useRef, type MouseEvent } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { profile } from '@/data/profile'

/**
 * Interactive identity card: a glassy mock terminal that tilts subtly toward
 * the cursor. Pointer-only enhancement; renders flat under reduced motion.
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

  const lines = [
    { prompt: '~', cmd: 'whoami', out: profile.name },
    { prompt: '~', cmd: 'cat role.txt', out: profile.role },
    { prompt: '~', cmd: 'cat edu.txt', out: `${profile.branch} · ${profile.year}` },
    { prompt: '~', cmd: 'cat cgpa.txt', out: `CGPA ${profile.cgpa}` },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-md"
    >
      {/* Glow */}
      <div
        aria-hidden="true"
        className="absolute -inset-6 rounded-[2rem] opacity-60 blur-2xl"
        style={{
          background:
            'radial-gradient(circle at 30% 20%, rgb(var(--color-accent) / 0.25), transparent 60%), radial-gradient(circle at 70% 80%, rgb(var(--color-accent-secondary) / 0.2), transparent 60%)',
        }}
      />

      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
        className="relative overflow-hidden rounded-2xl border border-border bg-card/80 shadow-card backdrop-blur-xl"
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-destructive/70" />
          <span className="h-3 w-3 rounded-full bg-amber-400/70" />
          <span className="h-3 w-3 rounded-full bg-success/70" />
          <span className="ml-3 font-mono text-xs text-muted-foreground">akesriram — zsh</span>
        </div>

        {/* Body */}
        <div className="space-y-3 p-5 font-mono text-sm">
          {lines.map((line, i) => (
            <motion.div
              key={line.cmd}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.15, duration: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <span className="text-accent">➜</span>
                <span className="text-accent-secondary">{line.prompt}</span>
                <span className="text-foreground">{line.cmd}</span>
              </div>
              <div className="pl-6 text-muted-foreground">{line.out}</div>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex items-center gap-2"
          >
            <span className="text-accent">➜</span>
            <span className="text-accent-secondary">~</span>
            <span className="inline-block h-4 w-2 animate-pulse bg-foreground/80" aria-hidden="true" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
