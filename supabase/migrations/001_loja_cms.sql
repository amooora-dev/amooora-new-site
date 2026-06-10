-- CMS Loja Amooora — schema dedicado no Supabase
-- Schema: ecommerce-amooora (NÃO usar public — BD compartilhado com outros apps)
--
-- Antes de rodar: confirme que o schema existe ou será criado abaixo.
-- Depois: Settings → API → Exposed schemas → adicionar "ecommerce-amooora"

create schema if not exists "ecommerce-amooora";

-- Permissões para roles do Supabase (PostgREST + RLS)
grant usage on schema "ecommerce-amooora" to postgres, anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type "ecommerce-amooora".product_category as enum (
  'camisetas',
  'moletons',
  'acessorios'
);

create type "ecommerce-amooora".product_badge as enum (
  'novo',
  'mais_vendido',
  'edicao_limitada'
);

-- ---------------------------------------------------------------------------
-- Produtos
-- ---------------------------------------------------------------------------
create table "ecommerce-amooora".products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description_short text not null,
  description_full text not null,
  price numeric(10, 2) not null check (price >= 0),
  category "ecommerce-amooora".product_category not null,
  badge "ecommerce-amooora".product_badge,
  active boolean not null default true,
  featured boolean not null default false,
  sizes text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_active_category_idx
  on "ecommerce-amooora".products (active, category);
create index products_sort_order_idx
  on "ecommerce-amooora".products (sort_order);

-- ---------------------------------------------------------------------------
-- Imagens (múltiplas por produto)
-- ---------------------------------------------------------------------------
create table "ecommerce-amooora".product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references "ecommerce-amooora".products (id) on delete cascade,
  url text not null,
  alt text,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create index product_images_product_id_idx
  on "ecommerce-amooora".product_images (product_id, sort_order);

create unique index product_images_one_primary_per_product
  on "ecommerce-amooora".product_images (product_id)
  where is_primary = true;

-- ---------------------------------------------------------------------------
-- Cores
-- ---------------------------------------------------------------------------
create table "ecommerce-amooora".product_colors (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references "ecommerce-amooora".products (id) on delete cascade,
  name text not null,
  hex_code text not null,
  available boolean not null default true,
  sort_order integer not null default 0
);

create index product_colors_product_id_idx
  on "ecommerce-amooora".product_colors (product_id, sort_order);

