/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--canvas)',
        surface: {
          DEFAULT: 'var(--surface)',
          subtle: 'var(--surface-subtle)',
          hover: 'var(--surface-hover)',
          selected: 'var(--surface-selected)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
        },
        text: {
          DEFAULT: 'var(--text)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
          disabled: 'var(--text-disabled)',
          'on-accent': 'var(--text-on-accent)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          active: 'var(--accent-active)',
          tint: 'var(--accent-tint)',
        },
        focus: {
          ring: 'var(--focus-ring)',
        },
        positive: {
          DEFAULT: 'var(--positive)',
          tint: 'var(--positive-tint)',
        },
        critical: {
          DEFAULT: 'var(--critical)',
          tint: 'var(--critical-tint)',
        },
        negative: {
          DEFAULT: 'var(--negative)',
          tint: 'var(--negative-tint)',
        },
        informative: {
          DEFAULT: 'var(--informative)',
          tint: 'var(--informative-tint)',
        },
        chart: {
          1: 'var(--chart-1)',
          2: 'var(--chart-2)',
          3: 'var(--chart-3)',
          4: 'var(--chart-4)',
          5: 'var(--chart-5)',
          6: 'var(--chart-6)',
          grid: 'var(--chart-grid)',
        },
      },
      borderRadius: {
        control: 'var(--radius-control)',
        card: 'var(--radius-card)',
        chip: 'var(--radius-chip)',
      },
      boxShadow: {
        xs: 'none',
        menu: 'var(--shadow-menu)',
        dialog: 'var(--shadow-dialog)',
      },
      fontFamily: {
        sans: [
          '"Open Sans"',
          '"Noto Sans Devanagari"',
          '"Noto Sans Kannada"',
          '"Noto Sans Tamil"',
          'system-ui',
          'sans-serif',
        ],
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        5: 'var(--space-5)',
        6: 'var(--space-6)',
        8: 'var(--space-8)',
        10: 'var(--space-10)',
      },
    },
  },
  plugins: [],
};
