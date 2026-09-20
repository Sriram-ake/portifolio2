import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Award, ExternalLink, Search } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { StateBlock } from '@/components/ui/StateBlock'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { certifications, certificationCategories } from '@/data/certifications'
import type { Certification } from '@/types'
import { fadeUp, staggerContainer, viewportOnce } from '@/animations/variants'
import { cn, formatDate } from '@/lib/utils'

export function Certifications() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [active, setActive] = useState<Certification | null>(null)

  const categories = useMemo(() => ['All', ...certificationCategories()], [])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return certifications.filter((c) => {
      const matchesCat = filter === 'All' || c.category === filter
      const matchesQuery =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.issuer.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      return matchesCat && matchesQuery
    })
  }, [query, filter])

  return (
    <Section
      id="certifications"
      eyebrow="Certifications"
      title="Credentials & learning"
      description="Verified certifications. This gallery is built to scale as new credentials are earned."
    >
      {certifications.length === 0 ? (
        <StateBlock
          variant="empty"
          title="Certifications coming soon"
          message="Certificates will be added here with verifiable credential links. Nothing is fabricated."
        />
      ) : (
        <>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative w-full max-w-xs">
              <span className="sr-only">Search certifications</span>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title or issuer"
                className="h-10 w-full rounded-full border border-border bg-card pl-9 pr-4 text-sm outline-none transition-colors focus:border-accent"
              />
            </label>

            {categories.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    aria-pressed={filter === cat}
                    className={cn(
                      'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                      filter === cat
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-border text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {visible.length === 0 ? (
            <StateBlock variant="empty" title="No matches" message="Try a different search or filter." />
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {visible.map((cert) => (
                <motion.button
                  key={cert.id}
                  variants={fadeUp}
                  onClick={() => setActive(cert)}
                  className="group h-full text-left"
                  aria-label={`View ${cert.title} certificate`}
                >
                  <SpotlightCard className="flex h-full flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-t-card bg-muted">
                      {cert.image ? (
                        <img
                          src={cert.image}
                          alt={`${cert.title} certificate`}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Award className="h-10 w-10 text-border" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <Badge variant="accent" className="self-start">
                        {cert.category}
                      </Badge>
                      <h3 className="mt-3 font-display font-semibold">{cert.title}</h3>
                      {cert.issuer && (
                        <p className="mt-1 text-sm text-muted-foreground">{cert.issuer}</p>
                      )}
                      <p className="mt-auto pt-3 text-xs font-medium text-accent">
                        View certificate →
                        {cert.issueDate && (
                          <span className="ml-2 font-normal text-muted-foreground">
                            {formatDate(cert.issueDate)}
                          </span>
                        )}
                      </p>
                    </div>
                  </SpotlightCard>
                </motion.button>
              ))}
            </motion.div>
          )}
        </>
      )}

      <Modal open={active !== null} onClose={() => setActive(null)} title={active?.title}>
        {active && (
          <div className="space-y-5">
            {active.image && (
              <img
                src={active.image}
                alt={`${active.title} certificate`}
                className="w-full rounded-lg border border-border"
              />
            )}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {active.issuer && (
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Issuer</p>
                  <p className="mt-1 font-medium">{active.issuer}</p>
                </div>
              )}
              {active.issueDate && (
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Issued</p>
                  <p className="mt-1 font-medium">{formatDate(active.issueDate)}</p>
                </div>
              )}
              {active.credentialId && (
                <div className="col-span-2">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Credential ID
                  </p>
                  <p className="mt-1 font-mono text-xs">{active.credentialId}</p>
                </div>
              )}
            </div>
            {active.description && (
              <p className="leading-relaxed text-muted-foreground">{active.description}</p>
            )}
            {active.credentialUrl && (
              <Button
                as="a"
                href={active.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Verify Credential
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
          </div>
        )}
      </Modal>
    </Section>
  )
}
