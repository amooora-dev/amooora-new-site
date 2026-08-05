'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import type { ProdutoLoja } from '@/lib/loja-data';
import { getBadgeBgClass } from '@/lib/loja/badge-display';
import { isProdutoEsgotado, PRODUTO_ESGOTADO_LABEL } from '@/lib/loja/product-availability';
import { buildWhatsappUrl } from '@/lib/supabase/map-product';
import { trackLinkClick, trackViewItem, trackWhatsappClick } from '@/lib/analytics';
import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ColorSwatches } from '@/components/loja/product/ColorSwatches';
import { ProductDescription } from '@/components/loja/product/ProductDescription';
import { GalleryPageLayout } from '@/components/loja/product/GalleryPageLayout';
import {
  ChevronRightIcon,
  WhatsAppIcon,
  ShareIcon,
  CheckIcon,
  TruckIcon,
  ShieldIcon,
  HeartIcon,
} from '@/components/icons';

type Props = {
  produto: ProdutoLoja;
  relacionados: ProdutoLoja[];
};

export function ProdutoDetalhePage({ produto, relacionados }: Props) {
  const imagens = produto.imagens.length ? produto.imagens : [produto.imagem];
  const [imgAtiva, setImgAtiva] = useState(0);
  const [corIdx, setCorIdx] = useState(0);
  const [tamanhoIdx, setTamanhoIdx] = useState(0);
  const isMobile = useIsMobile(768);
  const [copied, setCopied] = useState(false);
  const [wishlist, setWishlist] = useState(false);

  useEffect(() => {
    trackViewItem({
      productSlug: produto.slug,
      productName: produto.nome,
      category: produto.categoria,
      value: produto.precoNumerico,
    });
  }, [produto.slug, produto.nome, produto.categoria, produto.precoNumerico]);

  const whatsappUrl = useMemo(() =>
    buildWhatsappUrl(produto, {
      cor: produto.cores[corIdx]?.nome,
      tamanho: produto.tamanhos[tamanhoIdx],
    }),
    [produto, corIdx, tamanhoIdx]
  );
  const esgotado = isProdutoEsgotado(produto);

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: produto.nome, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <SiteNav isMobile={isMobile} layout="default" page="loja" />

      <div className="pt-[72px] md:pt-[84px]">
        {/* Breadcrumb */}
        <nav aria-label="Navegação estrutural" className="border-b border-black/5 bg-off-white">
          <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-5 py-3 md:px-12">
            <Link
              href="/"
              className="font-sans text-xs text-muted-fg transition hover:text-ink"
              onClick={() => trackLinkClick({
                linkText: 'Início',
                linkUrl: '/',
                linkType: 'internal',
                location: 'product_breadcrumb',
              })}
            >
              Início
            </Link>
            <ChevronRightIcon className="h-3 w-3 text-muted-fg/60" />
            <Link
              href="/loja"
              className="font-sans text-xs text-muted-fg transition hover:text-ink"
              onClick={() => trackLinkClick({
                linkText: 'Loja',
                linkUrl: '/loja',
                linkType: 'nav_route',
                location: 'product_breadcrumb',
              })}
            >
              Loja
            </Link>
            <ChevronRightIcon className="h-3 w-3 text-muted-fg/60" />
            <Link
              href={`/loja?categoria=${produto.categoria}`}
              className="font-sans text-xs text-muted-fg transition hover:text-ink"
              onClick={() => trackLinkClick({
                linkText: produto.categoria,
                linkUrl: `/loja?categoria=${produto.categoria}`,
                linkType: 'internal',
                location: 'product_breadcrumb',
              })}
            >
              {produto.categoria}
            </Link>
            <ChevronRightIcon className="h-3 w-3 text-muted-fg/60" />
            <span className="font-sans text-xs font-medium text-ink">{produto.nome}</span>
          </div>
        </nav>

        {/* Layout principal */}
        <div className="mx-auto max-w-7xl px-5 py-8 md:px-12 md:py-14">
          <div className="grid min-w-0 grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-14 lg:gap-20">

            {/* Galeria — self-start evita stretch do grid igualar altura com o painel */}
            <div className="min-w-0 w-full self-start overflow-hidden">
              <GalleryPageLayout
                imagens={imagens}
                alt={produto.nome}
                activeIndex={imgAtiva}
                onIndexChange={setImgAtiva}
              />
            </div>

            {/* Painel de compra */}
            <div className="relative z-10 flex min-w-0 flex-col gap-6">
              {/* Categoria + badge */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-muted-fg">
                  {produto.categoria}
                </span>
                {produto.badge && (
                  <span className={`rounded-full px-3 py-1 font-sans text-xs font-semibold uppercase tracking-wide text-white ${getBadgeBgClass(produto.badge)}`}>
                    {produto.badge}
                  </span>
                )}
              </div>

              {/* Nome + ações */}
              <div className="flex items-start justify-between gap-4">
                <h1 className="font-serif text-3xl font-bold leading-tight text-ink md:text-4xl">
                  {produto.nome}
                </h1>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => setWishlist((v) => !v)}
                    aria-label={wishlist ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
                      wishlist
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-black/10 text-muted-fg hover:border-primary/40 hover:text-primary'
                    }`}
                  >
                    <HeartIcon filled={wishlist} />
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label="Compartilhar produto"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-muted-fg transition hover:border-primary/40 hover:text-primary"
                  >
                    {copied ? <CheckIcon /> : <ShareIcon />}
                  </button>
                </div>
              </div>

              {/* Preço */}
              <div>
                {esgotado ? (
                  <p className="font-serif text-3xl font-bold text-muted-fg">{PRODUTO_ESGOTADO_LABEL}</p>
                ) : (
                  <>
                    <p className="font-serif text-3xl font-bold text-primary">{produto.preco}</p>
                    <p className="mt-1 font-sans text-xs text-muted-fg">Encomendas sob medida via WhatsApp</p>
                  </>
                )}
              </div>

              <div className="h-px bg-black/5" />

              {/* Cores */}
              <ColorSwatches
                cores={produto.cores}
                selectedIndex={corIdx}
                onSelect={setCorIdx}
                size="md"
                showLabel
              />

              {/* Tamanhos */}
              {produto.tamanhos.length > 0 && (
                <div>
                  <p className="mb-3 font-sans text-sm font-medium text-ink">
                    Tamanho
                    {produto.tamanhos[tamanhoIdx] && (
                      <span className="ml-2 font-normal text-muted-fg">
                        — {produto.tamanhos[tamanhoIdx]}
                      </span>
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {produto.tamanhos.map((t, i) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTamanhoIdx(i)}
                        aria-pressed={i === tamanhoIdx}
                        className={`min-w-[48px] rounded-xl px-4 py-2.5 font-sans text-sm font-medium transition ${
                          i === tamanhoIdx
                            ? 'bg-primary text-white shadow-sm'
                            : 'border border-black/15 text-ink hover:border-primary/50 hover:text-primary'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA WhatsApp */}
              {esgotado ? (
                <span
                  aria-disabled="true"
                  className="flex cursor-not-allowed items-center justify-center gap-3 rounded-2xl bg-black/10 px-6 py-4 font-sans text-base font-semibold text-muted-fg"
                >
                  <WhatsAppIcon />
                  Encomendar via WhatsApp
                </span>
              ) : (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsappClick({
                    productSlug: produto.slug,
                    productName: produto.nome,
                    location: 'product_detail',
                    value: produto.precoNumerico,
                  })}
                  className="flex items-center justify-center gap-3 rounded-2xl bg-primary px-6 py-4 font-sans text-base font-semibold text-white shadow-md transition hover:brightness-95 active:scale-[0.98]"
                >
                  <WhatsAppIcon />
                  Encomendar via WhatsApp
                </a>
              )}

              {/* Garantias */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2 rounded-xl border border-black/5 bg-off-white p-3">
                  <TruckIcon />
                  <div>
                    <p className="font-sans text-xs font-semibold text-ink">Frete à combinar</p>
                    <p className="font-sans text-[11px] text-muted-fg">Para toda São Paulo</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 rounded-xl border border-black/5 bg-off-white p-3">
                  <ShieldIcon />
                  <div>
                    <p className="font-sans text-xs font-semibold text-ink">Produto exclusivo</p>
                    <p className="font-sans text-[11px] text-muted-fg">Confeccionado conforme encomenda</p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-black/5" />

              {/* Descrição completa */}
              <div>
                <p className="mb-3 font-sans text-sm font-semibold uppercase tracking-[0.12em] text-muted-fg">
                  Sobre o produto
                </p>
                <ProductDescription html={produto.descricaoCompleta} />
              </div>
            </div>
          </div>
        </div>

        {/* Produtos relacionados */}
        {relacionados.length > 0 && (
          <section className="border-t border-black/5 bg-off-white py-16">
            <div className="mx-auto max-w-7xl px-5 md:px-12">
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <p className="mb-1 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-muted-fg">
                    Você também pode gostar
                  </p>
                  <h2 className="font-serif text-2xl font-bold text-ink">
                    Mais em {produto.categoria}
                  </h2>
                </div>
                <Link
                  href="/loja"
                  className="hidden font-sans text-sm font-medium text-primary transition hover:underline md:block"
                  onClick={() => trackLinkClick({
                    linkText: 'Ver tudo',
                    linkUrl: '/loja',
                    linkType: 'nav_route',
                    location: 'product_related',
                  })}
                >
                  Ver tudo →
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {relacionados.map((rel) => (
                  <RelatedCard key={rel.uuid} produto={rel} />
                ))}
              </div>

              <div className="mt-8 text-center md:hidden">
                <Link
                  href="/loja"
                  className="font-sans text-sm font-medium text-primary transition hover:underline"
                  onClick={() => trackLinkClick({
                    linkText: 'Ver toda a coleção',
                    linkUrl: '/loja',
                    linkType: 'nav_route',
                    location: 'product_related',
                  })}
                >
                  Ver toda a coleção →
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>

      <SiteFooter isMobile={isMobile} page="loja" />
    </div>
  );
}

function RelatedCard({ produto }: { produto: ProdutoLoja }) {
  const href = `/loja/${produto.slug}`;

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      onClick={() => trackLinkClick({
        linkText: produto.nome,
        linkUrl: href,
        linkType: 'product',
        location: 'product_related',
        productSlug: produto.slug,
        productName: produto.nome,
      })}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <Image
          src={produto.imagem}
          alt={produto.nome}
          fill
          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {produto.badge && (
          <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wide text-white">
            {produto.badge}
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="mb-0.5 truncate font-sans text-sm font-medium text-ink">{produto.nome}</p>
        {isProdutoEsgotado(produto) ? (
          <p className="font-sans text-sm font-semibold text-muted-fg">{PRODUTO_ESGOTADO_LABEL}</p>
        ) : (
          <p className="font-serif text-base font-bold text-primary">{produto.preco}</p>
        )}
        {produto.cores.length > 1 && (
          <div className="mt-2 flex gap-1.5">
            {produto.cores.slice(0, 4).map((c) => (
              <span
                key={c.hex}
                title={c.nome}
                className="inline-block h-4 w-4 rounded-full border border-black/10"
                style={{ background: c.hex }}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
