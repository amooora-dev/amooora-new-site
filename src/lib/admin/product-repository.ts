import { createAdminReadClient, createAdminWriteClient } from '@/lib/supabase/client';
import { isSupabaseAdminConfigured } from '@/lib/supabase/config';
import { SUPABASE_STORAGE_BUCKET } from '@/lib/supabase/config';
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
  await dbWrite().from('product_colors').delete().eq('product_id', productId);
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
  await dbWrite().from('whatsapp_ctas').delete().eq('product_id', productId);
  const { error } = await dbWrite().from('whatsapp_ctas').insert({
    product_id: productId,
    phone: whatsapp.phone,
    message_template: whatsapp.message_template,
  });
  if (error) throw new Error(error.message);
}

async function uploadImages(productId: string, files: File[], startOrder: number) {
  const supabase = dbWrite();
  const inserted: AdminProductImage[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file.size) continue;
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `${productId}/${Date.now()}-${i}.${ext}`;

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
        sort_order: startOrder + i,
        is_primary: false,
      })
      .select('*')
      .single();

    if (error) throw new Error(error.message);
    inserted.push(data as AdminProductImage);
  }

  return inserted;
}

async function ensurePrimaryImage(productId: string, primaryId?: string | null) {
  const { data: images } = await dbWrite()
    .from('product_images')
    .select('id')
    .eq('product_id', productId);

  if (!images?.length) return;

  const target = primaryId && images.some((i) => i.id === primaryId)
    ? primaryId
    : images[0].id;

  await dbWrite().from('product_images').update({ is_primary: false }).eq('product_id', productId);
  await dbWrite().from('product_images').update({ is_primary: true }).eq('id', target);
}

export async function createProduct(input: ProductFormInput, files: File[]) {
  const slug = await ensureUniqueSlug(input.slug || slugify(input.name));

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
      sort_order: input.sort_order,
    })
    .select('id')
    .single();

  if (error) throw new Error(error.message);
  const productId = data.id;

  await saveColors(productId, input.colors);
  await saveWhatsapp(productId, input.whatsapp);

  if (files.length) {
    await uploadImages(productId, files, 0);
    await ensurePrimaryImage(productId, input.primary_image_id);
  }

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
      sort_order: input.sort_order,
    })
    .eq('id', id);

  if (error) throw new Error(error.message);

  await saveColors(id, input.colors);
  await saveWhatsapp(id, input.whatsapp);

  const { count } = await dbWrite()
    .from('product_images')
    .select('*', { count: 'exact', head: true })
    .eq('product_id', id);

  if (files.length) {
    await uploadImages(id, files, count ?? 0);
  }

  await ensurePrimaryImage(id, input.primary_image_id);
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

export async function toggleProductActive(id: string, active: boolean) {
  const { error } = await dbWrite().from('products').update({ active }).eq('id', id);
  if (error) throw new Error(error.message);
}

export function parseProductFormData(formData: FormData): ProductFormInput {
  const badgeRaw = String(formData.get('badge') ?? '').trim();
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
    badge: badgeRaw ? (badgeRaw as ProductBadge) : null,
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
  };
}

export function getImageFiles(formData: FormData): File[] {
  return formData.getAll('new_images').filter((f): f is File => f instanceof File && f.size > 0);
}
