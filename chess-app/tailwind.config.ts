import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#161512',
        'bg-secondary': '#262421',
        'bg-tertiary': '#2d2b28',
        'board-light': '#f0d9b5',
        'board-dark': '#b58863',
        'accent': '#759900',
      },
    },
  },
  plugins: [],
}

export default config