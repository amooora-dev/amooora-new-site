import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        tertiary: 'var(--tertiary)',
        muted: 'var(--muted)',
        'muted-fg': 'var(--muted-fg)',
        white: 'var(--white)',
        'off-white': 'var(--off-white)',
        ink: 'var(--ink)',
        'ink-mid': 'var(--ink-mid)',
        'ink-soft': 'var(--ink-soft)',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-rubik)', 'Rubik', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        floatY: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.6' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.8s ease both',
        fadeIn: 'fadeIn 0.6s ease both',
        floatY: 'floatY 5s ease-in-out infinite',
        marquee: 'marquee 18s linear infinite',
        'pulse-ring': 'pulse-ring 1s ease-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
