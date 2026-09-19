/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Classic Windows 95/98 Palette
        'os-teal': '#008080',
        'os-gray': '#c0c0c0',
        'os-dark-gray': '#808080',
        'os-navy': '#000080',
        'os-text': '#000000',
        'os-white': '#ffffff',
        'os-black': '#000000',
      },
      fontFamily: {
        // 90s system fonts priority
        'sans': ['Tahoma', '"MS Sans Serif"', 'Arial', 'sans-serif'],
        'mono': ['"Courier New"', 'Courier', 'monospace'],
      },
      boxShadow: {
        // Classic 1px bevels (Outset for buttons/windows, Inset for inputs/depressed states)
        'retro-outset': 'inset 1px 1px #ffffff, inset -1px -1px #000000, inset 2px 2px #dfdfdf, inset -2px -2px #808080',
        'retro-inset': 'inset 1px 1px #000000, inset -1px -1px #ffffff, inset 2px 2px #808080, inset -2px -2px #dfdfdf',
      }
    },
  },
  plugins: [],
}