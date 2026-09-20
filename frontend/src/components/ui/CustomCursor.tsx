import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Variant = 'default' | 'hover' | 'text'

/**
 * Premium custom cursor: an instant accent dot plus a smooth trailing ring
 * that morphs by context — grows over links/buttons, and becomes a caret over
 * text inputs. Pointer-only (disabled on touch) and skipped entirely under
 * prefers-reduced-motion, where the native cursor is kept.
 */
export function CustomCursor() {
  const reduce = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [variant, setVariant] = useState<Variant>('default')
  const [down, setDown] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 300, damping: 26, mass: 0.5 })
  const ringY = useSpring(y, { stiffness: 300, damping: 26, mass: 0.5 })

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
        'a, button, [role="button"], summary, label, select, [data-cursor="hover"]',
      )
      const text = target?.closest?.(
        'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]), textarea, [contenteditable="true"]',
      )
      setVariant(text ? 'text' : interactive ? 'hover' : 'default')
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

  const isText = variant === 'text'
  const isHover = variant === 'hover'

  return (
    <>
      {/* Instant dot (hidden while over text, where the ring becomes a caret) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[200] rounded-full bg-accent"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: isText ? 2 : 6,
          height: isText ? 22 : 6,
          borderRadius: isText ? 2 : 999,
          opacity: isHover ? 0 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />

      {/* Trailing ring (hidden over text) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[200] rounded-full border"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: isHover ? 52 : 34,
          height: isHover ? 52 : 34,
          opacity: isText ? 0 : 1,
          scale: down ? 0.85 : 1,
          borderColor: isHover
            ? 'rgb(var(--color-accent))'
            : 'rgb(var(--color-accent) / 0.6)',
          backgroundColor: isHover ? 'rgb(var(--color-accent) / 0.12)' : 'rgb(var(--color-accent) / 0)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      />
    </>
  )
}
