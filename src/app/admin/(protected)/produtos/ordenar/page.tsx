import { ProductOrderManager } from '@/components/admin/ProductOrderManager';
import { AdminAlert, AdminPageHeader } from '@/components/admin/admin-ui';
import { isAdminReadOnly, listAdminProducts } from '@/lib/admin/product-repository';

export const metadata = { title: 'Ordenar produtos — CMS Amooora' };

export default async function OrdenarProdutosPage({
  searchParams,
}: {
  searchParams: { saved?: string };
}) {
  const readOnly = isAdminReadOnly();
  let products: Awaited<ReturnType<typeof listAdminProducts>> = [];
  let error: string | null = null;

  try {
    products = await listAdminProducts();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Erro ao carregar produtos';
  }

  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader
        title="Ordenar produtos"
        description="Defina a sequência em que os produtos aparecem na loja"
        breadcrumb={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Produtos', href: '/admin/produtos' },
          { label: 'Ordenar' },
        ]}
      />

      {searchParams.saved && (
        <div className="mb-4">
          <AdminAlert variant="success">Ordem atualizada com sucesso.</AdminAlert>
        </div>
      )}

      {readOnly && !error && (
        <div className="mb-4">
          <AdminAlert variant="warning">
            <strong>Somente leitura.</strong> É necessária a service role para salvar a nova ordem.
          </AdminAlert>
        </div>
      )}

      {error && (
        <div className="mb-4">
          <AdminAlert variant="error">{error}</AdminAlert>
        </div>
      )}

      {!error && <ProductOrderManager products={products} />}
    </div>
  );
}
