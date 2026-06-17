'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import type { AdminProduct, AdminProductColor } from '@/lib/admin/product-repository';
import type { ProductBadge, ProductCategory } from '@/lib/supabase/database.types';
import { DEFAULT_WHATSAPP_MESSAGE } from '@/lib/supabase/map-product';
import { slugify } from '@/lib/admin/slug';
import { saveProductAction, type ActionState } from '@/app/admin/(protected)/produtos/actions';
import { AdminButton, AdminCard, adminInputClass, adminLabelClass } from '@/components/admin/admin-ui';
import { ImageSortManager, type GalleryItem } from '@/components/admin/ImageSortManager';

function toGalleryItems(product?: AdminProduct): GalleryItem[] {
  if (!product?.images?.length) return [];
  return [...product.images]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((img) => ({ kind: 'saved' as const, id: img.id, url: img.url, alt: img.alt }));
}

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'camisetas', label: 'Camisetas' },
  { value: 'moletons', label: 'Moletons' },
  { value: 'acessorios', label: 'Acessórios' },
];

const BADGES: { value: ProductBadge | ''; label: string }[] = [
  { value: '', label: 'Nenhum' },
  { value: 'novo', label: 'Novo' },
  { value: 'mais_vendido', label: 'Mais vendido' },
  { value: 'edicao_limitada', label: 'Edição limitada' },
];

const DEFAULT_WHATSAPP_MSG = DEFAULT_WHATSAPP_MESSAGE;

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <AdminButton type="submit" variant="primary" disabled={pending} className="px-8">
      {pending ? 'Salvando…' : label}
    </AdminButton>
  );
}

const INITIAL_FORM_STATE: ActionState = {};

