'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdminSession } from '@/lib/admin/auth';
import {
  createProduct,
  deleteProduct,
  deleteProductImage,
  getImageFiles,
  parseProductFormData,
  toggleProductActive,
  updateProduct,
} from '@/lib/admin/product-repository';

export type ActionState = { error?: string; success?: string; redirectTo?: string };

function validateInput(input: ReturnType<typeof parseProductFormData>) {
  if (!input.name) return 'Nome é obrigatório.';
  if (!input.description_short) return 'Descrição curta é obrigatória.';
  if (!input.description_full) return 'Descrição completa é obrigatória.';
  if (!input.price || input.price < 0) return 'Preço inválido.';
  if (!input.whatsapp.phone) return 'Telefone WhatsApp é obrigatório.';
  return null;
}

function revalidateLoja() {
  revalidatePath('/loja');
  revalidatePath('/admin/produtos');
  revalidatePath('/admin/dashboard');
}

export async function saveProductAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdminSession();

  const input = parseProductFormData(formData);
  const validation = validateInput(input);
  if (validation) return { error: validation };

  let redirectTo: string;
  try {
    const files = getImageFiles(formData);
    const productId = String(formData.get('product_id') ?? '').trim();

    if (productId) {
      await updateProduct(productId, input, files);
      redirectTo = `/admin/produtos/${productId}?saved=1`;
    } else {
      const newId = await createProduct(input, files);
      redirectTo = `/admin/produtos/${newId}?saved=1`;
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Erro ao salvar produto.' };
  }

  revalidateLoja();
  return { redirectTo };
}

export async function deleteProductAction(productId: string) {
  await requireAdminSession();
  await deleteProduct(productId);
  revalidateLoja();
  redirect('/admin/produtos?deleted=1');
}

export async function deleteImageAction(imageId: string, productId: string) {
  await requireAdminSession();
  await deleteProductImage(imageId, productId);
  revalidateLoja();
  revalidatePath(`/admin/produtos/${productId}`);
}

export async function toggleActiveAction(productId: string, active: boolean) {
  await requireAdminSession();
  await toggleProductActive(productId, active);
  revalidateLoja();
  revalidatePath('/admin/produtos');
}
