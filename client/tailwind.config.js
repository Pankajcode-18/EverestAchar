/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        himalayan: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#0f2c20', // Deep Mountain Forest
          950: '#071811', // Dark Himalayan Night
        },
        ruby: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c', // Royal Ruby Red
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        crimson: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        mountainSlate: '#f8fafc',
        mountainCard: '#ffffff',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        nepali: ['Hind', 'Mukta', 'system-ui', 'sans-serif'],
        serif: ['Cinzel', 'Playfair Display', 'serif'],
      },
      boxShadow: {
        'premium': '0 10px 30px -5px rgba(15, 44, 32, 0.08), 0 4px 6px -2px rgba(15, 44, 32, 0.04)',
        'premium-hover': '0 20px 40px -10px rgba(15, 44, 32, 0.16), 0 8px 12px -4px rgba(15, 44, 32, 0.08)',
        'glow-ruby': '0 0 25px rgba(225, 29, 72, 0.35)',
        'glow-emerald': '0 0 25px rgba(22, 163, 74, 0.35)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.03)' },
        }
      }
    },
  },
  plugins: [],
}
