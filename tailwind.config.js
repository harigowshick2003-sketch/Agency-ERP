/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0f',
        surface: '#111118',
        surface2: '#18181f',
        border: '#2a2a35',
        accent: '#e8ff47',
        accent2: '#47c8ff',
        accent3: '#ff6b6b',
        accent4: '#a78bfa',
        muted: '#6b6b80',
        erp: {
          green: '#4ade80',
          red: '#f87171',
          yellow: '#fbbf24',
          blue: '#60a5fa',
        }
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
