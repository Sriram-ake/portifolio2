import { profile } from '@/data/profile'
import { skillCategories } from '@/data/skills'
import { projects } from '@/data/projects'
import { cn } from '@/lib/utils'

/**
 * Subtle developer-style status line.
 *
 * Every technology chip is derived from VERIFIED portfolio data — the skill
 * categories and real project stacks — so nothing here is invented. "DSA" is
 * included only because it is stated in the profile summary. If the underlying
 * data ever drops one of these, the chip disappears automatically.
 */
const known = new Set<string>()
skillCategories.forEach((c) => c.skills.forEach((s) => known.add(s.name.toLowerCase())))
projects.forEach((p) => p.technologies.forEach((t) => known.add(t.toLowerCase())))

const ORDER = ['Java', 'Spring Boot', 'React', 'TypeScript']
const techChips = ORDER.filter((t) => known.has(t.toLowerCase()))
if (/\bdsa\b|data structures/i.test(profile.summary)) techChips.push('DSA')

export function StatusBar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted-foreground',
        className,
      )}
    >
      <span className="flex items-center gap-1.5">
        <span
          className="h-1.5 w-1.5 rounded-full bg-success motion-safe:animate-pulse"
          aria-hidden="true"
        />
        Portfolio Online
      </span>
      {techChips.map((t) => (
        <span key={t} className="flex items-center gap-2">
          <span aria-hidden="true" className="text-border">
            ·
          </span>
          {t}
        </span>
      ))}
    </div>
  )
}
