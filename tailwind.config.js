/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        game: ['Fredoka One', 'cursive'],
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-8px)' },
          '40%': { transform: 'translateX(8px)' },
          '60%': { transform: 'translateX(-6px)' },
          '80%': { transform: 'translateX(6px)' },
        },
        bounce_in: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fall: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(300px) rotate(20deg)', opacity: '0' },
        },
        rope_pulse: {
          '0%, 100%': { scaleY: '1' },
          '50%': { scaleY: '1.05' },
        },
        flash_correct: {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(34,197,94,0.3)' },
        },
        flash_wrong: {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(239,68,68,0.3)' },
        },
      },
      animation: {
        shake: 'shake 0.4s ease-in-out',
        bounce_in: 'bounce_in 0.4s ease-out',
        fall: 'fall 1s ease-in forwards',
        flash_correct: 'flash_correct 0.4s ease',
        flash_wrong: 'flash_wrong 0.4s ease',
      },
    },
  },
  plugins: [],
}
