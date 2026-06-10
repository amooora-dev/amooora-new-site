import Link from 'next/link';
import { ProdutoForm } from '@/components/admin/ProdutoForm';

export const metadata = { title: 'Novo produto — CMS Amooora' };

export default function NovoProdutoPage() {
  const defaultWhatsappPhone = process.env.WHATSAPP_DEFAULT_PHONE ?? '';

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/produtos" className="font-sans text-sm text-primary hover:underline">
          ← Voltar para produtos
        </Link>
        <h1 className="mt-2 font-serif text-3xl font-bold text-ink">Novo produto</h1>
      </div>
      <ProdutoForm defaultWhatsappPhone={defaultWhatsappPhone} />
    </div>
  );
}
