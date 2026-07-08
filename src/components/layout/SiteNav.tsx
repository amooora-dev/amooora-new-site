'use client';

import { useState, useEffect, useCallback, type CSSProperties } from 'react';
import Link from 'next/link';
import { AmoooraLogoHeader } from '@/components/brand/AmoooraLogoHeader';
import { CONTEUDO_HOME as C } from '@/lib/conteudo-home';
import { trackLinkClick, type LinkClickLocation } from '@/lib/analytics';

type SiteNavProps = {
  accent: string;
  isMobile: boolean;
  dir?: 'A' | 'B';
  layout?: 'default' | 'hero';
  page?: 'home' | 'loja';
  /** Nav transparente sobre hero escuro (modelo 1 da loja) */
  navOverDark?: boolean;
};

type NavLinkId = (typeof C.nav.links)[number]['id'];

function navHref(id: string, page: 'home' | 'loja') {
  if (id === 'loja') return '/loja';
  return page === 'home' ? `#${id}` : `/#${id}`;
}

function HomeMenuIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 10.75 12 3l9 7.75" />
      <path d="M5.5 9.5V20h13V9.5" />
      <path d="M9.5 20v-6h5v6" />
    </svg>
  );
}

function NavIcon({ id, className = 'h-5 w-5' }: { id: NavLinkId; className?: string }) {
  const props = { className, fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 1.75, 'aria-hidden': true as const };

  switch (id) {
    case 'manifesto':
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    case 'aplicativo':
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    case 'valores':
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    case 'loja':
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      );
    case 'faq':
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    default:
      return null;
  }
}

function MenuToggleIcon({ open }: { open: boolean }) {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      {open ? (
        <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
      ) : (
        <>
          <path strokeLinecap="round" d="M4 7h16" />
          <path strokeLinecap="round" d="M4 12h16" />
          <path strokeLinecap="round" d="M4 17h16" />
        </>
      )}
    </svg>
  );
}

function navLinkType(id: string, href: string): 'nav_anchor' | 'nav_route' {
  return id === 'loja' || !href.includes('#') ? 'nav_route' : 'nav_anchor';
}

function trackNavLink(
  label: string,
  href: string,
  location: LinkClickLocation,
  sectionId?: string
) {
  trackLinkClick({
    linkText: label,
    linkUrl: href,
    linkType: navLinkType(sectionId ?? '', href),
    location,
    sectionId: sectionId && sectionId !== 'loja' ? sectionId : undefined,
  });
}

