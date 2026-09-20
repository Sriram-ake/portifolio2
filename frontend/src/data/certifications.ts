import type { Certification } from '@/types'

/**
 * Certifications — sourced from Sri Ram's resume. Verified titles/issuers only.
 * Credential URLs and images are null until the actual files/links are added
 * (drop images under public/certifications/ and set `image`/`credentialUrl`).
 */
export const certifications: Certification[] = [
  {
    id: 'cisco-c',
    title: 'C Programming',
    issuer: 'Cisco',
    issueDate: '',
    category: 'Programming',
    credentialUrl: null,
    image: null,
    description: 'C programming certification from Cisco Networking Academy.',
  },
  {
    id: 'oracle-ai',
    title: 'Artificial Intelligence Certification',
    issuer: 'Oracle',
    issueDate: '',
    category: 'AI',
    credentialUrl: null,
    image: null,
    description: 'Foundational Artificial Intelligence certification from Oracle.',
  },
  {
    id: 'html-css',
    title: 'HTML and CSS',
    issuer: '',
    issueDate: '',
    category: 'Web',
    credentialUrl: null,
    image: null,
    description: 'Certification covering HTML and CSS fundamentals.',
  },
]

export const certificationCategories = (): string[] =>
  Array.from(new Set(certifications.map((c) => c.category).filter(Boolean)))
