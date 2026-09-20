import type { Certification } from '@/types'

/**
 * Certifications data source.
 *
 * No certifications are invented. Add real certificates below.
 * Place certificate images/PDFs under `public/certifications/` and reference
 * them via the `image` field.
 *
 * Example (copy, fill in real data, and uncomment):
 *
 * {
 *   id: 'cert-id',
 *   title: 'Certificate Title',
 *   issuer: 'Issuing Organization',
 *   issueDate: '2025-01',
 *   credentialId: 'ABC123',
 *   credentialUrl: 'https://verify.example.com/ABC123',
 *   image: '/certifications/cert-id.png',
 *   category: 'Cloud',
 *   description: 'Short description of what the certificate covers.',
 * }
 */
export const certifications: Certification[] = []

export const certificationCategories = (): string[] =>
  Array.from(new Set(certifications.map((c) => c.category).filter(Boolean)))
