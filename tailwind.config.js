/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'noise-pattern': "url('data:image/png;base64,idata64')",
        'scan-lines': `repeating-linear-gradient(
          0deg,
          rgba(255,255,255,0.1) 0px,
          rgba(255,255,255,0.1) 1px,
          transparent 1px,
          transparent 2px
        )`,
        'crt-curve': `radial-gradient(
          circle at center,
          transparent 0%,
          rgba(0,0,0,0.2) 100%
        )`,
        'phosphor': `radial-gradient(
          circle at center,
          rgba(139,220,164,0.1) 0%,
          transparent 100%
        )`
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slideUp': 'slideUp 0.1s ease-out',
        'fadeIn': 'fadeIn 0.1s ease-out',
        'blink': 'blink 1s step-end infinite',
        'flash': 'flash 0.05s linear',
        'crt-flash': 'crt-flash 600ms ease-out',
        'scanline': 'scanline 500ms ease-out',
        'scanline-delayed': 'scanline 500ms ease-out 100ms',
        'color-shift': 'color-shift 400ms ease-out',
        'color-shift-delayed': 'color-shift 400ms ease-out 50ms',
        'phosphor': 'phosphor 1.2s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' }
        },
        flash: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'crt-flash': {
          '0%': { opacity: '0' },
          '10%': { opacity: '1' },
          '20%': { opacity: '0.7' },
          '30%': { opacity: '0.9' },
          '40%': { opacity: '0.4' },
          '50%': { opacity: '0.7' },
          '60%': { opacity: '0.3' },
          '70%': { opacity: '0.5' },
          '80%': { opacity: '0.2' },
          '100%': { opacity: '0' },
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)', opacity: '0.5' },
          '50%': { opacity: '0.7' },
          '100%': { transform: 'translateY(100%)', opacity: '0.3' },
        },
        'color-shift': {
          '0%': { transform: 'translateX(-15px)', opacity: '0.7' },
          '30%': { transform: 'translateX(10px)', opacity: '0.6' },
          '60%': { transform: 'translateX(-5px)', opacity: '0.4' },
          '100%': { transform: 'translateX(0)', opacity: '0' },
        },
        'phosphor': {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.1)' },
          '100%': { opacity: '0', transform: 'scale(1.2)' },
        },
      },
      fontSize: {
        '10': '10px',
        '11': '11px',
      }
    }
  },
  plugins: [],
};
