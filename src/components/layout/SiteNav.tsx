'use client';

import { useState, useEffect, type CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CONTEUDO_HOME as C } from '@/lib/conteudo-home';

type SiteNavProps = {
  accent: string;
  isMobile: boolean;
  dir?: 'A' | 'B';
  layout?: 'default' | 'hero';
  page?: 'home' | 'loja';
};

function navHref(id: string, page: 'home' | 'loja') {
  if (id === 'loja') return '/loja';
  return page === 'home' ? `#${id}` : `/#${id}`;
}

export function SiteNav({
  accent,
  isMobile,
  dir = 'A',
  layout = 'default',
  page = 'home',
}: SiteNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const overDarkHero = page === 'loja' && !scrolled;

  const navStyle: CSSProperties = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    background: overDarkHero
      ? 'transparent'
      : scrolled ? 'rgba(255,255,255,0.95)' : '#ffffff',
    backdropFilter: scrolled && !overDarkHero ? 'blur(12px)' : 'none',
    borderBottom: scrolled && !overDarkHero ? '1px solid rgba(109,40,217,0.1)' : 'none',
    transition: 'all 0.4s ease'
  };

  const logoStyle: CSSProperties = {
    height: isMobile ? 34 : 44,
    objectFit: 'contain',
    cursor: 'pointer',
    display: 'block'
  };

  const links = C.nav.links;

  const ctaButton = !isMobile ? (
    <Link href={page === 'home' ? '#aplicativo' : '/#aplicativo'} style={{
      fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600,
      background: accent, color: 'white', padding: '10px 22px', borderRadius: 100,
      textDecoration: 'none', transition: 'transform 0.2s, box-shadow 0.2s',
      boxShadow: `0 4px 20px ${accent}44`, whiteSpace: 'nowrap'
    }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 28px ${accent}66`; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `0 4px 20px ${accent}44`; }}>
      {C.nav.ctaDownload}
    </Link>
  ) : (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      aria-label="Abrir menu"
      style={{
        width: 40, height: 40, borderRadius: '50%',
        border: overDarkHero ? '1px solid rgba(255,255,255,0.6)' : `1px solid ${accent}44`,
        background: overDarkHero ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: overDarkHero ? '#ffffff' : accent, cursor: 'pointer'
      }}>
      <span style={{ fontSize: 20, lineHeight: 1 }}>{open ? '×' : '☰'}</span>
    </button>
  );

  const linkStyle: CSSProperties = {
    fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500,
    color: overDarkHero ? '#ffffff' : '#1a1a1a', textDecoration: 'none',
    opacity: overDarkHero ? 0.9 : 0.7, transition: 'opacity 0.2s', whiteSpace: 'nowrap'
  };

  return (
    <nav style={navStyle}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: scrolled
          ? (isMobile ? '12px 16px' : '14px 48px')
          : (isMobile ? '16px 16px' : '20px 48px'),
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr auto' : 'auto 1fr auto',
        alignItems: 'center',
        gap: isMobile ? 12 : 32,
        position: 'relative',
      }}>
        <Link href="/" style={{ justifySelf: 'start' }}>
          <Image
            src="/images/logo-header.png"
            alt="Amooora"
            width={1024}
            height={404}
            priority
            style={{ ...logoStyle, width: 'auto' }}
          />
        </Link>

        {!isMobile && layout === 'hero' && (
          <div style={{
            display: 'flex',
            gap: 28,
            alignItems: 'center',
            justifyContent: 'center',
            justifySelf: 'center',
          }}>
            {links.map((link) =>
              <Link key={link.id}
                href={navHref(link.id, page)}
                style={linkStyle}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7'; }}>
                {link.label}
              </Link>
            )}
          </div>
        )}

        {!isMobile && layout === 'default' && (
          <div style={{ display: 'flex', gap: 28, alignItems: 'center', justifySelf: 'end', gridColumn: '2 / -1' }}>
            {links.map((link) =>
              <Link key={link.id}
                href={navHref(link.id, page)}
                style={{ ...linkStyle, whiteSpace: 'normal' }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7'; }}>
                {link.label}
              </Link>
            )}
            {ctaButton}
          </div>
        )}

        {(isMobile || layout === 'hero') && (
          <div style={{ justifySelf: 'end' }}>{ctaButton}</div>
        )}
      </div>

      {isMobile && open &&
      <div style={{
        position: 'absolute', top: 'calc(100% + 8px)', right: 16,
        background: 'rgba(255,255,255,0.98)',
        border: `1px solid ${accent}22`,
        borderRadius: 14,
        padding: '12px 14px',
        display: 'flex', flexDirection: 'column', gap: 10,
        boxShadow: '0 10px 30px rgba(0,0,0,0.12)'
      }}>
          {links.map((link) =>
        <Link key={link.id}
        href={navHref(link.id, page)}
        onClick={() => setOpen(false)}
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 14,
          fontWeight: 600,
          color: '#1a1a1a',
          textDecoration: 'none'
        }}>
              {link.label}
            </Link>
        )}
        </div>
      }
    </nav>);
}
