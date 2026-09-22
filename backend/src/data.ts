/**
 * Portfolio content — the backend's source of truth for profile data.
 *
 * Mirrors the frontend data files. Only verified information is included; no
 * projects, certifications, or achievements are invented.
 */

import type {
  Certification,
  EducationItem,
  Profile,
  Project,
  SkillCategory,
  SocialLinks,
} from './types'

export const SOCIAL: SocialLinks = {
  github: 'https://github.com/Sriram-ake',
  linkedin: 'https://www.linkedin.com/in/sriram-ake-23514633/',
  leetcode: 'https://leetcode.com/u/akesriram/',
  codechef: 'https://www.codechef.com/users/akesriram_2007',
  geeksforgeeks: 'https://www.geeksforgeeks.org/user/akesriram/',
  hackerrank: 'https://www.hackerrank.com/profile/akesurekha',
  codeforces: 'https://codeforces.com/profile/Sriram_2007',
  codolio: 'https://codolio.com/profile/sriram1108',
  instagram: 'https://www.instagram.com/pspk_ram_42/',
}

export const PROFILE: Profile = {
  name: 'Ake Sri Ram',
  role: 'Information Technology Student',
  taglines: ['Building.', 'Learning.', 'Solving.', 'Creating.'],
  location: 'Surampalem, India',
  college: 'Aditya College of Engineering and Technology',
  branch: 'Information Technology',
  year: '3rd Year',
  cgpa: '8.36',
  interests: ['Listening to music'],
  languages: ['English', 'Telugu', 'Hindi (Basic)'],
  email: 'akesurekha@gmail.com',
  summary:
    'Ake Sri Ram builds ideas into working software. He is an Information Technology ' +
    'student at Aditya College of Engineering and Technology, focused on Java, ' +
    'Spring Boot, full-stack development, DSA, and AI. He learns by building real ' +
    'projects, solving problems, and turning concepts into usable products.',
  social: SOCIAL,
}

export const EDUCATION: EducationItem[] = [
  {
    id: 'btech',
    level: 'B.Tech — Information Technology',
    institution: 'Aditya College of Engineering and Technology',
    location: 'Surampalem',
    detail: '3rd Year · 2024 – Present',
    score: 'CGPA 8.36',
  },
  {
    id: 'intermediate',
    level: 'Intermediate — MPC',
    institution: 'Gamyam Junior College',
    detail: '2022 – 2024',
    score: '93.8%',
  },
  {
    id: 'ssc',
    level: 'SSC — High School',
    institution: 'S P P P R Z P High School',
    location: 'Pandalapaka',
    detail: '2017 – 2022',
    score: '78.7%',
  },
]

export const SKILLS: SkillCategory[] = [
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

// Real projects (github.com/Sriram-ake). Links are null where no public repo
// or live demo exists yet — never fabricated.
export const PROJECTS: Project[] = [
  {
    id: 'calculator',
    title: 'Calculator',
    description: 'A responsive calculator web app with a clean, minimal UI.',
    technologies: ['JavaScript', 'HTML', 'CSS'],
    featured: true,
    category: 'Web',
    year: '2025',
    githubUrl: 'https://github.com/Sriram-ake/Calculator',
    liveUrl: 'https://sriram-ake.github.io/Calculator/',
  },
  {
    id: 'synapcraft',
    title: 'SynapCraft',
    description: 'An interactive fruit-fly connectome model in Minecraft.',
    technologies: ['JavaScript', 'Python', 'HTML', 'CSS'],
    featured: true,
    category: 'AI',
    year: '2026',
    githubUrl: 'https://github.com/Sriram-ake/SynapCraft',
    liveUrl: 'https://sriram-ake.github.io/SynapCraft/',
  },
]

// Certifications from the resume (verified titles/issuers).
export const CERTIFICATIONS: Certification[] = [
  { id: 'cisco-c', title: 'C Programming', issuer: 'Cisco', issueDate: '', category: 'Programming' },
  {
    id: 'oracle-ai',
    title: 'Artificial Intelligence Certification',
    issuer: 'Oracle',
    issueDate: '',
    category: 'AI',
  },
  { id: 'html-css', title: 'HTML and CSS', issuer: '', issueDate: '', category: 'Web' },
]

// Achievements from the resume (verified). Used to ground the AI assistant.
export const ACHIEVEMENTS: string[] = [
  '4-star rating in C on HackerRank',
  '3-star rating in Python on HackerRank',
  '3-star rating in Java on HackerRank',
  '93.8% aggregate in Intermediate (MPC)',
  '78.7% aggregate in SSC (10th grade)',
  'Regularly practices data structures and algorithmic problem solving',
]

export const USERNAMES: Record<string, string> = {
  github: 'Sriram-ake',
  leetcode: 'akesriram',
  codechef: 'akesriram_2007',
  hackerrank: 'akesurekha',
  geeksforgeeks: 'akesriram',
  codeforces: 'Sriram_2007',
}
