/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          bg: 'var(--bg-primary)',
          sidebar: 'var(--bg-sidebar)',
          card: 'var(--bg-card)',
          cardHover: 'var(--bg-card-hover)',
          elevated: 'var(--bg-elevated)',
          border: 'var(--border-color)',
          borderLight: 'var(--border-light)',
          text: 'var(--text-primary)',
          muted: 'var(--text-muted)',
          subtle: 'var(--text-subtle)',
          emerald: '#10B981',
          emeraldHover: '#059669',
          emeraldMuted: 'rgba(16, 185, 129, 0.12)',
          blue: '#3B82F6',
          blueHover: '#2563EB',
          blueMuted: 'rgba(59, 130, 246, 0.12)',
          purple: '#8B5CF6',
          purpleMuted: 'rgba(139, 92, 246, 0.12)',
          rose: '#F43F5E',
          roseMuted: 'rgba(244, 63, 94, 0.12)',
          amber: '#F59E0B',
          amberMuted: 'rgba(245, 158, 11, 0.12)',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'card': 'var(--card-shadow)',
        'elevated': 'var(--card-shadow-elevated)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.25)',
        'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.25)',
      },
      borderRadius: {
        'card': '14px',
      }
    },
  },
  plugins: [],
}
