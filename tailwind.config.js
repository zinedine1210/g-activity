/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  mode:"jit",
  theme: {
    extend: {
      colors:{
        basic:"#ffffff",
        primary:"#0891B2",
        secondary:"#D9D9D9",
        dark:"#18191A",
        darkPrimary:"#242526",
        darkSecondary:"#3A3B3C"
      }
    },
  },
  darkMode:"class",
  plugins: [],
}
