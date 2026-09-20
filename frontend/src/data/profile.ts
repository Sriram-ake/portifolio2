import type { Profile } from '@/types'

/**
 * Single source of truth for personal profile information.
 * Only verified data is included. Date of birth and phone are kept out of the
 * public-facing UI by default (see `showSensitive` flags where consumed).
 */
export const profile: Profile = {
  name: 'Ake Sri Ram',
  role: 'Information Technology Student',
  taglines: ['Building.', 'Learning.', 'Solving.', 'Creating.'],
  location: 'Surampalem, India',
  college: 'Aditya College of Engineering and Technology',
  branch: 'Information Technology',
  year: '3rd Year',
  cgpa: '8.36',
  interests: ['Listening to music'],
  email: 'akesurekha@gmail.com',
  phone: '+91 98493 26138',
  languages: ['English', 'Telugu', 'Hindi (Basic)'],
  avatarUrl: '/profile.jpg',
  // Not rendered publicly. Kept here for completeness only.
  dateOfBirth: '2007-11-28',
  // Real resume PDF served from /public/resume.
  resumeUrl: '/resume/Ake-Sri-Ram-Resume.pdf',
  summary:
    'I am Ake Sri Ram, a B.Tech Information Technology student at Aditya College of Engineering and Technology, Surampalem. I work across C, C++, Java and Python, enjoy data structures and algorithmic problem solving, and build practical projects with web technologies. I care about writing clean, dependable code and continuously sharpening my fundamentals.',
}

/**
 * Feature flags for optionally-sensitive fields. Everything defaults to hidden.
 * Flip to `true` deliberately to surface a field in the UI.
 */
export const profileVisibility = {
  showDateOfBirth: false,
  showPhone: true,
} as const
