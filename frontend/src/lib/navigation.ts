export interface NavItem {
  id: string
  label: string
  /** Section id to scroll to. */
  href: string
  /**
   * Shown as a pill in the primary desktop bar. Non-primary items live in the
   * "More" menu so the bar stays uncrowded. Every item still appears in the
   * mobile drawer and is tracked by scroll-spy.
   */
  primary: boolean
}

/**
 * Full navigation. Order defines the scroll-spy priority and matches the
 * on-page section order in App.tsx. Every rendered section with an anchor is
 * represented here so scroll-spy covers the whole page.
 * `AI Assistant` scrolls to the assistant section (the floating button is
 * always available too).
 */
export const navItems: NavItem[] = [
  { id: 'home', label: 'Home', href: '#home', primary: true },
  { id: 'about', label: 'About', href: '#about', primary: true },
  { id: 'education', label: 'Education', href: '#education', primary: false },
  { id: 'skills', label: 'Skills', href: '#skills', primary: true },
  { id: 'projects', label: 'Projects', href: '#projects', primary: true },
  { id: 'github', label: 'GitHub', href: '#github', primary: false },
  { id: 'certifications', label: 'Certifications', href: '#certifications', primary: false },
  { id: 'coding', label: 'Coding', href: '#coding', primary: true },
  { id: 'milestones', label: 'Milestones', href: '#milestones', primary: false },
  { id: 'journey', label: 'Journey', href: '#journey', primary: false },
  { id: 'assistant', label: 'AI Assistant', href: '#assistant', primary: false },
  { id: 'contact', label: 'Contact', href: '#contact', primary: true },
]

/** Sections shown as pills directly in the desktop bar. */
export const primaryNavItems = navItems.filter((n) => n.primary)

/** Sections grouped under the desktop "More" menu. */
export const moreNavItems = navItems.filter((n) => !n.primary)
