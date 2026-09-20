/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Design tokens are driven by CSS variables (see src/styles/tokens.css)
        // so the whole system can be themed from one place.
        background: 'rgb(var(--color-background) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        muted: {
          DEFAULT: 'rgb(var(--color-muted) / <alpha-value>)',
          foreground: 'rgb(var(--color-muted-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'rgb(var(--color-card) / <alpha-value>)',
          foreground: 'rgb(var(--color-card-foreground) / <alpha-value>)',
        },
        border: 'rgb(var(--color-border) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
          secondary: 'rgb(var(--color-accent-secondary) / <alpha-value>)',
          foreground: 'rgb(var(--color-on-accent) / <alpha-value>)',
        },
        destructive: 'rgb(var(--color-destructive) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
      },
      fontFamily: {
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        display: ['clamp(2.75rem, 8vw, 6.5rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        heading: ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        subheading: ['clamp(1.25rem, 2vw, 1.75rem)', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
      },
      spacing: {
        section: 'clamp(4rem, 10vw, 9rem)',
      },
      maxWidth: {
        container: '1200px',
        prose: '68ch',
      },
      borderRadius: {
        card: '1rem',
        pill: '9999px',
      },
      boxShadow: {
        glow: '0 0 0 1px rgb(var(--color-border) / 0.6), 0 8px 40px -12px rgb(var(--color-accent) / 0.35)',
        card: '0 1px 0 0 rgb(255 255 255 / 0.03) inset, 0 20px 50px -20px rgb(0 0 0 / 0.6)',
      },
      backgroundImage: {
        'grid-fade':
          'linear-gradient(to bottom, transparent, rgb(var(--color-background))), radial-gradient(rgb(var(--color-border) / 0.7) 1px, transparent 1px)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'border-flow': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        shimmer: 'shimmer 2s infinite',
        'border-flow': 'border-flow 6s ease infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
