/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['"Inter"', 'sans-serif'],
      heading: ['"Outfit"', 'sans-serif'],
    },
    extend: {
      colors: {
        paper: {
          DEFAULT: '#ffffff',
          dark: '#000000',
        },
        ink: {
          DEFAULT: '#111827',
          light: '#f3f4f6',
        },
        pencil: '#9ca3af',
      },
      gridTemplateColumns: {
        '15': 'repeat(15, minmax(0, 1fr))',
        '31': 'repeat(31, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
}
