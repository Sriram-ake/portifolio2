import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { fadeUp, viewportOnce } from '@/animations/variants'

interface SectionProps {
  id: string
  eyebrow?: string
  title?: ReactNode
  description?: ReactNode
  children: ReactNode
  className?: string
  /** Center the header block. */
  centered?: boolean
  as?: 'section' | 'div'
}

/** Standard section shell with a consistent, animated header. */
export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  centered = false,
}: SectionProps) {
  return (
    <section id={id} className={cn('section-pad', className)} aria-labelledby={`${id}-title`}>
      <div className="container-px">
        {(eyebrow || title || description) && (
          <motion.header
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className={cn('mb-12 max-w-2xl', centered && 'mx-auto text-center')}
          >
            {eyebrow && (
              <span className="eyebrow">
                <span className="h-px w-6 bg-accent" aria-hidden="true" />
                {eyebrow}
              </span>
            )}
            {title && (
              <h2
                id={`${id}-title`}
                className="mt-4 font-display text-heading font-semibold text-balance"
              >
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">{description}</p>
            )}
          </motion.header>
        )}
        {children}
      </div>
    </section>
  )
}
