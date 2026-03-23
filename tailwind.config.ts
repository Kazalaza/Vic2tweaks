import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/renderer/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#090b12',
        foreground: '#e6ebff',
        card: '#0f1320',
        border: '#242b3d',
        accent: '#4f7cff',
        muted: '#9aa8d4'
      },
      boxShadow: {
        glow: '0 0 40px rgba(79, 124, 255, 0.25)'
      }
    }
  },
  plugins: []
} satisfies Config;
