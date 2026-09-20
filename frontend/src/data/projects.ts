import type { Project } from '@/types'

/**
 * Projects backed by real repositories on github.com/Sriram-ake only.
 * No invented projects, no fabricated live-demo links — a demo link appears
 * only when the repo actually has one.
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
    id: 'neural-flight-fly',
    title: 'Neural Flight Fly',
    description: 'A Flappy Bird–inspired game exploring neural-network-driven flight.',
    technologies: ['Python'],
    icon: 'plane',
    category: 'AI / Game',
    year: '2026',
    githubUrl: 'https://github.com/Sriram-ake/flappy-neural-flight',
    liveUrl: null,
    featured: false,
    inProgress: true,
  },
]

export const featuredProjects = (): Project[] => projects.filter((p) => p.featured)

export const projectCategories = (): string[] =>
  Array.from(new Set(projects.map((p) => p.category).filter(Boolean) as string[]))
