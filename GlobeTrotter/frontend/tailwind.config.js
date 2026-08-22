/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0B1120',
          900: '#0F172A',
          800: '#152238',
          700: '#1E293B'
        },
        brand: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1'
        },
        accent: {
          teal: '#14B8A6',
          amber: '#F59E0B',
          coral: '#FB7185'
        }
      },
      fontFamily: {
        display: ['"Poppins"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif']
      },
      boxShadow: {
        card: '0 4px 20px rgba(15, 23, 42, 0.08)',
        soft: '0 2px 10px rgba(15, 23, 42, 0.06)'
      },
      backgroundImage: {
        'sidebar-gradient': 'linear-gradient(180deg, #0F172A 0%, #152238 60%, #0EA5E9 260%)',
        'hero-gradient': 'linear-gradient(120deg, #0369A1 0%, #0EA5E9 50%, #14B8A6 100%)'
      }
    }
  },
  plugins: []
}
