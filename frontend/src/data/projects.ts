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
    githubUrl: 'https://github.com/Sriram-ake/projects',
    liveUrl: null,
    featured: true,
  },
  {
    id: 'synapcraft',
    title: 'SynapCraft',
    description: 'An interactive fruit-fly connectome model in Minecraft.',
    detailedDescription:
      'SynapCraft (NeuroCraft Fly) lets you interact with a simulated neural network inside Minecraft — inspecting its activity and exploring how changing the network changes its responses. Minecraft inputs map to modeled neural activity, which drives scripted body programs and in-game movement.',
    technologies: ['JavaScript', 'Python', 'HTML', 'CSS'],
    icon: 'blocks',
    category: 'AI',
    year: '2026',
    githubUrl: 'https://github.com/Sriram-ake/SynapCraft',
    liveUrl: null,
    featured: true,
    inProgress: true,
  },
]

export const featuredProjects = (): Project[] => projects.filter((p) => p.featured)

export const projectCategories = (): string[] =>
  Array.from(new Set(projects.map((p) => p.category).filter(Boolean) as string[]))
