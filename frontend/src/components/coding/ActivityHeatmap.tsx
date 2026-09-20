import { useMemo, useState } from 'react'
import type { Heatmap, HeatmapDay } from '@/types'
import { BrandIcon, type BrandKey } from '@/components/ui/BrandIcon'
import { BRAND_COLORS } from '@/lib/brandColors'
import { formatDate } from '@/lib/utils'

interface ActivityHeatmapProps {
  data: Heatmap
}

const LEVEL_CLASS = [
  'bg-muted', // 0
  'bg-accent/30',
  'bg-accent/50',
  'bg-accent/75',
  'bg-accent', // 4
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

interface Cell {
  day: HeatmapDay | null
}

/** Build GitHub-style columns of weeks (each column = Sun→Sat). */
function buildWeeks(days: HeatmapDay[]): { weeks: Cell[][]; monthLabels: (string | null)[] } {
  if (days.length === 0) return { weeks: [], monthLabels: [] }
  const byDate = new Map(days.map((d) => [d.date, d]))

  const first = new Date(days[0].date + 'T00:00:00')
  const last = new Date(days[days.length - 1].date + 'T00:00:00')

  // Start on the Sunday on/before the first day.
  const start = new Date(first)
  start.setDate(start.getDate() - start.getDay())

  const weeks: Cell[][] = []
  const monthLabels: (string | null)[] = []
  const cursor = new Date(start)

  while (cursor <= last) {
    const week: Cell[] = []
    let labelForWeek: string | null = null
    for (let d = 0; d < 7; d++) {
      const iso = cursor.toISOString().slice(0, 10)
      const inRange = cursor >= first && cursor <= last
      const day = inRange ? (byDate.get(iso) ?? { date: iso, count: 0, level: 0 }) : null
      // Label the column at the row where a new month begins near the top.
      if (day && cursor.getDate() <= 7 && d === 0) {
        labelForWeek = MONTHS[cursor.getMonth()]
      }
      week.push({ day })
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(week)
    monthLabels.push(labelForWeek)
  }
  return { weeks, monthLabels }
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const { weeks, monthLabels } = useMemo(() => buildWeeks(data.days), [data.days])
  const [tip, setTip] = useState<{ text: string; x: number; y: number } | null>(null)

  const unit = (n: number) => (data.platform === 'github' ? 'contribution' : 'submission') + (n === 1 ? '' : 's')

  return (
    <div className="rounded-card border border-border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BrandIcon
            name={data.platform as BrandKey}
            size={18}
            color={BRAND_COLORS[data.platform as BrandKey]}
          />
          <h3 className="font-display font-semibold">{data.displayName} activity</h3>
        </div>
        <p className="font-mono text-sm text-muted-foreground">
          <span className="text-foreground">{data.total.toLocaleString()}</span>{' '}
          {data.platform === 'github' ? 'contributions' : 'submissions'} in the last year
        </p>
      </div>

      {/* Scrollable calendar */}
      <div className="mt-5 overflow-x-auto pb-2 no-scrollbar">
        <div className="inline-flex flex-col gap-1.5">
          {/* Month labels */}
          <div className="flex gap-[3px] pl-0">
            {monthLabels.map((label, i) => (
              <div key={i} className="w-[11px] text-[10px] text-muted-foreground">
                {label ? <span className="relative -left-px">{label}</span> : null}
              </div>
            ))}
          </div>

          {/* Weeks grid: 7 rows, transposed via flex columns */}
          <div className="flex gap-[3px]">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((cell, di) => {
                  if (!cell.day) return <div key={di} className="h-[11px] w-[11px]" />
                  const { date, count, level } = cell.day
                  const text = `${count} ${unit(count)} on ${formatDate(date)}`
                  return (
                    <div
                      key={di}
                      role="img"
                      aria-label={text}
                      tabIndex={-1}
                      onMouseEnter={(e) =>
                        setTip({ text, x: e.clientX, y: e.clientY })
                      }
                      onMouseMove={(e) => setTip({ text, x: e.clientX, y: e.clientY })}
                      onMouseLeave={() => setTip(null)}
                      className={`h-[11px] w-[11px] rounded-[2px] ${LEVEL_CLASS[level] ?? LEVEL_CLASS[0]} ring-1 ring-inset ring-border/40 transition-transform hover:scale-125`}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-end gap-2 text-[11px] text-muted-foreground">
        <span>Less</span>
        {LEVEL_CLASS.map((cls, i) => (
          <span key={i} className={`h-[11px] w-[11px] rounded-[2px] ${cls} ring-1 ring-inset ring-border/40`} />
        ))}
        <span>More</span>
      </div>

      {/* Floating tooltip */}
      {tip && (
        <div
          className="pointer-events-none fixed z-[60] -translate-x-1/2 -translate-y-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs shadow-card"
          style={{ left: tip.x, top: tip.y - 8 }}
          role="status"
        >
          {tip.text}
        </div>
      )}
    </div>
  )
}
