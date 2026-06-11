import Link from 'next/link';
import { getDashboardStats } from '@/lib/admin/dashboard-stats';
import { SUPABASE_DB_SCHEMA } from '@/lib/supabase/config';
import { IconPackage, IconPlus, IconProducts, IconStore, IconTrending } from '@/components/admin/admin-icons';
import {
  AdminAlert,
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminPageHeader,
  AdminStatCard,
} from '@/components/admin/admin-ui';

export const metadata = {
  title: 'Dashboard — CMS Amooora',
};

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="mx-auto max-w-6xl">
      <AdminPageHeader
        title="Dashboard"
        description="Visão geral do catálogo e status da loja"
        breadcrumb={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'Dashboard' }]}
        action={
          <AdminBadge variant={stats.dbConnected ? 'success' : 'default'}>
            {stats.dbConnected ? 'Supabase conectado' : 'Modo estático'}
          </AdminBadge>
        }
      />

      {!stats.dbConnected && stats.dbError && (
        <AdminAlert variant="warning" >
          <p className="font-medium">Próximo passo</p>
          <p className="mt-1 opacity-90">{stats.dbError}</p>
          <ol className="mt-3 list-inside list-decimal space-y-1 opacity-90">
            <li>
              Supabase → Settings → API → Exposed schemas → adicionar{' '}
              <code className="rounded bg-amber-100/80 px-1">{SUPABASE_DB_SCHEMA}</code>
            </li>
            <li>
              SQL Editor → rodar{' '}
              <code className="rounded bg-amber-100/80 px-1">supabase/migrations/001_loja_cms.sql</code>
            </li>
            <li>
              Depois rodar <code className="rounded bg-amber-100/80 px-1">supabase/seed.sql</code>
            </li>
          </ol>
        </AdminAlert>
      )}

      <div className="mb-8 mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Total de produtos"
          value={stats.totalProducts}
          icon={<IconPackage className="h-5 w-5" />}
          accent="primary"
        />
        <AdminStatCard
          label="Camisetas"
          value={stats.byCategory.camisetas}
          icon={<IconProducts className="h-5 w-5" />}
          accent="tertiary"
        />
        <AdminStatCard
          label="Moletons"
          value={stats.byCategory.moletons}
          icon={<IconProducts className="h-5 w-5" />}
          accent="tertiary"
        />
        <AdminStatCard
          label="Acessórios"
          value={stats.byCategory.acessorios}
          icon={<IconTrending className="h-5 w-5" />}
          accent="green"
        />
      </div>

      {stats.dbConnected && (
        <AdminAlert variant="success">
          Loja pública em{' '}
          <Link href="/loja" className="font-semibold text-green-900 underline-offset-2 hover:underline">
            /loja
          </Link>{' '}
          lê produtos do Supabase (revalida a cada 60s).
        </AdminAlert>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <AdminCard className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-ink">Últimos produtos</h2>
            <Link href="/admin/produtos" className="font-sans text-sm font-medium text-primary hover:underline">
              Ver todos
            </Link>
          </div>
          {stats.recentProducts.length === 0 ? (
            <p className="font-sans text-sm text-muted-fg">Nenhum produto cadastrado.</p>
          ) : (
            <ul className="divide-y divide-black/[0.06]">
              {stats.recentProducts.map((p) => (
                <li key={p.name} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-muted ring-1 ring-black/[0.06]">
                      {p.thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.thumb} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center font-sans text-[10px] text-muted-fg">
                          —
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-sans text-sm font-medium text-ink">{p.name}</p>
                      <p className="font-sans text-xs capitalize text-muted-fg">{p.category}</p>
                    </div>
                  </div>
                  {p.createdAt && (
                    <time className="shrink-0 font-sans text-xs text-muted-fg">
                      {new Date(p.createdAt).toLocaleDateString('pt-BR')}
                    </time>
                  )}
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        <AdminCard className="lg:col-span-2">
          <h2 className="font-serif text-xl font-bold text-ink">Ações rápidas</h2>
          <div className="mt-5 space-y-3">
            <AdminButton href="/admin/produtos/novo" variant="primary" className="w-full">
              <IconPlus className="h-4 w-4" />
              Adicionar produto
            </AdminButton>
            <AdminButton href="/loja" variant="secondary" className="w-full">
              <IconStore className="h-4 w-4" />
              Ver loja pública
            </AdminButton>
            <p className="pt-2 font-sans text-xs text-muted-fg">
              Fonte dos dados:{' '}
              <strong className="text-ink">
                {stats.source === 'supabase' ? 'Supabase' : 'Arquivo estático (loja-data.ts)'}
              </strong>
            </p>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
