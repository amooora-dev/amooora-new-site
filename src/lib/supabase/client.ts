import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  SUPABASE_DB_SCHEMA,
  getSupabaseAnonKey,
  getSupabaseUrl,
  getServerSupabaseKey,
  isSupabaseBrowserConfigured,
  isSupabaseConfigured,
} from './config';

let browserClient: SupabaseClient<any, string, string> | null = null;

/**
 * Cliente browser — aponta para schema ecommerce-amooora (não public).
 * Retorna null se Supabase não estiver configurado (.env ausente).
 */
export function createSupabaseBrowserClient(): SupabaseClient<any, string, string> | null {
  if (!isSupabaseBrowserConfigured()) return null;

  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) return null;

  if (!browserClient) {
    browserClient = createClient(url, key, {
      db: { schema: SUPABASE_DB_SCHEMA },
      auth: { persistSession: true },
    });
  }

  return browserClient;
}

/**
 * Cliente server — Server Components / Route Handlers.
 */
export function createSupabaseServerClient(): SupabaseClient<any, string, string> | null {
  if (!isSupabaseConfigured()) return null;

  const url = getSupabaseUrl();
  const key = getServerSupabaseKey();
  if (!url || !key) return null;

  return createClient(url, key, {
    db: { schema: SUPABASE_DB_SCHEMA },
    auth: { persistSession: false },
  });
}
