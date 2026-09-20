import type {
  CodingPlatformKey,
  CodingPlatformStats,
  CodingSummary,
  ContactPayload,
  Heatmap,
} from '@/types'

/**
 * Base URL for the API. In development, Vite proxies `/api` to the FastAPI
 * backend (see vite.config.ts). In production set VITE_API_BASE_URL if the
 * backend lives on a different origin.
 */
const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit, timeoutMs = 12000): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
    })
    if (!res.ok) {
      let detail = `Request failed (${res.status})`
      try {
        const body = (await res.json()) as { detail?: string; message?: string }
        detail = body.detail ?? body.message ?? detail
      } catch {
        // ignore body parse errors
      }
      throw new ApiError(detail, res.status)
    }
    return (await res.json()) as T
  } catch (err) {
    if (err instanceof ApiError) throw err
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('The request timed out. Please try again.', 408)
    }
    throw new ApiError('Unable to reach the server. Please try again.', 0)
  } finally {
    clearTimeout(timeout)
  }
}

export const api = {
  health: () => request<{ status: string }>('/api/health'),

  coding: () => request<CodingSummary>('/api/coding'),

  codingPlatform: (platform: CodingPlatformKey) =>
    request<CodingPlatformStats>(`/api/coding/${platform}`),

  heatmap: (platform: 'github' | 'leetcode') =>
    request<Heatmap>(`/api/coding/${platform}/heatmap`, undefined, 15000),

  contact: (payload: ContactPayload) =>
    request<{ ok: boolean; message: string }>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  /**
   * Chat is streamed as newline-delimited text chunks. Returns an async
   * iterator of string tokens. Falls back gracefully on error.
   */
  chatStream: async function* (
    messages: { role: 'user' | 'assistant'; content: string }[],
    signal?: AbortSignal,
  ): AsyncGenerator<string> {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
      signal,
    })
    if (!res.ok || !res.body) {
      let detail = 'The assistant is unavailable right now.'
      try {
        const body = (await res.json()) as { detail?: string }
        detail = body.detail ?? detail
      } catch {
        // ignore
      }
      throw new ApiError(detail, res.status)
    }
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      yield decoder.decode(value, { stream: true })
    }
  },
}
