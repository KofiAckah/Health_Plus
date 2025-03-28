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
          100: "#191512",
          200: "#f46e0b",
          300: "#7e7e7e",
          400: "#262626",
          500: "#011627",
          600: "#8966be",
          700: "#4a86ff",
        },
      },
    },
  },
  plugins: [],
};
