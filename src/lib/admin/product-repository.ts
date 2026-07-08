import { createAdminReadClient, createAdminWriteClient } from '@/lib/supabase/client';
import { isSupabaseAdminConfigured } from '@/lib/supabase/config';
import { SUPABASE_STORAGE_BUCKET } from '@/lib/supabase/config';
import { ensureProductBadge, normalizeBadgeLabel } from '@/lib/admin/badge-repository';
import type { ProductBadge, ProductCategory } from '@/lib/supabase/database.types';
import { slugify } from './slug';

export type AdminProductColor = {
  id?: string;
  name: string;
  hex_code: string;
  available: boolean;
  sort_order: number;
};

export type AdminProductImage = {
  id: string;
  url: string;
  alt: string | null;
  sort_order: number;
  is_primary: boolean;
};

export type AdminProductWhatsapp = {
  phone: string;
  message_template: string;
};

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  description_short: string;
  description_full: string;
  price: number;
  category: ProductCategory;
  badge: ProductBadge | null;
  active: boolean;
  featured: boolean;
  sizes: string[];
  sort_order: number;
  created_at: string;
  images: AdminProductImage[];
  colors: AdminProductColor[];
  whatsapp: AdminProductWhatsapp | null;
};

export type ImageOrderEntry =
  | { kind: 'saved'; id: string }
  | { kind: 'pending' };

export type ProductFormInput = {
  name: string;
  slug: string;
  description_short: string;
  description_full: string;
  price: number;
  category: ProductCategory;
  badge: ProductBadge | null;
  active: boolean;
  featured: boolean;
  sizes: string[];
  sort_order: number;
  colors: AdminProductColor[];
  whatsapp: AdminProductWhatsapp;
  primary_image_id?: string | null;
  image_order: ImageOrderEntry[];
};

function dbRead() {
  const client = createAdminReadClient();
  if (!client) {
    throw new Error(
      'Supabase não configurado. Verifique NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY na Vercel.'
    );
  }
  return client;
}

function dbWrite() {
  const client = createAdminWriteClient();
  if (!client) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY não configurada — leitura funciona, mas criar/editar/excluir exige a service role na Vercel (Settings → Environment Variables). Depois de adicionar, faça redeploy.'
    );
  }
  return client;
}

/** true quando o admin só consegue listar (anon), sem gravar */
export function isAdminReadOnly(): boolean {
  return !isSupabaseAdminConfigured();
}

function storagePublicUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, '');
  return `${base}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/${path}`;
}

export async function listAdminProducts(opts?: {
  search?: string;
  category?: ProductCategory | '';
}) {
  let query = dbRead()
    .from('products')
    .select('id, slug, name, price, category, badge, active, featured, sort_order, created_at')
    .order('sort_order', { ascending: true });

  if (opts?.category) query = query.eq('category', opts.category);
  if (opts?.search) query = query.ilike('name', `%${opts.search}%`);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const products = data ?? [];
  const ids = products.map((p) => p.id);
  if (!ids.length) return [];

  const { data: images } = await dbRead()
    .from('product_images')
    .select('id, product_id, url, is_primary')
    .in('product_id', ids);

  return products.map((p) => {
    const imgs = (images ?? []).filter((i) => i.product_id === p.id);
    const primary = imgs.find((i) => i.is_primary) ?? imgs[0];
    return { ...p, thumb: primary?.url ?? null };
  });
}

export async function getAdminProduct(id: string): Promise<AdminProduct | null> {
  const { data: product, error } = await dbRead()
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!product) return null;

  const [{ data: images }, { data: colors }, { data: whatsapp }] = await Promise.all([
    dbRead().from('product_images').select('*').eq('product_id', id).order('sort_order'),
    dbRead().from('product_colors').select('*').eq('product_id', id).order('sort_order'),
    dbRead().from('whatsapp_ctas').select('*').eq('product_id', id).maybeSingle(),
  ]);

  return {
    ...product,
    price: Number(product.price),
    images: images ?? [],
    colors: colors ?? [],
    whatsapp: whatsapp
      ? { phone: whatsapp.phone, message_template: whatsapp.message_template }
      : null,
  } as AdminProduct;
}

