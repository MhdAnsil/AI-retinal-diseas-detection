/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#0f172a', // slate-900
        'brand-surface': '#1e293b', // slate-800
        'brand-border': '#334155', // slate-700
        'brand-text-light': '#cbd5e1', // slate-300
        'brand-text-heading': '#f1f5f9', // slate-100
        'brand-accent': '#3b82f6', // blue-500
        'brand-accent-hover': '#2563eb', // blue-600
        'brand-yellow': '#facc15', // yellow-400
        'brand-orange': '#f97316', // orange-500
      },
    },
  },
  plugins: [],
}
