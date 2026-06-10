import Link from 'next/link';
import { getDashboardStats } from '@/lib/admin/dashboard-stats';
import { SUPABASE_DB_SCHEMA } from '@/lib/supabase/config';

export const metadata = {
  title: 'Dashboard — CMS Amooora',
};

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <p className="font-sans text-sm text-muted-fg">{label}</p>
      <p className="mt-2 font-serif text-3xl font-bold text-ink">{value}</p>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink">Dashboard</h1>
          <p className="mt-1 font-sans text-muted-fg">Visão geral da Loja Amooora</p>
        </div>
        <span
          className={`rounded-full px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-wide ${
            stats.dbConnected
              ? 'bg-green-100 text-green-800'
              : 'bg-amber-100 text-amber-900'
          }`}
        >
          {stats.dbConnected ? 'Supabase conectado' : 'Modo estático / SQL pendente'}
        </span>
      </div>

      {!stats.dbConnected && stats.dbError && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="font-sans text-sm font-medium text-amber-950">Próximo passo</p>
          <p className="mt-1 font-sans text-sm text-amber-900">{stats.dbError}</p>
          <ol className="mt-3 list-inside list-decimal space-y-1 font-sans text-sm text-amber-900">
            <li>Supabase → Settings → API → Exposed schemas → adicionar <code className="rounded bg-amber-100 px-1">{SUPABASE_DB_SCHEMA}</code></li>
            <li>SQL Editor → rodar <code className="rounded bg-amber-100 px-1">supabase/migrations/001_loja_cms.sql</code></li>
            <li>Depois rodar <code className="rounded bg-amber-100 px-1">supabase/seed.sql</code></li>
          </ol>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total de produtos" value={stats.totalProducts} />
        <StatCard label="Camisetas" value={stats.byCategory.camisetas} />
        <StatCard label="Moletons" value={stats.byCategory.moletons} />
        <StatCard label="Acessórios" value={stats.byCategory.acessorios} />
      </div>

      {stats.dbConnected && (
        <p className="mb-6 font-sans text-sm text-green-800">
          Loja pública em <Link href="/loja" className="font-semibold text-primary hover:underline">/loja</Link> lê produtos do Supabase (revalida a cada 60s).
        </p>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-ink">Últimos produtos</h2>
          {stats.recentProducts.length === 0 ? (
            <p className="mt-4 font-sans text-sm text-muted-fg">Nenhum produto cadastrado.</p>
          ) : (
            <ul className="mt-4 divide-y divide-black/5">
              {stats.recentProducts.map((p) => (
                <li key={p.name} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-sans text-sm font-medium text-ink">{p.name}</p>
                    <p className="font-sans text-xs text-muted-fg">{p.category}</p>
                  </div>
                  {p.createdAt && (
                    <time className="font-sans text-xs text-muted-fg">
                      {new Date(p.createdAt).toLocaleDateString('pt-BR')}
                    </time>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-ink">Ações rápidas</h2>
          <div className="mt-4 space-y-3">
            <Link
              href="/loja"
              className="flex items-center justify-center rounded-full border border-primary px-6 py-3 font-sans text-sm font-semibold text-primary transition hover:bg-primary/5"
            >
              Ver loja pública
            </Link>
            <Link
              href="/admin/produtos/novo"
              className="rounded-full bg-primary px-6 py-3 font-sans text-sm font-semibold text-white transition hover:bg-tertiary"
            >
              Adicionar produto
            </Link>
            <p className="font-sans text-xs text-muted-fg">
              Fonte dos dados:{' '}
              <strong>{stats.source === 'supabase' ? 'Supabase' : 'Arquivo estático (loja-data.ts)'}</strong>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
