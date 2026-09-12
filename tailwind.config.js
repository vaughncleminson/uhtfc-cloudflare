/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/app/**/*.{js,ts,jsx,tsx}', './src/frontend/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        success: {
          DEFAULT: '#a3e635',
          surface: '#4d7c0f',
        },
        danger: {
          DEFAULT: '#f87171',
          surface: '#b91c1c',
        },
        warning: {
          DEFAULT: '#fbbf24',
          surface: '#d97706',
        },
        info: {
          DEFAULT: '#38bdf8',
          surface: '#075985',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
