/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./Screen/**/*.{js,jsx,ts,tsx}",
    "./Screen/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#49739c",
          200: "#11D6CD",
          300: "#0d141c",
          400: "#4a6fa1",
        },
        secondary: {
          100: "#0071BD",
          200: "#e7edf4",
          300: "#259FB7",
          400: "#379eff",
        },
        erro: {
          100: "#FF0000",
          200: "#FF4D4D",
          300: "#FF9999",
        },
      },
    },
  },
  plugins: [],
};
