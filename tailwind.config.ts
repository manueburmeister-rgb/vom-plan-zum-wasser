import type { Config } from 'tailwindcss'

const config: Config = {
  // Dark Mode ist fix aktiv (siehe app/layout.tsx html class="dark"),
  // aber 'class' lässt uns die Option offen für später.
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx,md,mdx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Ocean — dunkle Hintergründe
        ocean: {
          deep: '#0A1929',
          mid: '#0F2540',
          shallow: '#1E293B',
        },
        // Wing-Pink — Brand-Hauptfarbe (matcht den pinken Wing im Titelbild)
        wing: {
          DEFAULT: '#EC4899',
          50: '#FDF2F8',
          100: '#FCE7F3',
          400: '#F472B6',
          500: '#EC4899',
          600: '#DB2777',
        },
        // Water-Cyan — technische Akzentfarbe
        water: {
          DEFAULT: '#06B6D4',
          light: '#22D3EE',
        },
        // Semantic
        success: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',
        // Text
        ink: {
          primary: '#F8FAFC',
          muted: '#94A3B8',
        },
        // Strukturlinien
        line: '#1E293B',
        // Code / Mono-Bereiche
        code: '#0F172A',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        headline: ['var(--font-headline)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        prose: '72ch',
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
