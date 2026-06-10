'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { ProdutoLoja } from '@/lib/loja-data';

type ProdutoModalProps = {
  produto: ProdutoLoja;
  onClose: () => void;
};

export function ProdutoModal({ produto, onClose }: ProdutoModalProps) {
  const [slideAtivo, setSlideAtivo] = useState(0);
  const [corSelecionada, setCorSelecionada] = useState(0);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState(1);

  const slides = 4;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const prevSlide = () => setSlideAtivo((i) => (i - 1 + slides) % slides);
  const nextSlide = () => setSlideAtivo((i) => (i + 1) % slides);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 md:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-produto-titulo"
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink shadow-md transition hover:bg-muted"
        >
          ×
        </button>

        <div className="grid md:grid-cols-2">
          <div className="relative aspect-[3/4] overflow-hidden bg-muted md:aspect-auto md:min-h-[480px]">
            <Image
              src={produto.imagem}
              alt={produto.nome}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            <button
              type="button"
              onClick={prevSlide}
              aria-label="Imagem anterior"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary shadow-md transition hover:bg-white"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Próxima imagem"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary shadow-md transition hover:bg-white"
            >
              ›
            </button>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {Array.from({ length: slides }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Imagem ${i + 1}`}
                  onClick={() => setSlideAtivo(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === slideAtivo ? 'w-6 bg-primary' : 'w-2 bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5 p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-fg">
                {produto.categoria}
              </span>
              {produto.badge && (
                <span className="rounded-full bg-primary px-3 py-1 font-sans text-xs font-semibold uppercase tracking-wide text-white">
                  {produto.badge}
                </span>
              )}
            </div>

            <h2 id="modal-produto-titulo" className="font-serif text-3xl font-bold text-ink">
              {produto.nome}
            </h2>

            <p className="font-serif text-2xl font-bold text-primary">{produto.preco}</p>

            <div>
              <p className="mb-2 font-sans text-sm font-medium text-ink">Cor</p>
              <div className="flex gap-2">
                {produto.cores.map((cor, i) => (
                  <button
                    key={cor.nome}
                    type="button"
                    aria-label={cor.nome}
                    title={cor.nome}
                    onClick={() => setCorSelecionada(i)}
                    className={`h-8 w-8 rounded-full border-2 transition ${
                      i === corSelecionada ? 'border-primary scale-110' : 'border-transparent'
                    }`}
                    style={{
                      background: cor.hex,
                      boxShadow: cor.hex === '#ffffff' ? 'inset 0 0 0 1px #e8eaf2' : undefined,
                    }}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 font-sans text-sm font-medium text-ink">Tamanho</p>
              <div className="flex flex-wrap gap-2">
                {produto.tamanhos.map((t, i) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTamanhoSelecionado(i)}
                    className={`rounded-full px-4 py-2 font-sans text-sm font-medium transition ${
                      i === tamanhoSelecionado
                        ? 'bg-primary text-white'
                        : 'border border-primary text-primary hover:bg-primary/5'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <p className="font-sans text-sm leading-relaxed text-muted-fg">
              {produto.descricaoCompleta}
            </p>

            <button
              type="button"
              className="w-full rounded-full bg-primary px-6 py-3 font-sans text-sm font-semibold text-white transition hover:bg-tertiary"
            >
              Adicionar ao Carrinho
            </button>

            <a
              href={produto.shopUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center font-sans text-sm font-medium text-primary underline-offset-2 transition hover:text-tertiary hover:underline"
            >
              Ir para o site da loja →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