async function ensureUniqueSlug(baseSlug: string, excludeId?: string) {
  let slug = baseSlug || 'produto';
  let n = 0;
  while (true) {
    const candidate = n === 0 ? slug : `${slug}-${n}`;
    let query = dbRead().from('products').select('id').eq('slug', candidate);
    if (excludeId) query = query.neq('id', excludeId);
    const { data } = await query.maybeSingle();
    if (!data) return candidate;
    n++;
  }
}

async function saveColors(productId: string, colors: AdminProductColor[]) {
  const { error: delError } = await dbWrite().from('product_colors').delete().eq('product_id', productId);
  if (delError) throw new Error(`Erro ao limpar cores: ${delError.message}`);
  if (!colors.length) return;
  const { error } = await dbWrite().from('product_colors').insert(
    colors.map((c, i) => ({
      product_id: productId,
      name: c.name,
      hex_code: c.hex_code,
      available: c.available,
      sort_order: i,
    }))
  );
  if (error) throw new Error(error.message);
}

async function saveWhatsapp(productId: string, whatsapp: AdminProductWhatsapp) {
  const { error: delError } = await dbWrite().from('whatsapp_ctas').delete().eq('product_id', productId);
  if (delError) throw new Error(`Erro ao limpar WhatsApp: ${delError.message}`);
  const { error } = await dbWrite().from('whatsapp_ctas').insert({
    product_id: productId,
    phone: whatsapp.phone,
    message_template: whatsapp.message_template,
  });
  if (error) throw new Error(error.message);
}

async function uploadSingleImage(productId: string, file: File, sortOrder: number) {
  if (!file.size) return null;
  const supabase = dbWrite();
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${productId}/${Date.now()}-${sortOrder}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .upload(path, file, { upsert: false, contentType: file.type });

  if (uploadError) throw new Error(`Upload falhou: ${uploadError.message}`);

  const url = storagePublicUrl(path);
  const { data, error } = await supabase
    .from('product_images')
    .insert({
      product_id: productId,
      url,
      alt: file.name,
      sort_order: sortOrder,
      is_primary: false,
    })
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return data as AdminProductImage;
}

/** Alinha arquivos enviados com slots "pending" da ordem — evita upload duplicado ou órfão */
export function normalizeImageUpload(order: ImageOrderEntry[], files: File[]) {
  const validFiles = files.filter((f) => f.size > 0);
  if (!order.length) {
    return { order, files: validFiles };
  }
  const pendingSlots = order.filter((e) => e.kind === 'pending').length;
  if (pendingSlots === 0) {
    return { order, files: [] as File[] };
  }
  return { order, files: validFiles.slice(0, pendingSlots) };
}

async function applyImageOrder(productId: string, order: ImageOrderEntry[], files: File[]) {
  const { order: safeOrder, files: safeFiles } = normalizeImageUpload(order, files);

  if (!safeOrder.length) {
    if (!safeFiles.length) return;
    const { count } = await dbWrite()
      .from('product_images')
      .select('*', { count: 'exact', head: true })
      .eq('product_id', productId);
    // Produto já tem fotos: ignora arquivos sem ordem explícita (evita duplicar no re-save)
    if ((count ?? 0) > 0) return;
    for (let i = 0; i < safeFiles.length; i++) {
      await uploadSingleImage(productId, safeFiles[i], i);
    }
    await ensurePrimaryImage(productId, null);
    return;
  }

  const supabase = dbWrite();
  let fileIdx = 0;
  let primaryId: string | null = null;

  for (let i = 0; i < safeOrder.length; i++) {
    const entry = safeOrder[i];
    if (entry.kind === 'saved') {
      const { error } = await supabase
        .from('product_images')
        .update({ sort_order: i, is_primary: i === 0 })
        .eq('id', entry.id)
        .eq('product_id', productId);
      if (error) throw new Error(error.message);
      if (i === 0) primaryId = entry.id;
    } else {
      const file = safeFiles[fileIdx++];
      if (!file) continue;
      const inserted = await uploadSingleImage(productId, file, i);
      if (inserted && i === 0) primaryId = inserted.id;
    }
  }

  if (primaryId) {
    await supabase.from('product_images').update({ is_primary: false }).eq('product_id', productId);
    await supabase.from('product_images').update({ is_primary: true }).eq('id', primaryId);
  }
}

