/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Ajout de variables personnalisées pour RTL
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      fontFamily: {
        'syne': ['"Syne"', 'sans-serif'],
        'playfair': ['"Playfair Display"', 'serif'],
        'bbh': ['"BBH Hegarty"', 'sans-serif'],
      },
    },
  },
  plugins: [
    // Plugin pour supporter RTL automatiquement
    function({ addUtilities }) {
      addUtilities({
        '.text-start': {
          'text-align': 'start',
        },
        '.text-end': {
          'text-align': 'end',
        },
        '.float-start': {
          'float': 'start',
        },
        '.float-end': {
          'float': 'end',
        },
      });
    },
  ],
}
