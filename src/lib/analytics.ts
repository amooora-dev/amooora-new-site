import { hasAnalyticsConsent } from '@/lib/cookie-consent';

declare global {
  interface Window {
    dataLayer?: IArguments[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? '';
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim() ?? '';

let initialized = false;

/* ── setup ── */

export function initAnalytics() {
  if (typeof window === 'undefined') return;
  if (!hasAnalyticsConsent()) return;
  if (initialized) return;
  if (!GA_ID && !GTM_ID) return;

  initialized = true;

  if (GA_ID) {
    // Padrão exato do snippet do Google — usa arguments para compatibilidade
    window.dataLayer = window.dataLayer ?? [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments as unknown as IArguments);
    };
    window.gtag('js', new Date());
    // send_page_view: false evita double-count — pageview manual via trackPageView
    window.gtag('config', GA_ID, { send_page_view: false });

    const script = document.createElement('script');
    script.id = 'ga-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);
  }

  if (GTM_ID && !document.getElementById('gtm-script')) {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' } as unknown as IArguments);

    const script = document.createElement('script');
    script.id = 'gtm-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
    document.head.appendChild(script);
  }
}

/* ── helper interno ── */

function gtag(...args: unknown[]) {
  if (!hasAnalyticsConsent() || !window.gtag) return;
  window.gtag(...args);
}

/* ── eventos públicos ── */

export function trackConsent(choice: 'accepted' | 'rejected') {
  if (choice === 'accepted') {
    initAnalytics();
    // Dispara pageview da página atual logo após aceitar
    trackPageView(window.location.pathname + window.location.search);
  }
}

export function trackPageView(path: string) {
  const page_path = path.startsWith('/') ? path : `/${path}`;
  const page_location = typeof window !== 'undefined' ? window.location.origin + page_path : page_path;
  const page_title = typeof document !== 'undefined' ? document.title : '';

  gtag('event', 'page_view', { page_path, page_location, page_title });
}

export function trackEvent(
  event: string,
  params: Record<string, string | number | boolean | undefined> = {}
) {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined)
  );
  gtag('event', event, cleaned);
}

/* ── conversões ── */

export function trackNewsletterSignup() {
  trackEvent('generate_lead', { lead_type: 'newsletter', form_location: 'home_footer' });
}

export function trackPilotSignup() {
  trackEvent('generate_lead', { lead_type: 'pilot', form_location: 'home_app_section' });
}

/* ── loja ── */

export function trackViewItem(params: {
  productSlug: string;
  productName: string;
  category: string;
  value?: number;
}) {
  trackEvent('view_item', {
    item_id: params.productSlug,
    item_name: params.productName,
    item_category: params.category,
    currency: 'BRL',
    value: params.value,
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

/* ── navegação ── */

export type LinkClickLocation =
  | 'header_desktop'
  | 'header_mobile'
  | 'header_cta'
  | 'header_logo'
  | 'footer'
  | 'footer_social'
  | 'home_gallery'
  | 'store_hero'
  | 'store_cta_bottom'
  | 'product_breadcrumb'
  | 'product_related'
  | 'product_card'
  | 'product_card_gallery';

export type LinkClickType = 'nav_anchor' | 'nav_route' | 'product' | 'internal' | 'external';

export function sectionIdFromHref(href: string): string | undefined {
  return href.split('#')[1]?.split('?')[0] || undefined;
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

  if (params.linkType === 'external') {
    trackEvent('outbound_click', {
      link_url: params.linkUrl,
      link_text: params.linkText,
      click_location: params.location,
    });
  }
}
