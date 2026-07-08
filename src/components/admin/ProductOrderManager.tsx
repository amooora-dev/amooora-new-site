'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { saveProductOrderAction } from '@/app/admin/(protected)/produtos/actions';
import { AdminBadge, AdminButton } from '@/components/admin/admin-ui';
import type { ProductCategory } from '@/lib/supabase/database.types';

const CATEGORY_LABEL: Record<ProductCategory, string> = {
  camisetas: 'Camisetas',
  moletons: 'Moletons',
  acessorios: 'Acessórios',
};

export type ProductOrderItem = {
  id: string;
  name: string;
  category: ProductCategory;
  badge: string | null;
  active: boolean;
  sort_order: number;
  thumb: string | null;
};

function reorderList<T>(list: T[], from: number, to: number): T[] {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function GripIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="9" cy="7" r="1.5" />
      <circle cx="15" cy="7" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="9" cy="17" r="1.5" />
      <circle cx="15" cy="17" r="1.5" />
    </svg>
  );
}

export function ProductOrderManager({ products: initial }: { products: ProductOrderItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [dirty, setDirty] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setItems(initial);
    setDirty(false);
  }, [initial]);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length || from === to) return;
    setItems((list) => reorderList(list, from, to));
    setDirty(true);
    setFeedback(null);
  };

  const handleDragStart = (index: number) => {
    setDragIndex(index);
    setOverIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setOverIndex(index);
    setItems((list) => reorderList(list, dragIndex, index));
    setDragIndex(index);
    setDirty(true);
    setFeedback(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  const handleSave = () => {
    startTransition(async () => {
      const result = await saveProductOrderAction(items.map((p) => p.id));
      if (result.error) {
        setFeedback({ type: 'error', text: result.error });
        return;
      }
      setDirty(false);
      setFeedback({ type: 'success', text: result.success ?? 'Ordem salva.' });
      router.refresh();
    });
  };

  const handleReset = () => {
    setItems(initial);
    setDirty(false);
    setFeedback(null);
  };

  if (!items.length) {
    return (
      <p className="rounded-2xl border border-black/[0.06] bg-white px-6 py-12 text-center font-sans text-muted-fg">
        Nenhum produto cadastrado para ordenar.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {feedback && (
        <p
          className={`rounded-xl px-4 py-3 font-sans text-sm ${
            feedback.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}
          role="alert"
        >
          {feedback.text}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-sans text-sm text-muted-fg">
          Arraste os itens para cima ou para baixo. A loja só muda após clicar em <strong>Salvar ordem</strong>.
        </p>
        <div className="flex gap-2">
          {dirty && (
            <AdminButton type="button" variant="secondary" onClick={handleReset} disabled={isPending}>
              Desfazer
            </AdminButton>
          )}
          <AdminButton
            type="button"
            variant="primary"
            onClick={handleSave}
            disabled={!dirty || isPending}
          >
            {isPending ? 'Salvando…' : 'Salvar ordem'}
          </AdminButton>
        </div>
      </div>

      <ul className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        {items.map((product, index) => {
          const isDragging = dragIndex === index;
          const isOver = overIndex === index && dragIndex !== null;

          return (
            <li
              key={product.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-3 border-b border-black/[0.06] px-4 py-3 last:border-b-0 transition ${
                isDragging ? 'opacity-50' : ''
              } ${isOver ? 'bg-primary/[0.04]' : 'bg-white'}`}
            >
              <button
                type="button"
                onClick={() => move(index, index - 1)}
                disabled={index === 0 || isPending}
                aria-label="Mover para cima"
                className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black/10 text-muted-fg transition hover:border-primary/30 hover:text-primary disabled:opacity-30 sm:flex"
              >
                ↑
              </button>

              <span
                className="flex h-10 w-10 shrink-0 cursor-grab items-center justify-center rounded-xl bg-muted text-muted-fg active:cursor-grabbing"
                aria-hidden
              >
                <GripIcon />
              </span>

              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-off-white font-sans text-xs font-bold text-primary">
                {index + 1}
              </span>

              <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-muted">
                {product.thumb ? (
                  <Image src={product.thumb} alt="" fill className="object-cover" sizes="44px" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-sans text-[10px] text-muted-fg">
                    —
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-sans text-sm font-medium text-ink">{product.name}</p>
                <div className="mt-0.5 flex flex-wrap items-center gap-2">
                  <span className="font-sans text-xs text-muted-fg">
                    {CATEGORY_LABEL[product.category]}
                  </span>
                  {product.badge && (
                    <AdminBadge>{product.badge}</AdminBadge>
                  )}
                  {!product.active && (
                    <span className="font-sans text-xs text-red-600">Inativo</span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => move(index, index + 1)}
                disabled={index === items.length - 1 || isPending}
                aria-label="Mover para baixo"
                className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black/10 text-muted-fg transition hover:border-primary/30 hover:text-primary disabled:opacity-30 sm:flex"
              >
                ↓
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
