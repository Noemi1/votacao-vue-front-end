/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fiap-pink': {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#e91e63',
          600: '#c2185b',
          700: '#ad1457',
          800: '#880e4f',
          900: '#4a148c',
          950: '#2d0b3a',
        }
      }
    },
  },
  plugins: [],
} 