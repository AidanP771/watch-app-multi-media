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
      },
      fontSize: {
        'base': ['16px', '1.5'],
        'lg': ['18px', '1.625'],
        'xl': ['20px', '1.75'],
        '2xl': ['24px', '1.875'],
        '3xl': ['30px', '2'],
        '4xl': ['36px', '2.25'],
        '5xl': ['48px', '2.5'],
        '6xl': ['60px', '1.2'],
        '7xl': ['72px', '1.2'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      minHeight: {
        'screen-dynamic': ['100vh', '100dvh'],
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
};