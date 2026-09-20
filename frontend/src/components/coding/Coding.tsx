import { motion } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { StateBlock } from '@/components/ui/StateBlock'
import { Button } from '@/components/ui/Button'
import { useCoding } from '@/hooks/useCoding'
import { staggerContainer, fadeUp, viewportOnce } from '@/animations/variants'
import { PlatformCard } from './PlatformCard'
import { BreakdownChart } from './BreakdownChart'

export function Coding() {
  const { data, loading, error, refetch } = useCoding()

  const platforms = data?.platforms ?? []
  const chartsAvailable = platforms.filter((p) => p.status === 'ok' && p.breakdown?.length)

  return (
    <Section
      id="coding"
      eyebrow="Coding Activity"
      title="How I code"
      description="Live-ish statistics pulled from my public coding profiles, cached on the backend and refreshed periodically."
    >
      {/* Header actions */}
      <div className="mb-8 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {data?.updatedAt
            ? `Last updated ${new Date(data.updatedAt).toLocaleString()}`
            : 'Aggregated across six platforms'}
        </p>
        <Button variant="ghost" size="sm" onClick={refetch} disabled={loading} aria-label="Refresh statistics">
          <RefreshCw className={loading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} aria-hidden="true" />
          Refresh
        </Button>
      </div>

      {loading && !data ? (
        <StateBlock variant="loading" message="Fetching coding statistics…" />
      ) : error && !data ? (
        <StateBlock
          variant="error"
          title="Coding statistics unavailable"
          message="Couldn't reach the statistics service. Your profiles are still linked below."
          onRetry={refetch}
        />
      ) : (
        <>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {platforms.map((platform) => (
              <motion.div key={platform.platform} variants={fadeUp}>
                <PlatformCard data={platform} />
              </motion.div>
            ))}
          </motion.div>

          {chartsAvailable.length > 0 && (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {chartsAvailable.map((platform) => (
                <BreakdownChart key={platform.platform} data={platform} />
              ))}
            </div>
          )}
        </>
      )}
    </Section>
  )
}
