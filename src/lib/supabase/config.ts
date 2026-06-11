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

function envValue(key: string): string | undefined {
  const value = process.env[key]?.trim();
  return value || undefined;
}

export function getSupabaseUrl(): string | undefined {
  return envValue('NEXT_PUBLIC_SUPABASE_URL');
}

export function getSupabaseAnonKey(): string | undefined {
  return envValue('NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export function getSupabaseServiceKey(): string | undefined {
  return (
    envValue('SUPABASE_SERVICE_ROLE_KEY') ??
    envValue('SUPABASE_SERVICE_KEY') ??
    envValue('SUPABASE_SERVICE_ROLE')
  );
}

/** Diagnóstico (sem expor valores) — útil no painel admin */
export function getSupabaseConfigStatus() {
  return {
    url: Boolean(getSupabaseUrl()),
    anonKey: Boolean(getSupabaseAnonKey()),
    serviceRoleKey: Boolean(getSupabaseServiceKey()),
    schema: SUPABASE_DB_SCHEMA,
    canReadStore: isSupabaseConfigured(),
    canWriteAdmin: isSupabaseAdminConfigured(),
  };
}

/** Chave para Server Components / admin (service role preferida) */
export function getServerSupabaseKey(): string | undefined {
  return getSupabaseServiceKey() ?? getSupabaseAnonKey();
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getServerSupabaseKey());
}

/** Loja/cliente browser — exige anon key */
export function isSupabaseBrowserConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

/** Admin/CMS — exige service role (bypass RLS + INSERT/UPDATE/DELETE) */
export function isSupabaseAdminConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseServiceKey());
}
