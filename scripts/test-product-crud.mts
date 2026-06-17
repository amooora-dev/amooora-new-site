import { createClient } from '@supabase/supabase-js';
import {
  createProduct,
  deleteProduct,
  getAdminProduct,
  updateProduct,
} from '../src/lib/admin/product-repository';

const TEST_SLUG = 'camiseta-teste-admin-fake';

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { db: { schema: 'ecommerce-amooora' } }
  );
}

async function cleanupExisting() {
  const { data } = await db().from('products').select('id').eq('slug', TEST_SLUG).maybeSingle();
  if (data?.id) {
    await deleteProduct(data.id);
    console.log('🧹 Produto de teste anterior removido');
  }
}

async function addTestImage(productId: string) {
  const { error } = await db().from('product_images').insert({
    product_id: productId,
    url: '/images/loja/produtos/camiseta-sapatao-preta.png',
    alt: 'Camiseta Teste Admin',
    sort_order: 0,
    is_primary: true,
  });
  if (error) throw new Error(error.message);
}

async function assertInStore(name: string) {
  const { data, error } = await db().from('store_products').select('name, slug').eq('slug', TEST_SLUG).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Produto não apareceu na view store_products');
  if (data.name !== name) throw new Error(`Nome na loja incorreto: ${data.name}`);
  console.log('✅ Produto visível na view store_products:', data.name);
}

async function main() {
  await cleanupExisting();

  const whatsappTemplate =
    'Olá! Tenho interesse no {produto} ({preco}). Cor: {cor}. Tamanho: {tamanho}.\n\nLink: {link}';

  const createInput = {
    name: 'Camiseta Teste Admin (Fake)',
    slug: TEST_SLUG,
    description_short: 'Produto fake — teste automatizado do admin',
    description_full:
      'Esta camiseta foi criada automaticamente para validar o fluxo de CRUD do CMS Amooora.',
    price: 99.9,
    category: 'camisetas' as const,
    badge: 'novo' as const,
    active: true,
    featured: false,
    sizes: ['P', 'M', 'G', 'GG'],
    sort_order: 99,
    colors: [{ name: 'Roxo', hex_code: '#932D6F', available: true, sort_order: 0 }],
    whatsapp: { phone: '5511970548406', message_template: whatsappTemplate },
  };

  console.log('📦 Criando produto fake…');
  const productId = await createProduct(createInput, []);
  await addTestImage(productId);
  console.log('✅ Produto criado:', productId);

  const created = await getAdminProduct(productId);
  if (!created) throw new Error('getAdminProduct retornou null após criar');
  console.log('✅ getAdminProduct OK:', created.name);

  await assertInStore('Camiseta Teste Admin (Fake)');

  console.log('✏️  Editando produto…');
  await updateProduct(
    productId,
    {
      ...createInput,
      name: 'Camiseta Teste Admin (Editada)',
      description_short: 'Produto fake editado — teste OK',
      price: 109.9,
      badge: 'mais_vendido',
    },
    []
  );

  const edited = await getAdminProduct(productId);
  if (!edited || edited.name !== 'Camiseta Teste Admin (Editada)') {
    throw new Error('Edição não persistiu');
  }
  if (edited.price !== 109.9) throw new Error('Preço não atualizou');
  console.log('✅ Produto editado:', edited.name, `R$ ${edited.price}`);

  await assertInStore('Camiseta Teste Admin (Editada)');

  console.log('\n🎉 CRUD completo: criar → publicar na loja → editar — tudo OK');
  console.log(`   Slug: ${TEST_SLUG}`);
  console.log(`   URL loja: http://localhost:3000/loja?produto=${TEST_SLUG}`);
  console.log(`   Admin: http://localhost:3000/admin/produtos/${productId}`);
  console.log('\n   (Produto mantido no banco para você conferir no admin/loja)');
}

main().catch((e) => {
  console.error('❌ Falha:', e instanceof Error ? e.message : e);
  process.exit(1);
});
