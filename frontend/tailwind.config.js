/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf6f6',
          100: '#fbebeb',
          200: '#f8dcdb',
          300: '#f2c1c0',
          400: '#e89e9d',
          500: '#db7876',
          600: '#c55856',
          700: '#a54442',
          800: '#893b39',
          900: '#723432',
        },
        nude: {
          50: '#faf7f5',
          100: '#f4ece7',
          200: '#e9dad0',
          300: '#dbbead',
          400: '#c89b83',
          500: '#b87e62',
          600: '#aa6c51',
          700: '#8e5640',
          800: '#734737',
          900: '#5e3c30',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
