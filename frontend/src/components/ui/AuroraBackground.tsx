/**
 * Global ambient background:
 *   - a base wash
 *   - one slowly drifting line grid (subtle, top-masked)
 *   - three calm aurora blobs (violet + cyan)
 *
 * Purely decorative, fixed behind all content, pointer-events-none. Kept
 * deliberately restrained — a single structural layer plus low-opacity glow so
 * it reads premium, not noisy. All motion is paused under prefers-reduced-motion
 * by the global CSS killswitch, leaving a calm static gradient field.
 */
export function AuroraBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base wash (transitions with the theme) */}
      <div className="absolute inset-0 bg-background transition-colors duration-500" />

      {/* Slowly drifting line grid — the single structural layer */}
      <div
        className="absolute inset-0 opacity-[0.18] animate-grid-move"
        style={{
          backgroundImage:
            'linear-gradient(rgb(var(--color-border) / 0.5) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--color-border) / 0.5) 1px, transparent 1px)',
          backgroundSize: '54px 54px',
          maskImage: 'radial-gradient(ellipse 85% 65% at 50% 0%, black, transparent 78%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 85% 65% at 50% 0%, black, transparent 78%)',
        }}
      />

      {/* Aurora blobs — low opacity, wide blur for a controlled glow */}
      <div
        className="absolute -top-48 left-1/4 h-[40rem] w-[40rem] rounded-full blur-[140px] animate-aurora-drift"
        style={{ background: 'rgb(var(--color-accent) / 0.11)' }}
      />
      <div
        className="absolute top-1/3 right-0 h-[34rem] w-[34rem] rounded-full blur-[140px] animate-aurora-drift"
        style={{
          background: 'rgb(var(--color-accent-secondary) / 0.09)',
          animationDelay: '-6s',
        }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[30rem] w-[30rem] rounded-full blur-[140px] animate-aurora-drift"
        style={{
          background: 'rgb(var(--color-accent) / 0.07)',
          animationDelay: '-11s',
        }}
      />
    </div>
  )
}
