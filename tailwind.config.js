/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neon: {
          blue: '#00D9FF',
          purple: '#B537F2',
          pink: '#FF2E97',
          green: '#00FF94',
        },
        dark: {
          900: '#0A0A0F',
          800: '#121218',
          700: '#1A1A24',
          600: '#24242F',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(0, 217, 255, 0.5)',
        'neon-purple': '0 0 20px rgba(181, 55, 242, 0.5)',
        'neon-pink': '0 0 20px rgba(255, 46, 151, 0.5)',
        'glow': '0 0 40px rgba(0, 217, 255, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 217, 255, 0.5), 0 0 20px rgba(0, 217, 255, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 217, 255, 0.8), 0 0 40px rgba(0, 217, 255, 0.5)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
