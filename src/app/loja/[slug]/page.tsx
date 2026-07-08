import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { fetchSingleProduct, fetchStoreProducts } from '@/lib/supabase/products';
import { ProdutoDetalhePage } from '@/components/loja/ProdutoDetalhePage';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  buildBreadcrumbJsonLd,
  buildProductJsonLd,
  createPageMetadata,
} from '@/lib/seo';

export const revalidate = 60;

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const { produtos } = await fetchStoreProducts();
  return produtos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { produto } = await fetchSingleProduct(params.slug);
  if (!produto) {
    return createPageMetadata({
      title: 'Produto não encontrado — Loja Amooora',
      path: `/loja/${params.slug}`,
      noIndex: true,
    });
  }

  const images = produto.imagens.length ? produto.imagens : [produto.imagem];

  return createPageMetadata({
    title: `${produto.nome} — Loja Amooora`,
    description: produto.desc,
    path: `/loja/${produto.slug}`,
    ogImage: images,
  });
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

  const structuredData = [
    buildProductJsonLd(produto),
    buildBreadcrumbJsonLd([
      { name: 'Início', path: '/' },
      { name: 'Loja', path: '/loja' },
      { name: produto.categoria, path: `/loja?categoria=${encodeURIComponent(produto.categoria)}` },
      { name: produto.nome, path: `/loja/${produto.slug}` },
    ]),
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <ProdutoDetalhePage produto={produto} relacionados={relacionados} />
      </Suspense>
    </>
  );
}
