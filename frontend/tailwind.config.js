/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'oklch(var(--brand-50) / <alpha-value>)',
          100: 'oklch(var(--brand-100) / <alpha-value>)',
          200: 'oklch(var(--brand-200) / <alpha-value>)',
          300: 'oklch(var(--brand-300) / <alpha-value>)',
          400: 'oklch(var(--brand-400) / <alpha-value>)',
          500: 'oklch(var(--brand-500) / <alpha-value>)',
          600: 'oklch(var(--brand-600) / <alpha-value>)',
          700: 'oklch(var(--brand-700) / <alpha-value>)',
          800: 'oklch(var(--brand-800) / <alpha-value>)',
          900: 'oklch(var(--brand-900) / <alpha-value>)',
          950: 'oklch(var(--brand-950) / <alpha-value>)',
        },
        surface: {
          light: {
            canvas: 'oklch(var(--background) / <alpha-value>)',
            subtle: 'oklch(var(--muted) / <alpha-value>)',
            card: 'oklch(var(--card) / <alpha-value>)',
            elevated: 'oklch(var(--popover) / <alpha-value>)',
            border: 'oklch(var(--border) / <alpha-value>)',
            borderHover: 'oklch(0.8200 0.0200 74.6428 / <alpha-value>)',
          },
          dark: {
            canvas: 'oklch(var(--background) / <alpha-value>)',
            subtle: 'oklch(var(--muted) / <alpha-value>)',
            card: 'oklch(var(--card) / <alpha-value>)',
            elevated: 'oklch(var(--popover) / <alpha-value>)',
            border: 'oklch(var(--border) / <alpha-value>)',
            borderHover: 'oklch(0.5000 0.0300 145.0000 / <alpha-value>)',
          }
        },
        slate: {
          50: 'oklch(var(--slate-50) / <alpha-value>)',
          100: 'oklch(var(--slate-100) / <alpha-value>)',
          200: 'oklch(var(--slate-200) / <alpha-value>)',
          300: 'oklch(var(--slate-300) / <alpha-value>)',
          400: 'oklch(var(--slate-400) / <alpha-value>)',
          500: 'oklch(var(--slate-500) / <alpha-value>)',
          600: 'oklch(var(--slate-600) / <alpha-value>)',
          700: 'oklch(var(--slate-700) / <alpha-value>)',
          800: 'oklch(var(--slate-800) / <alpha-value>)',
          900: 'oklch(var(--slate-900) / <alpha-value>)',
          950: 'oklch(var(--slate-950) / <alpha-value>)',
        },
        // Semantic status mappings
        status: {
          open: {
            bg: 'oklch(var(--status-open) / 0.12)',
            text: 'oklch(var(--status-open))',
            border: 'oklch(var(--status-open) / 0.28)',
            dot: 'oklch(var(--status-open))',
          },
          inProgress: {
            bg: 'oklch(var(--status-progress) / 0.12)',
            text: 'oklch(var(--status-progress))',
            border: 'oklch(var(--status-progress) / 0.28)',
            dot: 'oklch(var(--status-progress))',
          },
          resolved: {
            bg: 'oklch(var(--status-resolved) / 0.12)',
            text: 'oklch(var(--status-resolved))',
            border: 'oklch(var(--status-resolved) / 0.28)',
            dot: 'oklch(var(--status-resolved))',
          }
        },
        priority: {
          high: {
            bg: 'oklch(var(--priority-high) / 0.12)',
            text: 'oklch(var(--priority-high))',
            border: 'oklch(var(--priority-high) / 0.28)',
          },
          medium: {
            bg: 'oklch(var(--priority-medium) / 0.12)',
            text: 'oklch(var(--priority-medium))',
            border: 'oklch(var(--priority-medium) / 0.28)',
          },
          low: {
            bg: 'oklch(var(--priority-low) / 0.12)',
            text: 'oklch(var(--priority-low))',
            border: 'oklch(var(--priority-low) / 0.28)',
          }
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        mono: ['Source Code Pro', 'monospace'],
      },
      fontSize: {
        'display-xl': ['3.25rem', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display-lg': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.025em', fontWeight: '750' }],
        'heading-xl': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'heading-lg': ['1.5rem', { lineHeight: '1.25', letterSpacing: '-0.015em', fontWeight: '650' }],
        'heading-md': ['1.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'heading-sm': ['1.0625rem', { lineHeight: '1.35', letterSpacing: '-0.005em', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '-0.005em', fontWeight: '400' }],
        'body-md': ['0.9375rem', { lineHeight: '1.55', letterSpacing: '0', fontWeight: '400' }],
        'body-sm': ['0.8125rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        'label-lg': ['0.9375rem', { lineHeight: '1.4', letterSpacing: '-0.005em', fontWeight: '500' }],
        'label-md': ['0.8125rem', { lineHeight: '1.35', letterSpacing: '0', fontWeight: '550' }],
        'label-sm': ['0.75rem', { lineHeight: '1.3', letterSpacing: '0.02em', fontWeight: '600' }],
        'caption': ['0.6875rem', { lineHeight: '1.25', letterSpacing: '0.02em', fontWeight: '500' }],
      },
      borderRadius: {
        'xs': '6px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 12px 28px -4px rgba(0, 0, 0, 0.09), 0 6px 12px -2px rgba(0, 0, 0, 0.04)',
        'dark-card': '0 0 0 1px rgba(255, 255, 255, 0.06), 0 8px 20px -4px rgba(0, 0, 0, 0.5)',
      },
      transitionTimingFunction: {
        'spring-subtle': 'cubic-bezier(0.16, 1, 0.3, 1)',
      }
    },
  },
  plugins: [],
}
