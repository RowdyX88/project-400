/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx,html}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          950: '#0f172a',
        },
      },
    },
  },
  plugins: [],
};
