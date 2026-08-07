'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CONTEUDO_HOME as C } from '@/lib/conteudo-home';
import { TextWithBreaks } from '@/components/ui/TextWithBreaks';
import { PilotSignup } from '@/components/home/PilotSignup';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { AccordionToggle } from '@/components/ui/AccordionToggle';
import { SectionShell } from '@/components/ui/SectionShell';
import { useInViewReveal } from '@/lib/hooks/useInViewReveal';
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
        const isLast = i === items.length - 1;
        return (
          <div
            key={i}
            className={
              isMobileCard
                ? 'overflow-hidden rounded-xl bg-white shadow-primary-card'
                : `border-t border-primary-13 ${isLast ? 'border-b border-primary-13' : ''}`
            }
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className={`flex w-full cursor-pointer items-center justify-between gap-3 border-none bg-transparent text-left ${
                isMobileCard ? 'px-5 py-[18px]' : 'px-0 py-[18px]'
              }`}
            >
              <span
                data-open={isOpen}
                className="font-sans text-[clamp(14px,1.2vw,16px)] font-semibold text-muted-fg transition-colors duration-200 data-[open=true]:text-primary"
              >
                {item.label}
              </span>
              <AccordionToggle open={isOpen} />
            </button>

            {isOpen && (
              <div className={`animate-fadeUp ${isMobileCard ? 'px-5 pb-5' : 'px-0 pb-5'}`}>
                {item.blocks.map((b, bi) => (
                  <div
                    key={bi}
                    className={`border-l-2 border-primary py-3.5 pl-4 ${
                      bi < item.blocks.length - 1 ? 'mb-3' : 'mb-0'
                    }`}
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
  const { ref, visible } = useInViewReveal<HTMLElement>();
  const [open, setOpen] = useState<number | null>(null);

  const items = C.app.items;
  const introFull = C.app.intro.slice(0, 2);
  const introSplit = C.app.intro.slice(2);

  const sectionLabel = (
    <div className="mb-6">
      <SectionLabel label={C.app.label} />
    </div>
  );

  const mockupImage = (
    <Image
      src="/images/app-mockup.png"
      alt="Amooora App"
      width={520}
      height={1040}
      className={`h-auto w-full object-contain ${
        isMobile
          ? 'max-w-[320px]'
          : 'max-w-[520px] animate-floatY drop-shadow-[0_32px_64px_rgba(147,45,111,0.25)]'
      }`}
    />
  );

  if (isMobile) {
    const { mobile } = C.app;
    return (
      <section id="aplicativo" ref={ref} className="section-pad relative overflow-hidden bg-off-white">
        <SectionShell>
          <div
            data-visible={visible}
            className="translate-y-6 text-center opacity-0 transition-all duration-700 ease-out data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100"
          >
            <div className="mb-6 flex items-center justify-center gap-3">
              <SectionLabel label={C.app.label} centered />
            </div>

            <h2 className="mb-6 font-serif text-[clamp(28px,3.5vw,50px)] font-black leading-[1.1] text-ink">
              {C.app.title}
            </h2>

            <p className="mx-auto mb-10 text-center font-sans text-[clamp(14px,1.2vw,16px)] font-light leading-[1.8] text-muted-fg">
              {mobile.intro}
            </p>

            <div className="mb-10 flex justify-center">{mockupImage}</div>

            <span className="mb-4 inline-block rounded-full bg-primary-8 px-[22px] py-2.5 font-sans text-sm font-semibold text-primary">
              {mobile.comingSoonTitle}
            </span>

            <p className="mb-10 text-center font-sans text-[clamp(14px,1.2vw,16px)] font-light leading-[1.8] text-muted-fg">
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
        </SectionShell>
      </section>
    );
  }

  return (
    <section id="aplicativo" ref={ref} className="section-pad relative overflow-hidden bg-off-white">
      <SectionShell>
        <div
          data-visible={visible}
          className="translate-y-6 opacity-0 transition-all duration-700 ease-out data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100"
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

        <div className="grid grid-cols-2 items-start gap-20">
          <div
            data-visible={visible}
            className="translate-y-6 opacity-0 transition-all duration-700 ease-out data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100"
          >
            {introSplit.map((paragraph, i) => (
              <p
                key={i}
                className={`font-sans text-[clamp(14px,1.2vw,16px)] font-light leading-[1.8] text-muted-fg ${
                  i === introSplit.length - 1 ? 'mb-10' : 'mb-5'
                }`}
              >
                <TextWithBreaks text={paragraph} />
              </p>
            ))}
            <AppAccordion items={items} open={open} setOpen={setOpen} variant="desktop" />
            <PilotSignup isMobile={isMobile} />
          </div>

          <div
            data-visible={visible}
            className="flex translate-x-10 items-start justify-center opacity-0 transition-all duration-1000 delay-200 ease-out data-[visible=true]:translate-x-0 data-[visible=true]:opacity-100"
          >
            {mockupImage}
          </div>
        </div>
      </SectionShell>
    </section>
  );
}
