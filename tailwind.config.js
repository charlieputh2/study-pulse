/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
        // Minimalist Study Pulse Theme
        'theme-bg': '#FFFFFF',      // White
        'theme-text': '#1A1A1A',    // Soft Black
        'theme-accent': '#1A1A1A',  // Black for primary actions
        'theme-secondary': '#F0E6D2', // Beige

        // Mapping standard colors to the new theme for compatibility
        primary: {
          50: '#FFFFFF',
          100: '#F9F9F9',
          200: '#F0E6D2', // Beige
          300: '#E0D0B0',
          400: '#C0B090',
          500: '#1A1A1A', // Dark
          600: '#151515',
          700: '#101010',
          800: '#0A0A0A',
          900: '#000000',
        },
        // Deprecating gold but mapping to secondary/accent to prevent breaks
        gold: {
          50: '#FBF8F1',
          100: '#F7F1E3',
          200: '#EBDCB9',
          300: '#DFC790',
          400: '#D4AF37', // Classic Metallic Gold
          500: '#B89628',
          600: '#A08020',
          700: '#806018',
          800: '#604812',
          900: '#40300C',
        },
        accent: {
          light: '#F0E6D2', // Beige
          DEFAULT: '#00008B', // Dark Blue
          dark: '#000066',
          white: '#ffffff',
          black: '#1A1A1A',
          navy: '#00008B', // Dark Blue
        },
        navy: {
          50: '#e6e6f5',
          100: '#cccceb',
          200: '#9999d6',
          300: '#6666c2',
          400: '#3333ad',
          500: '#0000a0',
          600: '#000099',
          700: '#00008B', // Dark Blue (main)
          800: '#000070',
          900: '#000055', // Darkest
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.03)',
        'medium': '0 4px 15px rgba(0, 0, 0, 0.05)',
        'hover': '0 8px 25px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-out',
        'slideIn': 'slideIn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(5px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