async function ensurePrimaryImage(productId: string, primaryId?: string | null) {
  const { data: images } = await dbWrite()
    .from('product_images')
    .select('id, is_primary, sort_order')
    .eq('product_id', productId)
    .order('sort_order', { ascending: true });

  if (!images?.length) return;

  // Se não foi informada uma preferência, verifica se já existe uma primária definida
  if (!primaryId) {
    const alreadyHasPrimary = images.some((i) => i.is_primary);
    if (alreadyHasPrimary) return; // respeita a ordem gerenciada pelo ImageSortManager
    primaryId = images[0].id; // fallback: primeira por sort_order
  }

  const target = images.some((i) => i.id === primaryId) ? primaryId : images[0].id;

  await dbWrite().from('product_images').update({ is_primary: false }).eq('product_id', productId);
  await dbWrite().from('product_images').update({ is_primary: true }).eq('id', target);
}

export async function createProduct(input: ProductFormInput, files: File[]) {
  const slug = await ensureUniqueSlug(input.slug || slugify(input.name));
  const sortOrder = await getNextProductSortOrder();

  const { data, error } = await dbWrite()
    .from('products')
    .insert({
      slug,
      name: input.name,
      description_short: input.description_short,
      description_full: input.description_full,
      price: input.price,
      category: input.category,
      badge: input.badge,
      active: input.active,
      featured: input.featured,
      sizes: input.sizes,
      sort_order: sortOrder,
    })
    .select('id')
    .single();

  if (error) throw new Error(error.message);
  const productId = data.id;

  if (input.badge) await ensureProductBadge(input.badge);

  await saveColors(productId, input.colors);
  await saveWhatsapp(productId, input.whatsapp);

  await applyImageOrder(productId, input.image_order, files);

  return productId;
}

export async function updateProduct(id: string, input: ProductFormInput, files: File[]) {
  const slug = await ensureUniqueSlug(input.slug || slugify(input.name), id);

  const { error } = await dbWrite()
    .from('products')
    .update({
      slug,
      name: input.name,
      description_short: input.description_short,
      description_full: input.description_full,
      price: input.price,
      category: input.category,
      badge: input.badge,
      active: input.active,
      featured: input.featured,
      sizes: input.sizes,
    })
    .eq('id', id);

  if (error) throw new Error(error.message);

  if (input.badge) await ensureProductBadge(input.badge);

  await saveColors(id, input.colors);
  await saveWhatsapp(id, input.whatsapp);

  await applyImageOrder(id, input.image_order, files);
}

export async function deleteProduct(id: string) {
  const { error } = await dbWrite().from('products').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteProductImage(imageId: string, productId: string) {
  const { data: image } = await dbWrite()
    .from('product_images')
    .select('url, is_primary')
    .eq('id', imageId)
    .maybeSingle();

  const { error } = await dbWrite().from('product_images').delete().eq('id', imageId);
  if (error) throw new Error(error.message);

  if (image?.url.includes(SUPABASE_STORAGE_BUCKET)) {
    const path = image.url.split(`${SUPABASE_STORAGE_BUCKET}/`)[1];
    if (path) await dbWrite().storage.from(SUPABASE_STORAGE_BUCKET).remove([path]);
  }

  if (image?.is_primary) {
    await ensurePrimaryImage(productId, null);
  }
}

export async function getNextProductSortOrder(): Promise<number> {
  const { data, error } = await dbRead()
    .from('products')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data?.sort_order ?? -1) + 1;
}

