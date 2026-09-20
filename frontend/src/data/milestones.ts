/**
 * Milestones — the developer journey in concrete, verified highlights.
 * `icon` maps to a lucide icon in the Milestones component.
 * Only real, self-reported milestones — no fabricated numbers.
 */
export interface Milestone {
  id: string
  icon:
    | 'trophy'
    | 'flame'
    | 'star'
    | 'boxes'
    | 'coffee'
    | 'rocket'
    | 'bot'
    | 'globe'
    | 'wrench'
    | 'graduation'
  title: string
  description: string
}

export const milestones: Milestone[] = [
  {
    id: 'leetcode-300',
    icon: 'trophy',
    title: '300+ LeetCode problems solved',
    description: 'Consistent problem solving across arrays, strings, trees, graphs and DP.',
  },
  {
    id: 'streak',
    icon: 'flame',
    title: '100 Days Badge · 2026',
    description: 'Earned the LeetCode 100 Days badge with a 49-day maximum streak.',
  },
  {
    id: 'hackerrank-stars',
    icon: 'star',
    title: '4★ C · 3★ Python · 3★ Java',
    description: 'Star ratings earned on HackerRank across multiple languages.',
  },
  {
    id: 'multi-platform',
    icon: 'boxes',
    title: 'Active across 5 platforms',
    description: 'LeetCode, CodeChef, HackerRank, Codeforces and GitHub.',
  },
  {
    id: 'java-dsa',
    icon: 'coffee',
    title: 'Java + DSA focus',
    description: 'A strong, ongoing data-structures and algorithms problem-solving journey.',
  },
  {
    id: 'fullstack',
    icon: 'rocket',
    title: 'Full-stack builder',
    description: 'Building applications with Java, Spring Boot, JavaScript and SQL.',
  },
  {
    id: 'ai-projects',
    icon: 'bot',
    title: 'Exploring AI projects',
    description: 'Working on AI-oriented projects including Masteria and Education RPG.',
  },
  {
    id: 'deployed',
    icon: 'globe',
    title: 'Built & deployed projects',
    description: 'Shipped a personal portfolio and web projects to live URLs.',
  },
  {
    id: 'tooling',
    icon: 'wrench',
    title: 'Hands-on with the full workflow',
    description: 'Git, GitHub, REST APIs, databases and deployment.',
  },
  {
    id: 'academics',
    icon: 'graduation',
    title: '93.8% Intermediate · 78.7% SSC',
    description: 'Consistent academic performance alongside CGPA 8.36 in B.Tech.',
  },
]
