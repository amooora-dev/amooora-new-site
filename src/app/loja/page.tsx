import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LojaPageContent } from '@/components/loja/LojaPageContent';
import { fetchStoreProducts } from '@/lib/supabase/products';

export const metadata: Metadata = {
  title: 'Loja Amooora — Vista sua identidade sáfica',
  description:
    'Cada peça é feita com amor, representatividade e orgulho sáfico. Camisetas, moletons e acessórios feitos por nós, para nós.',
};

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
