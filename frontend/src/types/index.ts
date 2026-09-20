/** Shared domain types for the portfolio. */

export interface SocialLinks {
  github: string
  linkedin: string
  leetcode: string
  codechef: string
  geeksforgeeks: string
  hackerrank: string
  codeforces: string
  /** Coding-profile aggregator (total problems solved across platforms). */
  codolio: string | null
  instagram: string | null
}

export interface Profile {
  name: string
  role: string
  taglines: string[]
  location: string
  college: string
  branch: string
  year: string
  cgpa: string
  interests: string[]
  email: string
  phone: string
  languages?: string[]
  /** Optional profile photo served from /public. */
  avatarUrl?: string | null
  /** Never exposed publicly unless explicitly enabled via config. */
  dateOfBirth?: string
  resumeUrl: string | null
  summary: string
}

export interface EducationItem {
  id: string
  level: string
  institution: string
  location?: string
  detail?: string
  period?: string
  score?: string
}

export type SkillProficiency = 'Learning' | 'Familiar' | 'Working Knowledge'

export interface Skill {
  name: string
  level: SkillProficiency
}

export interface SkillCategory {
  id: string
  title: string
  skills: Skill[]
}

export interface Project {
  id: string
  title: string
  description: string
  detailedDescription?: string
  problem?: string
  solution?: string
  features?: string[]
  technologies: string[]
  screenshots?: string[]
  image?: string | null
  /** Optional lucide icon key for the card thumbnail fallback. */
  icon?: string
  /** Marks work that is still in progress (shows a subtle badge). */
  inProgress?: boolean
  githubUrl?: string | null
  liveUrl?: string | null
  category?: string
  year?: string
  featured: boolean
}

export interface Certification {
  id: string
  title: string
  issuer: string
  issueDate: string
  credentialId?: string
  credentialUrl?: string | null
  image?: string | null
  category: string
  description?: string
}

export type CodingPlatformKey =
  | 'github'
  | 'leetcode'
  | 'codechef'
  | 'hackerrank'
  | 'geeksforgeeks'
  | 'codeforces'

export interface CodingStatItem {
  label: string
  value: string | number
}

/** Normalized shape returned by the backend for every platform. */
export interface CodingPlatformStats {
  platform: CodingPlatformKey
  displayName: string
  profileUrl: string
  username: string
  status: 'ok' | 'unavailable' | 'error'
  updatedAt: string | null
  stats: CodingStatItem[]
  /** Optional extra data used for charts (e.g. LeetCode easy/medium/hard). */
  breakdown?: { name: string; value: number }[]
  message?: string
}

export interface CodingSummary {
  platforms: CodingPlatformStats[]
  updatedAt: string | null
}

export interface HeatmapDay {
  date: string
  count: number
  level: number
}

export interface Heatmap {
  platform: CodingPlatformKey
  displayName: string
  profileUrl: string
  status: 'ok' | 'unavailable' | 'error'
  total: number
  days: HeatmapDay[]
  updatedAt: string | null
  message?: string
}

export interface GitHubRepo {
  name: string
  description: string | null
  language: string | null
  url: string
  homepage: string | null
  stars: number
  forks: number
  updatedAt: string | null
}

export interface GitHubReposResponse {
  status: 'ok' | 'unavailable' | 'error'
  repos: GitHubRepo[]
  updatedAt: string | null
  message?: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  date?: string
  source?: string
}

export interface JourneyMilestone {
  id: string
  year: string
  title: string
  description: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  error?: boolean
}

export interface ContactPayload {
  name: string
  email: string
  subject: string
  message: string
  /** Honeypot field — must remain empty. */
  website?: string
}

export interface ApiResult<T> {
  data: T | null
  error: string | null
  loading: boolean
}
