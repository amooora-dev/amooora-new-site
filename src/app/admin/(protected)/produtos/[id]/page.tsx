import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProdutoForm } from '@/components/admin/ProdutoForm';
import { getAdminProduct } from '@/lib/admin/product-repository';

export const metadata = { title: 'Editar produto — CMS Amooora' };

export default async function EditarProdutoPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { saved?: string };
}) {
  let product;
  try {
    product = await getAdminProduct(params.id);
  } catch {
    notFound();
  }
  if (!product) notFound();

  const defaultWhatsappPhone = process.env.WHATSAPP_DEFAULT_PHONE ?? '';

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/produtos" className="font-sans text-sm text-primary hover:underline">
          ← Voltar para produtos
        </Link>
        <h1 className="mt-2 font-serif text-3xl font-bold text-ink">Editar produto</h1>
        <p className="font-sans text-sm text-muted-fg">{product.name}</p>
      </div>

      {searchParams.saved === '1' && (
        <p className="mb-6 max-w-3xl rounded-xl bg-green-50 px-4 py-3 font-sans text-sm text-green-800">
          Produto salvo! As alterações aparecem na{' '}
          <Link href="/loja" className="font-semibold text-primary hover:underline">loja</Link>{' '}
          em até 60 segundos.
        </p>
      )}

      <ProdutoForm product={product} defaultWhatsappPhone={defaultWhatsappPhone} />
    </div>
  );
}
