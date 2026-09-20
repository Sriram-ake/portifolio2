import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { CodingPlatformStats } from '@/types'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { BrandIcon, type BrandKey } from '@/components/ui/BrandIcon'

interface BreakdownChartProps {
  data: CodingPlatformStats
}

// Accessible, non red/green-only palette for difficulty segments.
const COLORS = ['#4ade80', '#fbbf24', '#f87171', '#63b3ed', '#a78bfa']

/** Donut chart for a platform's breakdown (e.g. LeetCode easy/medium/hard). */
export function BreakdownChart({ data }: BreakdownChartProps) {
  const breakdown = data.breakdown ?? []
  const total = breakdown.reduce((sum, d) => sum + d.value, 0)
  if (breakdown.length === 0 || total === 0) return null

  return (
    <SpotlightCard className="p-6">
      <div className="flex items-center gap-2">
        <BrandIcon name={data.platform as BrandKey} size={18} />
        <h3 className="font-display font-semibold">{data.displayName} breakdown</h3>
      </div>

      <div className="mt-4 flex items-center gap-6">
        <div className="relative h-40 w-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={breakdown}
                dataKey="value"
                nameKey="name"
                innerRadius={52}
                outerRadius={72}
                paddingAngle={2}
                strokeWidth={0}
                isAnimationActive
              >
                {breakdown.map((entry, i) => (
                  <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'rgb(20 17 12)',
                  border: '1px solid rgb(54 46 36)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                itemStyle={{ color: 'rgb(245 240 234)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-2xl font-bold tabular-nums">{total}</span>
            <span className="text-xs text-muted-foreground">Total</span>
          </div>
        </div>

        {/* Legend + data table (accessibility) */}
        <ul className="flex-1 space-y-2 text-sm">
          {breakdown.map((entry, i) => (
            <li key={entry.name} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-sm"
                  style={{ background: COLORS[i % COLORS.length] }}
                  aria-hidden="true"
                />
                {entry.name}
              </span>
              <span className="font-mono tabular-nums text-muted-foreground">{entry.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </SpotlightCard>
  )
}
