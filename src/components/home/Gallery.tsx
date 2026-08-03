'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { CONTEUDO_HOME as C } from '@/lib/conteudo-home';
import { trackLinkClick } from '@/lib/analytics';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { pa } from '@/lib/style-utils';
import type { MobileProps } from '@/components/home/types';

export function Gallery({ isMobile }: MobileProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const photos = C.gallery.photos;

  return (
    <section
      id="loja"
      ref={ref}
      className="bg-off-white"
      style={{ padding: isMobile ? '80px 0' : '120px 0' }}
    >
      <div
        className="mx-auto"
        style={{ maxWidth: 1200, padding: isMobile ? '0 20px' : '0 48px' }}
      >
        <div
          className="mb-12"
          style={{ opacity: visible ? 1 : 0, transition: 'all 0.7s ease' }}
        >
          <div className="mb-6">
            <SectionLabel label={C.gallery.label} />
          </div>
          <h2 className="font-serif text-[clamp(28px,3.5vw,50px)] font-black leading-[1.1] text-ink">
            {C.gallery.title}
          </h2>
        </div>

        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
            gridTemplateRows: isMobile ? 'repeat(2, 200px)' : '280px',
          }}
        >
          {photos.map((src, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl bg-muted"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'none' : 'scale(0.96)',
                transition: `all 0.7s ${0.05 * i}s ease`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.zIndex = '2';
                e.currentTarget.style.boxShadow = `0 20px 60px ${pa(20)}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.zIndex = '';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${src})` }}
              />
            </div>
          ))}
        </div>

        <div
          className="mt-12 text-center"
          style={{ opacity: visible ? 1 : 0, transition: 'all 0.7s 0.5s ease' }}
        >
          <Link
            href={C.gallery.ctaUrl}
            className="inline-block rounded-full bg-primary font-sans text-[15px] font-semibold text-white no-underline transition-all duration-[250ms]"
            style={{ padding: '14px 32px', boxShadow: `0 8px 32px ${pa(27)}` }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 12px 40px ${pa(33)}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = `0 8px 32px ${pa(27)}`;
            }}
            onClick={() => trackLinkClick({
              linkText: C.gallery.cta,
              linkUrl: C.gallery.ctaUrl,
              linkType: 'nav_route',
              location: 'home_gallery',
            })}
          >
            {C.gallery.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