export function ProdutoForm({
  product,
  defaultWhatsappPhone,
}: {
  product?: AdminProduct;
  defaultWhatsappPhone: string;
}) {
  const router = useRouter();
  const [state, formAction] = useFormState<ActionState, FormData>(saveProductAction, INITIAL_FORM_STATE);
  const formState = state ?? INITIAL_FORM_STATE;
  const [name, setName] = useState(product?.name ?? '');
  const [slug, setSlug] = useState(product?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(Boolean(product?.slug));
  const [colors, setColors] = useState<AdminProductColor[]>(
    product?.colors?.length
      ? product.colors
      : [{ name: 'Roxo', hex_code: '#3a184f', available: true, sort_order: 0 }]
  );
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => toGalleryItems(product));
  const fileInputRef = useRef<HTMLInputElement>(null);
  const submittingRef = useRef(false);

  const serverImagesKey = useMemo(
    () => product?.images?.map((i) => `${i.id}:${i.sort_order}`).join('|') ?? '',
    [product?.images]
  );

  const colorsJson = useMemo(() => JSON.stringify(colors), [colors]);
  const imageOrderJson = useMemo(
    () =>
      JSON.stringify(
        galleryItems.map((item) =>
          item.kind === 'saved' ? { kind: 'saved', id: item.id } : { kind: 'pending' }
        )
      ),
    [galleryItems]
  );

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const addColor = () => {
    setColors((c) => [...c, { name: '', hex_code: '#932D6F', available: true, sort_order: c.length }]);
  };

  const updateColor = (index: number, patch: Partial<AdminProductColor>) => {
    setColors((c) => c.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const removeColor = (index: number) => {
    setColors((c) => c.filter((_, i) => i !== index));
  };

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const newItems: GalleryItem[] = Array.from(files).map((file) => ({
      kind: 'pending',
      clientId: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      previewUrl: URL.createObjectURL(file),
      file,
    }));
    setGalleryItems((items) => [...items, ...newItems]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;

    const formData = new FormData(e.currentTarget);
    formData.delete('new_images');
    for (const item of galleryItems) {
      if (item.kind === 'pending') formData.append('new_images', item.file);
    }
    formData.set('image_order_json', imageOrderJson);
    formAction(formData);
  };

  // Após save, o servidor devolve novas imagens — limpa previews pendentes para não reenviar
  useEffect(() => {
    setGalleryItems((prev) => {
      for (const item of prev) {
        if (item.kind === 'pending') URL.revokeObjectURL(item.previewUrl);
      }
      return toGalleryItems(product);
    });
  }, [product?.id, serverImagesKey]);

  useEffect(() => {
    if (formState.error) submittingRef.current = false;
  }, [formState.error]);

  useEffect(() => {
    if (formState.redirectTo) {
      submittingRef.current = false;
      if (fileInputRef.current) fileInputRef.current.value = '';
      router.push(formState.redirectTo);
    }
  }, [formState.redirectTo, router]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {product && <input type="hidden" name="product_id" value={product.id} />}
      <input type="hidden" name="colors_json" value={colorsJson} readOnly />
      <input type="hidden" name="image_order_json" value={imageOrderJson} readOnly />

      {formState.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 font-sans text-sm text-red-700" role="alert">
          {formState.error}
        </p>
      )}

      <AdminCard>
        <h2 className="mb-4 font-serif text-xl font-bold text-ink">Informações básicas</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={adminLabelClass} htmlFor="name">Nome *</label>
            <input
              id="name"
              name="name"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={adminInputClass}
            />
          </div>
          <div>
            <label className={adminLabelClass} htmlFor="slug">Slug (URL)</label>
            <input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              className={adminInputClass}
            />
          </div>
          <div>
            <label className={adminLabelClass} htmlFor="sort_order_display">Ordem na loja</label>
            {product ? (
              <>
                <p
                  id="sort_order_display"
                  className="rounded-xl border border-black/[0.08] bg-muted/40 px-4 py-3 font-sans text-sm text-ink"
                >
                  Posição <strong>{product.sort_order + 1}</strong> na vitrine
                </p>
                <p className="mt-1.5 font-sans text-xs text-muted-fg">
                  Para alterar, use{' '}
                  <a href="/admin/produtos/ordenar" className="font-medium text-primary hover:underline">
                    Ordenar Produtos
                  </a>
                  .
                </p>
              </>
            ) : (
              <p
                id="sort_order_display"
                className="rounded-xl border border-black/[0.08] bg-muted/40 px-4 py-3 font-sans text-sm text-muted-fg"
              >
                Será adicionado ao <strong>final da lista</strong> ao salvar.
              </p>
            )}
          </div>
          <div>
            <label className={adminLabelClass} htmlFor="category">Categoria *</label>
            <select
              id="category"
              name="category"
              defaultValue={product?.category ?? 'camisetas'}
              className={adminInputClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={adminLabelClass} htmlFor="badge">Badge</label>
            <select
              id="badge"
              name="badge"
              defaultValue={product?.badge ?? ''}
              className={adminInputClass}
            >
              {BADGES.map((b) => (
                <option key={b.value || 'none'} value={b.value}>{b.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={adminLabelClass} htmlFor="price">Preço (R$) *</label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={product?.price ?? ''}
              className={adminInputClass}
            />
          </div>
          <div className="md:col-span-2">
            <label className={adminLabelClass} htmlFor="sizes">Tamanhos (separados por vírgula)</label>
            <input
              id="sizes"
              name="sizes"
              defaultValue={product?.sizes?.join(', ') ?? 'P, M, G, GG'}
              className={adminInputClass}
            />
          </div>
          <label className="flex items-center gap-2 font-sans text-sm">
            <input type="checkbox" name="active" defaultChecked={product?.active ?? true} className="rounded" />
            Produto ativo (visível na loja)
          </label>
          <label className="flex items-center gap-2 font-sans text-sm">
            <input type="checkbox" name="featured" defaultChecked={product?.featured ?? false} className="rounded" />
            Destaque
          </label>
        </div>
      </AdminCard>

      <AdminCard>
        <h2 className="mb-4 font-serif text-xl font-bold text-ink">Descrições</h2>
        <div className="space-y-4">
          <div>
            <label className={adminLabelClass} htmlFor="description_short">Descrição curta (card) *</label>
            <textarea
              id="description_short"
              name="description_short"
              required
              rows={2}
              defaultValue={product?.description_short ?? ''}
              className={adminInputClass}
            />
          </div>
          <div>
            <label className={adminLabelClass} htmlFor="description_full">Descrição completa (modal) *</label>
            <p className="mb-2 font-sans text-xs text-muted-fg">
              Suporta parágrafos (linha em branco), <strong>**negrito**</strong>, HTML básico (p, br, strong, ul, li) e emojis.
            </p>
            <textarea
              id="description_full"
              name="description_full"
              required
              rows={5}
              defaultValue={product?.description_full ?? ''}
              className={adminInputClass}
            />
          </div>
        </div>
      </AdminCard>

      <AdminCard>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-ink">Cores</h2>
          <button type="button" onClick={addColor} className="font-sans text-sm font-medium text-primary hover:underline">
            + Adicionar cor
          </button>
        </div>
        <div className="space-y-3">
          {colors.map((cor, i) => (
            <div key={i} className="flex flex-wrap items-center gap-3 rounded-xl bg-muted/50 p-3">
              <input
                type="color"
                value={cor.hex_code}
                onChange={(e) => updateColor(i, { hex_code: e.target.value })}
                className="h-10 w-10 cursor-pointer rounded-lg border-0"
                aria-label="Cor"
              />
              <input
                type="text"
                placeholder="Nome da cor"
                value={cor.name}
                onChange={(e) => updateColor(i, { name: e.target.value })}
                className={`${adminInputClass} max-w-[180px]`}
              />
              <label className="flex items-center gap-1 font-sans text-xs">
                <input
                  type="checkbox"
                  checked={cor.available}
                  onChange={(e) => updateColor(i, { available: e.target.checked })}
                />
                Disponível
              </label>
              {colors.length > 1 && (
                <button type="button" onClick={() => removeColor(i)} className="font-sans text-xs text-red-600 hover:underline">
                  Remover
                </button>
              )}
            </div>
          ))}
        </div>
      </AdminCard>

      <AdminCard>
        <h2 className="mb-4 font-serif text-xl font-bold text-ink">WhatsApp</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={adminLabelClass} htmlFor="whatsapp_phone">Telefone *</label>
            <input
              id="whatsapp_phone"
              name="whatsapp_phone"
              required
              defaultValue={product?.whatsapp?.phone ?? defaultWhatsappPhone}
              placeholder="5511970548406"
              className={adminInputClass}
            />
          </div>
          <div className="md:col-span-2">
            <label className={adminLabelClass} htmlFor="whatsapp_message">Mensagem</label>
            <textarea
              id="whatsapp_message"
              name="whatsapp_message"
              rows={3}
              defaultValue={product?.whatsapp?.message_template ?? DEFAULT_WHATSAPP_MSG}
              className={adminInputClass}
            />
            <p className="mt-1 font-sans text-xs text-muted-fg">
              Variáveis: {'{produto}'}, {'{preco}'}, {'{cor}'}, {'{tamanho}'}, {'{link}'}
            </p>
          </div>
        </div>
      </AdminCard>

      <AdminCard>
        <h2 className="mb-4 font-serif text-xl font-bold text-ink">Fotos</h2>

        <ImageSortManager
          productId={product?.id}
          items={galleryItems}
          onChange={setGalleryItems}
        />

        <label className={adminLabelClass} htmlFor="new_images">Adicionar fotos</label>
        <input
          ref={fileInputRef}
          id="new_images"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="font-sans text-sm"
        />
        <p className="mt-3 font-sans text-xs text-muted-fg">
          JPG, PNG ou WebP. Proporção recomendada 3:4 (900×1200px). Você pode selecionar várias de uma vez.
        </p>
      </AdminCard>

      <div className="flex flex-wrap gap-3 pt-2">
        <SubmitButton label={product ? 'Salvar alterações' : 'Criar produto'} />
      </div>
    </form>
  );
}
