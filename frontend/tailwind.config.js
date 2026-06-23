/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Emerald — Growth, Charity, Trust
        emerald: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        brand: {
          DEFAULT: '#0F766E',
          hover:   '#115E59',
          light:   '#F0FDFA',
        },
        // Secondary Blue — Technology, Reliability
        blue: {
          DEFAULT: '#2563EB',
          hover:   '#1D4ED8',
          light:   '#EFF6FF',
        },
        // Reward Gold — Prizes, Jackpot, Winning
        gold: {
          DEFAULT: '#F59E0B',
          hover:   '#D97706',
          light:   '#FFFBEB',
        },
        // Status Colors
        success: '#22C55E',
        danger:  '#EF4444',
        warning: '#F59E0B',
        // Backgrounds
        surface: {
          DEFAULT: '#F8FAFC',
          card:    '#FFFFFF',
        },
        // Text
        ink: {
          DEFAULT: '#0F172A',
          muted:   '#64748B',
          subtle:  '#94A3B8',
        },
        // Borders
        border: '#E2E8F0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        card:    '0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.07)',
        elevated:'0 4px 16px 0 rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.05)',
        brand:   '0 4px 14px 0 rgba(15,118,110,0.25)',
        gold:    '0 4px 14px 0 rgba(245,158,11,0.30)',
      },
      backgroundImage: {
        'hero-gradient':    'linear-gradient(135deg, #0F766E 0%, #2563EB 100%)',
        'card-gradient':    'linear-gradient(135deg, #f0fdfa 0%, #eff6ff 100%)',
        'gold-gradient':    'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        'dark-gradient':    'linear-gradient(135deg, #0F766E 0%, #1e3a5f 100%)',
      },
      animation: {
        'fade-in':      'fadeIn 0.5s ease-out',
        'slide-up':     'slideUp 0.4s ease-out',
        'scale-in':     'scaleIn 0.3s ease-out',
        'pulse-gold':   'pulseGold 2s ease-in-out infinite',
        'count-up':     'countUp 1s ease-out',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn:   { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } },
        pulseGold: { '0%, 100%': { boxShadow: '0 0 0 0 rgba(245,158,11,0)' }, '50%': { boxShadow: '0 0 20px 6px rgba(245,158,11,0.3)' } },
      },
      borderRadius: {
        'xl':  '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
