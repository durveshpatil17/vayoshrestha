import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Open Sans',
          'Noto Sans Devanagari',
          'Noto Sans Kannada',
          'Noto Sans Tamil',
          ...defaultTheme.fontFamily.sans,
        ],
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
        informative: 'var(--informative)',
        'informative-tint': 'var(--informative-tint)',
      },
      borderRadius: {
        DEFAULT: '8px',
        control: '8px',
        container: '12px',
        sm: '4px',
        md: '8px',
        lg: '8px',
        xl: '12px',
        chip: '16px',
      },
      spacing: {
        '4.5': '18px',
        '13': '52px',
        '14': '56px',
        '64': '256px',
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
