export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burnt: {
          DEFAULT: '#C94F24',
          50: '#FDF6F3',
          100: '#FAE8E0',
          200: '#F5D1C1',
          300: '#E8A888',
          400: '#D67B4A',
          500: '#C94F24',
          600: '#A33F1D',
          700: '#7D2F16',
          800: '#571F0F',
          900: '#310F08',
        },
        charcoal: {
          DEFAULT: '#1A1A1A',
          50: '#F2F2F2',
          100: '#E5E5E5',
          200: '#CCCCCC',
          300: '#B3B3B3',
          400: '#808080',
          500: '#4D4D4D',
          600: '#333333',
          700: '#262626',
          800: '#1A1A1A',
          900: '#0D0D0D',
        },
        slate: {
          DEFAULT: '#7A8CA5',
          50: '#F4F5F7',
          100: '#E8EBF0',
          200: '#D1D7E1',
          300: '#AAB3C4',
          400: '#7A8CA5',
          500: '#5E7189',
          600: '#4A5A70',
          700: '#3B4758',
          800: '#2C3540',
          900: '#1D2328',
        },
        offwhite: '#F2F2F2',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.6s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
