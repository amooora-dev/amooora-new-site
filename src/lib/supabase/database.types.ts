/**
 * Tipos gerados manualmente a partir de supabase/migrations/001_loja_cms.sql
 * Após conectar o projeto Supabase, pode regenerar com: supabase gen types typescript
 */

export type ProductCategory = 'camisetas' | 'moletons' | 'acessorios';
/** Texto livre — rótulo exibido na loja (ex.: "Novo", "Promoção") */
export type ProductBadge = string;

export type DbProduct = {
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
  updated_at: string;
};

export type DbProductImage = {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
  is_primary: boolean;
};

export type DbProductColor = {
  id: string;
  product_id: string;
  name: string;
  hex_code: string;
  available: boolean;
  sort_order: number;
};

export type DbWhatsappCta = {
  id: string;
  product_id: string;
  phone: string;
  message_template: string;
};

export type StoreProductImage = {
  id: string;
  url: string;
  alt: string | null;
  sort_order: number;
  is_primary: boolean;
};

export type StoreProductColor = {
  id: string;
  name: string;
  hex_code: string;
  available: boolean;
  sort_order: number;
};

export type StoreProductWhatsapp = {
  phone: string;
  message_template: string;
};

/** Linha da view ecommerce-amooora.store_products */
export type StoreProduct = {
  id: string;
  slug: string;
  name: string;
  description_short: string;
  description_full: string;
  price: number;
  category: ProductCategory;
  badge: ProductBadge | null;
  featured: boolean;
  sizes: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
  images: StoreProductImage[];
  colors: StoreProductColor[];
  whatsapp: StoreProductWhatsapp | null;
};
