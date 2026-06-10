/**
 * Configuração Supabase — schema dedicado da loja Amooora.
 * Todo o CMS (tabelas, views, enums) vive em ecommerce-amooora, não em public.
 */

/** Schema PostgreSQL da loja (com hífen — igual ao criado no Supabase Table Editor) */
export const SUPABASE_DB_SCHEMA =
  process.env.SUPABASE_DB_SCHEMA ?? 'ecommerce-amooora';

/** Bucket Storage isolado (Storage não usa schema SQL) */
export const SUPABASE_STORAGE_BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET ?? 'ecommerce-amooora-produtos';

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
