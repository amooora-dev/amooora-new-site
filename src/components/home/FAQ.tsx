'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';
import { CONTEUDO_HOME as C } from '@/lib/conteudo-home';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { AccordionToggle } from '@/components/ui/AccordionToggle';
import { useInViewReveal } from '@/lib/hooks/useInViewReveal';
import { pa } from '@/lib/style-utils';
import type { MobileProps } from '@/components/home/types';

export function FAQ({ isMobile }: MobileProps) {
  const { ref, visible } = useInViewReveal<HTMLElement>();
  const [open, setOpen] = useState<number | null>(null);

  const items = C.faq.items;

  return (
    <section
      id="faq"
      ref={ref}
      className="bg-white"
      style={{ padding: isMobile ? '80px 0 24px' : '120px 0 32px' }}
    >
      <div
        className="mx-auto"
        style={{ maxWidth: 860, padding: isMobile ? '0 20px' : '0 48px' }}
      >
        <div
          data-visible={visible}
          className="mb-6 opacity-0 transition-opacity duration-700 ease-out data-[visible=true]:opacity-100"
        >
          <SectionLabel label={C.faq.label} />
        </div>

        <h2
          data-visible={visible}
          className="mb-14 font-serif text-[clamp(28px,3.5vw,48px)] font-black text-ink opacity-0 transition-opacity duration-700 delay-100 ease-out data-[visible=true]:opacity-100"
        >
          {C.faq.title}
        </h2>

        <div className="flex flex-col gap-0.5">
          {items.map((item, i) => {
            const isOpen = open === i;
            const delay = `${(0.05 * i).toFixed(2)}s`;
            return (
              <div
                key={i}
                data-visible={visible}
                className="opacity-0 transition-opacity duration-[600ms] ease-out [transition-delay:var(--delay)] data-[visible=true]:opacity-100"
                style={{
                  borderTop: `1px solid ${pa(13)}`,
                  borderBottom: i === items.length - 1 ? `1px solid ${pa(13)}` : 'none',
                  '--delay': delay,
                } as CSSProperties}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 border-none bg-transparent py-5 text-left"
                >
                  <span
                    className="font-sans text-[clamp(14px,1.2vw,16px)] font-semibold transition-colors duration-200"
                    style={{ color: isOpen ? 'var(--primary)' : 'var(--muted-fg)' }}
                  >
                    {item.q}
                  </span>
                  <AccordionToggle open={isOpen} />
                </button>

                {isOpen && (
                  <div className="animate-fadeUp pb-6 font-sans text-[15px] font-light leading-[1.8] text-muted-fg">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
