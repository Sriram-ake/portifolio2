export interface NavItem {
  id: string
  label: string
  /** Section id to scroll to. */
  href: string
}

/**
 * Primary navigation. Order also defines the scroll-spy priority.
 * `AI Assistant` scrolls to the assistant section (the floating button is
 * always available too).
 */
export const navItems: NavItem[] = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'skills', label: 'Skills', href: '#skills' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'certifications', label: 'Certifications', href: '#certifications' },
  { id: 'coding', label: 'Coding', href: '#coding' },
  { id: 'contact', label: 'Contact', href: '#contact' },
  { id: 'assistant', label: 'AI Assistant', href: '#assistant' },
]
