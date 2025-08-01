import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'Inter', 'Arial', 'Helvetica', 'sans-serif'],
        mono: ['Geist Mono', 'Menlo', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
