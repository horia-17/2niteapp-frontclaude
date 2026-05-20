/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          1: '#121212',
          2: '#18181B',
          3: '#27272A',
          4: '#3F3F46',
        },
        fg: {
          1: '#FFFFFF',
          2: '#D4D4D8',
          3: '#A1A1AA',
          4: '#71717A',
          5: '#52525B',
        },
        brand: {
          DEFAULT: '#5B1EDC',
          hover: '#6B2EE8',
          active: '#4F19C0',
          soft: '#8A38F5',
          glow: '#A77BFF',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#016FD0',
      },
      fontFamily: {
        sans: ['Unbounded', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        body: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'SF Mono', 'Roboto Mono', 'monospace'],
      },
      borderRadius: {
        pill: '999px',
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.2, 0, 0, 1)',
      },
    },
  },
  plugins: [],
};
