'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  getStoredConsent,
  setStoredConsent,
  type ConsentChoice,
} from '@/lib/cookie-consent';
import { trackConsent } from '@/lib/analytics';

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(!getStoredConsent());
  }, []);

  function handleConsent(choice: ConsentChoice) {
    setStoredConsent(choice);
    trackConsent(choice);
    setIsVisible(false);
  }

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-[90] border-t border-black/10 bg-white px-4 py-4 shadow-[0_-12px_40px_rgba(26,26,26,0.12)]"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="font-sans text-sm leading-6 text-ink-mid md:max-w-4xl">
          Este site usa cookies para melhorar sua experiência de navegação, analisar o tráfego do site
          e oferecer melhores experiências de usuário. Saiba mais em nossa{' '}
          <Link
            href="/politica-de-cookies"
            className="font-semibold text-primary underline underline-offset-4 transition hover:text-secondary"
          >
            política de cookies
          </Link>
          .
        </p>

        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => handleConsent('accepted')}
            className="rounded-md bg-primary px-5 py-2.5 font-sans text-sm font-semibold text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Aceitar
          </button>
          <button
            type="button"
            onClick={() => handleConsent('rejected')}
            className="rounded-md bg-slate-600 px-5 py-2.5 font-sans text-sm font-semibold text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          >
            Rejeitar
          </button>
        </div>
      </div>
    </aside>
  );
}
