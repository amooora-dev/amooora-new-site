/** URLs que nunca devem ser usadas como site público */
function isInvalidPublicSiteUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return host.includes('supabase.co') || host === 'localhost' || host === '127.0.0.1';
  } catch {
    return true;
  }
}

/**
 * Base URL do site (sem barra final).
 * Usada em links compartilhados (WhatsApp, etc.).
 */
export function getSiteBaseUrl(): string | null {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (configured && !isInvalidPublicSiteUrl(configured)) {
    return configured;
  }

  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(/\/$/, '') ||
    process.env.VERCEL_URL?.replace(/\/$/, '');
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, '');
    return `https://${host}`;
  }

  return configured ?? null;
}

export function buildAbsoluteSiteUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (typeof window !== 'undefined') {
    return `${window.location.origin}${normalizedPath}`;
  }

  const base = getSiteBaseUrl();
  return base ? `${base}${normalizedPath}` : normalizedPath;
}
