/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        page: 'var(--bg-page)',
        card: 'var(--bg-card)',
        soft: 'var(--bg-soft)',
        ink: {
          DEFAULT: 'var(--ink)',
          2: 'var(--ink-2)',
          muted: 'var(--ink-muted)',
          faint: 'var(--ink-faint)',
        },
        line: 'var(--line)',
        primary: {
          DEFAULT: 'var(--primary)',
          soft: 'var(--primary-soft)',
        },
        good: {
          DEFAULT: 'var(--good)',
          track: 'var(--good-track)',
        },
        bad: {
          DEFAULT: 'var(--bad)',
          track: 'var(--bad-track)',
        },
      },
      borderRadius: {
        frame: 'var(--radius-frame)',
        card: 'var(--radius-card)',
        pill: 'var(--radius-pill)',
        control: 'var(--radius-control)',
      },
      boxShadow: {
        frame: 'var(--shadow-frame)',
        card: 'var(--shadow-card)',
        pop: 'var(--shadow-pop)',
      },
    },
  },
  plugins: [],
};
