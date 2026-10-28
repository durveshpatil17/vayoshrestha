import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans', 'Noto Sans Devanagari', 'Noto Sans Kannada', 'Noto Sans Tamil', ...defaultTheme.fontFamily.sans],
        serif: ['Source Serif 4', 'IBM Plex Sans', ...defaultTheme.fontFamily.serif],
      },
      colors: {
        canvas:    'var(--canvas)',
        surface:   'var(--surface)',
        'surface-subtle': 'var(--surface-subtle)',
        'surface-hover':  'var(--surface-hover)',
        'surface-selected': 'var(--surface-selected)',
        border:    'var(--border)',
        'border-subtle': 'var(--border-subtle)',
        'border-strong': 'var(--border-strong)',
        text:      'var(--text)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        'text-disabled': 'var(--text-disabled)',
        accent:    'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        'accent-tint':  'var(--accent-tint)',
        negative:  'var(--negative)',
        'negative-tint': 'var(--negative-tint)',
        critical:  'var(--critical)',
        'critical-tint': 'var(--critical-tint)',
        positive:  'var(--positive)',
        'positive-tint': 'var(--positive-tint)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius-md)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      spacing: {
        '4.5': '18px',
        '13': '52px',
        '14': '56px',
        '62': '248px',
      },
      boxShadow: {
        popover: 'var(--shadow-popover)',
        drawer:  'var(--shadow-drawer)',
        none: 'none',
      },
    },
  },
  plugins: [],
};
