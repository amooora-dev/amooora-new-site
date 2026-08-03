'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CONTEUDO_HOME as C } from '@/lib/conteudo-home';
import { PrivacyModal } from '@/components/layout/PrivacyModal';
import { trackLinkClick } from '@/lib/analytics';
import { pa } from '@/lib/style-utils';

type SiteFooterProps = {
  isMobile: boolean;
  page?: 'home' | 'loja';
};

function footerHref(id: string, page: 'home' | 'loja') {
  if (!id) return '#';
  if (id === 'loja') return '/loja';
  return page === 'home' ? `#${id}` : `/#${id}`;
}

function FooterNavLink({ label, id, page }: { label: string; id: string; page: 'home' | 'loja' }) {
  if (id) {
    const href = footerHref(id, page);
    return (
      <Link
        href={href}
        className="mb-2 block font-sans text-sm text-white/60 no-underline transition-colors duration-200 hover:text-white"
        onClick={() => trackLinkClick({
          linkText: label,
          linkUrl: href,
          linkType: id === 'loja' || !href.includes('#') ? 'nav_route' : 'nav_anchor',
          location: 'footer',
          sectionId: id !== 'loja' ? id : undefined,
        })}
      >
        {label}
      </Link>
    );
  }
  return (
    <a href="#" className="mb-2 block font-sans text-sm text-white/60 no-underline transition-colors duration-200 hover:text-white">
      {label}
    </a>
  );
}

export function SiteFooter({ isMobile, page = 'home' }: SiteFooterProps) {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const navLinks = C.footer.navLinks;
  const navCol1 = navLinks.slice(0, 4);
  const navCol2 = navLinks.slice(4);

  return (
    <>
      <footer
        className="bg-primary text-white"
        style={{ padding: isMobile ? '40px 20px 20px' : '48px 48px 24px' }}
      >
        <div className="mx-auto" style={{ maxWidth: 1200 }}>
          <div
            className="grid"
            style={{
              gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
              gap: isMobile ? 28 : 40,
              marginBottom: isMobile ? 20 : 28,
            }}
          >
            {/* Coluna esquerda: logo + descrição + redes */}
            <div>
              <Image
                src="/images/logo.png"
                alt="Amooora"
                width={1984}
                height={1467}
                style={{ height: 52, width: 'auto', objectFit: 'contain', marginBottom: 12, filter: 'brightness(0) invert(1)' }}
              />
              <p className="max-w-[320px] font-sans text-sm font-light leading-[1.8] text-white/50">
                {C.footer.description}
              </p>

              <div
                className="flex flex-row flex-wrap items-center gap-4"
                style={{ marginTop: isMobile ? 24 : 16 }}
              >
                <a
                  href={C.footer.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-sans text-[12px] text-white/80 no-underline transition-opacity hover:opacity-100"
                  onClick={() => trackLinkClick({
                    linkText: C.footer.instagram,
                    linkUrl: C.footer.instagramUrl,
                    linkType: 'external',
                    location: 'footer_social',
                  })}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                  {C.footer.instagram}
                </a>

                <a
                  href={`mailto:${C.footer.email}`}
                  className="flex items-center gap-2 font-sans text-[12px] text-white/60 no-underline transition-colors hover:text-white"
                  onClick={() => trackLinkClick({
                    linkText: C.footer.email,
                    linkUrl: `mailto:${C.footer.email}`,
                    linkType: 'external',
                    location: 'footer_social',
                  })}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <polyline points="2,4 12,13 22,4" />
                  </svg>
                  {C.footer.email}
                </a>
              </div>
            </div>

            {/* Coluna direita: nav */}
            <div>
              <div className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.15em] text-white/30">
                {C.footer.navLabel}
              </div>
              <div className="grid gap-x-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
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
                    onClick={() => {
                      setPrivacyOpen(true);
                      trackLinkClick({
                        linkText: 'Política de Privacidade',
                        linkUrl: '/politica-de-cookies',
                        linkType: 'internal',
                        location: 'footer',
                      });
                    }}
                    className="mb-0 cursor-pointer border-none bg-transparent p-0 text-left font-sans text-sm text-white/60 transition-colors duration-200 hover:text-white"
                  >
                    Política de Privacidade
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.08]"
            style={{
              paddingTop: isMobile ? 16 : 20,
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              gap: isMobile ? 8 : 12,
            }}
          >
            <span className="font-sans text-xs text-white/30">{C.footer.copyright}</span>
            {!isMobile && (
              <span className="font-serif text-xs italic" style={{ color: 'var(--primary)', filter: 'brightness(1.4)', opacity: 0.6 }}>
                {C.footer.signature}
              </span>
            )}
          </div>
        </div>
      </footer>

      {privacyOpen && <PrivacyModal onClose={() => setPrivacyOpen(false)} />}
    </>
  );
}
