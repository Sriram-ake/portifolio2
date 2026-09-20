import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * Minimal custom cursor: a single thin outline ring (no center dot) that
 * smoothly trails the pointer and gently scales up over interactive elements.
 * Pointer-only (disabled on touch) and skipped under prefers-reduced-motion,
 * where the native cursor is kept.
 */
export function CustomCursor() {
  const reduce = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [down, setDown] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 250, damping: 24, mass: 0.6 })
  const ringY = useSpring(y, { stiffness: 250, damping: 24, mass: 0.6 })

  useEffect(() => {
    if (reduce || typeof window === 'undefined') return
    if (!window.matchMedia('(pointer: fine)').matches) return

    setEnabled(true)
    document.documentElement.classList.add('cursor-custom')

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const target = e.target as HTMLElement | null
      const interactive = target?.closest?.(
        'a, button, [role="button"], summary, label, select, input, textarea, [data-cursor="hover"]',
      )
      setHovering(Boolean(interactive))
    }
    const onLeave = () => {
      x.set(-100)
      y.set(-100)
    }
    const onDown = () => setDown(true)
    const onUp = () => setDown(false)

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.documentElement.classList.remove('cursor-custom')
    }
  }, [reduce, x, y])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[200] rounded-full border-[1.5px]"
      style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
      animate={{
        width: hovering ? 56 : 30,
        height: hovering ? 56 : 30,
        scale: down ? 0.8 : 1,
        borderColor: hovering ? 'rgb(var(--color-accent))' : 'rgb(var(--color-accent) / 0.65)',
        backgroundColor: hovering
          ? 'rgb(var(--color-accent) / 0.08)'
          : 'rgb(var(--color-accent) / 0)',
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    />
  )
}