export function SiteNav({
  accent,
  isMobile,
  dir = 'A',
  layout = 'default',
  page = 'home',
  navOverDark,
}: SiteNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const closeMenu = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isMobile || !open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobile, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeMenu]);

  useEffect(() => {
    closeMenu();
  }, [page, closeMenu]);

  const overDarkHero = (navOverDark ?? page === 'loja') && page === 'loja' && !scrolled;
  const ctaHref = page === 'home' ? '#aplicativo' : '/#aplicativo';

  const navStyle: CSSProperties = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    background: overDarkHero
      ? 'transparent'
      : scrolled ? 'rgba(255,255,255,0.95)' : '#ffffff',
    backdropFilter: scrolled && !overDarkHero ? 'blur(12px)' : 'none',
    borderBottom: scrolled && !overDarkHero ? '1px solid rgba(109,40,217,0.1)' : 'none',
    transition: 'all 0.4s ease'
  };

  const logoHeight = isMobile ? 34 : 44;

  const links = C.nav.links;

  const trackNavItem = (link: (typeof links)[number], location: LinkClickLocation) => {
    trackNavLink(link.label, navHref(link.id, page), location, link.id);
  };

  const [ctaColor, setCtaColor] = useState('#932D6F');

  useEffect(() => {
    const sync = () => {
      setCtaColor(
        getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#932D6F'
      );
    };
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);

  const ctaButton = !isMobile ? (
    <Link href={ctaHref} style={{
      fontFamily: 'var(--font-rubik, Rubik), Rubik, system-ui, sans-serif',
      fontSize: 13,
      fontWeight: 600,
      background: ctaColor, color: 'white', padding: '10px 22px', borderRadius: 100,
      textDecoration: 'none', transition: 'transform 0.2s, box-shadow 0.2s',
      boxShadow: `0 4px 20px ${ctaColor}44`, whiteSpace: 'nowrap'
    }}
    onClick={() => trackNavLink(C.nav.ctaDownload, ctaHref, 'header_cta', 'aplicativo')}
    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 28px ${ctaColor}66`; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `0 4px 20px ${ctaColor}44`; }}>
      {C.nav.ctaDownload}
    </Link>
  ) : (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      aria-label={open ? 'Fechar menu' : 'Abrir menu'}
      aria-expanded={open}
      aria-controls="mobile-nav-drawer"
      style={{
        width: 44, height: 44, borderRadius: '50%',
        border: overDarkHero ? '1px solid rgba(255,255,255,0.6)' : `1px solid ${accent}44`,
        background: overDarkHero ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: overDarkHero ? '#ffffff' : accent, cursor: 'pointer'
      }}>
      <MenuToggleIcon open={open} />
    </button>
  );

  const linkStyle: CSSProperties = {
    fontFamily: 'var(--font-rubik, Rubik), Rubik, system-ui, sans-serif',
    fontSize: 14,
    fontWeight: 500,
    color: overDarkHero ? '#ffffff' : '#1a1a1a', textDecoration: 'none',
    opacity: overDarkHero ? 0.9 : 0.7, transition: 'opacity 0.2s', whiteSpace: 'nowrap'
  };

  return (
    <>
      <nav className="font-sans" style={navStyle} aria-label="Principal">
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
          <Link href="/" style={{ justifySelf: 'start', background: 'transparent', boxShadow: 'none' }} onClick={() => {
            closeMenu();
            trackNavLink('Amooora', '/', 'header_logo');
          }}>
            <AmoooraLogoHeader height={logoHeight} priority />
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
                  onClick={() => trackNavItem(link, 'header_desktop')}
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
                  onClick={() => trackNavItem(link, 'header_desktop')}
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
      </nav>

      {/* Mobile — drawer + overlay (padrão slide-in) */}
      {isMobile && (
        <div
          className={`fixed inset-0 z-[110] transition-opacity duration-300 ${
            open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          }`}
          aria-hidden={!open}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/45"
            aria-label="Fechar menu"
            tabIndex={open ? 0 : -1}
            onClick={closeMenu}
          />

          <div
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            className={`absolute right-0 top-0 flex h-full w-[min(100%,320px)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
              open ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
              <span className="font-sans text-sm font-semibold uppercase tracking-[0.15em] text-primary">
                Menu
              </span>
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Fechar menu"
                className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-primary/5"
              >
                <MenuToggleIcon open />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Seções do site">
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/"
                    onClick={() => {
                      closeMenu();
                      trackNavLink('Amooora', '/', 'header_mobile');
                    }}
                    className="flex min-h-[52px] items-center gap-3 rounded-xl px-3 font-sans text-[15px] font-medium text-ink transition hover:bg-primary/5 active:bg-primary/10"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <HomeMenuIcon className="h-5 w-5" />
                    </span>
                    Amooora
                  </Link>
                </li>
                {links.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={navHref(link.id, page)}
                      onClick={() => {
                        closeMenu();
                        trackNavItem(link, 'header_mobile');
                      }}
                      className="flex min-h-[52px] items-center gap-3 rounded-xl px-3 font-sans text-[15px] font-medium text-ink transition hover:bg-primary/5 active:bg-primary/10"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <NavIcon id={link.id} />
                      </span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-black/5 p-5">
              <Link
                href={ctaHref}
                onClick={() => {
                  closeMenu();
                  trackNavLink(C.nav.ctaDownload, ctaHref, 'header_cta', 'aplicativo');
                }}
                className="flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-primary font-sans text-sm font-semibold text-white shadow-md transition hover:brightness-95"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {C.nav.ctaDownload}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
