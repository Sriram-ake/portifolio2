import type { Project } from '@/types'

/**
 * Projects backed by real repositories on github.com/Sriram-ake only.
 * No invented projects, no fabricated live-demo links — a demo link appears
 * only when the repo actually has one. Descriptions and feature lists are
 * drawn from each repository's own README; nothing is embellished.
 */
export const projects: Project[] = [
  {
    id: 'masteria',
    title: 'Masteria',
    description: 'An adaptive learning RPG for Android that turns your weakest topic into bite-sized quests.',
    detailedDescription:
      'Masteria is an adaptive learning RPG for Android. A short diagnostic finds your weakest topic and generates quests around it, while an Elo-based learner model adapts question difficulty as you play. Mastery unlocks new regions of a skill map through boss battles, and a streaming AI mentor explains mistakes along the way.',
    features: [
      'Adaptive quests driven by an Elo-based learner model',
      'Skill-tree map with mastery tracking and boss unlocks',
      'Streaming AI mentor that explains mistakes',
      'Scan-to-Quest: turns a textbook photo into a quest via OCR + AI',
      'RPG progression — XP, levels, coins, streaks, and badges',
      'Firebase accounts plus guest play',
    ],
    technologies: ['Kotlin', 'Jetpack Compose', 'Ktor', 'MongoDB Atlas', 'Firebase', 'NVIDIA NIM', 'Docker'],
    icon: 'graduation',
    category: 'AI',
    year: '2026',
    githubUrl: 'https://github.com/Sriram-ake/masteria',
    liveUrl: null,
    featured: false,
  },
  {
    id: 'flappy-bird',
    title: 'Flappy Bird: Neural Flight',
    description:
      'A modern Flappy Bird in Python, paired with a Deep Q-Network agent you can watch or race against.',
    detailedDescription:
      'Flappy Bird: Neural Flight pairs classic arcade gameplay with a Deep Q-Network (DQN) reinforcement-learning agent. Play it yourself, watch the trained agent fly with live Q-value telemetry, or take it on in a Human vs AI duel. The agent can also be trained and benchmarked from the command line.',
    features: [
      'Human, AI Spectator, and Human vs AI duel modes',
      'Double Dueling DQN agent (PyTorch) with experience replay',
      'Four visual themes and multiple bird skins',
      'Dynamic particle effects and procedural sound',
      'Headless fast-mode training with automatic checkpointing',
    ],
    technologies: ['Python', 'PyTorch', 'Gymnasium', 'Pygame', 'Matplotlib'],
    icon: 'bird',
    category: 'Game',
    year: '2026',
    githubUrl: 'https://github.com/Sriram-ake/flappy_bird',
    liveUrl: null,
    featured: false,
  },
  {
    id: 'developer-command-center',
    title: 'Developer Command Center',
    description:
      'A local-first, full-stack developer productivity dashboard — tracker, snippets, roadmap, and analytics in one place.',
    detailedDescription:
      'Developer Command Center is a local-first, full-stack developer productivity dashboard that combines several tools into one app, running entirely on your machine against a real on-disk database. It spans a DSA tracker, code snippets, a learning roadmap, goals and notes, a resume builder, live GitHub integration, and Recharts analytics — all behind JWT authentication.',
    features: [
      'JWT auth with BCrypt-hashed passwords and protected routes',
      'DSA problem tracker with filters and stats',
      'Code snippets with copy-to-clipboard',
      'Learning roadmap, goals, notes, and projects',
      'Resume builder with JSON export',
      'Live GitHub profile, repos, and language stats',
      'Recharts analytics across week / month / year',
      'Command palette (Ctrl / ⌘ + K)',
    ],
    technologies: [
      'React',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'Java',
      'Spring Boot',
      'Spring Security',
      'H2 / MySQL',
    ],
    icon: 'terminal',
    category: 'Full Stack',
    year: '2026',
    githubUrl: 'https://github.com/Sriram-ake/developer-command-center',
    liveUrl: null,
    featured: false,
  },
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
    featured: false,
  },
]

export const featuredProjects = (): Project[] => projects.filter((p) => p.featured)

export const projectCategories = (): string[] =>
  Array.from(new Set(projects.map((p) => p.category).filter(Boolean) as string[]))
