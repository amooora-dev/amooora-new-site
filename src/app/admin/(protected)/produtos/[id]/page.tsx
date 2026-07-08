import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProdutoForm } from '@/components/admin/ProdutoForm';
import { AdminAlert, AdminPageHeader } from '@/components/admin/admin-ui';
import { listProductBadges } from '@/lib/admin/badge-repository';
import { getAdminProduct } from '@/lib/admin/product-repository';

export const metadata = { title: 'Editar produto — CMS Amooora' };

export default async function EditarProdutoPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { saved?: string; t?: string };
}) {
  let product;
  try {
    product = await getAdminProduct(params.id);
  } catch {
    notFound();
  }
  if (!product) notFound();

  const defaultWhatsappPhone = process.env.WHATSAPP_DEFAULT_PHONE ?? '';
  const availableBadges = await listProductBadges();

  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader
        title="Editar produto"
        description={product.name}
        breadcrumb={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Produtos', href: '/admin/produtos' },
          { label: product.name },
        ]}
      />

      {searchParams.saved && (
        <div className="mb-6">
          <AdminAlert variant="success">
            Produto salvo! As alterações aparecem na{' '}
            <Link href="/loja" className="font-semibold underline-offset-2 hover:underline">
              loja
            </Link>{' '}
            em até 60 segundos.
          </AdminAlert>
        </div>
      )}

      <ProdutoForm
        key={`${product.id}-${product.sold_out ? 'esgotado' : 'disponivel'}-${searchParams.saved ?? 'edit'}`}
        product={product}
        defaultWhatsappPhone={defaultWhatsappPhone}
        availableBadges={availableBadges}
      />
    </div>
  );
}
