'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteProductAction, toggleActiveAction } from '@/app/admin/(protected)/produtos/actions';
import { AdminBadge, AdminButton } from '@/components/admin/admin-ui';
import type { ProductCategory } from '@/lib/supabase/database.types';

const CATEGORY_LABEL: Record<ProductCategory, string> = {
  camisetas: 'Camisetas',
  moletons: 'Moletons',
  acessorios: 'Acessórios',
};

type Row = {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  badge: string | null;
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
      <div className="rounded-2xl border border-black/[0.06] bg-white px-6 py-16 text-center shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <p className="font-sans text-muted-fg">Nenhum produto encontrado.</p>
        <AdminButton href="/admin/produtos/novo" variant="primary" className="mt-5">
          Criar primeiro produto
        </AdminButton>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px]">
          <thead>
            <tr className="border-b border-black/[0.06] bg-[#FAFAFA] text-left">
              <th className="px-5 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-muted-fg">
                Produto
              </th>
              <th className="px-5 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-muted-fg">
                Categoria
              </th>
              <th className="px-5 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-muted-fg">
                Preço
              </th>
              <th className="px-5 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-muted-fg">
                Status
              </th>
              <th className="px-5 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-muted-fg">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className="border-b border-black/[0.04] transition last:border-0 hover:bg-primary/[0.02]"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-muted ring-1 ring-black/[0.06]">
                      {p.thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.thumb} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-muted-fg">—</div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-sans text-sm font-medium text-ink">{p.name}</p>
                      {p.badge && (
                        <span className="font-sans text-[10px] font-semibold uppercase tracking-wide text-primary">
                          {p.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 font-sans text-sm text-muted-fg">{CATEGORY_LABEL[p.category]}</td>
                <td className="px-5 py-4 font-sans text-sm font-semibold text-ink">
                  {Number(p.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => handleToggle(p.id, p.active)}
                    className="transition hover:opacity-80"
                    title={p.active ? 'Clique para desativar' : 'Clique para ativar'}
                  >
                    <AdminBadge variant={p.active ? 'success' : 'muted'}>
                      {p.active ? 'Ativo' : 'Inativo'}
                    </AdminBadge>
                  </button>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/produtos/${p.id}`}
                      className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1.5 font-sans text-xs font-semibold text-primary transition hover:bg-primary/15"
                    >
                      Editar
                    </Link>
                    <button
                      type="button"
                      disabled={deleting === p.id}
                      onClick={() => handleDelete(p.id, p.name)}
                      className="inline-flex items-center rounded-lg bg-red-50 px-3 py-1.5 font-sans text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                    >
                      {deleting === p.id ? '…' : 'Excluir'}
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
