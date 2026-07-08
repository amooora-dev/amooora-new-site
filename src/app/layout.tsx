import type { Metadata, Viewport } from 'next';
import { playfair, rubik } from '@/lib/fonts';
import { CookieConsentBanner } from '@/components/layout/CookieConsentBanner';
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider';
import { getMetadataBase, SEO, toAbsoluteUrl } from '@/lib/seo';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: SEO.defaultTitle,
    template: '%s',
  },
  description: SEO.defaultDescription,
  applicationName: SEO.siteName,
  authors: [{ name: SEO.siteName, url: getMetadataBase() }],
  creator: SEO.siteName,
  publisher: SEO.siteName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: SEO.locale,
    url: getMetadataBase(),
    siteName: SEO.siteName,
    title: SEO.defaultTitle,
    description: SEO.defaultDescription,
    images: [{ url: toAbsoluteUrl(SEO.defaultOgImage), alt: SEO.defaultTitle }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO.defaultTitle,
    description: SEO.defaultDescription,
    images: [toAbsoluteUrl(SEO.defaultOgImage)],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: SEO.logoPath,
    apple: SEO.logoPath,
  },
};

export const viewport: Viewport = {
  themeColor: '#932D6F',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${rubik.variable}`}>
      <body className={`${rubik.className} font-sans min-h-screen antialiased`}>
        {children}
        <AnalyticsProvider />
        <CookieConsentBanner />
      </body>
    </html>
  );
}
