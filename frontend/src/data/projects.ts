import type { Project } from '@/types'

/**
 * Projects data source.
 *
 * No projects are invented. Add real projects below using the `Project` shape.
 * Set `featured: true` on standout work to give it more visual emphasis.
 *
 * Example (copy, fill in real data, and uncomment):
 *
 * {
 *   id: 'my-project',
 *   title: 'Project Title',
 *   description: 'One-line summary shown on the card.',
 *   detailedDescription: 'Longer description for the detail view.',
 *   problem: 'What problem it solves.',
 *   solution: 'How it solves it.',
 *   features: ['Feature one', 'Feature two'],
 *   technologies: ['React', 'TypeScript', 'FastAPI'],
 *   screenshots: ['/projects/my-project/1.png'],
 *   image: '/projects/my-project/cover.png',
 *   githubUrl: 'https://github.com/Sriram-ake/my-project',
 *   liveUrl: null,
 *   category: 'Web',
 *   year: '2025',
 *   featured: true,
 * }
 */
export const projects: Project[] = []

export const featuredProjects = (): Project[] => projects.filter((p) => p.featured)

export const projectCategories = (): string[] =>
  Array.from(new Set(projects.map((p) => p.category).filter(Boolean) as string[]))
