'use client';

import type { CSSProperties } from 'react';
import Image from 'next/image';
import { CONTEUDO_HOME as C } from '@/lib/conteudo-home';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SectionShell } from '@/components/ui/SectionShell';
import { useInViewReveal } from '@/lib/hooks/useInViewReveal';
import type { MobileProps } from '@/components/home/types';

export function Values({ isMobile }: MobileProps) {
  const { ref, visible } = useInViewReveal<HTMLElement>();

  const vals = C.values.items;

  return (
    <section id="valores" ref={ref} className="section-pad overflow-hidden bg-white">
      <SectionShell>
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
              className="h-auto w-full max-w-[280px] object-contain md:max-w-[360px]"
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

        <div className={`grid gap-0 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {vals.map((v, i) => {
            const delay = `${(0.05 * i).toFixed(2)}s`;
            const isLeftCol = !isMobile && i % 2 === 0;
            const isRightCol = !isMobile && i % 2 === 1;
            return (
              <div
                key={i}
                data-visible={visible}
                className={`group grid cursor-default grid-cols-[72px_1fr] border-t border-primary-10 py-8 opacity-0 translate-y-5 transition-[opacity,transform,background-color] duration-[600ms] ease-out [transition-delay:var(--delay)] hover:bg-primary-4 data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100 ${
                  isLeftCol ? 'border-r border-primary-10 pr-10 pl-0' : ''
                } ${isRightCol ? 'pr-0 pl-10' : 'pr-10 pl-0'}`}
                style={{ '--delay': delay } as CSSProperties}
              >
                <div className="select-none pt-1 font-serif text-5xl font-black leading-none tracking-[-0.04em] text-primary-13 transition-colors duration-[250ms] group-hover:text-primary">
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
      </SectionShell>
    </section>
  );
}
