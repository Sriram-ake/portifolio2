/**
 * Global ambient background:
 *   - a base wash
 *   - a slowly drifting grid (React Bits "Squares" feel)
 *   - a fading dot grid
 *   - three drifting aurora blobs (violet + cyan)
 *
 * Purely decorative, fixed behind all content, pointer-events-none. All motion
 * is paused under prefers-reduced-motion by the global CSS killswitch, leaving a
 * calm static gradient field.
 */
export function AuroraBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base wash */}
      <div className="absolute inset-0 bg-background" />

      {/* Slowly drifting line grid */}
      <div
        className="absolute inset-0 opacity-[0.35] animate-grid-move"
        style={{
          backgroundImage:
            'linear-gradient(rgb(var(--color-border) / 0.5) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--color-border) / 0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 0%, black, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 90% 70% at 50% 0%, black, transparent 80%)',
        }}
      />

      {/* Dot grid, fading toward the bottom */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            'radial-gradient(rgb(var(--color-border) / 0.7) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 10%, black, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 60% at 50% 10%, black, transparent 75%)',
        }}
      />

      {/* Aurora blobs */}
      <div
        className="absolute -top-48 left-1/4 h-[40rem] w-[40rem] rounded-full blur-[130px] animate-aurora-drift"
        style={{ background: 'rgb(var(--color-accent) / 0.16)' }}
      />
      <div
        className="absolute top-1/3 right-0 h-[34rem] w-[34rem] rounded-full blur-[130px] animate-aurora-drift"
        style={{
          background: 'rgb(var(--color-accent-secondary) / 0.14)',
          animationDelay: '-6s',
        }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[30rem] w-[30rem] rounded-full blur-[130px] animate-aurora-drift"
        style={{
          background: 'rgb(var(--color-accent) / 0.1)',
          animationDelay: '-11s',
        }}
      />
    </div>
  )
}
