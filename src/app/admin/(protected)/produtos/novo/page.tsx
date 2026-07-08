import { ProdutoForm } from '@/components/admin/ProdutoForm';
import { AdminPageHeader } from '@/components/admin/admin-ui';
import { listProductBadges } from '@/lib/admin/badge-repository';

export const metadata = { title: 'Novo produto — CMS Amooora' };

export default async function NovoProdutoPage() {
  const defaultWhatsappPhone = process.env.WHATSAPP_DEFAULT_PHONE ?? '';
  const availableBadges = await listProductBadges();

  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader
        title="Novo produto"
        description="Preencha os dados para publicar na loja"
        breadcrumb={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Produtos', href: '/admin/produtos' },
          { label: 'Novo' },
        ]}
      />
      <ProdutoForm defaultWhatsappPhone={defaultWhatsappPhone} availableBadges={availableBadges} />
    </div>
  );
}
