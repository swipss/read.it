/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-dark": {
          DEFAULT: "#000",
        },
        "brand-brown": {
          DEFAULT: "#4F4F4F",
        },
        "brand-red": {
          DEFAULT: "#ff2255",
        },
        "brand-white": {
          DEFAULT: "#FEF4F4",
        },
      },
    },
  },
  plugins: [],
};
