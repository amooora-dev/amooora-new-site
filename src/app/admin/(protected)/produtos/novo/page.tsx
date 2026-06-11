import { ProdutoForm } from '@/components/admin/ProdutoForm';
import { AdminPageHeader } from '@/components/admin/admin-ui';

export const metadata = { title: 'Novo produto — CMS Amooora' };

export default function NovoProdutoPage() {
  const defaultWhatsappPhone = process.env.WHATSAPP_DEFAULT_PHONE ?? '';

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
      <ProdutoForm defaultWhatsappPhone={defaultWhatsappPhone} />
    </div>
  );
}
