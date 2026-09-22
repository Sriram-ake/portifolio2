/**
 * NVIDIA NIM chat integration (OpenAI-compatible streaming API).
 * The API key lives only on the backend. The frontend never sees it.
 */

import { settings } from '../config'
import type { ChatMessage } from '../types'
import { SYSTEM_PROMPT } from './context'

export function isConfigured(): boolean {
  return Boolean(settings.nvidiaNimApiKey)
}

/**
 * Stream assistant text deltas from NVIDIA NIM. `onDelta` is called for each
 * token. Throws on transport/HTTP failure so the caller can fall back.
 */
export async function streamChat(
  messages: ChatMessage[],
  onDelta: (delta: string) => void | Promise<void>,
  signal?: AbortSignal,
): Promise<void> {
  const payload = {
    model: settings.nvidiaNimModel,
    messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
    temperature: 0.3,
    top_p: 0.9,
    max_tokens: 1024,
    stream: true,
  }
  const url = `${settings.nvidiaNimBaseUrl.replace(/\/$/, '')}/chat/completions`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 60_000)
  if (signal) signal.addEventListener('abort', () => controller.abort())

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${settings.nvidiaNimApiKey}`,
        Accept: 'text/event-stream',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    if (!resp.ok || !resp.body) {
      throw new Error(`NIM responded ${resp.status}`)
    }

    const reader = resp.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      // Server-sent events are newline-delimited.
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''
      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith('data:')) continue
        const chunk = trimmed.slice('data:'.length).trim()
        if (chunk === '[DONE]') return
        try {
          const parsed = JSON.parse(chunk)
          const delta = parsed?.choices?.[0]?.delta?.content
          if (delta) await onDelta(delta)
        } catch {
          // Ignore malformed keep-alive/partial chunks.
        }
      }
    }
  } finally {
    clearTimeout(timeout)
  }
}
