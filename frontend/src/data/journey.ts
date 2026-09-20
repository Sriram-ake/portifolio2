import type { JourneyMilestone } from '@/types'

/**
 * Developer journey milestones.
 * These describe direction and focus using only verified facts — no invented
 * accomplishments, awards, or roles. Edit freely as the journey progresses.
 */
export const journey: JourneyMilestone[] = [
  {
    id: 'foundations',
    year: 'School',
    title: 'Curiosity for how things work',
    description:
      'Completed schooling and developed an early interest in computers and problem solving.',
  },
  {
    id: 'btech-start',
    year: 'B.Tech',
    title: 'Information Technology at Aditya',
    description:
      'Began a B.Tech in Information Technology, building core foundations in programming, data structures, and software engineering.',
  },
  {
    id: 'programming',
    year: 'Ongoing',
    title: 'Practicing problem solving',
    description:
      'Actively solving problems across competitive programming platforms and strengthening fundamentals in Java, Python, and C/C++.',
  },
  {
    id: 'building',
    year: 'Now',
    title: 'Building real projects',
    description:
      'Focusing on backend development and full-stack projects — turning concepts into practical, maintainable software.',
  },
]
