/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans KR', 'sans-serif'],
        display: ['Jua', 'sans-serif'],
      },
      colors: {
        primary: '#F472B6', // Pink-400
        secondary: '#FB923C', // Orange-400
        accent: '#8B5CF6', // Violet-500
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'zoom-in': 'zoomIn 0.3s ease-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        zoomIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}