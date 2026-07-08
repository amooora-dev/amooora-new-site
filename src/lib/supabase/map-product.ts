import type { ProdutoLoja } from '@/lib/loja-data';
import { formatProductBadge } from '@/lib/loja/badge-display';
import { buildAbsoluteSiteUrl } from '@/lib/site-url';
import type { ProductCategory, StoreProduct } from './database.types';

const CATEGORY_LABEL: Record<ProductCategory, ProdutoLoja['categoria']> = {
  camisetas: 'Camisetas',
  moletons: 'Moletons',
  acessorios: 'Acessórios',
};

export function formatPrecoBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export const DEFAULT_WHATSAPP_MESSAGE =
  'Olá! Tenho interesse no {produto} ({preco}). Cor: {cor}. Tamanho: {tamanho}.\n\nLink: {link}';

export function buildProductPageUrl(slug: string): string {
  return buildAbsoluteSiteUrl(`/loja?produto=${encodeURIComponent(slug)}`);
}

export function buildWhatsappUrl(
  product: Pick<
    ProdutoLoja,
    'nome' | 'precoNumerico' | 'whatsappPhone' | 'whatsappMessageTemplate' | 'slug'
  >,
  opts?: { cor?: string; tamanho?: string }
): string {
  const phone = product.whatsappPhone?.replace(/\D/g, '') ?? '';
  if (!phone) return '#';

  const template = product.whatsappMessageTemplate || DEFAULT_WHATSAPP_MESSAGE;
  const link = buildProductPageUrl(product.slug);

  const message = template
    .replaceAll('{produto}', product.nome)
    .replaceAll('{preco}', formatPrecoBRL(product.precoNumerico))
    .replaceAll('{cor}', opts?.cor ?? '—')
    .replaceAll('{tamanho}', opts?.tamanho ?? '—')
    .replaceAll('{link}', link);

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function mapStoreProductToProdutoLoja(row: StoreProduct, index = 0): ProdutoLoja {
  const imagensRows = Array.isArray(row.images) ? row.images : [];
  const imagens = [...imagensRows]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((i) => i.url);
  const primary = imagensRows.find((i) => i.is_primary) ?? imagensRows[0];

  const precoNumerico = Number(row.price);
  const whatsappPhone =
    row.whatsapp?.phone ?? process.env.WHATSAPP_DEFAULT_PHONE ?? '';
  const whatsappMessageTemplate =
    row.whatsapp?.message_template ?? DEFAULT_WHATSAPP_MESSAGE;

  const produto: ProdutoLoja = {
    uuid: row.id,
    slug: row.slug,
    id: index + 1,
    nome: row.name,
    categoria: CATEGORY_LABEL[row.category],
    preco: formatPrecoBRL(precoNumerico),
    precoNumerico,
    badge: row.badge ? formatProductBadge(row.badge) : null,
    desc: row.description_short,
    descricaoCompleta: row.description_full,
    imagem: primary?.url ?? imagens[0] ?? '/images/loja/produtos/placeholder.png',
    imagens: imagens.length ? imagens : [primary?.url ?? ''],
    cores: (Array.isArray(row.colors) ? row.colors : [])
      .filter((c) => c.available)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((c) => ({ nome: c.name, hex: c.hex_code })),
    tamanhos: row.sizes?.length ? row.sizes : ['Único'],
    whatsappPhone,
    whatsappMessageTemplate,
    shopUrl: '#',
  };

  produto.shopUrl = buildWhatsappUrl(produto);
  return produto;
}
