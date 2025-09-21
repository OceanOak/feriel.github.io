/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./elm-src/**/*.elm",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'kodemono': ['Kode Mono', 'monospace'],
        'assistant': ['Assistant', 'sans-serif'],
        'firacode': ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
