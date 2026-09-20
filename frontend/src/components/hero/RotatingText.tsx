import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface RotatingTextProps {
  words: string[]
  intervalMs?: number
  className?: string
}

/** Cycles through words with a smooth vertical swap. Static under reduced motion. */
export function RotatingText({ words, intervalMs = 2200, className }: RotatingTextProps) {
  const [index, setIndex] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce || words.length <= 1) return
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), intervalMs)
    return () => clearInterval(id)
  }, [words.length, intervalMs, reduce])

  if (reduce) {
    // Show all words joined so meaning is preserved without motion.
    return <span className={className}>{words.join(' · ')}</span>
  }

  return (
    <span className={`relative inline-block ${className ?? ''}`} aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: '0.6em', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-0.6em', opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
