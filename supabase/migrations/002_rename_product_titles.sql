-- Renomeia títulos para o padrão: [Estampa] — [Modelo] [Cor/Variação]
-- Rodar no SQL Editor do Supabase (schema ecommerce-amooora)
-- Seguro para rodar mais de uma vez: só atualiza se o nome antigo ainda existir

-- Camisetas (títulos do admin)
UPDATE "ecommerce-amooora".products SET name = 'Sapatão — Camiseta Oversized Brasil' WHERE name = 'Sapatão | T-Shirt | Brasil';
UPDATE "ecommerce-amooora".products SET name = 'Sapatão — Camiseta Branca' WHERE name = 'Sapatão | T-Shirt - Branca';
UPDATE "ecommerce-amooora".products SET name = 'Sapatão — Camiseta Roxa' WHERE name = 'Sapatão | T-Shirt - Roxa';
UPDATE "ecommerce-amooora".products SET name = 'Sapatão — Camiseta Preta' WHERE name IN ('Sapatão | T-Shirt - Preta', 'Camiseta Sapatão Preta');
UPDATE "ecommerce-amooora".products SET name = 'Quenga — Camiseta Oversized Brasil' WHERE name IN ('Quenga | T-Shirt | Brasil', 'Camiseta Quenga Ringer');
UPDATE "ecommerce-amooora".products SET name = 'Sapatão — Camiseta Ringer Amarela' WHERE name IN ('Camiseta Sapatão Ringer Amarela', 'Sapatão | T-Shirt Ringer Amarela');
UPDATE "ecommerce-amooora".products SET name = 'Sapatão de Sítio — Regata Preta' WHERE name = 'Sapatão de Sítio | Regada | Preta';
UPDATE "ecommerce-amooora".products SET name = 'Vagitariana — Camiseta Dry Fit Roxa' WHERE name = 'Vagitariana | Dry Fit | Roxa';
UPDATE "ecommerce-amooora".products SET name = 'Amooora — Regata Preta' WHERE name = 'Amoooora | Regada | Preta';
UPDATE "ecommerce-amooora".products SET name = 'Sapatão — Camiseta Arco-íris' WHERE name = 'Camiseta Sapatão Arco-íris';
UPDATE "ecommerce-amooora".products SET name = 'Vagitariana — Regata Roxa' WHERE name = 'Regata Vagitariana';

-- Moletons
UPDATE "ecommerce-amooora".products SET name = 'Sapatão — Moletom Roxo' WHERE name IN ('Sapatão | Moleton | Roxo', 'Moletom Sapatão Roxo');
UPDATE "ecommerce-amooora".products SET name = 'Sapatão — Moletom Branco' WHERE name = 'Sapatão | Moleton | Branco';

-- Acessórios
UPDATE "ecommerce-amooora".products SET name = 'Sapatão — Boné Trucker Roxo' WHERE name IN ('Boné | Sapatão', 'Boné Trucker Sapatão');
UPDATE "ecommerce-amooora".products SET name = 'Sapatão — Ecobag Bege' WHERE name = 'Ecobag | Sapatão';

-- Por slug (reforço para o seed original)
UPDATE "ecommerce-amooora".products SET name = 'Sapatão — Camiseta Arco-íris' WHERE slug = 'camiseta-sapatao-arco-iris' AND name <> 'Sapatão — Camiseta Arco-íris';
UPDATE "ecommerce-amooora".products SET name = 'Sapatão — Camiseta Preta' WHERE slug = 'camiseta-sapatao-preta' AND name <> 'Sapatão — Camiseta Preta';
UPDATE "ecommerce-amooora".products SET name = 'Sapatão — Camiseta Ringer Amarela' WHERE slug = 'camiseta-sapatao-ringer-amarela' AND name <> 'Sapatão — Camiseta Ringer Amarela';
UPDATE "ecommerce-amooora".products SET name = 'Quenga — Camiseta Oversized Brasil' WHERE slug = 'camiseta-quenga-ringer' AND name <> 'Quenga — Camiseta Oversized Brasil';
UPDATE "ecommerce-amooora".products SET name = 'Vagitariana — Regata Roxa' WHERE slug = 'regata-vagitariana' AND name <> 'Vagitariana — Regata Roxa';
UPDATE "ecommerce-amooora".products SET name = 'Sapatão — Moletom Roxo' WHERE slug = 'moletom-sapatao-roxo' AND name <> 'Sapatão — Moletom Roxo';
UPDATE "ecommerce-amooora".products SET name = 'Sapatão — Boné Trucker Roxo' WHERE slug = 'bone-trucker-sapatao' AND name <> 'Sapatão — Boné Trucker Roxo';
