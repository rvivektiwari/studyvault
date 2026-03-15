/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif']
      },
      colors: {
        primary: "#2563EB",
        bgsoft: "#F8FAFC",
        card: "#FFFFFF",
        borderSoft: "#E5E7EB"
      },
      boxShadow: {
        soft: "0 8px 24px rgba(0,0,0,0.06)",
        nav: "0 -6px 24px rgba(0,0,0,0.08)"
      },
      borderRadius: {
        card: "18px"
      }
    }
  },
  plugins: []
}
