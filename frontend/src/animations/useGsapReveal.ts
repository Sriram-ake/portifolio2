import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface RevealOptions {
  /** Stagger children instead of animating the container. */
  stagger?: boolean
  y?: number
  start?: string
}

/**
 * Scroll-reveal hook backed by GSAP ScrollTrigger.
 * Respects prefers-reduced-motion by rendering the final state immediately.
 * Presets adapted from the UI/UX Pro Max GSAP "Scroll Reveal" recipes.
 */
export function useGsapReveal<T extends HTMLElement>(options: RevealOptions = {}) {
  const ref = useRef<T>(null)
  const { stagger = false, y = 24, start = 'top 85%' } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return // leave the DOM in its natural, fully-visible state

    const ctx = gsap.context(() => {
      const targets = stagger ? el.children : el
      gsap.from(targets, {
        opacity: 0,
        y,
        duration: 0.55,
        ease: 'power2.out',
        ...(stagger ? { stagger: 0.08 } : {}),
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: 'play none none reverse',
        },
      })
    }, el)

    return () => ctx.revert()
  }, [stagger, y, start])

  return ref
}
