import { hasAnalyticsConsent } from '@/lib/cookie-consent';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim() ?? '';
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? '';

let analyticsInitialized = false;
let gaScriptLoaded = false;
const gaReadyQueue: Array<() => void> = [];

function ensureDataLayer() {
  window.dataLayer = window.dataLayer ?? [];
}

function ensureGtag() {
  ensureDataLayer();
  if (!window.gtag) {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    };
  }
}

function onGaReady(callback: () => void) {
  if (!GA_MEASUREMENT_ID) return;
  if (gaScriptLoaded && window.gtag) {
    callback();
    return;
  }
  gaReadyQueue.push(callback);
}

function flushGaReadyQueue() {
  gaScriptLoaded = true;
  while (gaReadyQueue.length > 0) {
    gaReadyQueue.shift()?.();
  }
}

function pushToDataLayer(payload: Record<string, unknown>) {
  if (!hasAnalyticsConsent()) return;
  ensureDataLayer();
  window.dataLayer!.push(payload);
}

function runGtag(...args: unknown[]) {
  if (!hasAnalyticsConsent() || !GA_MEASUREMENT_ID) return;
  onGaReady(() => {
    window.gtag?.(...args);
  });
}

export function isAnalyticsConfigured(): boolean {
  return Boolean(GTM_ID || GA_MEASUREMENT_ID);
}

function initGoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return;

  ensureGtag();

  if (document.getElementById('ga-script')) {
    if (gaScriptLoaded) return;
    return;
  }

  window.gtag!('js', new Date());

  const script = document.createElement('script');
  script.id = 'ga-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;

  script.onload = () => {
    window.gtag!('config', GA_MEASUREMENT_ID, {
      send_page_view: false,
    });
    flushGaReadyQueue();
    trackPageView(window.location.pathname + window.location.search);
  };

  script.onerror = () => {
    console.warn('[analytics] Falha ao carregar Google Analytics');
  };

  document.head.appendChild(script);
}

function initGoogleTagManager() {
  if (!GTM_ID || document.getElementById('gtm-script')) return;

  pushToDataLayer({ 'gtm.start': Date.now(), event: 'gtm.js' });

  const script = document.createElement('script');
  script.id = 'gtm-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(script);

  if (!document.getElementById('gtm-noscript')) {
    const noscript = document.createElement('noscript');
    noscript.id = 'gtm-noscript';
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${GTM_ID}`;
    iframe.height = '0';
    iframe.width = '0';
    iframe.style.display = 'none';
    iframe.style.visibility = 'hidden';
    noscript.appendChild(iframe);
    document.body.appendChild(noscript);
  }
}

export function initAnalytics() {
  if (typeof window === 'undefined' || !hasAnalyticsConsent() || analyticsInitialized) return;
  if (!isAnalyticsConfigured()) return;

  analyticsInitialized = true;

  initGoogleAnalytics();
  initGoogleTagManager();

  pushToDataLayer({
    event: 'consent_update',
    analytics_consent: 'granted',
  });
}

export function trackConsent(choice: 'accepted' | 'rejected') {
  if (choice === 'accepted') {
    initAnalytics();
    trackEvent('cookie_consent', { consent_status: 'accepted' });
    return;
  }

  pushToDataLayer({
    event: 'cookie_consent',
    consent_status: 'rejected',
  });
}

export function trackPageView(path: string) {
  if (!hasAnalyticsConsent()) return;

  const page_path = path.startsWith('/') ? path : `/${path}`;
  const page_location = `${window.location.origin}${page_path}`;
  const page_title = document.title;

  runGtag('event', 'page_view', {
    page_path,
    page_location,
    page_title,
  });

  pushToDataLayer({ event: 'page_view', page_path, page_location, page_title });
}

export function trackEvent(
  event: string,
  params: Record<string, string | number | boolean | undefined> = {}
) {
  if (!hasAnalyticsConsent()) return;

  const cleaned = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined)
  );

  runGtag('event', event, cleaned);
  pushToDataLayer({ event, ...cleaned });
}

export function trackNewsletterSignup() {
  trackEvent('newsletter_signup', {
    form_location: 'home_footer',
  });
  trackEvent('generate_lead', {
    lead_type: 'newsletter',
    form_location: 'home_footer',
  });
}

export function trackPilotSignup() {
  trackEvent('pilot_signup', {
    form_location: 'home_app_section',
  });
  trackEvent('generate_lead', {
    lead_type: 'pilot',
    form_location: 'home_app_section',
  });
}

export function trackWhatsappClick(params: {
  productSlug: string;
  productName: string;
  location: 'product_detail' | 'store_card' | 'product_modal';
  value?: number;
}) {
  trackEvent('whatsapp_click', {
    product_slug: params.productSlug,
    product_name: params.productName,
    click_location: params.location,
    currency: 'BRL',
    value: params.value,
  });
}

export type LinkClickLocation =
  | 'header_desktop'
  | 'header_mobile'
  | 'header_cta'
  | 'header_logo'
  | 'footer'
  | 'store_hero'
  | 'store_cta_bottom'
  | 'product_breadcrumb'
  | 'product_related'
  | 'product_card'
  | 'product_card_gallery';

export type LinkClickType = 'nav_anchor' | 'nav_route' | 'product' | 'internal';

export function sectionIdFromHref(href: string): string | undefined {
  const hash = href.split('#')[1];
  return hash?.split('?')[0] || undefined;
}

export function trackLinkClick(params: {
  linkText: string;
  linkUrl: string;
  linkType: LinkClickType;
  location: LinkClickLocation;
  sectionId?: string;
  productSlug?: string;
  productName?: string;
}) {
  const sectionId = params.sectionId ?? sectionIdFromHref(params.linkUrl);

  trackEvent('link_click', {
    link_text: params.linkText,
    link_url: params.linkUrl,
    link_type: params.linkType,
    click_location: params.location,
    section_id: sectionId,
    product_slug: params.productSlug,
    product_name: params.productName,
  });

  if (params.linkType === 'nav_anchor' || params.linkType === 'nav_route') {
    trackEvent('nav_click', {
      nav_label: params.linkText,
      nav_url: params.linkUrl,
      nav_section: sectionId,
      click_location: params.location,
    });
  }

  if (params.linkType === 'product') {
    trackEvent('select_item', {
      item_id: params.productSlug,
      item_name: params.productName,
      click_location: params.location,
    });
  }
}
