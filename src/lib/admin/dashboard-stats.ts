import { PRODUTOS_LOJA } from '@/lib/loja-data';
import { createAdminReadClient } from '@/lib/supabase/client';
import { getSupabaseConfigStatus, isSupabaseConfigured, SUPABASE_DB_SCHEMA } from '@/lib/supabase/config';

export type RecentProduct = {
  name: string;
  category: string;
  createdAt: string | null;
  thumb: string | null;
};

export type DashboardStats = {
  source: 'supabase' | 'static';
  dbConnected: boolean;
  readOnly: boolean;
  dbError: string | null;
  totalProducts: number;
  byCategory: { camisetas: number; moletons: number; acessorios: number };
  recentProducts: RecentProduct[];
};

function staticStats(dbError: string | null = 'Tabelas ainda não criadas — rode os SQL no Supabase.'): DashboardStats {
  const byCategory = { camisetas: 0, moletons: 0, acessorios: 0 };
  for (const p of PRODUTOS_LOJA) {
    const key = p.categoria === 'Camisetas' ? 'camisetas' : p.categoria === 'Moletons' ? 'moletons' : 'acessorios';
    byCategory[key]++;
  }
  return {
    source: 'static',
    dbConnected: false,
    readOnly: false,
    dbError,
    totalProducts: PRODUTOS_LOJA.length,
    byCategory,
    recentProducts: PRODUTOS_LOJA.slice(0, 5).map((p) => ({
      name: p.nome,
      category: p.categoria,
      createdAt: null,
      thumb: p.imagem ?? null,
    })),
  };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const config = getSupabaseConfigStatus();

  if (!isSupabaseConfigured()) {
    return staticStats(
      !config.url
        ? 'NEXT_PUBLIC_SUPABASE_URL não configurada na Vercel.'
        : 'NEXT_PUBLIC_SUPABASE_ANON_KEY não configurada na Vercel.'
    );
  }

  const supabase = createAdminReadClient();
  if (!supabase) return staticStats();

  const readOnly = !config.canWriteAdmin;

  const { data, error } = await supabase
    .from('products')
    .select('id, name, category, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return {
      ...staticStats(
        error.message.includes('does not exist')
          ? `Schema "${SUPABASE_DB_SCHEMA}" sem tabelas — rode supabase/migrations/001_loja_cms.sql`
          : error.message
      ),
      readOnly,
    };
  }

  const byCategory = { camisetas: 0, moletons: 0, acessorios: 0 };
  for (const row of data ?? []) {
    const cat = row.category as keyof typeof byCategory;
    if (cat in byCategory) byCategory[cat]++;
  }

  const categoryLabel: Record<string, string> = {
    camisetas: 'Camisetas',
    moletons: 'Moletons',
    acessorios: 'Acessórios',
  };

  const recent = (data ?? []).slice(0, 5);
  const recentIds = recent.map((row) => row.id);

  const thumbByProductId = new Map<string, string>();
  if (recentIds.length) {
    const { data: images } = await supabase
      .from('product_images')
      .select('product_id, url, is_primary')
      .in('product_id', recentIds);

    for (const id of recentIds) {
      const imgs = (images ?? []).filter((i) => i.product_id === id);
      const primary = imgs.find((i) => i.is_primary) ?? imgs[0];
      if (primary?.url) thumbByProductId.set(id, primary.url);
    }
  }

  return {
    source: 'supabase',
    dbConnected: true,
    readOnly,
    dbError: readOnly
      ? 'SUPABASE_SERVICE_ROLE_KEY ausente na Vercel — você vê os produtos ativos, mas criar/editar exige a service role + redeploy.'
      : null,
    totalProducts: data?.length ?? 0,
    byCategory,
    recentProducts: recent.map((row) => ({
      name: row.name,
      category: categoryLabel[row.category] ?? row.category,
      createdAt: row.created_at,
      thumb: thumbByProductId.get(row.id) ?? null,
    })),
  };
}
