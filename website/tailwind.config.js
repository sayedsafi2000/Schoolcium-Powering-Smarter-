/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          50:  '#f0fdf6',
          100: '#dcfce9',
          200: '#bbf7d2',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',   // primary green
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'clay':    '0 4px 24px -4px rgba(0,0,0,0.08), 0 2px 8px -2px rgba(0,0,0,0.04)',
        'clay-lg': '0 8px 40px -8px rgba(0,0,0,0.14), 0 4px 16px -4px rgba(0,0,0,0.06)',
        'glow-green': '0 0 30px rgba(22,163,74,0.25)',
      },
    },
  },
  plugins: [],
}
