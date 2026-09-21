/**
 * Builds the grounded portfolio context for the AI assistant.
 *
 * The context is assembled strictly from verified portfolio data so the model
 * cannot invent facts. A deterministic, rule-based fallback responder is also
 * provided for when NVIDIA NIM is not configured — it answers common questions
 * directly from the same data (and says so when it lacks information).
 */

import { ACHIEVEMENTS, CERTIFICATIONS, EDUCATION, PROFILE, PROJECTS, SKILLS, SOCIAL } from '../data'

function skillsText(): string {
  return SKILLS.map((cat) => {
    const skills = cat.skills.map((s) => `${s.name} (${s.level})`).join(', ')
    return `- ${cat.title}: ${skills}`
  }).join('\n')
}

function educationText(): string {
  return EDUCATION.map((e) => {
    const bits = [e.level, e.institution]
    if (e.location) bits.push(e.location)
    if (e.detail) bits.push(e.detail)
    if (e.score) bits.push(e.score)
    return '- ' + bits.join(' · ')
  }).join('\n')
}

function socialText(): string {
  const entries: [string, string | null][] = [
    ['GitHub', SOCIAL.github],
    ['LinkedIn', SOCIAL.linkedin],
    ['LeetCode', SOCIAL.leetcode],
    ['CodeChef', SOCIAL.codechef],
    ['GeeksforGeeks', SOCIAL.geeksforgeeks],
    ['HackerRank', SOCIAL.hackerrank],
    ['Codeforces', SOCIAL.codeforces],
    ['Codolio (aggregated problem-solving stats)', SOCIAL.codolio],
    ['Instagram', SOCIAL.instagram],
  ]
  return entries
    .filter(([, v]) => v)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n')
}

export function buildContext(): string {
  const p = PROFILE
  const projects = PROJECTS.length
    ? PROJECTS.map((pr) => `- ${pr.title}: ${pr.description}`).join('\n')
    : 'No projects have been published on the portfolio yet.'
  const certs = CERTIFICATIONS.length
    ? CERTIFICATIONS.map((c) => `- ${c.title}${c.issuer ? ` — ${c.issuer}` : ''}`).join('\n')
    : 'No certifications have been published on the portfolio yet.'
  const achievements = ACHIEVEMENTS.length
    ? ACHIEVEMENTS.map((a) => `- ${a}`).join('\n')
    : 'No achievements listed yet.'

  return `PROFILE
Name: ${p.name}
Role: ${p.role}
Education: ${p.branch}, ${p.year} at ${p.college}, ${p.location}
CGPA: ${p.cgpa}
Interests: ${p.interests.join(', ')}
Email: ${p.email}
Summary: ${p.summary}

EDUCATION
${educationText()}

SKILLS
${skillsText()}

PROJECTS
${projects}

CERTIFICATIONS
${certs}

ACHIEVEMENTS
${achievements}

LANGUAGES
${p.languages.join(', ')}

CODING PLATFORMS & SOCIAL LINKS
${socialText()}
`
}

export const SYSTEM_PROMPT =
  'You are the portfolio assistant for Ake Sri Ram (also called Sri Ram). ' +
  'Answer questions about him using ONLY the portfolio context provided below. ' +
  'Be concise, friendly, and professional. ' +
  'If the information needed is not in the context, say: ' +
  '"I don\'t have that information in Sri Ram\'s portfolio yet." ' +
  'Never invent projects, certifications, statistics, achievements, or personal details. ' +
  'You may format answers with simple markdown.\n\n' +
  'PORTFOLIO CONTEXT:\n' +
  buildContext()

