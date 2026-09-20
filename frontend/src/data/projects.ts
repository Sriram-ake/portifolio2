import type { Project } from '@/types'

/**
 * Real projects only. Links point to actual repositories on
 * github.com/Sriram-ake. Where a public repo or live demo isn't available yet,
 * the field is left null rather than inventing a link.
 */
export const projects: Project[] = [
  {
    id: 'calculator',
    title: 'Calculator',
    description: 'A responsive calculator web app with a clean, minimal UI.',
    detailedDescription:
      'A browser-based calculator focused on a tidy, responsive interface and smooth interactions. Built with vanilla web technologies and deployed on GitHub Pages.',
    technologies: ['JavaScript', 'HTML', 'CSS'],
    icon: 'calculator',
    category: 'Web',
    year: '2025',
    githubUrl: 'https://github.com/Sriram-ake/Calculator',
    liveUrl: 'https://sriram-ake.github.io/Calculator/',
    featured: true,
  },
  {
    id: 'snake-game',
    title: 'Snake Game',
    description: 'The classic Snake game built in Java with a Swing GUI.',
    detailedDescription:
      'A desktop Snake game implemented in Java using Swing — grid-based movement, growth on eating, collision detection and score tracking.',
    technologies: ['Java', 'Swing'],
    icon: 'gamepad',
    category: 'Game',
    year: '2025',
    githubUrl: 'https://github.com/Sriram-ake/projects/tree/main/snake_game',
    liveUrl: null,
    featured: true,
  },
  {
    id: 'flappy-bird',
    title: 'Flappy Bird',
    description: 'A Flappy Bird–style arcade game — fly through the gaps and beat your score.',
    technologies: ['Java'],
    icon: 'bird',
    category: 'Game',
    year: '2025',
    githubUrl: null,
    liveUrl: null,
    featured: false,
  },
  {
    id: 'neural-flight-fly',
    title: 'Neural Flight Fly',
    description: 'A Flappy Bird–inspired experiment exploring neural-network-driven flight.',
    technologies: ['Python'],
    icon: 'plane',
    category: 'AI / Game',
    year: '2026',
    githubUrl: 'https://github.com/Sriram-ake/flappy-neural-flight',
    liveUrl: null,
    featured: false,
    inProgress: true,
  },
  {
    id: 'snappy-craft',
    title: 'Snappy Craft',
    description: 'An interactive web project.',
    technologies: ['JavaScript'],
    icon: 'blocks',
    category: 'Web',
    year: '2026',
    githubUrl: null,
    liveUrl: null,
    featured: false,
    inProgress: true,
  },
]

export const featuredProjects = (): Project[] => projects.filter((p) => p.featured)

export const projectCategories = (): string[] =>
  Array.from(new Set(projects.map((p) => p.category).filter(Boolean) as string[]))
