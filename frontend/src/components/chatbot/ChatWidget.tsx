import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bot,
  Check,
  Copy,
  MessageSquare,
  RefreshCw,
  Send,
  Square,
  Trash2,
  X,
} from 'lucide-react'
import { useChat } from '@/hooks/useChat'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Markdown } from '@/lib/markdown'
import { suggestedPrompts, assistantIntro } from '@/data/assistant'
import { profile } from '@/data/profile'
import { cn } from '@/lib/utils'

export const OPEN_ASSISTANT_EVENT = 'open-assistant'

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const { messages, isStreaming, send, retryLast, clear, stop } = useChat()
  const reduce = useReducedMotion()
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Allow other parts of the page to open the assistant.
  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener(OPEN_ASSISTANT_EVENT, handler)
    return () => window.removeEventListener(OPEN_ASSISTANT_EVENT, handler)
  }, [])

  // Auto-scroll to newest message.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  const handleSend = () => {
    if (!input.trim()) return
    void send(input)
    setInput('')
  }

  const handleCopy = async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 1500)
    } catch {
      // clipboard unavailable — no-op
    }
  }

  const lastIsError = messages.length > 0 && messages[messages.length - 1].error

  return (
    <>
      {/* Floating launcher */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-[85] flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-[0_10px_40px_-10px_rgb(var(--color-accent)/0.7)] transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? 'close' : 'open'}
            initial={{ opacity: 0, rotate: -30 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 30 }}
            transition={{ duration: 0.15 }}
          >
            {open ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="AI portfolio assistant"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-5 z-[85] flex h-[min(600px,75vh)] w-[min(400px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Bot className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Portfolio Assistant</p>
                  <p className="text-xs text-muted-foreground">Ask about {profile.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={clear}
                    aria-label="Clear conversation"
                    title="Clear conversation"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close assistant"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              {messages.length === 0 ? (
                <div className="space-y-4">
                  <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3 text-sm leading-relaxed">
                    {assistantIntro}
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Try asking
                    </p>
                    {suggestedPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => void send(prompt)}
                        className="block w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-left text-sm transition-colors hover:border-accent/50 hover:text-accent"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}
                  >
                    <div
                      className={cn(
                        'group relative max-w-[85%] rounded-2xl px-4 py-2.5 text-sm',
                        m.role === 'user'
                          ? 'rounded-br-sm bg-accent text-accent-foreground'
                          : cn(
                              'rounded-tl-sm bg-muted',
                              m.error && 'ring-1 ring-destructive/40',
                            ),
                      )}
                    >
                      {m.role === 'assistant' ? (
                        m.content ? (
                          <Markdown content={m.content} />
                        ) : (
                          <TypingDots />
                        )
                      ) : (
                        <p className="whitespace-pre-wrap">{m.content}</p>
                      )}

                      {m.role === 'assistant' && m.content && !m.error && (
                        <button
                          onClick={() => handleCopy(m.id, m.content)}
                          aria-label="Copy response"
                          className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
                        >
                          {copiedId === m.id ? (
                            <Check className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}

              {lastIsError && !isStreaming && (
                <div className="flex justify-center">
                  <button
                    onClick={retryLast}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                    Retry
                  </button>
                </div>
              )}
            </div>

            {/* Composer */}
            <div className="border-t border-border p-3">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  rows={1}
                  placeholder="Ask about Sri Ram…"
                  aria-label="Message"
                  className="max-h-28 flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent"
                />
                {isStreaming ? (
                  <button
                    onClick={stop}
                    aria-label="Stop generating"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Square className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    aria-label="Send message"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-opacity disabled:opacity-40"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>
              <p className="mt-2 text-center text-[11px] text-muted-foreground">
                Answers are based only on {profile.name}'s portfolio data.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1 py-1" aria-label="Assistant is typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  )
}
