import { createAdminReadClient, createAdminWriteClient } from '@/lib/supabase/client';

export function normalizeBadgeLabel(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ');
}

export async function listProductBadges(): Promise<string[]> {
  const supabase = createAdminReadClient();
  if (!supabase) return DEFAULT_BADGES;

  const { data, error } = await supabase
    .from('product_badges')
    .select('label')
    .order('label', { ascending: true });

  if (error) {
    if (error.message.includes('product_badges')) return DEFAULT_BADGES;
    throw new Error(error.message);
  }

  const labels = (data ?? []).map((row) => row.label).filter(Boolean);
  return labels.length ? labels : DEFAULT_BADGES;
}

export async function ensureProductBadge(label: string): Promise<void> {
  const normalized = normalizeBadgeLabel(label);
  if (!normalized) return;

  const supabase = createAdminWriteClient();
  if (!supabase) return;

  const { error } = await supabase
    .from('product_badges')
    .upsert({ label: normalized }, { onConflict: 'label' });

  if (error) throw new Error(error.message);
}

const DEFAULT_BADGES = ['Novo', 'Mais vendido', 'Edição limitada'];