/** Rule-based fallback (used when NVIDIA NIM is not configured). */
export function fallbackAnswer(question: string): string {
  const q = question.toLowerCase()
  const p = PROFILE
  const has = (...words: string[]) => words.some((w) => q.includes(w))

  if (has('hello', 'hi ', 'hey', 'how are you') && q.length < 20) {
    return (
      `Hi! I'm ${p.name}'s portfolio assistant. Ask me about his education, skills, ` +
      'coding profiles, or how to reach him.'
    )
  }
  if (has('who', 'about', 'yourself', 'introduce')) return p.summary
  if (has('study', 'college', 'education', 'branch', 'cgpa', 'degree', 'university')) {
    return `${p.name} is pursuing a ${p.branch} B.Tech (${p.year}) at ${p.college}, ${p.location}, with a current CGPA of ${p.cgpa}.`
  }
  if (has('learning', 'currently learn', 'improving', 'getting better')) {
    const learning = [...new Set(SKILLS.flatMap((c) => c.skills).filter((s) => s.level === 'Learning').map((s) => s.name))]
    if (learning.length) return "He's currently learning: " + learning.join(', ') + '.'
  }
  if (has('skill', 'technolog', 'tech stack', 'language', 'know', 'programming', 'stack')) {
    return 'Here are the technologies he works with:\n\n' + skillsText()
  }
  if (has('where', 'location', 'based', 'from', 'live')) {
    return `${p.name} is based in ${p.location}, studying at ${p.college}.`
  }
  if (has('project')) {
    if (PROJECTS.length) {
      return (
        'Here are his projects:\n\n' +
        PROJECTS.map((pr) => `- **${pr.title}** — ${pr.description}`).join('\n')
      )
    }
    return "There are no projects published on the portfolio yet — they'll appear here as they're completed."
  }
  if (has('certificat', 'credential')) {
    if (CERTIFICATIONS.length) {
      return 'Certifications:\n\n' + CERTIFICATIONS.map((c) => `- ${c.title} — ${c.issuer}`).join('\n')
    }
    return 'No certifications have been published on the portfolio yet.'
  }
  if (has('achievement', 'rating', 'star', 'accomplish', 'award', 'rank')) {
    if (ACHIEVEMENTS.length) {
      return 'Here are his achievements:\n\n' + ACHIEVEMENTS.map((a) => `- ${a}`).join('\n')
    }
  }
  if (has('contact', 'email', 'reach', 'hire', 'connect', 'phone', 'number', 'call')) {
    return (
      `You can reach ${p.name} by email at **${p.email}** or by phone at ` +
      '**+91 98493 26138**, or use the contact form on this site.'
    )
  }
  if (has('github')) return `His GitHub profile: ${p.social.github}`
  if (has('leetcode')) return `His LeetCode profile: ${p.social.leetcode}`
  if (has('codechef')) return `His CodeChef profile: ${p.social.codechef}`
  if (has('codeforces')) return `His Codeforces profile: ${p.social.codeforces}`
  if (has('hackerrank')) return `His HackerRank profile: ${p.social.hackerrank}`
  if (has('geeksforgeeks', 'gfg')) return `His GeeksforGeeks profile: ${p.social.geeksforgeeks}`
  if (has('linkedin')) return `His LinkedIn profile: ${p.social.linkedin}`
  if (has('codolio') && p.social.codolio) {
    return `His aggregated problem-solving stats (Codolio): ${p.social.codolio}`
  }
  if (has('instagram') && p.social.instagram) return `His Instagram: ${p.social.instagram}`
  if (has('solved', 'problems', 'how many', 'dsa', 'leetcode problem', 'questions')) {
    const parts = [
      'He solves DSA problems across LeetCode, CodeChef, GeeksforGeeks, HackerRank, and Codeforces.',
    ]
    if (p.social.codolio) parts.push(`Live aggregated totals are on his Codolio profile: ${p.social.codolio}`)
    parts.push('The Coding section of this site shows current counts pulled live from each platform.')
    return parts.join(' ')
  }
  if (has('coding', 'platform', 'competitive')) {
    return "He's active on these coding platforms:\n\n" + socialText()
  }
  if (has('interest', 'hobby', 'music')) {
    return `Outside of coding, ${p.name} enjoys ${p.interests.join(', ').toLowerCase()}.`
  }

  return (
    "I don't have that information in Sri Ram's portfolio yet. " +
    'Try asking about his education, skills, coding platforms, or how to contact him.'
  )
}
