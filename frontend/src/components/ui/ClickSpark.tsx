import { useEffect, useRef } from 'react'

interface Spark {
  x: number
  y: number
  angle: number
  born: number
}

/**
 * Global click-spark effect: a small burst of accent lines radiates from every
 * click (React Bits "Click Spark"). Rendered on a fixed, pointer-events-none
 * canvas. No-ops entirely under prefers-reduced-motion.
 */
export function ClickSpark({
  sparkColor,
  count = 8,
  size = 14,
  duration = 400,
}: {
  sparkColor?: string
  count?: number
  size?: number
  duration?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sparks = useRef<Spark[]>([])
  const raf = useRef<number>(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Resolve the accent color once (fallback to violet if unavailable).
    const accent =
      sparkColor ??
      (() => {
        const raw = getComputedStyle(document.documentElement)
          .getPropertyValue('--color-accent')
          .trim()
        return raw ? `rgb(${raw})` : '#7c5cff'
      })()

    const onClick = (e: MouseEvent) => {
      const now = performance.now()
      for (let i = 0; i < count; i++) {
        sparks.current.push({
          x: e.clientX,
          y: e.clientY,
          angle: (Math.PI * 2 * i) / count,
          born: now,
        })
      }
    }
    window.addEventListener('click', onClick)

    const ease = (t: number) => 1 - Math.pow(1 - t, 3)

    const draw = () => {
      const now = performance.now()
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      sparks.current = sparks.current.filter((s) => now - s.born < duration)
      ctx.strokeStyle = accent
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      for (const s of sparks.current) {
        const t = ease((now - s.born) / duration)
        const dist = t * 26
        const len = size * (1 - t)
        const x1 = s.x + Math.cos(s.angle) * dist
        const y1 = s.y + Math.sin(s.angle) * dist
        const x2 = s.x + Math.cos(s.angle) * (dist + len)
        const y2 = s.y + Math.sin(s.angle) * (dist + len)
        ctx.globalAlpha = 1 - t
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
      raf.current = requestAnimationFrame(draw)
    }
    raf.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('click', onClick)
      cancelAnimationFrame(raf.current)
    }
  }, [sparkColor, count, size, duration])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90]"
    />
  )
}
