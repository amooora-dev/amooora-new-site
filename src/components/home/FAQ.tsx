'use client';

import { useState, useEffect, useRef } from 'react';
import { CONTEUDO_HOME as C } from '@/lib/conteudo-home';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { pa } from '@/lib/style-utils';
import type { MobileProps } from '@/components/home/types';

export function FAQ({ isMobile }: MobileProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

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
          className="mb-6"
          style={{ opacity: visible ? 1 : 0, transition: 'all 0.7s ease' }}
        >
          <SectionLabel label={C.faq.label} />
        </div>

        <h2
          className="mb-14 font-serif text-[clamp(28px,3.5vw,48px)] font-black text-ink"
          style={{ opacity: visible ? 1 : 0, transition: 'all 0.7s 0.1s ease' }}
        >
          {C.faq.title}
        </h2>

        <div className="flex flex-col gap-0.5">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                style={{
                  borderTop: `1px solid ${pa(13)}`,
                  borderBottom: i === items.length - 1 ? `1px solid ${pa(13)}` : 'none',
                  opacity: visible ? 1 : 0,
                  transition: `all 0.6s ${0.05 * i}s ease`,
                }}
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
                  <span
                    className="flex shrink-0 items-center justify-center rounded-full text-lg font-light transition-all duration-[250ms]"
                    style={{
                      width: 28,
                      height: 28,
                      background: isOpen ? 'var(--primary)' : pa(8),
                      color: isOpen ? 'white' : 'var(--primary)',
                      transform: isOpen ? 'rotate(45deg)' : 'none',
                    }}
                  >+</span>
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
