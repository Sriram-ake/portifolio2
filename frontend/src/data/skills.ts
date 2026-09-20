import type { SkillCategory } from '@/types'

/**
 * Skills grouped by category. Reflects Sri Ram's full-stack focus with
 * Spring Boot, alongside the languages/tools from his resume.
 * Proficiency labels are conservative — adjust freely.
 */
export const skillCategories: SkillCategory[] = [
  {
    id: 'programming',
    title: 'Programming Languages',
    skills: [
      { name: 'Java', level: 'Working Knowledge' },
      { name: 'Python', level: 'Working Knowledge' },
      { name: 'C', level: 'Working Knowledge' },
      { name: 'C++', level: 'Familiar' },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    skills: [
      { name: 'HTML', level: 'Working Knowledge' },
      { name: 'CSS', level: 'Working Knowledge' },
      { name: 'JavaScript', level: 'Working Knowledge' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    skills: [
      { name: 'Spring Boot', level: 'Working Knowledge' },
      { name: 'REST APIs', level: 'Working Knowledge' },
      { name: 'Django', level: 'Familiar' },
    ],
  },
  {
    id: 'database',
    title: 'Databases',
    skills: [
      { name: 'MySQL', level: 'Working Knowledge' },
      { name: 'Google Sheets', level: 'Familiar' },
    ],
  },
  {
    id: 'tools',
    title: 'Tools',
    skills: [
      { name: 'Git', level: 'Working Knowledge' },
      { name: 'GitHub', level: 'Working Knowledge' },
      { name: 'IntelliJ IDEA', level: 'Working Knowledge' },
      { name: 'VS Code', level: 'Working Knowledge' },
    ],
  },
]

export interface SoftSkill {
  name: string
  /** lucide icon key mapped in the Skills component. */
  icon: 'puzzle' | 'book' | 'message' | 'users' | 'flag' | 'shuffle'
}

/** Soft skills & strengths. */
export const softSkills: SoftSkill[] = [
  { name: 'Problem-solving', icon: 'puzzle' },
  { name: 'Self-learning', icon: 'book' },
  { name: 'Communication', icon: 'message' },
  { name: 'Team collaboration', icon: 'users' },
  { name: 'Leadership', icon: 'flag' },
  { name: 'Adaptability', icon: 'shuffle' },
]
