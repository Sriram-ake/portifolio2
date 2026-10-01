import {
  Award,
  Bot,
  Code2,
  Copy,
  Download,
  FolderGit2,
  Github,
  GraduationCap,
  Home,
  Layers,
  type LucideIcon,
  Mail,
  Route,
  SunMoon,
  Terminal,
  Trophy,
  User,
} from 'lucide-react'
import { navItems } from '@/lib/navigation'
import { profile } from '@/data/profile'
import { socialLinks } from '@/data/socialLinks'
import { projects } from '@/data/projects'

/**
 * Command Center command model.
 *
 * Commands are built from the SAME verified data the rest of the site uses
 * (navItems, profile, socialLinks, projects) — nothing is invented here. A
 * command only exists when its underlying link/action actually exists (e.g.
 * "Download Resume" appears only when `profile.resumeUrl` is set).
 */
export type CommandGroup = 'Navigation' | 'Actions' | 'Projects'

export interface Command {
  id: string
  title: string
  group: CommandGroup
  icon: LucideIcon
  /** Extra terms folded into search matching (never shown). */
  keywords?: string
  /** Small right-aligned label, e.g. "Opens ↗" or a shortcut. */
  hint?: string
  /**
   * Perform the command's side effect. Returning a string keeps the palette
   * open and flashes that text as confirmation (used by "Copy Email"); any
   * other return closes the palette.
   */
  run: () => void | string
}

/** Side effects the palette wires in (kept out of the data layer). */
export interface CommandActions {
  navigate: (href: string) => void
  toggleTheme: () => void
  openAssistant: () => void
  openExternal: (url: string) => void
  copyEmail: () => string
}

/** lucide icon per navigation section id. */
const navIcons: Record<string, LucideIcon> = {
  home: Home,
  about: User,
  education: GraduationCap,
  skills: Layers,
  projects: FolderGit2,
  github: Github,
  certifications: Award,
  coding: Terminal,
  milestones: Trophy,
  journey: Route,
  assistant: Bot,
  contact: Mail,
}

const projectIcons: Record<string, LucideIcon> = {
  graduation: GraduationCap,
  terminal: Terminal,
}

export function buildCommands(a: CommandActions): Command[] {
  const navigation: Command[] = navItems.map((item) => ({
    id: `nav-${item.id}`,
    title: `Go to ${item.label}`,
    group: 'Navigation',
    icon: navIcons[item.id] ?? Home,
    keywords: `${item.label} ${item.id} jump scroll section`,
    run: () => a.navigate(item.href),
  }))

  // Actions — every entry is gated on the underlying data actually existing.
  const actions: Command[] = []

  if (profile.resumeUrl) {
    const url = profile.resumeUrl
    actions.push({
      id: 'download-resume',
      title: 'Download Resume',
      group: 'Actions',
      icon: Download,
      keywords: 'resume cv pdf download curriculum',
      hint: 'PDF',
      run: () => a.openExternal(url),
    })
  }

  if (profile.email) {
    actions.push({
      id: 'copy-email',
      title: 'Copy Email',
      group: 'Actions',
      icon: Copy,
      keywords: `email mail contact reach ${profile.email}`,
      hint: profile.email,
      run: () => a.copyEmail(),
    })
  }

  if (socialLinks.github) {
    const url = socialLinks.github
    actions.push({
      id: 'open-github',
      title: 'Open GitHub',
      group: 'Actions',
      icon: Github,
      keywords: 'github repos code source profile activity',
      hint: 'Opens ↗',
      run: () => a.openExternal(url),
    })
  }

  if (socialLinks.leetcode) {
    const url = socialLinks.leetcode
    actions.push({
      id: 'open-leetcode',
      title: 'Open LeetCode',
      group: 'Actions',
      icon: Code2,
      keywords: 'leetcode dsa problems coding profile',
      hint: 'Opens ↗',
      run: () => a.openExternal(url),
    })
  }

  actions.push({
    id: 'toggle-theme',
    title: 'Toggle Theme',
    group: 'Actions',
    icon: SunMoon,
    keywords: 'theme dark light mode appearance color',
    run: () => a.toggleTheme(),
  })

  actions.push({
    id: 'open-assistant',
    title: 'Open AI Assistant',
    group: 'Actions',
    icon: Bot,
    keywords: 'ai assistant chat ask bot help question',
    run: () => a.openAssistant(),
  })

  // Projects — jump straight to the Projects section for any real project.
  const projectCommands: Command[] = projects.map((p) => ({
    id: `project-${p.id}`,
    title: p.title,
    group: 'Projects',
    icon: (p.icon ? projectIcons[p.icon] : undefined) ?? FolderGit2,
    keywords: `project projects ${p.category ?? ''} ${p.technologies.join(' ')}`,
    hint: 'View',
    run: () => a.navigate('#projects'),
  }))

  return [...navigation, ...actions, ...projectCommands]
}

/** Case-insensitive substring match over title + group + keywords. */
export function filterCommands(commands: Command[], query: string): Command[] {
  const q = query.trim().toLowerCase()
  if (!q) return commands
  return commands.filter((c) =>
    `${c.title} ${c.group} ${c.keywords ?? ''}`.toLowerCase().includes(q),
  )
}
