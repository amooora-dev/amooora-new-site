'use client';

import Image from 'next/image';

function ChevronLeft({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRight({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

type ProductImageGalleryProps = {
  imagens: string[];
  alt: string;
  activeIndex: number;
  onIndexChange: (index: number) => void;
  variant?: 'card' | 'modal';
  onMainImageClick?: () => void;
  className?: string;
};

export function ProductImageGallery({
  imagens,
  alt,
  activeIndex,
  onIndexChange,
  variant = 'card',
  onMainImageClick,
  className = '',
}: ProductImageGalleryProps) {
  const total = imagens.length;
  const hasMultiple = total > 1;
  const isModal = variant === 'modal';

  const prev = () => onIndexChange((activeIndex - 1 + total) % total);
  const next = () => onIndexChange((activeIndex + 1) % total);

  const thumbSize = isModal ? 'h-[72px] w-[56px]' : 'h-14 w-11';
  const arrowBtn = isModal
    ? 'h-12 w-12 border border-black/10 bg-white text-ink shadow-lg hover:bg-off-white'
    : 'h-10 w-10 bg-secondary text-white shadow-md hover:brightness-110';

  return (
    <div className={`flex flex-col ${className}`}>
      <div
        className={`relative overflow-hidden bg-muted ${
          isModal ? 'aspect-[3/4] min-h-[320px] md:min-h-[480px]' : 'aspect-[3/4]'
        }`}
      >
        {onMainImageClick ? (
          <button
            type="button"
            className="relative block h-full w-full cursor-zoom-in"
            onClick={onMainImageClick}
            aria-label={`Ampliar ${alt}`}
          >
            <Image
              src={imagens[activeIndex]}
              alt={`${alt} — foto ${activeIndex + 1} de ${total}`}
              fill
              className="object-cover object-center"
              sizes={
                isModal
                  ? '(max-width: 768px) 100vw, 50vw'
                  : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
              }
              priority={isModal && activeIndex === 0}
            />
          </button>
        ) : (
          <div className="relative h-full w-full">
            <Image
              src={imagens[activeIndex]}
              alt={`${alt} — foto ${activeIndex + 1} de ${total}`}
              fill
              className="object-cover object-center"
              sizes={
                isModal
                  ? '(max-width: 768px) 100vw, 50vw'
                  : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
              }
              priority={isModal && activeIndex === 0}
            />
          </div>
        )}

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Foto anterior"
              className={`pointer-events-auto absolute left-2 top-1/2 z-20 flex -translate-y-1/2 items-center justify-center rounded-full transition hover:scale-105 active:scale-95 ${arrowBtn} ${
                isModal ? 'md:left-4' : ''
              }`}
            >
              <ChevronLeft className={isModal ? 'h-6 w-6' : 'h-5 w-5'} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Próxima foto"
              className={`pointer-events-auto absolute right-2 top-1/2 z-20 flex -translate-y-1/2 items-center justify-center rounded-full transition hover:scale-105 active:scale-95 ${arrowBtn} ${
                isModal ? 'md:right-4' : ''
              }`}
            >
              <ChevronRight className={isModal ? 'h-6 w-6' : 'h-5 w-5'} />
            </button>

            <span className="absolute bottom-3 right-3 z-20 rounded-full bg-black/55 px-2.5 py-1 font-sans text-[11px] font-semibold text-white backdrop-blur-sm">
              {activeIndex + 1}/{total}
            </span>
          </>
        )}
      </div>

      {hasMultiple && (
        <div
          className={`pointer-events-auto relative z-20 flex gap-2 overflow-x-auto bg-white scrollbar-thin ${
            isModal ? 'border-t border-black/5 p-3 md:p-4' : 'border-t border-black/5 p-2'
          }`}
          role="tablist"
          aria-label="Miniaturas do produto"
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
                onClick={(e) => {
                  e.stopPropagation();
                  onIndexChange(i);
                }}
                className={`relative shrink-0 overflow-hidden rounded-lg border-2 transition ${thumbSize} ${
                  active
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-black/10 opacity-75 hover:border-primary/40 hover:opacity-100'
                }`}
              >
                <Image src={src} alt="" fill className="object-cover object-center" sizes="80px" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
