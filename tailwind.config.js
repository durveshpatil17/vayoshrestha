/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: 'var(--color-bg-base)',
          subtle: 'var(--color-bg-subtle)',
          active: 'var(--color-bg-active)',
        },
        border: {
          hairline: 'var(--color-border-hairline)',
          strong: 'var(--color-border-strong)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          muted: 'var(--color-text-muted)',
          disabled: 'var(--color-text-disabled)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          tint: 'var(--color-accent-tint)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          bg: 'var(--color-success-bg)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          bg: 'var(--color-warning-bg)',
        },
        danger: {
          DEFAULT: 'var(--color-danger)',
          bg: 'var(--color-danger-bg)',
        },
        info: {
          DEFAULT: 'var(--color-info)',
          bg: 'var(--color-info-bg)',
        },
        chart: {
          forest: 'var(--color-chart-forest)',
          ochre: 'var(--color-chart-ochre)',
          terracotta: 'var(--color-chart-terracotta)',
          slate: 'var(--color-chart-slate)',
          olive: 'var(--color-chart-olive)',
          sand: 'var(--color-chart-sand)',
        },
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'serif'],
        sans: ['"IBM Plex Sans"', '"Noto Sans Devanagari"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '6px',
        tag: '4px',
      },
    },
  },
  plugins: [],
};
