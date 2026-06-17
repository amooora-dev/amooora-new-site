'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CONTEUDO_HOME as C } from '@/lib/conteudo-home';

type SiteFooterProps = {
  accent: string;
  isMobile: boolean;
  page?: 'home' | 'loja';
};

function footerHref(id: string, page: 'home' | 'loja') {
  if (!id) return '#';
  if (id === 'loja') return '/loja';
  return page === 'home' ? `#${id}` : `/#${id}`;
}

function appLinkHref(label: string) {
  return label === 'Política de Privacidade' ? '/politica-de-cookies' : '#';
}

export function SiteFooter({ accent, isMobile, page = 'home' }: SiteFooterProps) {
  return (
    <footer style={{ background: 'var(--secondary)', color: 'white', padding: isMobile ? '56px 20px 28px' : '80px 48px 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr', gap: isMobile ? 36 : 60, marginBottom: 64 }}>
          <div>
            <Image
              src="/images/logo.png"
              alt="Amooora"
              width={1984}
              height={1467}
              style={{ height: 52, width: 'auto', objectFit: 'contain', marginBottom: 16, filter: 'brightness(0) invert(1)' }}
            />
            <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.8, maxWidth: 320, fontWeight: 300 }}>
              {C.footer.description}
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <a href={C.footer.instagramUrl} style={{
                fontFamily: "var(--sans)", fontSize: 12, color: 'white',
                textDecoration: 'none', opacity: 0.8 }}>{C.footer.instagram}</a>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
              <a href={`mailto:${C.footer.email}`} style={{
                fontFamily: "var(--sans)", fontSize: 12, color: 'rgba(255,255,255,0.5)',
                textDecoration: 'none' }}>{C.footer.email}</a>
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 11, fontWeight: 600,
              letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 20 }}>
              {C.footer.navLabel}
            </div>
            {C.footer.navLinks.map((link) =>
              link.id ? (
                <Link key={link.label} href={footerHref(link.id, page)} style={{ display: 'block', fontFamily: "var(--sans)",
                  fontSize: 14, color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
                  marginBottom: 12, transition: 'color 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}>
                  {link.label}
                </Link>
              ) : (
                <a key={link.label} href="#" style={{ display: 'block', fontFamily: "var(--sans)",
                  fontSize: 14, color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
                  marginBottom: 12, transition: 'color 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}>
                  {link.label}
                </a>
              )
            )}
          </div>
          <div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 11, fontWeight: 600,
              letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 20 }}>
              {C.footer.appLabel}
            </div>
            {C.footer.appLinks.map((l) => {
              const href = appLinkHref(l);

              return href.startsWith('/') ? (
                <Link key={l} href={href} style={{ display: 'block', fontFamily: "var(--sans)",
                  fontSize: 14, color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
                  marginBottom: 12, transition: 'color 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}>
                  {l}
                </Link>
              ) : (
                <a key={l} href={href} style={{ display: 'block', fontFamily: "var(--sans)",
                  fontSize: 14, color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
                  marginBottom: 12, transition: 'color 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}>
                  {l}
                </a>
              );
            })}
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 32,
          display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontFamily: "var(--sans)", fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
            {C.footer.copyright}
          </span>
          <span style={{ fontFamily: "var(--serif)", fontSize: 12, color: accent, fontStyle: 'italic', opacity: 0.6 }}>
            {C.footer.signature}
          </span>
        </div>
      </div>
    </footer>);
}
