/**
 * Global ambient background: a subtle dot grid that fades out, plus two slow
 * drifting aurora blobs. Purely decorative, fixed behind all content, and
 * automatically static under prefers-reduced-motion (handled by global CSS).
 */
export function AuroraBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base wash */}
      <div className="absolute inset-0 bg-background" />

      {/* Dot grid, fading toward the bottom */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            'radial-gradient(rgb(var(--color-border) / 0.6) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent 75%)',
        }}
      />

      {/* Aurora blobs */}
      <div
        className="absolute -top-40 left-1/4 h-[38rem] w-[38rem] rounded-full blur-[120px] animate-float"
        style={{ background: 'rgb(var(--color-accent) / 0.12)' }}
      />
      <div
        className="absolute top-1/3 right-0 h-[32rem] w-[32rem] rounded-full blur-[120px] animate-float"
        style={{ background: 'rgb(var(--color-accent-secondary) / 0.1)', animationDelay: '-3s' }}
      />
    </div>
  )
}
