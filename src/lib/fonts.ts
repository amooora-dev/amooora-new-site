import { Playfair_Display, Rubik } from 'next/font/google';

/** Títulos de marca — Playfair Display */
export const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

/** Interface e corpo — Rubik Regular (+ pesos usados na UI) */
export const rubik = Rubik({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rubik',
  display: 'swap',
});

/** Para style={{ fontFamily: fontSans }} — stack com fallback se a variável Next ainda não carregou */
export const fontSans = 'var(--font-rubik, Rubik), Rubik, system-ui, sans-serif';
export const fontSerif = "var(--font-playfair, 'Playfair Display'), 'Playfair Display', Georgia, serif";
