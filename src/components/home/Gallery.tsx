"use client";

import { SectionLabel } from "@/components/ui/SectionLabel";
import { trackLinkClick } from "@/lib/analytics";
import { CONTEUDO_HOME as C } from "@/lib/conteudo-home";
import { useInViewReveal } from "@/lib/hooks/useInViewReveal";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { pa } from "@/lib/style-utils";
import Link from "next/link";
import type { CSSProperties } from "react";

export function Gallery() {
  const isMobile = useIsMobile();
  const { ref, visible } = useInViewReveal<HTMLElement>();

  const photos = C.gallery.photos;

  return (
    <section
      id='loja'
      ref={ref}
      className='bg-off-white'
      style={{ padding: isMobile ? "80px 0" : "120px 0" }}
    >
      <div
        className='mx-auto'
        style={{ maxWidth: 1200, padding: isMobile ? "0 20px" : "0 48px" }}
      >
        <div
          data-visible={visible}
          className='mb-12 opacity-0 transition-opacity duration-700 ease-out data-[visible=true]:opacity-100'
        >
          <div className='mb-6'>
            <SectionLabel label={C.gallery.label} />
          </div>
          <h2 className='font-serif text-[clamp(28px,3.5vw,50px)] font-black leading-[1.1] text-ink'>
            {C.gallery.title}
          </h2>
        </div>

        <div
          className='grid gap-3'
          style={{
            gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)",
            gridTemplateRows: isMobile ? "repeat(2, 200px)" : "280px",
          }}
        >
          {photos.map((src, i) => {
            const delay = `${(0.05 * i).toFixed(2)}s`;
            return (
              <div
                key={i}
                data-visible={visible}
                className='relative z-0 overflow-hidden rounded-2xl bg-muted opacity-0 scale-95 transition-all duration-700 ease-out [transition-delay:var(--delay)] hover:z-[2] hover:scale-[1.02] hover:shadow-[0_20px_60px_var(--hover-shadow)] data-[visible=true]:opacity-100 data-[visible=true]:scale-100'
                style={
                  {
                    "--delay": delay,
                    "--hover-shadow": pa(20),
                  } as CSSProperties
                }
              >
                <div
                  className='h-full w-full bg-cover bg-center'
                  style={{ backgroundImage: `url(${src})` }}
                />
              </div>
            );
          })}
        </div>

        <div
          data-visible={visible}
          className='mt-12 text-center opacity-0 transition-opacity duration-700 delay-500 ease-out data-[visible=true]:opacity-100'
        >
          <Link
            href={C.gallery.ctaUrl}
            className='inline-block rounded-full bg-primary px-8 py-3.5 font-sans text-[15px] font-semibold text-white no-underline transition-all duration-[250ms] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_var(--hover-shadow)]'
            style={
              {
                boxShadow: `0 8px 32px ${pa(27)}`,
                "--hover-shadow": pa(33),
              } as CSSProperties
            }
            onClick={() =>
              trackLinkClick({
                linkText: C.gallery.cta,
                linkUrl: C.gallery.ctaUrl,
                linkType: "nav_route",
                location: "home_gallery",
              })
            }
          >
            {C.gallery.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
