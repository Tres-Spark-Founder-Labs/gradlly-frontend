import type { Config } from 'tailwindcss';

export const baseConfig: Config = {
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        skeleton: 'skeleton 1.5s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        modal: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#dce5ff',
          500: '#3b62f6',
          600: '#2d52e8',
          700: '#1e3ecc',
          900: '#0d1f6e',
        },
        error: { DEFAULT: '#dc2626', light: '#fee2e2' },
        info: { DEFAULT: '#0284c7', light: '#e0f2fe' },
        portal: {
          accent: 'var(--portal-accent)',
          'accent-fg': 'var(--portal-accent-fg)',
          header: 'var(--portal-header-bg)',
          sidebar: 'var(--portal-sidebar-bg)',
        },
        success: { DEFAULT: '#16a34a', light: '#dcfce7' },
        surface: {
          0: '#ffffff',
          1: '#f8fafc',
          2: '#f1f5f9',
          3: '#e2e8f0',
        },
        warning: { DEFAULT: '#d97706', light: '#fef3c7' },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        skeleton: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.5' } },
        slideUp: {
          from: { transform: 'translateY(8px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
    },
  },
  plugins: [],
};
