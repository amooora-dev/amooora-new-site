import { PRODUTOS_LOJA, type ProdutoLoja } from '@/lib/loja-data';
import { createSupabaseServerClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { StoreProduct } from '@/lib/supabase/database.types';
import { mapStoreProductToProdutoLoja } from '@/lib/supabase/map-product';

export type StoreProductsResult = {
  produtos: ProdutoLoja[];
  source: 'supabase' | 'static';
  error: string | null;
};

function staticFallback(error: string | null): StoreProductsResult {
  return {
    produtos: PRODUTOS_LOJA,
    source: 'static',
    error,
  };
}

export async function fetchStoreProducts(): Promise<StoreProductsResult> {
  if (!isSupabaseConfigured()) {
    return staticFallback(null);
  }

  const supabase = createSupabaseServerClient();
  if (!supabase) return staticFallback(null);

  const { data, error } = await supabase
    .from('store_products')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error || !data?.length) {
    return staticFallback(error?.message ?? 'Nenhum produto ativo no banco.');
  }

  return {
    produtos: (data as StoreProduct[]).map((row, i) =>
      mapStoreProductToProdutoLoja(row, i)
    ),
    source: 'supabase',
    error: null,
  };
}
