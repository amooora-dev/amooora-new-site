import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LojaPageContent } from '@/components/loja/LojaPageContent';
import { fetchStoreProducts } from '@/lib/supabase/products';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Loja Amooora — Vista sua identidade sáfica',
  description:
    'Cada peça é feita com amor, representatividade e orgulho sáfico. Camisetas, moletons e acessórios feitos por nós, para nós.',
  path: '/loja',
  ogImage: '/images/loja/banner-hero-modelo-2-visual.png',
});

/** Revalida a cada 60s — produtos atualizados no CMS aparecem na loja */
export const revalidate = 60;

export default async function LojaPage() {
  const { produtos, source, error } = await fetchStoreProducts();

  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <LojaPageContent
        produtos={produtos}
        dataSource={source}
        dataError={error}
      />
    </Suspense>
  );
}
