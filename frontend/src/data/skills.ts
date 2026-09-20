import type { SkillCategory } from '@/types'

/**
 * Skills grouped by category — sourced directly from Sri Ram's resume.
 * Proficiency labels are conservative inferences (the resume lists skills,
 * not levels). Language levels are informed by HackerRank star ratings
 * (C 4★, Python 3★, Java 3★). Adjust freely.
 */
export const skillCategories: SkillCategory[] = [
  {
    id: 'programming',
    title: 'Programming Languages',
    skills: [
      { name: 'C', level: 'Working Knowledge' },
      { name: 'Python', level: 'Working Knowledge' },
      { name: 'Java', level: 'Working Knowledge' },
      { name: 'C++', level: 'Familiar' },
    ],
  },
  {
    id: 'web',
    title: 'Web Technologies',
    skills: [
      { name: 'HTML', level: 'Working Knowledge' },
      { name: 'CSS', level: 'Working Knowledge' },
      { name: 'JavaScript', level: 'Familiar' },
    ],
  },
  {
    id: 'frameworks',
    title: 'Frameworks & Tools',
    skills: [
      { name: 'Django', level: 'Learning' },
      { name: 'Git', level: 'Working Knowledge' },
      { name: 'GitHub', level: 'Working Knowledge' },
      { name: 'VS Code', level: 'Working Knowledge' },
    ],
  },
  {
    id: 'database',
    title: 'Databases',
    skills: [
      { name: 'MySQL', level: 'Familiar' },
      { name: 'Google Sheets', level: 'Familiar' },
    ],
  },
]
