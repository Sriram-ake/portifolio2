import { useCallback, useRef, useState } from 'react'
import { api } from '@/services/api'
import type { ChatMessage } from '@/types'

let idCounter = 0
const nextId = () => `m${Date.now()}-${idCounter++}`

interface UseChatResult {
  messages: ChatMessage[]
  isStreaming: boolean
  send: (text: string) => Promise<void>
  retryLast: () => void
  clear: () => void
  stop: () => void
}

/** Manages chat state and streaming responses from POST /api/chat. */
export function useChat(): UseChatResult {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const controllerRef = useRef<AbortController | null>(null)
  const lastUserText = useRef<string>('')

  const runStream = useCallback(async (history: ChatMessage[]) => {
    setIsStreaming(true)
    const controller = new AbortController()
    controllerRef.current = controller

    const assistantId = nextId()
    setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }])

    try {
      const payload = history.map((m) => ({ role: m.role, content: m.content }))
      let acc = ''
      for await (const chunk of api.chatStream(payload, controller.signal)) {
        acc += chunk
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: acc } : m)),
        )
      }
      if (!acc.trim()) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: 'I did not receive a response. Please try again.', error: true }
              : m,
          ),
        )
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // User stopped generation — keep whatever streamed so far.
      } else {
        const message =
          err instanceof Error ? err.message : 'The assistant is unavailable right now.'
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: message, error: true } : m,
          ),
        )
      }
    } finally {
      setIsStreaming(false)
      controllerRef.current = null
    }
  }, [])

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isStreaming) return
      lastUserText.current = trimmed
      const userMessage: ChatMessage = { id: nextId(), role: 'user', content: trimmed }
      const history = [...messages, userMessage]
      setMessages(history)
      await runStream(history)
    },
    [messages, isStreaming, runStream],
  )

  const retryLast = useCallback(() => {
    if (isStreaming) return
    // Drop the last assistant (error) message and re-run from the last user turn.
    setMessages((prev) => {
      const withoutLastAssistant =
        prev.length && prev[prev.length - 1].role === 'assistant' ? prev.slice(0, -1) : prev
      void runStream(withoutLastAssistant)
      return withoutLastAssistant
    })
  }, [isStreaming, runStream])

  const clear = useCallback(() => {
    controllerRef.current?.abort()
    setMessages([])
  }, [])

  const stop = useCallback(() => {
    controllerRef.current?.abort()
  }, [])

  return { messages, isStreaming, send, retryLast, clear, stop }
}
