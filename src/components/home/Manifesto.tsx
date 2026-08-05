'use client';

import type { CSSProperties } from 'react';
import Image from 'next/image';
import { CONTEUDO_HOME as C } from '@/lib/conteudo-home';
import { TextWithBreaks } from '@/components/ui/TextWithBreaks';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { useInViewReveal } from '@/lib/hooks/useInViewReveal';
import type { ManifestoParagraph, MobileProps } from '@/components/home/types';

const REVEAL_UP = 'opacity-0 translate-y-[30px] transition-all duration-[800ms] ease-out data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0';

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
      className="mb-8 opacity-0 translate-y-5 transition-all duration-700 ease-out data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0"
    >
      <SectionLabel label={C.manifesto.label} />
    </div>
  );

  const imageBlock = (
    <div
      data-visible={visible}
      className={`flex items-start opacity-0 translate-x-6 transition-all duration-[900ms] delay-200 ease-out data-[visible=true]:opacity-100 data-[visible=true]:translate-x-0 ${isMobile ? 'justify-center mb-8' : 'justify-end mb-0'}`}
    >
      <Image
        src={C.manifesto.image}
        alt="Manifesto Amooora"
        width={440}
        height={440}
        style={{
          width: '100%',
          maxWidth: isMobile ? 320 : 440,
          height: 'auto',
          objectFit: 'contain',
          borderRadius: 4,
        }}
      />
    </div>
  );

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      className="relative overflow-hidden bg-white"
      style={{ padding: isMobile ? '80px 0' : '120px 0' }}
    >
      <div
        className="relative z-[2] mx-auto"
        style={{
          maxWidth: 1200,
          padding: isMobile ? '0 20px' : '0 48px',
        }}
      >
        {isMobile ? (
          <>
            {imageBlock}
            {labelBlock}
            {paragraphs.map((p, i) => renderParagraph(p, i, visible, 0, i === paragraphs.length - 1))}
          </>
        ) : (
          <div className="grid items-start gap-14" style={{ gridTemplateColumns: '1.05fr 0.95fr' }}>
            <div>
              {labelBlock}
              {leadingParagraphs.map((p, i) => renderParagraph(p, i, visible))}
              <div style={{ width: 'calc(100% + 56px + (100% * 0.95 / 1.05))' }}>
                {renderParagraph(closingParagraph, paragraphs.length - 1, visible, 0, true)}
              </div>
            </div>
            {imageBlock}
          </div>
        )}
      </div>
    </section>
  );
}
