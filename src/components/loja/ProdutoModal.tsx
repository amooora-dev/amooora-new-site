'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ProdutoLoja } from '@/lib/loja-data';
import { isProdutoEsgotado, PRODUTO_ESGOTADO_LABEL } from '@/lib/loja/product-availability';
import { buildWhatsappUrl } from '@/lib/supabase/map-product';
import { ColorSwatches } from '@/components/loja/product/ColorSwatches';
import { ProductDescription } from '@/components/loja/product/ProductDescription';
import { ProductImageGallery } from '@/components/loja/product/ProductImageGallery';

type ProdutoModalProps = {
  produto: ProdutoLoja;
  onClose: () => void;
};

export function ProdutoModal({ produto, onClose }: ProdutoModalProps) {
  const imagens = produto.imagens.length ? produto.imagens : [produto.imagem];
  const [slideAtivo, setSlideAtivo] = useState(0);
  const [corSelecionada, setCorSelecionada] = useState(0);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState(0);

  useEffect(() => {
    setSlideAtivo(0);
    setCorSelecionada(0);
    setTamanhoSelecionado(0);
  }, [produto.uuid]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (imagens.length > 1 && e.key === 'ArrowLeft') {
        setSlideAtivo((i) => (i - 1 + imagens.length) % imagens.length);
      }
      if (imagens.length > 1 && e.key === 'ArrowRight') {
        setSlideAtivo((i) => (i + 1) % imagens.length);
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose, imagens.length]);

  const whatsappUrl = useMemo(() => {
    const cor = produto.cores[corSelecionada]?.nome;
    const tamanho = produto.tamanhos[tamanhoSelecionado];
    return buildWhatsappUrl(produto, { cor, tamanho });
  }, [produto, corSelecionada, tamanhoSelecionado]);
  const esgotado = isProdutoEsgotado(produto);

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
          className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-xl text-ink shadow-md transition hover:bg-muted"
        >
          ×
        </button>

        <div className="grid md:grid-cols-2">
          <ProductImageGallery
            variant="modal"
            imagens={imagens}
            alt={produto.nome}
            activeIndex={slideAtivo}
            onIndexChange={setSlideAtivo}
          />

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

            {esgotado ? (
              <p className="font-serif text-2xl font-bold text-muted-fg">{PRODUTO_ESGOTADO_LABEL}</p>
            ) : (
              <p className="font-serif text-2xl font-bold text-primary">{produto.preco}</p>
            )}

            <ColorSwatches
              cores={produto.cores}
              selectedIndex={corSelecionada}
              onSelect={setCorSelecionada}
              size="md"
            />

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

            <ProductDescription html={produto.descricaoCompleta} />

            {esgotado ? (
              <span
                aria-disabled="true"
                className="mt-auto w-full cursor-not-allowed rounded-full bg-black/10 px-6 py-3 text-center font-sans text-sm font-semibold text-muted-fg"
              >
                Encomendar via WhatsApp
              </span>
            ) : (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto w-full rounded-full bg-primary px-6 py-3 text-center font-sans text-sm font-semibold text-white transition hover:brightness-95"
              >
                Encomendar via WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
