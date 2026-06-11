'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { ProdutoLoja } from '@/lib/loja-data';
import { buildWhatsappUrl } from '@/lib/supabase/map-product';
import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ColorSwatches } from '@/components/loja/product/ColorSwatches';
import { ProductDescription } from '@/components/loja/product/ProductDescription';
import { GalleryPageLayout } from '@/components/loja/product/GalleryPageLayout';

const ACCENT = '#93296F';

function ChevronRight({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

type Props = {
  produto: ProdutoLoja;
  relacionados: ProdutoLoja[];
};

export function ProdutoDetalhePage({ produto, relacionados }: Props) {
  const imagens = produto.imagens.length ? produto.imagens : [produto.imagem];
  const [imgAtiva, setImgAtiva] = useState(0);
  const [corIdx, setCorIdx] = useState(0);
  const [tamanhoIdx, setTamanhoIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [copied, setCopied] = useState(false);
  const [wishlist, setWishlist] = useState(false);

  useEffect(() => {
    const sync = () => setIsMobile(window.innerWidth < 768);
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);

  const whatsappUrl = useMemo(() =>
    buildWhatsappUrl(produto, {
      cor: produto.cores[corIdx]?.nome,
      tamanho: produto.tamanhos[tamanhoIdx],
    }),
    [produto, corIdx, tamanhoIdx]
  );

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
      <SiteNav accent={ACCENT} isMobile={isMobile} layout="default" page="loja" />

      <div className="pt-[72px] md:pt-[84px]">
        {/* Breadcrumb */}
        <nav aria-label="Navegação estrutural" className="border-b border-black/5 bg-off-white">
          <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-5 py-3 md:px-12">
            <Link href="/" className="font-sans text-xs text-muted-fg transition hover:text-ink">Início</Link>
            <ChevronRight className="h-3 w-3 text-muted-fg/60" />
            <Link href="/loja" className="font-sans text-xs text-muted-fg transition hover:text-ink">Loja</Link>
            <ChevronRight className="h-3 w-3 text-muted-fg/60" />
            <Link href={`/loja?categoria=${produto.categoria}`} className="font-sans text-xs text-muted-fg transition hover:text-ink">{produto.categoria}</Link>
            <ChevronRight className="h-3 w-3 text-muted-fg/60" />
            <span className="font-sans text-xs font-medium text-ink">{produto.nome}</span>
          </div>
        </nav>

        {/* Layout principal */}
        <div className="mx-auto max-w-7xl px-5 py-8 md:px-12 md:py-14">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-14 lg:gap-20">

            {/* Galeria — thumbnails verticais no desktop */}
            <GalleryPageLayout
              imagens={imagens}
              alt={produto.nome}
              activeIndex={imgAtiva}
              onIndexChange={setImgAtiva}
            />

            {/* Painel de compra */}
            <div className="flex flex-col gap-6">
              {/* Categoria + badge */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-muted-fg">
                  {produto.categoria}
                </span>
                {produto.badge && (
                  <span className={`rounded-full px-3 py-1 font-sans text-xs font-semibold uppercase tracking-wide text-white ${
                    produto.badge === 'EDIÇÃO LIMITADA' ? 'bg-accent' : 'bg-primary'
                  }`}>
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
                <p className="font-serif text-3xl font-bold text-primary">{produto.preco}</p>
                <p className="mt-1 font-sans text-xs text-muted-fg">Via WhatsApp · sem juros</p>
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
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 rounded-2xl bg-accent px-6 py-4 font-sans text-base font-semibold text-white shadow-md transition hover:brightness-95 active:scale-[0.98]"
              >
                <WhatsAppIcon />
                Comprar via WhatsApp
              </a>

              {/* Garantias */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2 rounded-xl border border-black/5 bg-off-white p-3">
                  <TruckIcon />
                  <div>
                    <p className="font-sans text-xs font-semibold text-ink">Envio rápido</p>
                    <p className="font-sans text-[11px] text-muted-fg">Para todo o Brasil</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 rounded-xl border border-black/5 bg-off-white p-3">
                  <ShieldIcon />
                  <div>
                    <p className="font-sans text-xs font-semibold text-ink">Compra segura</p>
                    <p className="font-sans text-[11px] text-muted-fg">Atendimento humano</p>
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
                >
                  Ver toda a coleção →
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>

      <SiteFooter accent={ACCENT} isMobile={isMobile} page="loja" />
    </div>
  );
}

function RelatedCard({ produto }: { produto: ProdutoLoja }) {
  return (
    <Link
      href={`/loja/${produto.slug}`}
      className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
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
        <p className="font-serif text-base font-bold text-primary">{produto.preco}</p>
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
