-- Seed: 8 produtos da loja Amooora
-- Schema: ecommerce-amooora
-- Rodar APÓS supabase/migrations/001_loja_cms.sql

-- truncate "ecommerce-amooora".whatsapp_ctas,
--   "ecommerce-amooora".product_colors,
--   "ecommerce-amooora".product_images,
--   "ecommerce-amooora".products cascade;

insert into "ecommerce-amooora".products (
  slug, name, description_short, description_full, price, category, badge, sizes, sort_order
) values
(
  'camiseta-sapatao-arco-iris',
  'Sapatão — Camiseta Arco-íris',
  'Estampa tipográfica em sete cores, roxo vibrante',
  'Camiseta roxa com a palavra "sapatão" repetida em sete cores do arco-íris. Modelagem unissex, 100% algodão, ideal para o dia a dia com muito orgulho.',
  84.90, 'camisetas', 'mais_vendido', array['P','M','G','GG'], 1
),
(
  'camiseta-sapatao-preta',
  'Sapatão — Camiseta Preta',
  'Estampa branca com detalhe rosa, algodão premium',
  'Camiseta preta com estampa "sapatão" em branco e círculo rosa no peito. Corte confortável, tecido de alta qualidade.',
  79.90, 'camisetas', null, array['P','M','G','GG'], 2
),
(
  'camiseta-sapatao-ringer-amarela',
  'Sapatão — Camiseta Ringer Amarela',
  'Modelo ringer amarelo, estampa verde e detalhe laranja',
  'Camiseta ringer amarela com gola e mangas verdes. Estampa "sapatão" em verde escuro com círculo laranja. Unissex e confortável.',
  74.90, 'camisetas', 'novo', array['P','M','G','GG'], 3
),
(
  'camiseta-quenga-ringer',
  'Quenga — Camiseta Oversized Brasil',
  'Ringer amarela com estampa tipográfica quenga',
  'Camiseta ringer amarela com detalhes verdes na gola. Estampa "quenga" em tipografia serifada preta. Peça ousada e cheia de personalidade.',
  74.90, 'camisetas', null, array['P','M','G','GG'], 4
),
(
  'regata-vagitariana',
  'Vagitariana — Regata Roxa',
  'Tipografia serifada em branco, roxo vibrante',
  'Regata em tom roxo profundo com estampa "vagitariana" em letras brancas e detalhes em rosa. Tecido leve e confortável para o calor.',
  69.90, 'camisetas', 'novo', array['P','M','G','GG'], 5
),
(
  'moletom-sapatao-roxo',
  'Sapatão — Moletom Roxo',
  'Capuz, bolso canguru, estampa branca e detalhe rosa',
  'Moletom roxo com estampa "sapatão" em branco e círculo rosa no peito. Soft fleece, capuz com cordão e bolso frontal.',
  189.90, 'moletons', 'novo', array['P','M','G','GG'], 6
),
(
  'bone-trucker-sapatao',
  'Sapatão — Boné Trucker Roxo',
  'Boné trucker roxo e branco, estampa Amooora',
  'Boné trucker com aba roxa, tela branca e estampa "sapatão" com detalhe Amooora. Ajuste traseiro, ideal para o dia a dia.',
  59.90, 'acessorios', null, array['Único'], 7
),
(
  'capacete-sapatao-uvex',
  'Capacete Sapatão Uvex',
  'Capacete ciclismo vermelho, parceria Uvex x Amooora',
  'Capacete de ciclismo vermelho com estampa "sapatão" e branding Amooora. Parceria exclusiva com Uvex — segurança e identidade sáfica na bike.',
  249.90, 'acessorios', 'edicao_limitada', array['P','M','G'], 8
);

insert into "ecommerce-amooora".product_images (product_id, url, alt, sort_order, is_primary)
select p.id, v.url, p.name, 0, true
from "ecommerce-amooora".products p
join (values
  ('camiseta-sapatao-arco-iris', '/images/loja/produtos/camiseta-sapatao-arco-iris.png'),
  ('camiseta-sapatao-preta', '/images/loja/produtos/camiseta-sapatao-preta.png'),
  ('camiseta-sapatao-ringer-amarela', '/images/loja/produtos/camiseta-sapatao-amarela-ringer.png'),
  ('camiseta-quenga-ringer', '/images/loja/produtos/camiseta-quenga-amarela.png'),
  ('regata-vagitariana', '/images/loja/produtos/regata-vagitariana.png'),
  ('moletom-sapatao-roxo', '/images/loja/produtos/moletom-sapatao-roxo.png'),
  ('bone-trucker-sapatao', '/images/loja/produtos/bone-sapatao-trucker.png'),
  ('capacete-sapatao-uvex', '/images/loja/produtos/capacete-sapatao-vermelho.png')
) as v(slug, url) on v.slug = p.slug;

insert into "ecommerce-amooora".product_colors (product_id, name, hex_code, sort_order)
select p.id, c.name, c.hex, c.ord
from "ecommerce-amooora".products p
join (values
  ('camiseta-sapatao-arco-iris', 'Roxo', '#3a184f', 0),
  ('camiseta-sapatao-arco-iris', 'Vinho', '#93296F', 1),
  ('camiseta-sapatao-preta', 'Preto', '#1a1a1a', 0),
  ('camiseta-sapatao-preta', 'Vinho', '#93296F', 1),
  ('camiseta-sapatao-ringer-amarela', 'Amarelo', '#f5c842', 0),
  ('camiseta-sapatao-ringer-amarela', 'Verde', '#2d5016', 1),
  ('camiseta-quenga-ringer', 'Amarelo', '#f5c842', 0),
  ('camiseta-quenga-ringer', 'Verde', '#2d5016', 1),
  ('regata-vagitariana', 'Roxo', '#3a184f', 0),
  ('regata-vagitariana', 'Vinho', '#93296F', 1),
  ('moletom-sapatao-roxo', 'Roxo', '#3a184f', 0),
  ('moletom-sapatao-roxo', 'Vinho', '#93296F', 1),
  ('bone-trucker-sapatao', 'Roxo', '#3a184f', 0),
  ('bone-trucker-sapatao', 'Branco', '#ffffff', 1),
  ('capacete-sapatao-uvex', 'Vermelho', '#c41e3a', 0)
) as c(slug, name, hex, ord) on c.slug = p.slug;

insert into "ecommerce-amooora".whatsapp_ctas (product_id, phone, message_template)
select
  p.id,
  '5511970548406',
  E'Olá! Tenho interesse no {produto} ({preco}). Cor: {cor}. Tamanho: {tamanho}.\n\nLink: {link}'
from "ecommerce-amooora".products p;
