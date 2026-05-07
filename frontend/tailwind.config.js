/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        "primary-hover": "#4f46e5",
        "bg-dark": "#0f172a",
        "bg-card": "rgba(30, 41, 59, 0.7)",
        "text-muted": "#94a3b8",
        "text-main": "#f8fafc",
      }
    },
  },
  plugins: [],
}
