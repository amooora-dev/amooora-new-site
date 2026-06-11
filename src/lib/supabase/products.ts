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

export type SingleProductResult = {
  produto: ProdutoLoja | null;
  source: 'supabase' | 'static';
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

export async function fetchSingleProduct(slug: string): Promise<SingleProductResult> {
  if (!isSupabaseConfigured()) {
    return {
      produto: PRODUTOS_LOJA.find((p) => p.slug === slug) ?? null,
      source: 'static',
    };
  }

  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return {
      produto: PRODUTOS_LOJA.find((p) => p.slug === slug) ?? null,
      source: 'static',
    };
  }

  const { data, error } = await supabase
    .from('store_products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    const staticProduto = PRODUTOS_LOJA.find((p) => p.slug === slug) ?? null;
    return { produto: staticProduto, source: 'static' };
  }

  return {
    produto: mapStoreProductToProdutoLoja(data as StoreProduct, 0),
    source: 'supabase',
  };
}
