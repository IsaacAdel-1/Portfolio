import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#060a14',
        bgsoft: '#0a1120',
        surface: '#0a1020',
        cobalt: {
          DEFAULT: '#378add',
          bright: '#4f9eef',
        },
        ink: '#eaf3ff',
        muted: '#8fb3d9',
        faint: '#5b8fd0',
        positive: '#3dff88',
        negative: '#ff6b6b',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'sans-serif'],
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        pulse2: {
          '0%':   { boxShadow: '0 0 0 0 rgba(58,209,122,0.5)' },
          '70%':  { boxShadow: '0 0 0 8px rgba(58,209,122,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(58,209,122,0)' },
        },
      },
      animation: {
        pulse2: 'pulse2 2s infinite',
      },
    },
  },
  plugins: [],
};

export default config;
