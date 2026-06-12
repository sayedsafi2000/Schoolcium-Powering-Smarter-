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
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',  // teal-500
          600: '#0d9488',  // teal-600 — primary
          700: '#0f766e',  // teal-700
          800: '#115e59',  // teal-800
          900: '#134e4a',  // teal-900
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'clay':    '0 4px 24px -4px rgba(0,0,0,0.08), 0 2px 8px -2px rgba(0,0,0,0.04)',
        'clay-lg': '0 8px 40px -8px rgba(0,0,0,0.14), 0 4px 16px -4px rgba(0,0,0,0.06)',
        'glow-teal': '0 0 40px rgba(13,148,136,0.3)',
      },
    },
  },
  plugins: [],
}
