-- Badges dinâmicas: catálogo + coluna texto em products
-- A view store_products depende de products.badge — removemos antes e recriamos depois.

drop view if exists "ecommerce-amooora".store_products;

create table if not exists "ecommerce-amooora".product_badges (
  id uuid primary key default gen_random_uuid(),
  label text not null unique,
  created_at timestamptz not null default now()
);

insert into "ecommerce-amooora".product_badges (label) values
  ('Novo'),
  ('Mais vendido'),
  ('Edição limitada')
on conflict (label) do nothing;

-- Migra enum → texto (idempotente se rodar de novo após erro parcial)
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'ecommerce-amooora'
      and table_name = 'products'
      and column_name = 'badge'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'ecommerce-amooora'
      and table_name = 'products'
      and column_name = 'badge'
      and data_type = 'text'
  ) then
    alter table "ecommerce-amooora".products add column if not exists badge_text text;

    update "ecommerce-amooora".products
    set badge_text = case badge::text
      when 'novo' then 'Novo'
      when 'mais_vendido' then 'Mais vendido'
      when 'edicao_limitada' then 'Edição limitada'
      else null
    end
    where badge is not null and badge_text is null;

    alter table "ecommerce-amooora".products drop column badge;
    alter table "ecommerce-amooora".products rename column badge_text to badge;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'ecommerce-amooora'
      and table_name = 'products'
      and column_name = 'badge_text'
  ) then
    alter table "ecommerce-amooora".products rename column badge_text to badge;
  end if;
end $$;

drop type if exists "ecommerce-amooora".product_badge;

-- Recria view da loja
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

grant select on "ecommerce-amooora".store_products to anon, authenticated;

alter table "ecommerce-amooora".product_badges enable row level security;

drop policy if exists "Public read product badges" on "ecommerce-amooora".product_badges;
create policy "Public read product badges"
  on "ecommerce-amooora".product_badges for select
  using (true);

drop policy if exists "Admin full access product_badges" on "ecommerce-amooora".product_badges;
create policy "Admin full access product_badges"
  on "ecommerce-amooora".product_badges for all
  using (
    exists (select 1 from "ecommerce-amooora".admin_users au where au.id = auth.uid())
  )
  with check (
    exists (select 1 from "ecommerce-amooora".admin_users au where au.id = auth.uid())
  );

grant select on "ecommerce-amooora".product_badges to anon, authenticated;
grant all on "ecommerce-amooora".product_badges to authenticated, service_role;
