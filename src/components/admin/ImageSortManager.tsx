'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { deleteImageAction } from '@/app/admin/(protected)/produtos/actions';

export type GalleryItem =
  | { kind: 'saved'; id: string; url: string; alt: string | null }
  | { kind: 'pending'; clientId: string; previewUrl: string; file: File };

function ArrowUpIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  );
}
function ArrowDownIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}
function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

type Props = {
  productId?: string;
  items: GalleryItem[];
  onChange: (items: GalleryItem[]) => void;
};

export function ImageSortManager({ productId, items, onChange }: Props) {
  const [isPending, startTransition] = useTransition();
  const [deleting, setDeleting] = useState<string | null>(null);

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const handleDelete = (item: GalleryItem, index: number) => {
    if (!confirm('Remover esta foto?')) return;

    if (item.kind === 'pending') {
      URL.revokeObjectURL(item.previewUrl);
      onChange(items.filter((_, i) => i !== index));
      return;
    }

    if (!productId) return;
    setDeleting(item.id);
    startTransition(async () => {
      await deleteImageAction(item.id, productId);
      onChange(items.filter((_, i) => i !== index));
      setDeleting(null);
    });
  };

  if (!items.length) {
    return (
      <p className="mb-4 rounded-xl border border-dashed border-black/10 px-4 py-6 text-center font-sans text-sm text-muted-fg">
        Nenhuma foto ainda. Use o campo abaixo para adicionar.
      </p>
    );
  }

  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1;
          const isPendingItem = item.kind === 'pending';
          const key = item.kind === 'saved' ? item.id : item.clientId;
          const isDeleting = item.kind === 'saved' && deleting === item.id;
          const src = item.kind === 'saved' ? item.url : item.previewUrl;

          return (
            <div
              key={key}
              className={`relative overflow-hidden rounded-2xl border-2 bg-white transition ${
                isFirst ? 'border-primary ring-2 ring-primary/15' : 'border-black/8'
              } ${isDeleting ? 'opacity-40' : ''}`}
            >
              <div className="relative aspect-[3/4] bg-muted">
                {item.kind === 'saved' ? (
                  <Image src={src} alt={item.alt ?? ''} fill className="object-cover" sizes="160px" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt="" className="h-full w-full object-cover" />
                )}

                {isFirst ? (
                  <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 font-sans text-[10px] font-semibold text-white shadow">
                    <StarIcon filled />
                    Capa
                  </span>
                ) : isPendingItem ? (
                  <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 font-sans text-[10px] font-semibold text-white shadow">
                    Nova
                  </span>
                ) : null}

                <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 font-sans text-[10px] font-bold text-white">
                  {index + 1}
                </span>
              </div>

              <div className="flex items-center justify-between gap-1 p-2">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={isFirst || isPending}
                    aria-label="Mover para esquerda"
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-black/10 text-ink transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ArrowUpIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={isLast || isPending}
                    aria-label="Mover para direita"
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-black/10 text-ink transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ArrowDownIcon />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(item, index)}
                  disabled={isPending}
                  aria-label="Remover foto"
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50 disabled:opacity-30"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-3 font-sans text-xs text-muted-fg">
        A foto na posição <strong>1</strong> é a capa. Reordene com as setas e clique em <strong>Salvar alterações</strong> para publicar.
      </p>
    </div>
  );
}