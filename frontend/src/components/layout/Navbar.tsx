import { useState, useCallback, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Menu, X } from 'lucide-react'
import { navItems, primaryNavItems, moreNavItems } from '@/lib/navigation'
import { useScrolled } from '@/hooks/useScrolled'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { profile } from '@/data/profile'

const sectionIds = navItems.map((n) => n.id)

export function Navbar() {
  const scrolled = useScrolled(24)
  const active = useScrollSpy(sectionIds)
  const [open, setOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const moreRef = useRef<HTMLLIElement>(null)
  const moreActive = moreNavItems.some((item) => item.id === active)

  const handleNav = useCallback((href: string) => {
    setOpen(false)
    setMoreOpen(false)
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  // Close the More menu on outside pointer or Escape.
  useEffect(() => {
    if (!moreOpen) return
    const onPointer = (e: PointerEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMoreOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [moreOpen])

  // Close the mobile drawer on Escape.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-[70] transition-all duration-300',
        scrolled ? 'border-b border-border bg-background/80 backdrop-blur-lg' : 'border-b border-transparent',
      )}
    >
      <nav
        className={cn(
          'container-px flex items-center justify-between transition-[height] duration-300',
          scrolled ? 'h-14' : 'h-16',
        )}
        aria-label="Primary"
      >
        {/* Logo / name */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault()
            handleNav('#home')
          }}
          className="group flex shrink-0 items-center gap-2 font-display text-sm font-semibold tracking-tight"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card font-mono text-accent transition-colors group-hover:border-accent/50">
            {'</>'}
          </span>
          <span className="hidden sm:inline">{profile.name}</span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          {primaryNavItems.map((item) => {
            const isActive = active === item.id
            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNav(item.href)
                  }}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'relative rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors',
                    isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-muted"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {item.label}
                </a>
              </li>
            )
          })}

          {/* More menu — secondary sections */}
          <li ref={moreRef} className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={moreOpen}
              aria-current={moreActive ? 'true' : undefined}
              className={cn(
                'relative flex items-center gap-1 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors',
                moreActive || moreOpen ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {moreActive && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 -z-10 rounded-full bg-muted"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              More
              <ChevronDown
                className={cn('h-3.5 w-3.5 transition-transform duration-200', moreOpen && 'rotate-180')}
                aria-hidden="true"
              />
            </button>
            <AnimatePresence>
              {moreOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 min-w-[11rem] origin-top-right rounded-xl border border-border bg-background/95 p-1.5 shadow-xl backdrop-blur-lg"
                >
                  {moreNavItems.map((item) => {
                    const isActive = active === item.id
                    return (
                      <li key={item.id}>
                        <a
                          href={item.href}
                          onClick={(e) => {
                            e.preventDefault()
                            handleNav(item.href)
                          }}
                          aria-current={isActive ? 'true' : undefined}
                          className={cn(
                            'block rounded-lg px-3 py-2 text-[13px] font-medium transition-colors',
                            isActive
                              ? 'bg-muted text-foreground'
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                          )}
                        >
                          {item.label}
                        </a>
                      </li>
                    )
                  })}
                </motion.ul>
              )}
            </AnimatePresence>
          </li>
        </ul>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <ThemeToggle />
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-foreground"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className={cn(
                'fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden',
                scrolled ? 'top-14' : 'top-16',
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              id="mobile-menu"
              className={cn(
                'absolute inset-x-0 z-50 origin-top border-b border-border bg-background/95 backdrop-blur-lg lg:hidden',
                scrolled ? 'top-14' : 'top-16',
              )}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <ul className="container-px flex max-h-[calc(100dvh-4rem)] flex-col overflow-y-auto py-4">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault()
                        handleNav(item.href)
                      }}
                      aria-current={active === item.id ? 'true' : undefined}
                      className={cn(
                        'block rounded-lg px-4 py-3 text-base font-medium transition-colors',
                        active === item.id
                          ? 'bg-muted text-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      )}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
