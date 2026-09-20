import type { IconType } from 'react-icons'
import {
  SiC,
  SiCplusplus,
  SiCss,
  SiDjango,
  SiGit,
  SiGithub,
  SiGooglesheets,
  SiHtml5,
  SiIntellijidea,
  SiJavascript,
  SiMysql,
  SiOpenjdk,
  SiPython,
  SiSpringboot,
} from 'react-icons/si'
import { Code2, Database, Webhook, type LucideIcon } from 'lucide-react'

interface TechDef {
  Icon: IconType | LucideIcon
  color?: string
}

/**
 * Maps a technology name to a recognizable logo + brand color.
 * Colors are tuned to read on both dark and light cards; anything without an
 * official logo falls back to a neutral lucide glyph in the accent color.
 */
const TECH: Record<string, TechDef> = {
  Java: { Icon: SiOpenjdk, color: '#E76F00' },
  Python: { Icon: SiPython, color: '#4B8BBE' },
  C: { Icon: SiC, color: '#A8B9CC' },
  'C++': { Icon: SiCplusplus, color: '#00A3E0' },
  HTML: { Icon: SiHtml5, color: '#E34F26' },
  CSS: { Icon: SiCss, color: '#3AA0DB' },
  JavaScript: { Icon: SiJavascript, color: '#F7DF1E' },
  'Spring Boot': { Icon: SiSpringboot, color: '#6DB33F' },
  'REST APIs': { Icon: Webhook, color: undefined },
  Django: { Icon: SiDjango, color: '#44B78B' },
  MySQL: { Icon: SiMysql, color: '#5B8FB0' },
  'Google Sheets': { Icon: SiGooglesheets, color: '#34A853' },
  Git: { Icon: SiGit, color: '#F05032' },
  GitHub: { Icon: SiGithub, color: undefined },
  'IntelliJ IDEA': { Icon: SiIntellijidea, color: '#F97583' },
  'VS Code': { Icon: Code2, color: '#3AA0DB' },
}

interface TechIconProps {
  name: string
  size?: number
  className?: string
}

export function TechIcon({ name, size = 22, className }: TechIconProps) {
  const def = TECH[name] ?? { Icon: Database, color: undefined }
  const { Icon, color } = def
  // `color` undefined → inherit currentColor (accent, set by the parent).
  return <Icon size={size} color={color} className={className} aria-hidden />
}
