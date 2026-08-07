'use client';

import type { CSSProperties } from 'react';
import Image from 'next/image';
import { CONTEUDO_HOME as C } from '@/lib/conteudo-home';
import { TextWithBreaks } from '@/components/ui/TextWithBreaks';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SectionShell } from '@/components/ui/SectionShell';
import { useInViewReveal } from '@/lib/hooks/useInViewReveal';
import type { ManifestoParagraph, MobileProps } from '@/components/home/types';

const REVEAL_UP =
  'opacity-0 translate-y-[30px] transition-all duration-[800ms] ease-out data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0';

function renderParagraph(
  p: ManifestoParagraph,
  i: number,
  visible: boolean,
  delayOffset = 0,
  isLast = false
) {
  const delay = (0.1 + delayOffset + i * 0.12).toFixed(2) + 's';
  return (
    <div
      key={i}
      data-visible={visible}
      className={`${REVEAL_UP} [transition-delay:var(--delay)] ${isLast ? 'mb-0' : p.big ? 'mb-7' : 'mb-4'}`}
      style={{ '--delay': delay } as CSSProperties}
    >
      {p.big ? (
        <p className="font-serif text-[clamp(28px,4vw,54px)] font-bold leading-[1.15] tracking-[-0.02em] text-ink">
          <TextWithBreaks text={p.text} />
        </p>
      ) : (
        <p className="font-sans text-[clamp(14px,1.2vw,16px)] font-light leading-[1.8] text-muted-fg">
          <TextWithBreaks text={p.text} />
        </p>
      )}
    </div>
  );
}

export function Manifesto({ isMobile }: MobileProps) {
  const { ref: sectionRef, visible } = useInViewReveal<HTMLElement>(0.2);

  const paragraphs = C.manifesto.paragraphs;
  const leadingParagraphs = paragraphs.slice(0, -1);
  const closingParagraph = paragraphs[paragraphs.length - 1];

  const labelBlock = (
    <div
      data-visible={visible}
      className="mb-8 translate-y-5 opacity-0 transition-all duration-700 ease-out data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100"
    >
      <SectionLabel label={C.manifesto.label} />
    </div>
  );

  const imageBlock = (
    <div
      data-visible={visible}
      className={`flex items-start translate-x-6 opacity-0 transition-all duration-[900ms] delay-200 ease-out data-[visible=true]:translate-x-0 data-[visible=true]:opacity-100 ${
        isMobile ? 'mb-8 justify-center' : 'mb-0 justify-end'
      }`}
    >
      <Image
        src={C.manifesto.image}
        alt="Manifesto Amooora"
        width={440}
        height={440}
        className={`h-auto w-full rounded object-contain ${isMobile ? 'max-w-[320px]' : 'max-w-[440px]'}`}
      />
    </div>
  );

  return (
    <section id="manifesto" ref={sectionRef} className="section-pad relative overflow-hidden bg-white">
      <SectionShell className="relative z-[2]">
        {isMobile ? (
          <>
            {imageBlock}
            {labelBlock}
            {paragraphs.map((p, i) => renderParagraph(p, i, visible, 0, i === paragraphs.length - 1))}
          </>
        ) : (
          <div className="grid grid-cols-[1.05fr_0.95fr] items-start gap-14">
            <div>
              {labelBlock}
              {leadingParagraphs.map((p, i) => renderParagraph(p, i, visible))}
              <div className="w-[calc(100%+56px+(100%*0.95/1.05))]">
                {renderParagraph(closingParagraph, paragraphs.length - 1, visible, 0, true)}
              </div>
            </div>
            {imageBlock}
          </div>
        )}
      </SectionShell>
    </section>
  );
}
