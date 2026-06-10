'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ProdutoModal } from '@/components/loja/ProdutoModal';
import {
  CATEGORIAS_LOJA,
  CONTEUDO_LOJA,
  filtrarProdutos,
  type CategoriaFiltro,
  type ProdutoLoja,
} from '@/lib/loja-data';

const { hero } = CONTEUDO_LOJA;

const ACCENT = '#93296F';

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className={`mb-6 flex items-center gap-4 ${light ? 'text-white/60' : 'text-primary'}`}>
      <div className={`h-0.5 w-12 ${light ? 'bg-white/60' : 'bg-primary'}`} />
      <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em]">
        {children}
      </span>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function ProdutoCard({
  produto,
  index,
  onSelect,
}: {
  produto: ProdutoLoja;
  index: number;
  onSelect: (p: ProdutoLoja) => void;
}) {
  return (
    <article
      className="group animate-fadeUp overflow-hidden rounded-3xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <Image
          src={produto.imagem}
          alt={produto.nome}
          fill
          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {produto.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 font-sans text-xs font-semibold uppercase tracking-wide text-white">
            {produto.badge}
          </span>
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-primary/0 opacity-0 transition-all duration-300 group-hover:bg-primary/20 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onSelect(produto)}
            className="translate-y-2 rounded-full bg-white px-5 py-2.5 font-sans text-sm font-semibold text-primary shadow-md transition group-hover:translate-y-0"
          >
            Ver Detalhes
          </button>
        </div>
      </div>

      <div className="p-4">
        <p className="mb-1 font-sans text-xs font-semibold uppercase tracking-widest text-muted-fg">
          {produto.categoria}
        </p>
        <h3 className="mb-1 font-sans text-base font-medium text-ink">{produto.nome}</h3>
        <p className="mb-4 line-clamp-2 font-sans text-sm text-muted-fg">{produto.desc}</p>
        <div className="flex items-center justify-between">
          <span className="font-serif text-xl font-bold text-primary">{produto.preco}</span>
          <a
            href={produto.shopUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Comprar ${produto.nome} via WhatsApp`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition hover:bg-tertiary"
          >
            <WhatsAppIcon />
          </a>
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
  const [isMobile, setIsMobile] = useState(false);
  const [filtro, setFiltro] = useState<CategoriaFiltro>('Todos');
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoLoja | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const slug = searchParams.get('produto');
    if (!slug) return;
    const produto = produtos.find((p) => p.slug === slug);
    if (produto) setProdutoSelecionado(produto);
  }, [searchParams, produtos]);

  useEffect(() => {
    const sync = () => setIsMobile(window.innerWidth <= 900);
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);

  const produtosFiltrados = filtrarProdutos(produtos, filtro);
  const navOffset = isMobile ? 72 : 84;

  return (
    <main className="min-h-screen bg-white">
      <SiteNav accent={ACCENT} isMobile={isMobile} layout="default" page="loja" />

      {/* Hero — imagem de fundo full-bleed (caminho em CONTEUDO_LOJA.hero.imagem) */}
      <section
        className="relative w-full overflow-hidden"
        style={{ minHeight: `min(62vh, ${hero.alturaMaxPx}px)` }}
      >
        <Image
          src={hero.imagem}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a]/85 via-[#3a184f]/70 to-[#3a184f]/40"
          aria-hidden="true"
        />

        <div
          className="relative z-10 mx-auto flex max-w-[1200px] flex-col justify-center px-6 pb-10 md:px-12 lg:px-20"
          style={{ minHeight: `min(62vh, ${hero.alturaMaxPx}px)`, paddingTop: navOffset }}
        >
          <SectionLabel light>{hero.label}</SectionLabel>
          <h1 className="mb-4 max-w-3xl font-serif text-4xl font-bold leading-tight text-white md:text-5xl lg:text-[64px]">
            {hero.titulo}
          </h1>
          <p className="mb-6 font-serif text-xl italic text-white md:text-2xl">
            {hero.subtitulo}
          </p>
          <p className="mb-8 max-w-xl font-sans text-lg leading-relaxed text-white">
            {hero.descricao}
          </p>
          <div className="mb-5 flex flex-wrap gap-4">
            <a
              href="#produtos"
              className="rounded-full bg-primary px-6 py-3 font-sans text-sm font-semibold text-white transition hover:bg-tertiary"
            >
              {hero.ctaPrimario}
            </a>
            <Link
              href="/#manifesto"
              className="rounded-full border border-white/70 px-6 py-3 font-sans text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {hero.ctaSecundario}
            </Link>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <div className="sticky top-[72px] z-50 border-b border-black/5 bg-white shadow-sm md:top-[84px]">
        <div className="mx-auto flex max-w-[1200px] gap-2 overflow-x-auto px-6 py-4 md:px-12 lg:px-20">
          {CATEGORIAS_LOJA.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFiltro(cat)}
              className={`shrink-0 rounded-full px-5 py-2 font-sans text-sm font-medium transition ${
                filtro === cat
                  ? 'bg-primary text-white'
                  : 'border border-primary text-primary hover:bg-primary/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Galeria */}
      <section id="produtos" className="bg-off-white py-16 md:py-20">
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
              onSelect={setProdutoSelecionado}
            />
          ))}
        </div>
        {produtosFiltrados.length === 0 && (
          <p className="text-center font-sans text-muted-fg">
            Nenhum produto nesta categoria no momento.
          </p>
        )}
      </section>

      {/* Nossa Essência */}
      <section className="relative overflow-hidden bg-gradient-to-r from-tertiary to-primary py-20 text-white">
        <div className="pointer-events-none absolute -left-10 top-10 h-40 w-40 rounded-full bg-white/10" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-16 right-10 h-56 w-56 rounded-full bg-white/10" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center md:px-12">
          <SectionLabel light>FEITO COM AMOR</SectionLabel>
          <h2 className="mb-4 font-serif text-3xl font-bold md:text-5xl">
            Cada peça conta uma história sáfica
          </h2>
          <p className="font-sans text-lg text-white/80">
            Produtos sustentáveis, produção ética, identidade real.
          </p>
        </div>
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
              className="rounded-full bg-primary px-6 py-3 font-sans text-sm font-semibold text-white transition hover:bg-tertiary"
            >
              Baixar o App
            </Link>
            <Link
              href="/"
              className="rounded-full border border-primary px-6 py-3 font-sans text-sm font-semibold text-primary transition hover:bg-primary/5"
            >
              Conhecer a Plataforma
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter accent={ACCENT} isMobile={isMobile} page="loja" />

      {produtoSelecionado && (
        <ProdutoModal
          produto={produtoSelecionado}
          onClose={() => setProdutoSelecionado(null)}
        />
      )}
    </main>
  );
}
