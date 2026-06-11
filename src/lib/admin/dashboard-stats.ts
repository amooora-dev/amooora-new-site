import { PRODUTOS_LOJA } from '@/lib/loja-data';
import { createSupabaseAdminClient } from '@/lib/supabase/client';
import { isSupabaseAdminConfigured, SUPABASE_DB_SCHEMA } from '@/lib/supabase/config';

export type RecentProduct = {
  name: string;
  category: string;
  createdAt: string | null;
  thumb: string | null;
};

export type DashboardStats = {
  source: 'supabase' | 'static';
  dbConnected: boolean;
  dbError: string | null;
  totalProducts: number;
  byCategory: { camisetas: number; moletons: number; acessorios: number };
  recentProducts: RecentProduct[];
};

function staticStats(): DashboardStats {
  const byCategory = { camisetas: 0, moletons: 0, acessorios: 0 };
  for (const p of PRODUTOS_LOJA) {
    const key = p.categoria === 'Camisetas' ? 'camisetas' : p.categoria === 'Moletons' ? 'moletons' : 'acessorios';
    byCategory[key]++;
  }
  return {
    source: 'static',
    dbConnected: false,
    dbError: 'Tabelas ainda não criadas — rode os SQL no Supabase.',
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
  if (!isSupabaseAdminConfigured()) return staticStats();

  const supabase = createSupabaseAdminClient();
  if (!supabase) return staticStats();

  const { data, error } = await supabase
    .from('products')
    .select('id, name, category, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return {
      ...staticStats(),
      dbError: error.message.includes('does not exist')
        ? `Schema "${SUPABASE_DB_SCHEMA}" sem tabelas — rode supabase/migrations/001_loja_cms.sql`
        : error.message,
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

  let thumbByProductId = new Map<string, string>();
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
    dbError: null,
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
