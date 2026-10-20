/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          dark: '#0a361f',
          sidebar: '#0d4a2b',
          sidebarHover: '#135c36',
          primary: '#15803d',
          primaryHover: '#166534',
          accent: '#22c55e',
          light: '#f0fdf4',
          badge: '#dcfce7',
          surface: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
        }
      }
    },
  },
  plugins: [],
}
