export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif']
      },
      colors: {
        primary: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8'
        },
        surface: '#F8FAFC',
        card:    '#FFFFFF',
        border:  '#E5E7EB'
      },
      boxShadow: {
        card:  '0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
        soft:  '0 8px 24px rgba(0,0,0,0.08)',
        fab:   '0 6px 24px rgba(37,99,235,0.40)',
        nav:   '0 -4px 20px rgba(0,0,0,0.07)'
      },
      borderRadius: {
        card: '18px',
        fab:  '9999px'
      },
      spacing: {
        nav:    '64px',
        safe:   'env(safe-area-inset-bottom)'
      }
    }
  },
  plugins: []
}
