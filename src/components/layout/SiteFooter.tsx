'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CONTEUDO_HOME as C } from '@/lib/conteudo-home';
import { PrivacyModal } from '@/components/layout/PrivacyModal';

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


export function SiteFooter({ accent, isMobile, page = 'home' }: SiteFooterProps) {
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (<>
    <footer style={{ background: 'var(--primary)', color: 'white', padding: isMobile ? '56px 20px 28px' : '80px 48px 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: isMobile ? 36 : 60, marginBottom: 64 }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
              <a href={C.footer.instagramUrl} target="_blank" rel="noopener noreferrer" style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: "var(--sans)", fontSize: 12, color: 'white',
                textDecoration: 'none', opacity: 0.8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
                {C.footer.instagram}
              </a>
              <a href={`mailto:${C.footer.email}`} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: "var(--sans)", fontSize: 12, color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <polyline points="2,4 12,13 22,4"/>
                </svg>
                {C.footer.email}
              </a>
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
            <button
              onClick={() => setPrivacyOpen(true)}
              style={{
                display: 'block', fontFamily: 'var(--sans)',
                fontSize: 14, color: 'rgba(255,255,255,0.6)',
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 0, marginBottom: 12, textAlign: 'left',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
            >
              Política de Privacidade
            </button>
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
    </footer>

    {privacyOpen && <PrivacyModal onClose={() => setPrivacyOpen(false)} />}
    </>);
}
