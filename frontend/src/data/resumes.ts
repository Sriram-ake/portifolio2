/**
 * Downloadable résumé variants. Both are real PDFs served from
 * `/public/resume`; the labels below were chosen after reading each file's
 * contents (never invented):
 *  - "General CV" — career-objective-led overview (highlights, achievements).
 *  - "Technical Resume" — skills-forward résumé (stack, certifications, projects).
 *
 * This is the single source of truth consumed by the Hero résumé menu and the
 * Command Center download commands. The legacy `profile.resumeUrl` is kept for
 * backward compatibility and points at the primary (technical) résumé.
 */
export interface ResumeOption {
  id: string
  label: string
  description: string
  /** Public path to the PDF. */
  file: string
  /** Suggested download filename. */
  downloadName: string
}

export const resumeOptions: ResumeOption[] = [
  {
    id: 'technical',
    label: 'Technical Resume',
    description: 'Stack, certifications & projects',
    file: '/resume/Ake-Sri-Ram-Technical-Resume.pdf',
    downloadName: 'Ake-Sri-Ram-Technical-Resume.pdf',
  },
  {
    id: 'general',
    label: 'General CV',
    description: 'Career overview & achievements',
    file: '/resume/Ake-Sri-Ram-CV.pdf',
    downloadName: 'Ake-Sri-Ram-CV.pdf',
  },
]
