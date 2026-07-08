import type { Metadata } from 'next';
import { CONTEUDO_HOME as C } from '@/lib/conteudo-home';
import { getSiteBaseUrl } from '@/lib/site-url';
import type { ProdutoLoja } from '@/lib/loja-data';
import { isProdutoEsgotado } from '@/lib/loja/product-availability';

export const SEO = {
  siteName: 'Amooora',
  defaultTitle: C.site.title,
  defaultDescription:
    'Somos a plataforma referência para a comunidade sáfica. Chegamos para somar, criar e espalhar conteúdo, informação e serviços com a nossa cara.',
  defaultOgImage: C.hero.background,
  locale: 'pt_BR',
  language: 'pt-BR',
  email: C.footer.email,
  instagramUrl: C.footer.instagramUrl,
  logoPath: '/images/logo.png',
} as const;

const FALLBACK_SITE_URL = 'https://amooora.com.br';

export function getMetadataBase(): URL {
  const base = getSiteBaseUrl();
  return new URL(base ?? FALLBACK_SITE_URL);
}

export function toAbsoluteUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return new URL(normalized, getMetadataBase()).toString();
}

type PageMetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string | string[];
  noIndex?: boolean;
};

export function createPageMetadata(input: PageMetadataInput = {}): Metadata {
  const description = input.description ?? SEO.defaultDescription;
  const title = input.title ?? SEO.defaultTitle;
  const canonical = input.path ? toAbsoluteUrl(input.path) : undefined;
  const images = (Array.isArray(input.ogImage) ? input.ogImage : [input.ogImage ?? SEO.defaultOgImage])
    .filter((image): image is string => Boolean(image))
    .map((image) => toAbsoluteUrl(image));

  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      type: 'website',
      locale: SEO.locale,
      url: canonical,
      siteName: SEO.siteName,
      title,
      description,
      images: images.map((url) => ({ url, alt: title })),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
    robots: input.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export function buildOrganizationJsonLd() {
  const url = getMetadataBase().toString();

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SEO.siteName,
    url,
    logo: toAbsoluteUrl(SEO.logoPath),
    email: SEO.email,
    sameAs: [SEO.instagramUrl],
  };
}

export function buildWebSiteJsonLd() {
  const url = getMetadataBase().toString();

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SEO.siteName,
    url,
    description: SEO.defaultDescription,
    inLanguage: SEO.language,
    publisher: {
      '@type': 'Organization',
      name: SEO.siteName,
      logo: toAbsoluteUrl(SEO.logoPath),
    },
  };
}

export function buildProductJsonLd(produto: ProdutoLoja) {
  const url = toAbsoluteUrl(`/loja/${produto.slug}`);
  const images = (produto.imagens.length ? produto.imagens : [produto.imagem])
    .filter(Boolean)
    .map((image) => toAbsoluteUrl(image));

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: produto.nome,
    description: produto.descricaoCompleta || produto.desc,
    url,
    image: images,
    sku: produto.slug,
    category: produto.categoria,
    brand: {
      '@type': 'Brand',
      name: SEO.siteName,
    },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'BRL',
      price: produto.precoNumerico,
      availability: isProdutoEsgotado(produto)
        ? 'https://schema.org/OutOfStock'
        : 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: SEO.siteName,
      },
    },
  };
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.path),
    })),
  };
}

export function buildFaqPageJsonLd(items: ReadonlyArray<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}

export function buildItemListJsonLd(produtos: ProdutoLoja[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Loja Amooora — Coleção',
    url: toAbsoluteUrl('/loja'),
    numberOfItems: produtos.length,
    itemListElement: produtos.map((produto, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: toAbsoluteUrl(`/loja/${produto.slug}`),
      name: produto.nome,
    })),
  };
}
