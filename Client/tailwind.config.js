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
          100: "#FF4242",
          200: "#DBD053",
          300: "#7e7e7e",
          400: "#ECCFC3",
          500: "#1C7C54",
          600: "#73E2A7",
          700: "#4a86ff",
          800: "#f26a8d",
        },
      },
    },
  },
  plugins: [],
};
