import { socialLinkList } from '@/data/socialLinks'
import { BrandIcon, type BrandKey } from './BrandIcon'
import { cn } from '@/lib/utils'

interface SocialLinksProps {
  className?: string
  iconSize?: number
  /** Visual size of each icon button. */
  buttonClassName?: string
}

/** Row of verified social/coding profile links. Skips any null URLs. */
export function SocialLinks({ className, iconSize = 18, buttonClassName }: SocialLinksProps) {
  return (
    <ul className={cn('flex flex-wrap items-center gap-2', className)}>
      {socialLinkList.map(({ key, label, url }) => {
        if (!url) return null
        return (
          <li key={key}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${label} profile (opens in a new tab)`}
              title={label}
              className={cn(
                'group flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent',
                buttonClassName,
              )}
            >
              <BrandIcon name={key as BrandKey} size={iconSize} />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
