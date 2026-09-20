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
  phone: '9849326138',
  // Not rendered publicly. Kept here for completeness only.
  dateOfBirth: '2007-11-28',
  // Set to a real file under /public/resume when available; null renders a
  // graceful disabled state instead of a fake download.
  resumeUrl: null,
  summary:
    'I am Ake Sri Ram, a B.Tech third-year Information Technology student at Aditya College of Engineering and Technology, Surampalem. I focus on software development, problem solving, and backend engineering, and I enjoy turning ideas into practical, well-built technology projects.',
}

/**
 * Feature flags for optionally-sensitive fields. Everything defaults to hidden.
 * Flip to `true` deliberately to surface a field in the UI.
 */
export const profileVisibility = {
  showDateOfBirth: false,
  showPhone: false,
} as const
