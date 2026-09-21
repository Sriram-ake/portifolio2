/**
 * Shared response types. These mirror the shapes the frontend consumes
 * (camelCase keys), so responses are built directly in the right form.
 */

export type Status = 'ok' | 'unavailable' | 'error'
export type SkillLevel = 'Learning' | 'Familiar' | 'Working Knowledge'

export interface SocialLinks {
  github: string
  linkedin: string
  leetcode: string
  codechef: string
  geeksforgeeks: string
  hackerrank: string
  codeforces: string
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
  languages: string[]
  email: string
  summary: string
  social: SocialLinks
}

export interface EducationItem {
  id: string
  level: string
  institution: string
  location?: string | null
  detail?: string | null
  score?: string | null
}

export interface Skill {
  name: string
  level: SkillLevel
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
  technologies: string[]
  featured: boolean
  category?: string | null
  year?: string | null
  githubUrl?: string | null
  liveUrl?: string | null
}

export interface Certification {
  id: string
  title: string
  issuer: string
  issueDate: string
  category: string
  credentialUrl?: string | null
}

export interface CodingStatItem {
  label: string
  value: string | number
}

export interface CodingBreakdownItem {
  name: string
  value: number
}

export interface CodingPlatformStats {
  platform: string
  displayName: string
  profileUrl: string
  username: string
  status: Status
  updatedAt: string | null
  stats: CodingStatItem[]
  breakdown?: CodingBreakdownItem[] | null
  message?: string | null
}

export interface CodingSummary {
  platforms: CodingPlatformStats[]
  updatedAt: string | null
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
  status: Status
  repos: GitHubRepo[]
  updatedAt?: string | null
  message?: string | null
}

export interface GitHubActivityItem {
  id: string
  type: string
  repo: string
  repoUrl: string
  detail: string | null
  createdAt: string
}

export interface GitHubActivityResponse {
  status: Status
  items: GitHubActivityItem[]
  updatedAt?: string | null
  message?: string | null
}

export interface RepoCommit {
  sha: string
  message: string
  url: string
  date: string | null
}

export interface RepoCommitsResponse {
  status: Status
  commits: RepoCommit[]
  message?: string | null
}

export interface HeatmapDay {
  date: string
  count: number
  level: number
}

export interface Heatmap {
  platform: string
  displayName: string
  profileUrl: string
  status: Status
  total: number
  days: HeatmapDay[]
  updatedAt: string | null
  message?: string | null
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}
