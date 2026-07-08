import Link from 'next/link';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Página não encontrada — Amooora',
  description: 'A página que você procura não foi encontrada.',
  noIndex: true,
});

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-off-white px-6 text-center">
      <p className="mb-2 font-sans text-sm font-semibold uppercase tracking-[0.2em] text-primary">
        Erro 404
      </p>
      <h1 className="mb-4 font-serif text-4xl font-bold text-ink">Página não encontrada</h1>
      <p className="mb-8 max-w-md font-sans text-base text-muted-fg">
        O conteúdo pode ter sido movido ou o endereço está incorreto.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-primary px-6 py-3 font-sans text-sm font-semibold text-white transition hover:brightness-95"
        >
          Voltar para a home
        </Link>
        <Link
          href="/loja"
          className="rounded-full border border-primary px-6 py-3 font-sans text-sm font-semibold text-primary transition hover:bg-primary/5"
        >
          Ir para a loja
        </Link>
      </div>
    </main>
  );
}
