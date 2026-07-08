import type { MetadataRoute } from 'next';
import { fetchStoreProducts } from '@/lib/supabase/products';
import { getSiteBaseUrl } from '@/lib/site-url';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (getSiteBaseUrl() ?? 'https://amooora.com.br').replace(/\/$/, '');
  const { produtos } = await fetchStoreProducts();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${base}/loja`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${base}/politica-de-cookies`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = produtos.map((produto) => ({
    url: `${base}/loja/${produto.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
