'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { COOKIE_CONSENT_EVENT, getStoredConsent } from '@/lib/cookie-consent';
import { initAnalytics, trackPageView } from '@/lib/analytics';

function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (getStoredConsent() !== 'accepted') return;
    const query = searchParams.toString();
    trackPageView(query ? `${pathname}?${query}` : pathname);
  }, [pathname, searchParams]);

  return null;
}

export function AnalyticsProvider() {
  useEffect(() => {
    // Usuário já havia aceito em visita anterior
    if (getStoredConsent() === 'accepted') {
      initAnalytics();
    }

    // Usuário aceita agora no banner
    const onConsent = (e: Event) => {
      const choice = (e as CustomEvent<'accepted' | 'rejected'>).detail;
      if (choice === 'accepted') {
        initAnalytics();
      }
    };

    window.addEventListener(COOKIE_CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onConsent);
  }, []);

  return (
    <Suspense fallback={null}>
      <RouteTracker />
    </Suspense>
  );
}
