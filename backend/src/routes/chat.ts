/** AI assistant chat endpoint (streaming plain-text chunks). */

import { Router } from 'express'
import type { ChatMessage } from '../types'
import { fallbackAnswer } from '../services/context'
import * as nvidia from '../services/nvidia'

export const chatRouter = Router()

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** Parse and validate the incoming chat payload. Returns null if invalid. */
function parseMessages(body: unknown): ChatMessage[] | null {
  if (!body || typeof body !== 'object') return null
  const raw = (body as { messages?: unknown }).messages
  if (!Array.isArray(raw) || raw.length < 1 || raw.length > 40) return null
  const messages: ChatMessage[] = []
  for (const m of raw) {
    if (!m || typeof m !== 'object') return null
    const { role, content } = m as { role?: unknown; content?: unknown }
    if (role !== 'user' && role !== 'assistant') return null
    if (typeof content !== 'string' || content.length < 1 || content.length > 4000) return null
    messages.push({ role, content })
  }
  return messages
}

chatRouter.post('/chat', async (req, res) => {
  const messages = parseMessages(req.body)
  if (!messages) {
    res.status(422).json({ detail: 'Invalid chat request.' })
    return
  }

  const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.content ?? ''

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('X-Accel-Buffering', 'no')

  const streamFallback = async () => {
    for (const word of fallbackAnswer(lastUser).split(' ')) {
      res.write(word + ' ')
      await sleep(15)
    }
  }

  if (nvidia.isConfigured()) {
    let produced = false
    try {
      await nvidia.streamChat(messages, (delta) => {
        produced = true
        res.write(delta)
      })
    } catch {
      // Graceful degradation to the rule-based answer if nothing streamed yet.
      if (!produced) await streamFallback()
    }
  } else {
    await streamFallback()
  }

  res.end()
})
