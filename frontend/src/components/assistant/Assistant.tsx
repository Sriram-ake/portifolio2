import { motion } from 'framer-motion'
import { Bot, Sparkles } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { suggestedPrompts } from '@/data/assistant'
import { OPEN_ASSISTANT_EVENT } from '@/components/chatbot/ChatWidget'
import { fadeUp, viewportOnce } from '@/animations/variants'

function openAssistant() {
  window.dispatchEvent(new CustomEvent(OPEN_ASSISTANT_EVENT))
}

export function Assistant() {
  return (
    <Section id="assistant" eyebrow="AI Assistant" title="Ask about my work" centered>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border bg-card p-8 text-center sm:p-12"
      >
        {/* ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(circle at 50% 0%, rgb(var(--color-accent) / 0.12), transparent 60%)',
          }}
        />
        <div className="relative">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <Bot className="h-7 w-7" aria-hidden="true" />
          </span>
          <h3 className="mt-5 font-display text-2xl font-semibold">A conversational way to explore</h3>
          <p className="mx-auto mt-3 max-w-xl leading-relaxed text-muted-foreground">
            Chat with an AI assistant that answers questions about my background, skills, projects,
            and coding activity — grounded strictly in my portfolio data, never invented.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {suggestedPrompts.slice(0, 3).map((prompt) => (
              <span
                key={prompt}
                className="rounded-full border border-border bg-background/50 px-3 py-1.5 text-sm text-muted-foreground"
              >
                {prompt}
              </span>
            ))}
          </div>

          <Button className="mt-8" onClick={openAssistant}>
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Launch Assistant
          </Button>
        </div>
      </motion.div>
    </Section>
  )
}
