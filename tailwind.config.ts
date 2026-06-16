import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F6E56',
          dark: '#085041',
          light: '#E1F5EE',
        },
        neutral: {
          900: '#1A1A1A',
          500: '#666666',
          300: '#AAAAAA',
          100: '#E4E4E4',
        },
        surface: '#F7FAF9',
        amber: '#EF9F27',
        danger: '#E24B4A',
        info: {
          DEFAULT: '#185FA5',
          light: '#E6F1FB',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'Arial', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['"Courier New"', 'monospace'],
      },
      maxWidth: {
        site: '1280px',
      },
      borderRadius: {
        sm: '4px',
        md: '7px',
        lg: '10px',
        xl: '20px',
      },
      boxShadow: {
        'card': '0 1px 4px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.04)',
        'modal': '0 8px 32px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
}
export default config
