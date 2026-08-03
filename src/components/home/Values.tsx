'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { CONTEUDO_HOME as C } from '@/lib/conteudo-home';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { pa } from '@/lib/style-utils';
import type { MobileProps } from '@/components/home/types';

export function Values({ isMobile }: MobileProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

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
            className="mb-10 flex justify-center"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateY(20px)',
              transition: 'all 0.8s ease',
            }}
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
          className="mb-[72px]"
          style={{ opacity: visible ? 1 : 0, transition: 'all 0.7s ease' }}
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
            const isHov = hovered === i;
            return (
              <div
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '72px 1fr',
                  padding: '32px 40px 32px 0',
                  borderTop: `1px solid ${pa(10)}`,
                  borderRight: !isMobile && i % 2 === 0 ? `1px solid ${pa(10)}` : 'none',
                  paddingRight: !isMobile && i % 2 === 0 ? 40 : 0,
                  paddingLeft: !isMobile && i % 2 === 1 ? 40 : 0,
                  background: isHov ? pa(4) : 'transparent',
                  transition: 'background 0.25s',
                  cursor: 'default',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'none' : 'translateY(20px)',
                  transitionDelay: `${0.05 * i}s`,
                  transitionProperty: 'opacity, transform, background',
                  transitionDuration: '0.6s, 0.6s, 0.25s',
                }}
              >
                <div
                  className="select-none pt-1 font-serif text-5xl font-black leading-none tracking-[-0.04em] transition-colors duration-[250ms]"
                  style={{ color: isHov ? 'var(--primary)' : pa(13) }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3
                    className="mb-2.5 font-sans text-[clamp(14px,1.2vw,16px)] font-semibold leading-[1.8] transition-colors duration-[250ms]"
                    style={{ color: isHov ? 'var(--primary)' : 'var(--muted-fg)' }}
                  >
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
