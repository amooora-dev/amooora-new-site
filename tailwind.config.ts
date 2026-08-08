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
        primary: {
          DEFAULT: 'var(--primary)',
          2: 'var(--primary-2)',
          4: 'var(--primary-4)',
          8: 'var(--primary-8)',
          10: 'var(--primary-10)',
          13: 'var(--primary-13)',
          20: 'var(--primary-20)',
          27: 'var(--primary-27)',
          33: 'var(--primary-33)',
          40: 'var(--primary-40)',
        },
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
      boxShadow: {
        'primary-cta': '0 8px 32px var(--primary-27)',
        'primary-cta-hover': '0 12px 40px var(--primary-33)',
        'primary-nav': '0 4px 20px var(--primary-27)',
        'primary-nav-hover': '0 8px 28px var(--primary-40)',
        'primary-card': '0 2px 12px var(--primary-8)',
        'primary-photo': '0 20px 60px var(--primary-20)',
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
