-- Disponibilidade do produto: disponível ou esgotado

alter table "ecommerce-amooora".products
  add column if not exists sold_out boolean not null default false;

drop view if exists "ecommerce-amooora".store_products;

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
  p.sold_out,
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
