import type { SkillCategory } from '@/types'

/**
 * Skills grouped by category. Proficiency labels are intentionally
 * conservative — 'Working Knowledge' | 'Familiar' | 'Learning'.
 * Update these as skills evolve; do not overstate expertise.
 */
export const skillCategories: SkillCategory[] = [
  {
    id: 'programming',
    title: 'Programming',
    skills: [
      { name: 'Java', level: 'Working Knowledge' },
      { name: 'Python', level: 'Working Knowledge' },
      { name: 'C', level: 'Familiar' },
      { name: 'C++', level: 'Familiar' },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    skills: [
      { name: 'HTML', level: 'Working Knowledge' },
      { name: 'CSS', level: 'Working Knowledge' },
      { name: 'JavaScript', level: 'Familiar' },
      { name: 'React', level: 'Learning' },
      { name: 'TypeScript', level: 'Learning' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    skills: [
      { name: 'Python', level: 'Working Knowledge' },
      { name: 'FastAPI', level: 'Learning' },
      { name: 'Spring Boot', level: 'Learning' },
    ],
  },
  {
    id: 'database',
    title: 'Database',
    skills: [
      { name: 'SQL', level: 'Working Knowledge' },
      { name: 'MySQL', level: 'Familiar' },
      { name: 'PostgreSQL', level: 'Learning' },
    ],
  },
  {
    id: 'tools',
    title: 'Tools',
    skills: [
      { name: 'Git', level: 'Working Knowledge' },
      { name: 'GitHub', level: 'Working Knowledge' },
      { name: 'IntelliJ IDEA', level: 'Familiar' },
      { name: 'VS Code', level: 'Working Knowledge' },
    ],
  },
]
