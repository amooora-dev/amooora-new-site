import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { fetchSingleProduct, fetchStoreProducts } from '@/lib/supabase/products';
import { ProdutoDetalhePage } from '@/components/loja/ProdutoDetalhePage';

export const revalidate = 60;

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const { produtos } = await fetchStoreProducts();
  return produtos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { produto } = await fetchSingleProduct(params.slug);
  if (!produto) return { title: 'Produto não encontrado — Loja Amooora' };
  return {
    title: `${produto.nome} — Loja Amooora`,
    description: produto.desc,
    openGraph: {
      title: produto.nome,
      description: produto.desc,
      images: produto.imagem ? [{ url: produto.imagem }] : [],
    },
  };
}

export default async function ProdutoPage({ params }: Props) {
  const [{ produto }, { produtos: todos }] = await Promise.all([
    fetchSingleProduct(params.slug),
    fetchStoreProducts(),
  ]);

  if (!produto) notFound();

  const relacionados = todos
    .filter((p) => p.slug !== produto.slug && p.categoria === produto.categoria)
    .slice(0, 4);

  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ProdutoDetalhePage produto={produto} relacionados={relacionados} />
    </Suspense>
  );
}
