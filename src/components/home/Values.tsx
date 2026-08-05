'use client';

import type { CSSProperties } from 'react';
import Image from 'next/image';
import { CONTEUDO_HOME as C } from '@/lib/conteudo-home';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { useInViewReveal } from '@/lib/hooks/useInViewReveal';
import { pa } from '@/lib/style-utils';
import type { MobileProps } from '@/components/home/types';

export function Values({ isMobile }: MobileProps) {
  const { ref, visible } = useInViewReveal<HTMLElement>();

  const vals = C.values.items;

  return (
    <section
      id="valores"
      ref={ref}
      className="overflow-hidden bg-white"
      style={{ padding: isMobile ? '80px 0' : '120px 0' }}
    >
      <div
        className="mx-auto"
        style={{ maxWidth: 1200, padding: isMobile ? '0 20px' : '0 48px' }}
      >
        {isMobile && C.values.image && (
          <div
            data-visible={visible}
            className="mb-10 flex justify-center opacity-0 translate-y-5 transition-all duration-[800ms] ease-out data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0"
          >
            <Image
              src={C.values.image}
              alt="Nossos Valores Amooora"
              width={360}
              height={360}
              style={{
                width: '100%',
                maxWidth: isMobile ? 280 : 360,
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          </div>
        )}

        <div
          data-visible={visible}
          className="mb-[72px] opacity-0 transition-opacity duration-700 ease-out data-[visible=true]:opacity-100"
        >
          <div className="mb-5">
            <SectionLabel label={C.values.label} />
          </div>
          <h2 className="font-serif text-[clamp(32px,4vw,56px)] font-black leading-[1.1] text-ink">
            {C.values.titleLine1}
          </h2>
        </div>

        <div
          className="grid"
          style={{ gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 0 }}
        >
          {vals.map((v, i) => {
            const delay = `${(0.05 * i).toFixed(2)}s`;
            return (
              <div
                key={i}
                data-visible={visible}
                className="group grid opacity-0 translate-y-5 cursor-default transition-[opacity,transform] duration-[600ms] ease-out [transition-delay:var(--delay)] hover:bg-[var(--hover-bg)] data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0"
                style={{
                  gridTemplateColumns: '72px 1fr',
                  padding: '32px 40px 32px 0',
                  borderTop: `1px solid ${pa(10)}`,
                  borderRight: !isMobile && i % 2 === 0 ? `1px solid ${pa(10)}` : 'none',
                  paddingRight: !isMobile && i % 2 === 0 ? 40 : 0,
                  paddingLeft: !isMobile && i % 2 === 1 ? 40 : 0,
                  '--delay': delay,
                  '--hover-bg': pa(4),
                } as CSSProperties}
              >
                <div
                  className="select-none pt-1 font-serif text-5xl font-black leading-none tracking-[-0.04em] text-[var(--num-color)] transition-colors duration-[250ms] group-hover:text-primary"
                  style={{ '--num-color': pa(13) } as CSSProperties}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3 className="mb-2.5 font-sans text-[clamp(14px,1.2vw,16px)] font-semibold leading-[1.8] text-muted-fg transition-colors duration-[250ms] group-hover:text-primary">
                    {v.title}
                  </h3>
                  <p className="font-sans text-sm font-light leading-[1.75] text-muted-fg">
                    {v.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
