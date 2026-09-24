/**
 * Application configuration loaded from environment variables.
 * All secrets come from the environment / .env file — never hardcoded.
 */

import { config as loadEnv } from 'dotenv'

loadEnv()

function env(key: string, fallback: string): string {
  const v = process.env[key]
  return v === undefined || v === '' ? fallback : v
}

function envOptional(key: string): string | null {
  const v = process.env[key]
  return v === undefined || v === '' ? null : v
}

function envInt(key: string, fallback: number): number {
  const v = process.env[key]
  if (v === undefined || v === '') return fallback
  const n = Number.parseInt(v, 10)
  return Number.isNaN(n) ? fallback : n
}

export const settings = {
  appName: env('APP_NAME', 'Ake Sri Ram Portfolio API'),
  frontendUrl: env('FRONTEND_URL', 'http://localhost:5173'),
  port: envInt('PORT', 8000),

  // Coding platform usernames (verified defaults).
  githubUsername: env('GITHUB_USERNAME', 'Sriram-ake'),
  leetcodeUsername: env('LEETCODE_USERNAME', 'akesriram'),
  codechefUsername: env('CODECHEF_USERNAME', 'akesriram_2007'),
  hackerrankUsername: env('HACKERRANK_USERNAME', 'akesurekha'),
  geeksforgeeksUsername: env('GEEKSFORGEEKS_USERNAME', 'akesriram'),
  codeforcesUsername: env('CODEFORCES_USERNAME', 'Sriram_2007'),

  // Optional GitHub token for higher rate limits (read-only, public data).
  githubToken: envOptional('GITHUB_TOKEN'),

  // Cache TTL for coding statistics, in seconds (default 1 hour).
  codingCacheTtl: envInt('CODING_CACHE_TTL', 60 * 60),

  // NVIDIA NIM (chat).
  nvidiaNimApiKey: envOptional('NVIDIA_NIM_API_KEY'),
  nvidiaNimModel: env('NVIDIA_NIM_MODEL', 'meta/llama-3.1-8b-instruct'),
  nvidiaNimBaseUrl: env('NVIDIA_NIM_BASE_URL', 'https://integrate.api.nvidia.com/v1'),

  // Brevo (contact email).
  brevoApiKey: envOptional('BREVO_API_KEY'),
  brevoSenderEmail: envOptional('BREVO_SENDER_EMAIL'),
  brevoSenderName: env('BREVO_SENDER_NAME', 'Portfolio Contact Form'),
  // Accept CONTACT_RECIPIENT_EMAIL as an alias so either spelling works.
  contactReceiverEmail: envOptional('CONTACT_RECEIVER_EMAIL') ?? envOptional('CONTACT_RECIPIENT_EMAIL'),

  // Contact rate limiting.
  contactRateLimit: envInt('CONTACT_RATE_LIMIT', 5),
  contactRateWindow: envInt('CONTACT_RATE_WINDOW', 60 * 60),
}

/**
 * Allowed CORS origins (frontend URL + local dev + Render subdomains).
 *
 * Trailing slashes are stripped because browsers send the `Origin` header
 * without one — a `FRONTEND_URL` like `https://site.onrender.com/` would
 * otherwise silently fail to match and block every cross-origin request.
 * FRONTEND_URL may also be a comma-separated list (e.g. custom domain + the
 * onrender.com URL) so multiple front-ends can share one backend.
 *
 * A `*.onrender.com` pattern is always allowed so the deployed frontend can
 * reach the API even when FRONTEND_URL hasn't been set to its exact origin (the
 * Render subdomain can differ from the guessed name). This is safe here: the
 * API is public and read-only and runs with `credentials: false`, so CORS is
 * not acting as a security boundary — it only decides which browsers may read
 * already-public data. Custom domains should still be added via FRONTEND_URL.
 */
export function corsOrigins(): (string | RegExp)[] {
  const normalize = (url: string) => url.trim().replace(/\/+$/, '')
  const configured = settings.frontendUrl.split(',').map(normalize)
  const set = new Set([
    ...configured,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ])
  const patterns: RegExp[] = [/^https:\/\/[a-z0-9-]+\.onrender\.com$/i]
  return [...[...set].filter(Boolean), ...patterns]
}
