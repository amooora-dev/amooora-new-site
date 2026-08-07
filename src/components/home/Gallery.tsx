'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { CONTEUDO_HOME as C } from '@/lib/conteudo-home';
import { trackLinkClick } from '@/lib/analytics';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SectionShell } from '@/components/ui/SectionShell';
import { useInViewReveal } from '@/lib/hooks/useInViewReveal';
import type { MobileProps } from '@/components/home/types';

export function Gallery({ isMobile }: MobileProps) {
  const { ref, visible } = useInViewReveal<HTMLElement>();

  const photos = C.gallery.photos;

  return (
    <section id="loja" ref={ref} className="section-pad bg-off-white">
      <SectionShell>
        <div
          data-visible={visible}
          className="mb-12 opacity-0 transition-opacity duration-700 ease-out data-[visible=true]:opacity-100"
        >
          <div className="mb-6">
            <SectionLabel label={C.gallery.label} />
          </div>
          <h2 className="font-serif text-[clamp(28px,3.5vw,50px)] font-black leading-[1.1] text-ink">
            {C.gallery.title}
          </h2>
        </div>

        <div
          className={`grid gap-3 ${
            isMobile
              ? 'grid-cols-2 grid-rows-[repeat(2,200px)]'
              : 'grid-cols-4 grid-rows-[280px]'
          }`}
        >
          {photos.map((src, i) => {
            const delay = `${(0.05 * i).toFixed(2)}s`;
            return (
              <div
                key={i}
                data-visible={visible}
                className="relative z-0 scale-95 overflow-hidden rounded-2xl bg-muted opacity-0 transition-all duration-700 ease-out [transition-delay:var(--delay)] hover:z-[2] hover:scale-[1.02] hover:shadow-primary-photo data-[visible=true]:scale-100 data-[visible=true]:opacity-100"
                style={{ '--delay': delay } as CSSProperties}
              >
                <div
                  className="h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${src})` }}
                />
              </div>
            );
          })}
        </div>

        <div
          data-visible={visible}
          className="mt-12 text-center opacity-0 transition-opacity duration-700 delay-500 ease-out data-[visible=true]:opacity-100"
        >
          <Link
            href={C.gallery.ctaUrl}
            className="inline-block rounded-full bg-primary px-8 py-3.5 font-sans text-[15px] font-semibold text-white no-underline shadow-primary-cta transition-all duration-[250ms] hover:-translate-y-0.5 hover:shadow-primary-cta-hover"
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
      </SectionShell>
    </section>
  );
}
