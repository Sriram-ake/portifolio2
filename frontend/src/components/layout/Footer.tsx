import { Mail } from 'lucide-react'
import { navItems } from '@/lib/navigation'
import { profile } from '@/data/profile'
import { SocialLinks } from '@/components/ui/SocialLinks'

export function Footer() {
  const year = new Date().getFullYear()

  const handleNav = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <footer className="border-t border-border">
      <div className="container-px py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault()
                handleNav('#home')
              }}
              className="font-display text-lg font-semibold"
            >
              {profile.name}
            </a>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">{profile.role}</p>
            <SocialLinks className="mt-5" />
          </div>

          <nav aria-label="Footer">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Navigate
            </h2>
            <ul className="mt-4 space-y-2.5">
              {navItems.slice(0, 6).map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault()
                      handleNav(item.href)
                    }}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Contact
            </h2>
            <a
              href={`mailto:${profile.email}`}
              className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              {profile.email}
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-center text-sm text-muted-foreground sm:flex-row sm:text-left">
          <p>
            © {year} {profile.name}. Built with React, TypeScript and a passion for technology.
          </p>
          <p className="font-mono text-xs">Designed &amp; engineered for the web.</p>
        </div>
      </div>
    </footer>
  )
}
