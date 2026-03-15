/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#0D6EFD',
        secondary: '#00C2FF',
        dark: '#0A2540',
        light: '#F5F7FA',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(90deg, #0D6EFD, #00C2FF)',
        'gradient-brand-135': 'linear-gradient(135deg, #0D6EFD, #00C2FF)',
      },
      boxShadow: {
        card: '0 10px 40px rgba(0,0,0,0.1)',
        'card-hover': '0 20px 60px rgba(13,110,253,0.2)',
        'btn-glow': '0 0 20px rgba(13,110,253,0.5)',
      },
      borderRadius: {
        xl2: '12px',
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'float-delayed': 'float 4s ease-in-out 1s infinite',
        'slide-infinite': 'slideInfinite 30s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        slideInfinite: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
