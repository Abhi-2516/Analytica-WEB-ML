/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      keyframes: {
        'hero-pulse': {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(1.05)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        // --- ADD THIS SECTION ---
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // ------------------------
      },
      animation: {
        'hero-pulse': 'hero-pulse 8s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 15s ease infinite',
        // --- ADD THIS LINE ---
        'fade-in': 'fade-in 0.5s ease-out',
        // ---------------------
      },
    },
  },
  plugins: [],
};