'use client';

import { useState } from 'react';
import Image from 'next/image';

function ChevronLeft({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRight({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function ZoomIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
    </svg>
  );
}

type GalleryPageLayoutProps = {
  imagens: string[];
  alt: string;
  activeIndex: number;
  onIndexChange: (i: number) => void;
};

export function GalleryPageLayout({ imagens, alt, activeIndex, onIndexChange }: GalleryPageLayoutProps) {
  const [lightbox, setLightbox] = useState(false);
  const total = imagens.length;
  const hasMultiple = total > 1;

  const prev = () => onIndexChange((activeIndex - 1 + total) % total);
  const next = () => onIndexChange((activeIndex + 1) % total);

  return (
    <>
      {/* Desktop: thumbnails verticais à esquerda + imagem principal */}
      <div className="flex flex-col gap-3 md:flex-row md:gap-4">
        {hasMultiple && (
          <div
            className="order-2 flex flex-row gap-2 overflow-x-auto pb-1 md:order-1 md:w-[80px] md:flex-col md:overflow-x-visible md:overflow-y-auto md:pb-0"
            role="tablist"
            aria-label="Miniaturas"
          >
            {imagens.map((src, i) => {
              const active = i === activeIndex;
              return (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Foto ${i + 1}`}
                  onClick={() => onIndexChange(i)}
                  className={`relative shrink-0 overflow-hidden rounded-xl border-2 transition ${
                    active
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-black/10 opacity-60 hover:border-primary/40 hover:opacity-100'
                  } h-16 w-12 md:h-[88px] md:w-[70px]`}
                >
                  <Image src={src} alt="" fill className="object-cover object-center" sizes="80px" />
                </button>
              );
            })}
          </div>
        )}

        {/* Imagem principal */}
        <div className={`relative order-1 overflow-hidden rounded-2xl bg-muted md:order-2 md:flex-1 ${hasMultiple ? '' : 'w-full'}`}>
          <div className="relative aspect-[3/4]">
            <Image
              src={imagens[activeIndex]}
              alt={`${alt} — foto ${activeIndex + 1} de ${total}`}
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Botão zoom */}
            <button
              type="button"
              onClick={() => setLightbox(true)}
              aria-label="Ampliar imagem"
              className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-white/60 bg-white/90 px-3 py-1.5 font-sans text-xs font-medium text-ink shadow-sm backdrop-blur-sm transition hover:bg-white"
            >
              <ZoomIcon />
              Ampliar
            </button>

            {hasMultiple && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Foto anterior"
                  className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white shadow-md transition hover:scale-105"
                >
                  <ChevronLeft />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Próxima foto"
                  className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white shadow-md transition hover:scale-105"
                >
                  <ChevronRight />
                </button>
                <span className="absolute bottom-3 left-3 rounded-full bg-black/50 px-2.5 py-1 font-sans text-[11px] font-semibold text-white backdrop-blur-sm">
                  {activeIndex + 1}/{total}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal
          aria-label="Visualizar imagem ampliada"
        >
          <button
            type="button"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Fechar"
            onClick={() => setLightbox(false)}
          >
            ×
          </button>

          <div
            className="relative max-h-[90vh] max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={imagens[activeIndex]}
              alt={`${alt} — ampliado`}
              width={800}
              height={1066}
              className="h-auto max-h-[85vh] w-full rounded-xl object-contain"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Foto anterior"
                className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Próxima foto"
                className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
