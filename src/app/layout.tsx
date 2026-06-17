import type { Metadata, Viewport } from 'next';
import { playfair, rubik } from '@/lib/fonts';
import { CookieConsentBanner } from '@/components/layout/CookieConsentBanner';
import './globals.css';

export const metadata: Metadata = {
  title: 'Amooora — Um mundo inteiro de acolhimento e liberdade',
  description:
    'Somos a plataforma referência para a comunidade sáfica. Chegamos para somar, criar e espalhar conteúdo, informação e serviços com a nossa cara.',
};

export const viewport: Viewport = {
  themeColor: '#932D6F',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${rubik.variable}`}>
      <body className={`${rubik.className} font-sans min-h-screen antialiased`}>
        {children}
        <CookieConsentBanner />
      </body>
    </html>
  );
}
