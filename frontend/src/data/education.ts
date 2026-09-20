import type { EducationItem } from '@/types'

/** Education timeline, most recent first. Sourced from Sri Ram's resume. */
export const education: EducationItem[] = [
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
    level: 'SSC',
    institution: 'S P P P R Z P High School',
    location: 'Pandalapaka',
    detail: '2022',
    score: '78.7%',
  },
]
