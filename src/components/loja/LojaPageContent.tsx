'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ColorSwatches } from '@/components/loja/product/ColorSwatches';
import { ProductImageGallery } from '@/components/loja/product/ProductImageGallery';
import { LojaHero, lojaNavOverDark } from '@/components/loja/LojaHero';
import { WhatsAppIcon } from '@/components/icons';
import {
  CATEGORIAS_LOJA,
  CONTEUDO_LOJA,
  filtrarProdutos,
  type CategoriaFiltro,
  type ProdutoLoja,
} from '@/lib/loja-data';
import { buildWhatsappUrl } from '@/lib/supabase/map-product';
import { trackLinkClick, trackWhatsappClick } from '@/lib/analytics';
import { isProdutoEsgotado, PRODUTO_ESGOTADO_LABEL } from '@/lib/loja/product-availability';

const { hero, filtros } = CONTEUDO_LOJA;

function ProdutoCard({
  produto,
  index,
}: {
  produto: ProdutoLoja;
  index: number;
}) {
  const router = useRouter();
  const imagens = produto.imagens.length ? produto.imagens : [produto.imagem];
  const [imgAtiva, setImgAtiva] = useState(0);
  const [corAtiva, setCorAtiva] = useState(0);
  const produtoHref = `/loja/${produto.slug}`;

  const whatsappUrl = buildWhatsappUrl(produto, {
    cor: produto.cores[corAtiva]?.nome,
  });
  const esgotado = isProdutoEsgotado(produto);

  const trackProductOpen = (location: 'product_card' | 'product_card_gallery') => {
    trackLinkClick({
      linkText: produto.nome,
      linkUrl: produtoHref,
      linkType: 'product',
      location,
      productSlug: produto.slug,
      productName: produto.nome,
    });
  };

  return (
    // position:relative + Link overlay é o padrão para card clicável com botão interno
    <article
      className="group animate-fadeUp relative overflow-hidden rounded-3xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Link atrás do conteúdo — cliques passam via pointer-events-none nos filhos */}
      <Link
        href={produtoHref}
        className="absolute inset-0 z-0"
        aria-label={`Ver detalhes de ${produto.nome}`}
        onClick={() => trackProductOpen('product_card')}
      />

      {/* Imagem — swipe no mobile; setas no desktop; toque na imagem abre o produto */}
      <div className="relative z-10 pointer-events-none">
        <ProductImageGallery
          variant="card"
          imagens={imagens}
          alt={produto.nome}
          activeIndex={imgAtiva}
          onIndexChange={setImgAtiva}
          onCardNavigate={() => {
            trackProductOpen('product_card_gallery');
            router.push(produtoHref);
          }}
        />

        {produto.badge && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-primary px-3 py-1 font-sans text-xs font-semibold uppercase tracking-wide text-white">
            {produto.badge}
          </span>
        )}
      </div>

      <div className="relative z-10 pointer-events-none p-4">
        <p className="mb-1 font-sans text-xs font-semibold uppercase tracking-widest text-muted-fg">
          {produto.categoria}
        </p>
        <h3 className="mb-1 font-sans text-base font-medium text-ink">{produto.nome}</h3>
        <p className="mb-3 line-clamp-2 font-sans text-sm text-muted-fg">{produto.desc}</p>

        <ColorSwatches
          cores={produto.cores}
          selectedIndex={corAtiva}
          onSelect={(i) => { setCorAtiva(i); }}
          size="sm"
          className="pointer-events-auto relative z-10 mb-4"
        />

        <div className="flex items-center justify-between">
          {esgotado ? (
            <span className="font-sans text-sm font-semibold text-muted-fg">{PRODUTO_ESGOTADO_LABEL}</span>
          ) : (
            <span className="font-serif text-xl font-bold text-primary">{produto.preco}</span>
          )}
          {esgotado ? (
            <span
              aria-label="Produto esgotado"
              className="pointer-events-none relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-muted-fg"
            >
              <WhatsAppIcon />
            </span>
          ) : (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsappClick({
                productSlug: produto.slug,
                productName: produto.nome,
                location: 'store_card',
                value: produto.precoNumerico,
              })}
              aria-label={`Comprar ${produto.nome} via WhatsApp`}
              className="pointer-events-auto relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition hover:brightness-95"
            >
              <WhatsAppIcon />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function LojaPageContent({
  produtos,
  dataSource,
  dataError,
}: {
  produtos: ProdutoLoja[];
  dataSource: 'supabase' | 'static';
  dataError: string | null;
}) {
  const isMobile = useIsMobile();
  const [filtro, setFiltro] = useState<CategoriaFiltro>('Todos');
  const searchParams = useSearchParams();

  useEffect(() => {
    const slug = searchParams.get('produto');
    if (slug) {
      window.location.replace(`/loja/${slug}`);
    }
  }, [searchParams]);

  const produtosFiltrados = filtrarProdutos(produtos, filtro);
  const navOffset = isMobile ? 72 : 84;

  return (
    <main className="min-h-screen bg-white">
      <SiteNav
        isMobile={isMobile}
        layout="hero"
        page="loja"
        navOverDark={lojaNavOverDark(hero.modelo)}
      />

      <LojaHero modelo={hero.modelo} navOffset={navOffset} isMobile={isMobile} />

      {/* Filtros — fora do hero, seção dedicada */}
      <section
        id="produtos"
        aria-labelledby="loja-filtros-titulo"
        className="border-b border-black/5 bg-off-white"
      >
        <div className="mx-auto max-w-[1200px] px-6 py-8 md:px-12 lg:px-20">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                id="loja-filtros-titulo"
                className="mb-1 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-primary"
              >
                {filtros.titulo}
              </p>
              <p className="max-w-xl font-sans text-sm text-muted-fg">{filtros.descricao}</p>
            </div>
            <p className="font-sans text-sm text-muted-fg" aria-live="polite">
              <span className="font-semibold text-ink">{produtosFiltrados.length}</span>{' '}
              {produtosFiltrados.length === 1 ? 'produto' : 'produtos'}
              {filtro !== 'Todos' && (
                <span className="text-primary"> · {filtro}</span>
              )}
            </p>
          </div>

          <div
            role="group"
            aria-label="Categorias de produtos"
            className="flex flex-wrap gap-2"
          >
            {CATEGORIAS_LOJA.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFiltro(cat)}
                aria-pressed={filtro === cat}
                className={`shrink-0 rounded-full px-5 py-2 font-sans text-sm font-medium transition ${
                  filtro === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'border border-primary bg-white text-primary hover:bg-primary/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Galeria */}
      <section className="bg-off-white py-16 md:py-20">
        {dataSource === 'static' && dataError && process.env.NODE_ENV === 'development' && (
          <p className="mx-auto mb-6 max-w-2xl px-6 text-center font-sans text-xs text-amber-800">
            Fallback estático: {dataError}
          </p>
        )}
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3 lg:px-12 xl:grid-cols-4 xl:px-20">
          {produtosFiltrados.map((produto, i) => (
            <ProdutoCard
              key={produto.uuid}
              produto={produto}
              index={i}
            />
          ))}
        </div>
        {produtosFiltrados.length === 0 && (
          <p className="text-center font-sans text-muted-fg">
            Nenhum produto nesta categoria no momento.
          </p>
        )}
      </section>

      {/* CTA Final */}
      <section className="bg-muted py-20">
        <div className="mx-auto max-w-2xl px-6 text-center md:px-12">
          <h2 className="mb-4 font-serif text-3xl font-bold text-ink md:text-4xl">
            Ainda não conhece a Amooora?
          </h2>
          <p className="mb-8 font-sans text-lg text-muted-fg">
            Baixe o app e faça parte da maior comunidade sáfica do Brasil
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/#aplicativo"
              className="rounded-full bg-primary px-6 py-3 font-sans text-sm font-semibold text-white transition hover:brightness-95"
              onClick={() => trackLinkClick({
                linkText: 'Baixar o App',
                linkUrl: '/#aplicativo',
                linkType: 'nav_anchor',
                location: 'store_cta_bottom',
                sectionId: 'aplicativo',
              })}
            >
              Baixar o App
            </Link>
            <Link
              href="/"
              className="rounded-full border border-primary px-6 py-3 font-sans text-sm font-semibold text-primary transition hover:bg-primary/5"
              onClick={() => trackLinkClick({
                linkText: 'Conhecer a Plataforma',
                linkUrl: '/',
                linkType: 'internal',
                location: 'store_cta_bottom',
              })}
            >
              Conhecer a Plataforma
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter isMobile={isMobile} page="loja" />
    </main>
  );
}
