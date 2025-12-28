/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#0f1115",
        accent: "#9b87f5",
        subtle: "#1a1d24",
      },
      boxShadow: {
        card: "0 10px 40px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
};
