import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_DB_SCHEMA, isSupabaseConfigured } from './config';

let browserClient: SupabaseClient<any, string, string> | null = null;

/**
 * Cliente browser — aponta para schema ecommerce-amooora (não public).
 * Retorna null se Supabase não estiver configurado (.env ausente).
 */
export function createSupabaseBrowserClient(): SupabaseClient<any, string, string> | null {
  if (!isSupabaseConfigured()) return null;

  if (!browserClient) {
    browserClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        db: { schema: SUPABASE_DB_SCHEMA },
        auth: { persistSession: true },
      }
    );
  }

  return browserClient;
}

/**
 * Cliente server — Server Components / Route Handlers.
 */
export function createSupabaseServerClient(): SupabaseClient<any, string, string> | null {
  if (!isSupabaseConfigured()) return null;

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: { schema: SUPABASE_DB_SCHEMA },
      auth: { persistSession: false },
    }
  );
}