export async function reorderProducts(orderedIds: string[]) {
  if (!orderedIds.length) return;

  const { data: existing, error: readError } = await dbRead()
    .from('products')
    .select('id');

  if (readError) throw new Error(readError.message);

  const allIds = (existing ?? []).map((p) => p.id);
  const seen = new Set<string>();
  const fullOrder: string[] = [];

  for (const id of orderedIds) {
    if (allIds.includes(id) && !seen.has(id)) {
      fullOrder.push(id);
      seen.add(id);
    }
  }
  for (const id of allIds) {
    if (!seen.has(id)) fullOrder.push(id);
  }

  const supabase = dbWrite();
  await Promise.all(
    fullOrder.map((id, index) =>
      supabase.from('products').update({ sort_order: index }).eq('id', id)
    )
  );
}

export async function reorderProductImages(productId: string, orderedIds: string[]) {
  const supabase = dbWrite();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from('product_images').update({ sort_order: index }).eq('id', id).eq('product_id', productId)
    )
  );
  // primeira da lista vira principal
  const [first, ...rest] = orderedIds;
  if (first) {
    await supabase.from('product_images').update({ is_primary: true }).eq('id', first);
    if (rest.length) {
      await supabase.from('product_images').update({ is_primary: false }).in('id', rest);
    }
  }
}

export async function toggleProductActive(id: string, active: boolean) {
  const { error } = await dbWrite().from('products').update({ active }).eq('id', id);
  if (error) throw new Error(error.message);
}

export function parseProductFormData(formData: FormData): ProductFormInput {
  const badgeRaw = normalizeBadgeLabel(String(formData.get('badge') ?? ''));
  const sizesRaw = String(formData.get('sizes') ?? 'P, M, G, GG');

  let colors: AdminProductColor[] = [];
  try {
    colors = JSON.parse(String(formData.get('colors_json') ?? '[]'));
  } catch {
    colors = [];
  }

  return {
    name: String(formData.get('name') ?? '').trim(),
    slug: String(formData.get('slug') ?? '').trim(),
    description_short: String(formData.get('description_short') ?? '').trim(),
    description_full: String(formData.get('description_full') ?? '').trim(),
    price: Number.parseFloat(String(formData.get('price') ?? '0')),
    category: String(formData.get('category') ?? 'camisetas') as ProductCategory,
    badge: badgeRaw || null,
    active: formData.get('active') === 'on',
    featured: formData.get('featured') === 'on',
    sizes: sizesRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    sort_order: Number.parseInt(String(formData.get('sort_order') ?? '0'), 10) || 0,
    colors,
    whatsapp: {
      phone: String(formData.get('whatsapp_phone') ?? '').trim(),
      message_template: String(formData.get('whatsapp_message') ?? '').trim(),
    },
    primary_image_id: String(formData.get('primary_image_id') ?? '') || null,
    image_order: parseImageOrderJson(formData),
  };
}

function parseImageOrderJson(formData: FormData): ImageOrderEntry[] {
  try {
    const raw = JSON.parse(String(formData.get('image_order_json') ?? '[]'));
    if (!Array.isArray(raw)) return [];
    return raw.filter(
      (entry): entry is ImageOrderEntry =>
        (entry?.kind === 'saved' && typeof entry.id === 'string') || entry?.kind === 'pending'
    );
  } catch {
    return [];
  }
}

export function getImageFiles(formData: FormData): File[] {
  const seen = new Set<string>();
  return formData.getAll('new_images').filter((f): f is File => {
    if (!(f instanceof File) || !f.size) return false;
    const key = `${f.name}:${f.size}:${f.lastModified}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
