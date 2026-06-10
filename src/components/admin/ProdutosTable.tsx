'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteProductAction, toggleActiveAction } from '@/app/admin/(protected)/produtos/actions';
import type { ProductBadge, ProductCategory } from '@/lib/supabase/database.types';

const CATEGORY_LABEL: Record<ProductCategory, string> = {
  camisetas: 'Camisetas',
  moletons: 'Moletons',
  acessorios: 'Acessórios',
};

const BADGE_LABEL: Record<ProductBadge, string> = {
  novo: 'NOVO',
  mais_vendido: 'MAIS VENDIDO',
  edicao_limitada: 'EDIÇÃO LIMITADA',
};

type Row = {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  badge: ProductBadge | null;
  active: boolean;
  thumb: string | null;
};

export function ProdutosTable({ products }: { products: Row[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Excluir "${name}"? Esta ação não pode ser desfeita.`)) return;
    setDeleting(id);
    await deleteProductAction(id);
  };

  const handleToggle = async (id: string, active: boolean) => {
    await toggleActiveAction(id, !active);
    router.refresh();
  };

  if (!products.length) {
    return (
      <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
        <p className="font-sans text-muted-fg">Nenhum produto encontrado.</p>
        <Link
          href="/admin/produtos/novo"
          className="mt-4 inline-block rounded-full bg-primary px-6 py-3 font-sans text-sm font-semibold text-white"
        >
          Criar primeiro produto
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-black/5 bg-muted/40 text-left">
              <th className="px-4 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted-fg">Produto</th>
              <th className="px-4 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted-fg">Categoria</th>
              <th className="px-4 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted-fg">Preço</th>
              <th className="px-4 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted-fg">Status</th>
              <th className="px-4 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted-fg">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {p.thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.thumb} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-muted-fg">—</div>
                      )}
                    </div>
                    <div>
                      <p className="font-sans text-sm font-medium text-ink">{p.name}</p>
                      {p.badge && (
                        <span className="font-sans text-[10px] uppercase text-primary">
                          {BADGE_LABEL[p.badge]}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-sans text-sm text-muted-fg">
                  {CATEGORY_LABEL[p.category]}
                </td>
                <td className="px-4 py-3 font-sans text-sm font-medium text-ink">
                  {Number(p.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => handleToggle(p.id, p.active)}
                    className={`rounded-full px-3 py-1 font-sans text-xs font-medium ${
                      p.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {p.active ? 'Ativo' : 'Inativo'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/produtos/${p.id}`}
                      className="rounded-lg bg-primary/10 px-3 py-1.5 font-sans text-xs font-medium text-primary hover:bg-primary/20"
                    >
                      Editar
                    </Link>
                    <button
                      type="button"
                      disabled={deleting === p.id}
                      onClick={() => handleDelete(p.id, p.name)}
                      className="rounded-lg bg-red-50 px-3 py-1.5 font-sans text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
