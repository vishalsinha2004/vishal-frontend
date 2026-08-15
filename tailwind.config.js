/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'space-black': '#050505',
        'space-dark': '#121212',
        'space-gray': '#2A2A2A',
        'space-white': '#E0E0E0',
        'thruster-blue': '#005288', // classic SpaceX blue
        'thruster-glow': '#4FC3F7',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'], // Gives that clean, modern tech feel
        'mono': ['Fira Code', 'monospace'], // For terminal/code elements
      },
      // Now correctly inside the 'extend' block!
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.2s ease-out',
      }
    },
  },
  plugins: [],
}