/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A1A1A', // Rich black
          light: '#2A2A2A',
        },
        secondary: {
          DEFAULT: '#D4AF37', // Metallic gold
          light: '#E5C158',
        },
        accent: {
          DEFAULT: '#2E5D4B', // Deep forest green
          light: '#3A7561',
        },
        gray: {
          dark: '#333333',
          medium: '#666666',
          light: '#999999',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
};