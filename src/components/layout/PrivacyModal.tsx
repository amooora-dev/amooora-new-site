'use client';

import { useEffect } from 'react';
import { POLITICA_DE_COOKIES as P } from '@/lib/politica-de-cookies';

type PrivacyModalProps = {
  onClose: () => void;
};

export function PrivacyModal({ onClose }: PrivacyModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-secondary/50 p-5 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[88vh] w-full max-w-[680px] overflow-y-auto rounded-[20px] bg-white p-6 md:p-12"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="sticky top-0 float-right flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-primary-8 text-lg leading-none text-primary"
        >
          ✕
        </button>

        <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
          Política de Privacidade
        </p>

        <h2 className="mb-2 font-serif text-[clamp(24px,3vw,36px)] font-bold leading-[1.15] text-secondary">
          {P.title}
        </h2>

        <p className="mb-4 font-sans text-[13px] font-light leading-[1.8] text-muted-fg">
          Última atualização: {P.lastUpdate}
        </p>

        {P.intro.map((paragraph) => (
          <p key={paragraph} className="mb-3 font-sans text-[clamp(14px,1.2vw,16px)] font-light leading-[1.8] text-muted-fg">
            {paragraph}
          </p>
        ))}

        {P.sections.map((section) => (
          <div key={section.title}>
            <p className="mb-2 mt-7 font-sans text-[clamp(14px,1.2vw,16px)] font-semibold leading-[1.8] text-muted-fg">
              {section.title}
            </p>
            {section.paragraphs.map((p) => (
              <p key={p} className="mb-2 font-sans text-[clamp(14px,1.2vw,16px)] font-light leading-[1.8] text-muted-fg">
                {p}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
