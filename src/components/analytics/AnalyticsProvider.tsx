'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { COOKIE_CONSENT_EVENT, getStoredConsent } from '@/lib/cookie-consent';
import { initAnalytics, trackPageView } from '@/lib/analytics';

function AnalyticsRouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    trackPageView(query ? `${pathname}?${query}` : pathname);
  }, [pathname, searchParams]);

  return null;
}

export function AnalyticsProvider() {
  useEffect(() => {
    if (getStoredConsent() === 'accepted') {
      initAnalytics();
      trackPageView(window.location.pathname + window.location.search);
    }

    const handleConsent = (event: Event) => {
      const choice = (event as CustomEvent<'accepted' | 'rejected'>).detail;
      if (choice === 'accepted') {
        initAnalytics();
        trackPageView(window.location.pathname + window.location.search);
      }
    };

    window.addEventListener(COOKIE_CONSENT_EVENT, handleConsent);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, handleConsent);
  }, []);

  return (
    <Suspense fallback={null}>
      <AnalyticsRouteTracker />
    </Suspense>
  );
}
