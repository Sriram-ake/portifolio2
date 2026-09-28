import type { Variants } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { fadeUp, viewportOnce } from './variants'

/**
 * Reduced-motion-safe reveal props for scroll-triggered sections.
 *
 * Normal motion → the usual pattern: start `hidden` (opacity:0, y:20) and
 * animate to `show` once the element scrolls into view (once, at 25%).
 *
 * Reduced motion → the element mounts already at its `show` state, so content
 * is visible immediately and never depends on Framer's IntersectionObserver or
 * rAF loop to appear. This upholds the rule that animation must never be the
 * only way content becomes visible: the CSS reduced-motion killswitch in
 * index.css can't reach Framer's JS-driven animations, so we neutralise them
 * here by making the initial state the visible one.
 *
 * Spread onto a `motion.*` element in place of the inline
 * `variants/initial/whileInView/viewport` props. Works for single elements and
 * for stagger containers alike (children inherit the resolved variant state).
 */
export function useReveal(variants: Variants = fadeUp) {
  const reduce = useReducedMotion()

  return {
    variants,
    initial: reduce ? 'show' : 'hidden',
    whileInView: 'show',
    viewport: viewportOnce,
  }
}