-- ---------------------------------------------------------------------------
-- CTA WhatsApp
-- ---------------------------------------------------------------------------
create table "ecommerce-amooora".whatsapp_ctas (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null unique references "ecommerce-amooora".products (id) on delete cascade,
  phone text not null,
  message_template text not null default 'Olá! Tenho interesse no produto {produto} ({preco}). Cor: {cor}. Tamanho: {tamanho}.',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Admins (allowlist — usuário em auth.users)
-- ---------------------------------------------------------------------------
create table "ecommerce-amooora".admin_users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- updated_at automático
-- ---------------------------------------------------------------------------
create or replace function "ecommerce-amooora".set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_set_updated_at
  before update on "ecommerce-amooora".products
  for each row execute function "ecommerce-amooora".set_updated_at();

create trigger whatsapp_ctas_set_updated_at
  before update on "ecommerce-amooora".whatsapp_ctas
  for each row execute function "ecommerce-amooora".set_updated_at();

-- ---------------------------------------------------------------------------
-- View para a loja (produtos ativos + relações)
-- ---------------------------------------------------------------------------
create or replace view "ecommerce-amooora".store_products as
select
  p.id,
  p.slug,
  p.name,
  p.description_short,
  p.description_full,
  p.price,
  p.category,
  p.badge,
  p.featured,
  p.sizes,
  p.sort_order,
  p.created_at,
  p.updated_at,
  coalesce(
    (
      select json_agg(
        json_build_object(
          'id', pi.id,
          'url', pi.url,
          'alt', pi.alt,
          'sort_order', pi.sort_order,
          'is_primary', pi.is_primary
        )
        order by pi.sort_order
      )
      from "ecommerce-amooora".product_images pi
      where pi.product_id = p.id
    ),
    '[]'::json
  ) as images,
  coalesce(
    (
      select json_agg(
        json_build_object(
          'id', pc.id,
          'name', pc.name,
          'hex_code', pc.hex_code,
          'available', pc.available,
          'sort_order', pc.sort_order
        )
        order by pc.sort_order
      )
      from "ecommerce-amooora".product_colors pc
      where pc.product_id = p.id
    ),
    '[]'::json
  ) as colors,
  (
    select json_build_object(
      'phone', w.phone,
      'message_template', w.message_template
    )
    from "ecommerce-amooora".whatsapp_ctas w
    where w.product_id = p.id
  ) as whatsapp
from "ecommerce-amooora".products p
where p.active = true;

-- ---------------------------------------------------------------------------
-- Grants nas tabelas/view (RLS ainda se aplica)
-- ---------------------------------------------------------------------------
grant select on all tables in schema "ecommerce-amooora" to anon, authenticated;
grant select on "ecommerce-amooora".store_products to anon, authenticated;
grant all on all tables in schema "ecommerce-amooora" to authenticated, service_role;
grant all on all sequences in schema "ecommerce-amooora" to authenticated, service_role;

alter default privileges in schema "ecommerce-amooora"
  grant select on tables to anon, authenticated;
alter default privileges in schema "ecommerce-amooora"
  grant all on tables to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table "ecommerce-amooora".products enable row level security;
alter table "ecommerce-amooora".product_images enable row level security;
alter table "ecommerce-amooora".product_colors enable row level security;
alter table "ecommerce-amooora".whatsapp_ctas enable row level security;
alter table "ecommerce-amooora".admin_users enable row level security;

create policy "Public read active products"
  on "ecommerce-amooora".products for select
  using (active = true);

create policy "Public read images of active products"
  on "ecommerce-amooora".product_images for select
  using (
    exists (
      select 1 from "ecommerce-amooora".products p
      where p.id = product_id and p.active = true
    )
  );

create policy "Public read colors of active products"
  on "ecommerce-amooora".product_colors for select
  using (
    exists (
      select 1 from "ecommerce-amooora".products p
      where p.id = product_id and p.active = true
    )
  );

create policy "Public read whatsapp of active products"
  on "ecommerce-amooora".whatsapp_ctas for select
  using (
    exists (
      select 1 from "ecommerce-amooora".products p
      where p.id = product_id and p.active = true
    )
  );

create policy "Admin full access products"
  on "ecommerce-amooora".products for all
  using (
    exists (select 1 from "ecommerce-amooora".admin_users au where au.id = auth.uid())
  )
  with check (
    exists (select 1 from "ecommerce-amooora".admin_users au where au.id = auth.uid())
  );

create policy "Admin full access product_images"
  on "ecommerce-amooora".product_images for all
  using (
    exists (select 1 from "ecommerce-amooora".admin_users au where au.id = auth.uid())
  )
  with check (
    exists (select 1 from "ecommerce-amooora".admin_users au where au.id = auth.uid())
  );

create policy "Admin full access product_colors"
  on "ecommerce-amooora".product_colors for all
  using (
    exists (select 1 from "ecommerce-amooora".admin_users au where au.id = auth.uid())
  )
  with check (
    exists (select 1 from "ecommerce-amooora".admin_users au where au.id = auth.uid())
  );

create policy "Admin full access whatsapp_ctas"
  on "ecommerce-amooora".whatsapp_ctas for all
  using (
    exists (select 1 from "ecommerce-amooora".admin_users au where au.id = auth.uid())
  )
  with check (
    exists (select 1 from "ecommerce-amooora".admin_users au where au.id = auth.uid())
  );

create policy "Admin read admin_users"
  on "ecommerce-amooora".admin_users for select
  using (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- Storage: bucket isolado por app (Storage não usa schema SQL)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'ecommerce-amooora-produtos',
  'ecommerce-amooora-produtos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy "Public read ecommerce product images"
  on storage.objects for select
  using (bucket_id = 'ecommerce-amooora-produtos');

create policy "Admin upload ecommerce product images"
  on storage.objects for insert
  with check (
    bucket_id = 'ecommerce-amooora-produtos'
    and exists (
      select 1 from "ecommerce-amooora".admin_users au where au.id = auth.uid()
    )
  );

create policy "Admin update ecommerce product images"
  on storage.objects for update
  using (
    bucket_id = 'ecommerce-amooora-produtos'
    and exists (
      select 1 from "ecommerce-amooora".admin_users au where au.id = auth.uid()
    )
  );

create policy "Admin delete ecommerce product images"
  on storage.objects for delete
  using (
    bucket_id = 'ecommerce-amooora-produtos'
    and exists (
      select 1 from "ecommerce-amooora".admin_users au where au.id = auth.uid()
    )
  );
