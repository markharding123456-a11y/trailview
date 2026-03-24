/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        trail: {
          green: "#22c55e",
          blue: "#3b82f6",
          black: "#1e293b",
          red: "#ef4444",
        },
        brand: {
          dark: "#1A3550",
          mid: "#2B5A82",
          light: "#3B7AB5",
          bg: "#F4F7FA",
        },
      },
      animation: {
        'fade-in': 'fadeInUp 0.6s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
