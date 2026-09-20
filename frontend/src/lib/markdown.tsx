import { Fragment, type ReactNode } from 'react'

/**
 * Minimal, dependency-free, XSS-safe markdown renderer for chat responses.
 * Supports: fenced code blocks, inline code, bold, italic, links, unordered
 * and ordered lists, and paragraphs. Everything is rendered as React elements
 * (no dangerouslySetInnerHTML), so untrusted model output cannot inject HTML.
 */

interface CodeBlock {
  type: 'code'
  lang: string
  content: string
}
interface TextBlock {
  type: 'text'
  content: string
}
type Block = CodeBlock | TextBlock

function splitFences(src: string): Block[] {
  const blocks: Block[] = []
  const regex = /```(\w*)\n?([\s\S]*?)```/g
  let last = 0
  let match: RegExpExecArray | null
  while ((match = regex.exec(src)) !== null) {
    if (match.index > last) {
      blocks.push({ type: 'text', content: src.slice(last, match.index) })
    }
    blocks.push({ type: 'code', lang: match[1] || 'text', content: match[2].replace(/\n$/, '') })
    last = regex.lastIndex
  }
  if (last < src.length) blocks.push({ type: 'text', content: src.slice(last) })
  return blocks
}

/** Inline formatting: `code`, **bold**, *italic*, [text](url). */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const regex = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\((https?:\/\/[^\s)]+)\))/g
  let last = 0
  let match: RegExpExecArray | null
  let i = 0
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index))
    const token = match[0]
    const key = `${keyPrefix}-${i++}`
    if (token.startsWith('`')) {
      nodes.push(
        <code key={key} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]">
          {token.slice(1, -1)}
        </code>,
      )
    } else if (token.startsWith('**')) {
      nodes.push(
        <strong key={key} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>,
      )
    } else if (token.startsWith('*')) {
      nodes.push(<em key={key}>{token.slice(1, -1)}</em>)
    } else {
      const linkMatch = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/.exec(token)
      if (linkMatch) {
        nodes.push(
          <a
            key={key}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-2"
          >
            {linkMatch[1]}
          </a>,
        )
      }
    }
    last = regex.lastIndex
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

function renderTextBlock(content: string, blockKey: string): ReactNode {
  const lines = content.split('\n')
  const out: ReactNode[] = []
  let list: { ordered: boolean; items: string[] } | null = null
  let paragraph: string[] = []

  const flushParagraph = (key: string) => {
    if (paragraph.length === 0) return
    out.push(
      <p key={key} className="whitespace-pre-wrap leading-relaxed">
        {renderInline(paragraph.join(' '), key)}
      </p>,
    )
    paragraph = []
  }
  const flushList = (key: string) => {
    if (!list) return
    const items = list.items
    out.push(
      list.ordered ? (
        <ol key={key} className="ml-5 list-decimal space-y-1">
          {items.map((it, idx) => (
            <li key={idx}>{renderInline(it, `${key}-${idx}`)}</li>
          ))}
        </ol>
      ) : (
        <ul key={key} className="ml-5 list-disc space-y-1">
          {items.map((it, idx) => (
            <li key={idx}>{renderInline(it, `${key}-${idx}`)}</li>
          ))}
        </ul>
      ),
    )
    list = null
  }

  lines.forEach((raw, idx) => {
    const line = raw.trimEnd()
    const ul = /^\s*[-*]\s+(.*)$/.exec(line)
    const ol = /^\s*\d+\.\s+(.*)$/.exec(line)
    if (ul) {
      flushParagraph(`${blockKey}-p-${idx}`)
      if (!list || list.ordered) {
        flushList(`${blockKey}-l-${idx}`)
        list = { ordered: false, items: [] }
      }
      list.items.push(ul[1])
    } else if (ol) {
      flushParagraph(`${blockKey}-p-${idx}`)
      if (!list || !list.ordered) {
        flushList(`${blockKey}-l-${idx}`)
        list = { ordered: true, items: [] }
      }
      list.items.push(ol[1])
    } else if (line.trim() === '') {
      flushParagraph(`${blockKey}-p-${idx}`)
      flushList(`${blockKey}-l-${idx}`)
    } else {
      flushList(`${blockKey}-l-${idx}`)
      paragraph.push(line)
    }
  })
  flushParagraph(`${blockKey}-p-end`)
  flushList(`${blockKey}-l-end`)

  return <Fragment>{out}</Fragment>
}

export function Markdown({ content }: { content: string }) {
  const blocks = splitFences(content)
  return (
    <div className="space-y-3 text-sm">
      {blocks.map((block, i) =>
        block.type === 'code' ? (
          <pre
            key={i}
            className="overflow-x-auto rounded-lg border border-border bg-background/60 p-3 font-mono text-xs"
          >
            <code>{block.content}</code>
          </pre>
        ) : (
          <div key={i}>{renderTextBlock(block.content, `b${i}`)}</div>
        ),
      )}
    </div>
  )
}
