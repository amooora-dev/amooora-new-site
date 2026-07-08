'use client';

import { useState, type CSSProperties, type MouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CONTEUDO_HOME as C } from '@/lib/conteudo-home';
import { PrivacyModal } from '@/components/layout/PrivacyModal';
import { trackLinkClick } from '@/lib/analytics';

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

const linkStyle: CSSProperties = {
  display: 'block',
  fontFamily: 'var(--sans)',
  fontSize: 14,
  color: 'rgba(255,255,255,0.6)',
  textDecoration: 'none',
  marginBottom: 8,
  transition: 'color 0.2s',
};

function FooterNavLink({
  label,
  id,
  page,
}: {
  label: string;
  id: string;
  page: 'home' | 'loja';
}) {
  const hover = {
    onMouseEnter: (e: MouseEvent<HTMLElement>) => { e.currentTarget.style.color = 'white'; },
    onMouseLeave: (e: MouseEvent<HTMLElement>) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; },
  };

  if (id) {
    const href = footerHref(id, page);
    return (
      <Link
        href={href}
        style={linkStyle}
        onClick={() => trackLinkClick({
          linkText: label,
          linkUrl: href,
          linkType: id === 'loja' || !href.includes('#') ? 'nav_route' : 'nav_anchor',
          location: 'footer',
          sectionId: id !== 'loja' ? id : undefined,
        })}
        {...hover}
      >
        {label}
      </Link>
    );
  }

  return (
    <a href="#" style={linkStyle} {...hover}>
      {label}
    </a>
  );
}


export function SiteFooter({ accent, isMobile, page = 'home' }: SiteFooterProps) {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const navLinks = C.footer.navLinks;
  const navCol1 = navLinks.slice(0, 4);
  const navCol2 = navLinks.slice(4);

  return (<>
    <footer style={{ background: 'var(--primary)', color: 'white', padding: isMobile ? '40px 20px 20px' : '48px 48px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
          gap: isMobile ? 28 : 40,
          marginBottom: isMobile ? 20 : 28,
        }}>
          <div>
            <Image
              src="/images/logo.png"
              alt="Amooora"
              width={1984}
              height={1467}
              style={{ height: 52, width: 'auto', objectFit: 'contain', marginBottom: 12, filter: 'brightness(0) invert(1)' }}
            />
            <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.8, maxWidth: 320, fontWeight: 300 }}>
              {C.footer.description}
            </p>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 16,
              marginTop: isMobile ? 24 : 16,
            }}>
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
            <div style={{ fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>
              {C.footer.navLabel}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
              <div>
                {navCol1.map((link) => (
                  <FooterNavLink key={link.label} label={link.label} id={link.id} page={page} />
                ))}
              </div>
              <div>
                {navCol2.map((link) => (
                  <FooterNavLink key={link.label} label={link.label} id={link.id} page={page} />
                ))}
                <button
                  onClick={() => setPrivacyOpen(true)}
                  style={{
                    ...linkStyle,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    textAlign: 'left',
                    marginBottom: 0,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                >
                  Política de Privacidade
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: isMobile ? 16 : 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          flexDirection: isMobile ? 'column' : 'row',
          flexWrap: 'wrap',
          gap: isMobile ? 8 : 12,
        }}>
          <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
            {C.footer.copyright}
          </span>
          {!isMobile && (
            <span style={{ fontFamily: 'var(--serif)', fontSize: 12, color: accent, fontStyle: 'italic', opacity: 0.6 }}>
              {C.footer.signature}
            </span>
          )}
        </div>
      </div>
    </footer>

    {privacyOpen && <PrivacyModal onClose={() => setPrivacyOpen(false)} />}
    </>);
}
