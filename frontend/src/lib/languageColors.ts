/**
 * Canonical GitHub language → dot colour map (a small, curated subset of
 * github-linguist's palette). Used only as a tiny visual cue on repo cards;
 * anything not listed falls back to the brand accent so the UI stays coherent.
 */
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572a5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Shell: '#89e051',
  Go: '#00add8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4f5d95',
  Kotlin: '#a97bff',
  Swift: '#f05138',
  Dart: '#00b4ab',
  Vue: '#41b883',
  Jupyter: '#da5b0b',
  'Jupyter Notebook': '#da5b0b',
  Dockerfile: '#384d54',
}

/** Returns the language's canonical colour, or the brand accent as a fallback. */
export function languageColor(language: string | null | undefined): string {
  if (!language) return 'rgb(var(--color-accent))'
  return LANGUAGE_COLORS[language] ?? 'rgb(var(--color-accent))'
}
