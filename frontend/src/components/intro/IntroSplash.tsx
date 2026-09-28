import { useEffect, useState } from 'react'
import { profile } from '@/data/profile'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const HOLD_MS = 1300 // splash stays fully visible this long before leaving
const EXIT_MS = 700 // slide-up / fade-out duration before it unmounts

/**
 * Module-scoped guard so React 18 StrictMode's dev double-mount doesn't decide
 * twice (which would otherwise mark the intro "seen" on the first mount and
 * skip it on the second). Persists for the life of the JS bundle only — a real
 * page reload re-evaluates the module and re-checks sessionStorage.
 */
let decided = false
let willShow = false

/**
 * First-load intro overlay: the name draws in, then the panel lifts away to
 * reveal the page. Purely decorative and defensively self-removing:
 *  - Removal is driven by setTimeout (not animation/transition events), so the
 *    overlay always unmounts even if CSS/rAF is frozen (e.g. backgrounded tab).
 *    The real page renders beneath it and is never permanently covered.
 *  - Skipped entirely under prefers-reduced-motion.
 *  - Shows once per browser tab session (sessionStorage); refreshes within a
 *    session don't replay it.
 */
export function IntroSplash() {
  const reduce = useReducedMotion()
  const [render, setRender] = useState(false)
  const [mounted, setMounted] = useState(false) // drives the entrance transition
  const [leaving, setLeaving] = useState(false) // drives the exit transition

  useEffect(() => {
    if (!decided) {
      decided = true
      let seen = false
      try {
        seen = sessionStorage.getItem('intro-seen') === '1'
      } catch {
        /* sessionStorage unavailable (e.g. private mode) — treat as unseen */
      }
      willShow = !reduce && !seen
      if (willShow) {
        try {
          sessionStorage.setItem('intro-seen', '1')
        } catch {
          /* ignore write failures */
        }
      }
    }
    if (willShow) setRender(true)
  }, [reduce])

  useEffect(() => {
    if (!render) return

    // Lock scroll while the splash is up; always restored on cleanup.
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const raf = requestAnimationFrame(() => setMounted(true))
    const leaveTimer = setTimeout(() => setLeaving(true), HOLD_MS)
    const doneTimer = setTimeout(() => setRender(false), HOLD_MS + EXIT_MS)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(leaveTimer)
      clearTimeout(doneTimer)
      document.body.style.overflow = prevOverflow
    }
  }, [render])

  if (!render) return null

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
      style={{
        transition: `opacity ${EXIT_MS}ms ease, transform ${EXIT_MS}ms cubic-bezier(0.16,1,0.3,1)`,
        opacity: leaving ? 0 : 1,
        transform: leaving ? 'translateY(-100%)' : 'translateY(0)',
      }}
    >
      {/* ambient accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(circle at 50% 40%, rgb(var(--color-accent) / 0.18), transparent 60%)',
        }}
      />

      <div className="relative flex flex-col items-center px-6 text-center">
        <span
          className="font-mono text-xs uppercase tracking-[0.3em] text-accent"
          style={{
            transition: 'opacity 500ms ease 100ms, transform 500ms ease 100ms',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(8px)',
          }}
        >
          &lt;/&gt; Portfolio
        </span>

        <p
          className="mt-4 font-display text-4xl font-semibold sm:text-6xl"
          style={{
            transition:
              'opacity 600ms ease, transform 600ms cubic-bezier(0.16,1,0.3,1), filter 600ms ease',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(16px)',
            filter: mounted ? 'blur(0px)' : 'blur(8px)',
          }}
        >
          {profile.name}
        </p>

        {/* accent underline draws in from the left */}
        <span
          aria-hidden="true"
          className="mt-5 h-0.5 w-40 origin-left rounded-full bg-gradient-to-r from-accent to-accent-secondary"
          style={{
            transition: 'transform 700ms cubic-bezier(0.16,1,0.3,1) 200ms',
            transform: mounted ? 'scaleX(1)' : 'scaleX(0)',
          }}
        />

        <span
          className="mt-5 font-mono text-sm text-muted-foreground"
          style={{ transition: 'opacity 500ms ease 350ms', opacity: mounted ? 1 : 0 }}
        >
          {profile.role}
        </span>
      </div>
    </div>
  )
}
