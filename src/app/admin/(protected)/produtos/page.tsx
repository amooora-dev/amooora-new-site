import Link from 'next/link';
import { ProdutosTable } from '@/components/admin/ProdutosTable';
import { listAdminProducts } from '@/lib/admin/product-repository';
import type { ProductCategory } from '@/lib/supabase/database.types';

export const metadata = { title: 'Produtos — CMS Amooora' };

const CATEGORIES = [
  { value: '', label: 'Todas' },
  { value: 'camisetas', label: 'Camisetas' },
  { value: 'moletons', label: 'Moletons' },
  { value: 'acessorios', label: 'Acessórios' },
] as const;

export default async function AdminProdutosPage({
  searchParams,
}: {
  searchParams: { q?: string; categoria?: string; deleted?: string };
}) {
  const search = searchParams.q?.trim() ?? '';
  const category = (searchParams.categoria ?? '') as ProductCategory | '';

  let products: Awaited<ReturnType<typeof listAdminProducts>> = [];
  let error: string | null = null;

  try {
    products = await listAdminProducts({ search: search || undefined, category: category || undefined });
  } catch (e) {
    error = e instanceof Error ? e.message : 'Erro ao carregar produtos';
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink">Produtos</h1>
          <p className="mt-1 font-sans text-muted-fg">Gerencie o catálogo da loja</p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="rounded-full bg-primary px-6 py-3 font-sans text-sm font-semibold text-white transition hover:bg-tertiary"
        >
          + Novo produto
        </Link>
      </div>

      {searchParams.deleted === '1' && (
        <p className="mb-4 rounded-xl bg-green-50 px-4 py-3 font-sans text-sm text-green-800">
          Produto excluído com sucesso.
        </p>
      )}

      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 font-sans text-sm text-red-700">{error}</p>
      )}

      <form className="mb-6 flex flex-wrap gap-3" method="get">
        <input
          type="search"
          name="q"
          defaultValue={search}
          placeholder="Buscar por nome…"
          className="min-w-[200px] flex-1 rounded-xl border border-black/10 px-4 py-2.5 font-sans text-sm outline-none focus:border-primary"
        />
        <select
          name="categoria"
          defaultValue={category}
          className="rounded-xl border border-black/10 px-4 py-2.5 font-sans text-sm outline-none focus:border-primary"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-full border border-primary px-5 py-2.5 font-sans text-sm font-medium text-primary hover:bg-primary/5"
        >
          Filtrar
        </button>
      </form>

      <ProdutosTable products={products} />
    </div>
  );
}
