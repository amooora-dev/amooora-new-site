'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { CONTEUDO_HOME as C } from '@/lib/conteudo-home';
import { TextWithBreaks } from '@/components/ui/TextWithBreaks';
import { PilotSignup } from '@/components/home/PilotSignup';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { pa } from '@/lib/style-utils';
import type { MobileProps } from '@/components/home/types';

type AppAccordionProps = {
  items: typeof C.app.items;
  open: number | null;
  setOpen: (index: number | null) => void;
  variant: 'desktop' | 'mobile';
};

function AppAccordion({ items, open, setOpen, variant }: AppAccordionProps) {
  const isMobileCard = variant === 'mobile';

  return (
    <div className={isMobileCard ? 'flex flex-col gap-3' : 'flex flex-col'}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            style={isMobileCard ? {
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 2px 12px rgba(96,16,59,0.06)',
              overflow: 'hidden',
            } : {
              borderTop: `1px solid ${pa(13)}`,
              borderBottom: i === items.length - 1 ? `1px solid ${pa(13)}` : 'none',
            }}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full cursor-pointer items-center justify-between gap-3 border-none bg-transparent text-left"
              style={{ padding: isMobileCard ? '18px 20px' : '18px 0' }}
            >
              <span
                className="font-sans text-[clamp(14px,1.2vw,16px)] font-semibold transition-colors duration-200"
                style={{ color: isOpen ? 'var(--primary)' : 'var(--muted-fg)' }}
              >
                {item.label}
              </span>
              <span
                className="flex shrink-0 items-center justify-center rounded-full text-lg font-light transition-all duration-[220ms]"
                style={{
                  width: 28, height: 28,
                  background: isOpen ? 'var(--primary)' : pa(8),
                  color: isOpen ? 'white' : 'var(--primary)',
                  transform: isOpen ? 'rotate(45deg)' : 'none',
                }}
              >+</span>
            </button>

            {isOpen && (
              <div
                className="animate-fadeUp"
                style={{ padding: isMobileCard ? '0 20px 20px' : '0 0 20px' }}
              >
                {item.blocks.map((b, bi) => (
                  <div
                    key={bi}
                    className="py-3.5 pl-4"
                    style={{
                      borderLeft: '2px solid var(--primary)',
                      marginBottom: bi < item.blocks.length - 1 ? 12 : 0,
                    }}
                  >
                    <p className="mb-1.5 font-sans text-[13px] font-semibold text-ink">{b.q}</p>
                    <p className="font-sans text-[13px] font-light leading-[1.7] text-muted-fg">{b.a}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function AppSection({ isMobile }: MobileProps) {
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

  const items = C.app.items;
  const introFull = C.app.intro.slice(0, 2);
  const introSplit = C.app.intro.slice(2);

  const sectionLabel = <div className="mb-6"><SectionLabel label={C.app.label} /></div>;

  const mockupImage = (
    <Image
      src="/images/app-mockup.png"
      alt="Amooora App"
      width={520}
      height={1040}
      style={{
        width: '100%',
        maxWidth: isMobile ? 320 : 520,
        height: 'auto',
        objectFit: 'contain',
        filter: isMobile ? 'none' : 'drop-shadow(0 32px 64px rgba(147,45,111,0.25))',
        animation: isMobile ? 'none' : 'floatY 5s ease-in-out infinite',
      }}
    />
  );

  if (isMobile) {
    const { mobile } = C.app;
    return (
      <section
        id="aplicativo"
        ref={ref}
        className="relative overflow-hidden bg-off-white"
        style={{ padding: '80px 0' }}
      >
        <div className="mx-auto" style={{ maxWidth: 1200, paddingInline: 20 }}>
          <div
            className="text-center"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateY(24px)',
              transition: 'all 0.7s ease',
            }}
          >
            <div className="mb-6 flex items-center justify-center gap-3">
              <SectionLabel label={C.app.label} centered />
            </div>

            <h2 className="mb-6 font-serif text-[clamp(28px,3.5vw,50px)] font-black leading-[1.1] text-ink">
              {C.app.title}
            </h2>

            <p className="mx-auto mb-10 font-sans text-[clamp(14px,1.2vw,16px)] font-light leading-[1.8] text-muted-fg" style={{ textAlign: 'center' }}>
              {mobile.intro}
            </p>

            <div className="mb-10 flex justify-center">{mockupImage}</div>

            <span
              className="mb-4 inline-block rounded-full font-sans text-sm font-semibold text-primary"
              style={{ background: pa(8), padding: '10px 22px' }}
            >
              {mobile.comingSoonTitle}
            </span>

            <p className="mb-10 font-sans text-[clamp(14px,1.2vw,16px)] font-light leading-[1.8] text-muted-fg" style={{ textAlign: 'center' }}>
              {mobile.comingSoonSubtitle}
            </p>
          </div>

          <div className="text-left">
            <h3 className="mb-5 font-sans text-[clamp(20px,4.5vw,24px)] font-extrabold leading-[1.2] text-ink">
              {mobile.offersTitle}
            </h3>
            <AppAccordion items={items} open={open} setOpen={setOpen} variant="mobile" />
            <PilotSignup isMobile={isMobile} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="aplicativo"
      ref={ref}
      className="relative overflow-hidden bg-off-white"
      style={{ padding: '120px 0' }}
    >
      <div className="mx-auto" style={{ maxWidth: 1200, paddingInline: 48 }}>
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(24px)',
            transition: 'all 0.7s ease',
          }}
        >
          {sectionLabel}
          <h2 className="mb-3 font-serif text-[clamp(28px,3.5vw,50px)] font-black leading-[1.1] text-ink">
            {C.app.title}
          </h2>
          {introFull.map((paragraph, i) => (
            <p
              key={i}
              className="mb-5 font-sans text-[clamp(14px,1.2vw,16px)] font-light leading-[1.8] text-muted-fg"
            >
              <TextWithBreaks text={paragraph} />
            </p>
          ))}
        </div>

        <div className="grid items-start" style={{ gridTemplateColumns: '1fr 1fr', gap: 80 }}>
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateY(24px)',
              transition: 'all 0.7s ease',
            }}
          >
            {introSplit.map((paragraph, i) => (
              <p
                key={i}
                className="font-sans text-[clamp(14px,1.2vw,16px)] font-light leading-[1.8] text-muted-fg"
                style={{ marginBottom: i === introSplit.length - 1 ? 40 : 20 }}
              >
                <TextWithBreaks text={paragraph} />
              </p>
            ))}
            <AppAccordion items={items} open={open} setOpen={setOpen} variant="desktop" />
            <PilotSignup isMobile={isMobile} />
          </div>

          <div
            className="flex items-start justify-center"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateX(40px)',
              transition: 'all 1s 0.2s ease',
            }}
          >
            {mockupImage}
          </div>
        </div>
      </div>
    </section>
  );
}
