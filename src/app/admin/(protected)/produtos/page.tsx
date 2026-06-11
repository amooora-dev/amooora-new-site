import { ProdutosTable } from '@/components/admin/ProdutosTable';
import { IconPlus, IconSearch } from '@/components/admin/admin-icons';
import { AdminAlert, AdminButton, AdminCard, AdminPageHeader, adminInputClass } from '@/components/admin/admin-ui';
import { isAdminReadOnly, listAdminProducts } from '@/lib/admin/product-repository';
import type { ProductCategory } from '@/lib/supabase/database.types';

export const metadata = { title: 'Produtos — CMS Amooora' };

const CATEGORIES = [
  { value: '', label: 'Todas as categorias' },
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

  const readOnly = isAdminReadOnly();
  let products: Awaited<ReturnType<typeof listAdminProducts>> = [];
  let error: string | null = null;

  try {
    products = await listAdminProducts({ search: search || undefined, category: category || undefined });
  } catch (e) {
    error = e instanceof Error ? e.message : 'Erro ao carregar produtos';
  }

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="Produtos"
        description="Gerencie o catálogo da loja"
        breadcrumb={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Produtos' },
        ]}
        action={
          <AdminButton href="/admin/produtos/novo" variant="primary">
            <IconPlus className="h-4 w-4" />
            Novo produto
          </AdminButton>
        }
      />

      {searchParams.deleted === '1' && (
        <div className="mb-4">
          <AdminAlert variant="success">Produto excluído com sucesso.</AdminAlert>
        </div>
      )}

      {readOnly && !error && (
        <div className="mb-4">
          <AdminAlert variant="warning">
            <strong>Somente leitura.</strong> A loja pública funciona com a anon key; o admin precisa de{' '}
            <code className="rounded bg-amber-100/80 px-1">SUPABASE_SERVICE_ROLE_KEY</code> na Vercel
            (Production) para criar, editar e excluir. Depois de adicionar, faça redeploy.
          </AdminAlert>
        </div>
      )}

      {error && (
        <div className="mb-4">
          <AdminAlert variant="error">{error}</AdminAlert>
        </div>
      )}

      <AdminCard className="mb-6" padding="p-4 md:p-5">
        <form className="flex flex-col gap-3 md:flex-row md:items-center" method="get">
          <div className="relative min-w-0 flex-1">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-fg" />
            <input
              type="search"
              name="q"
              defaultValue={search}
              placeholder="Buscar por nome…"
              className={`${adminInputClass} pl-10`}
            />
          </div>
          <select
            name="categoria"
            defaultValue={category}
            className={`${adminInputClass} md:w-52`}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <AdminButton type="submit" variant="secondary" className="md:w-auto">
            Filtrar
          </AdminButton>
        </form>
      </AdminCard>

      <ProdutosTable products={products} />
    </div>
  );
}
