-- Atualiza descrições curta e longa dos produtos da loja
-- Rodar no SQL Editor do Supabase (schema ecommerce-amooora)
-- Gerado por: node scripts/generate-description-migration.mjs
-- Seguro para rodar mais de uma vez (idempotente)
--
-- O QUE FAZ: 11 comandos UPDATE, cada um com WHERE name = '...'
-- NÃO altera nome, preço, fotos nem outros produtos fora da lista.

-- PRÉ-CHECK: deve retornar 11 linhas. Se faltar alguma, o nome no banco está diferente.
SELECT name
FROM "ecommerce-amooora".products
WHERE name IN (
  'Sapatão — Camiseta Oversized Brasil',
  'Sapatão — Camiseta Branca',
  'Sapatão — Camiseta Roxa',
  'Sapatão — Camiseta Preta',
  'Quenga — Camiseta Oversized Brasil',
  'Sapatão — Camiseta Ringer Amarela',
  'Sapatão de Sítio — Regata Preta',
  'Vagitariana — Camiseta Dry Fit Roxa',
  'Amooora — Regata Preta',
  'Sapatão — Moletom Roxo',
  'Sapatão — Moletom Branco'
)
ORDER BY name;

-- ------------------------------------------------------------------
-- [1/11] DE/PARA: Sapatão — Camiseta Oversized Brasil
-- Atualiza description_short (card) e description_full (página do produto)
-- WHERE name = 'Sapatão — Camiseta Oversized Brasil'  →  só este produto existente é alterado
-- ------------------------------------------------------------------
UPDATE "ecommerce-amooora".products
SET
  description_short = 'Tem palavras que a gente tomou de volta. "Sapatão" é uma delas. Camiseta oversized nas cores do Brasil — porque esse país também é nosso.',
  description_full = '<h3>SOBRE O PRODUTO</h3><p>A Camiseta Oversized Brasil nasce de um ato de reapropriação: pegar uma palavra que foi usada como ofensa e transformá-la em bandeira. Verde, amarelo e laranja — as cores do Brasil estampadas com orgulho por quem sabe que esse país tem muito mais a representar do que o que nos foi ensinado.</p><p>Confeccionada em algodão premium de alta qualidade, possui toque macio, caimento estruturado e modelagem oversized que veste com conforto e personalidade. No verso, um logo pequeno da Amooora — um detalhe que destaca o orgulho de fazer parte da maior comunidade sáfica do Brasil. Uma peça feita para acompanhar você em todos os lugares — do rolê ao cotidiano — sem abrir mão do estilo.</p><p>Por que você vai amar:</p><ul><li>✨ Modelagem oversized com caimento moderno e confortável</li><li>✨ Algodão premium macio e resistente</li><li>✨ Estampa exclusiva Amooora nas cores do Brasil</li><li>✨ Logo Amooora no verso — identidade sáfica em cada detalhe</li><li>✨ Gola reforçada e acabamento de alta qualidade</li><li>✨ Peça versátil para compor looks casuais ou streetwear</li><li>✨ Produção nacional</li></ul><h4>Detalhes do produto</h4><p><strong>Modelagem:</strong> Oversized Unissex<br><strong>Tecido:</strong> Algodão Premium<br><strong>Gola:</strong> Canelada reforçada<br><strong>Estampa:</strong> Silk de alta definição<br><strong>Toque:</strong> Macio e encorpado</p>'
WHERE name = 'Sapatão — Camiseta Oversized Brasil';

-- ------------------------------------------------------------------
-- [2/11] DE/PARA: Sapatão — Camiseta Branca
-- Atualiza description_short (card) e description_full (página do produto)
-- WHERE name = 'Sapatão — Camiseta Branca'  →  só este produto existente é alterado
-- ------------------------------------------------------------------
UPDATE "ecommerce-amooora".products
SET
  description_short = 'Simples assim: uma peça que diz tudo sem precisar explicar nada. Clássica, atemporal e com a palavra certa estampada no peito.',
  description_full = '<h3>SOBRE O PRODUTO</h3><p>Branca por fora, política por dentro. A Camiseta Sapatão Branca é a peça coringa da sua coleção — aquela que combina com tudo e ainda carrega uma mensagem que não passa despercebida. Porque existir com orgulho não precisa de barulho, às vezes basta a palavra certa no lugar certo.</p><p>Confeccionada em algodão premium de alta qualidade, possui toque macio, caimento estruturado e modelagem que veste com conforto e presença. No verso, um logo pequeno da Amooora — um detalhe que destaca o orgulho de fazer parte da maior comunidade sáfica do Brasil. Uma peça feita para quem vive a identidade sáfica no dia a dia, sem pedir licença.</p><p>Por que você vai amar:</p><ul><li>✨ Modelagem clássica com caimento confortável</li><li>✨ Algodão premium macio e resistente</li><li>✨ Estampa exclusiva Amooora em preto</li><li>✨ Logo Amooora no verso — identidade sáfica em cada detalhe</li><li>✨ Gola reforçada e acabamento de alta qualidade</li><li>✨ Peça coringa para qualquer composição de look</li><li>✨ Produção nacional</li></ul><h4>Detalhes do produto</h4><p><strong>Modelagem:</strong> Regular Unissex<br><strong>Tecido:</strong> Algodão Premium<br><strong>Gola:</strong> Canelada reforçada<br><strong>Estampa:</strong> Silk de alta definição<br><strong>Toque:</strong> Macio e encorpado</p>'
WHERE name = 'Sapatão — Camiseta Branca';

-- ------------------------------------------------------------------
-- [3/11] DE/PARA: Sapatão — Camiseta Roxa
-- Atualiza description_short (card) e description_full (página do produto)
-- WHERE name = 'Sapatão — Camiseta Roxa'  →  só este produto existente é alterado
-- ------------------------------------------------------------------
UPDATE "ecommerce-amooora".products
SET
  description_short = 'A cor que virou símbolo da nossa existência, estampada com a palavra que a gente ressignificou. Presença que não precisa se justificar.',
  description_full = '<h3>SOBRE O PRODUTO</h3><p>Roxo não é só uma cor — é um posicionamento. A Camiseta Sapatão Roxa une a estética que marcou a identidade sáfica com uma palavra que a nossa comunidade escolheu usar com orgulho. Uma peça que carrega história, atitude e muito pertencimento em cada detalhe.</p><p>Confeccionada em algodão premium de alta qualidade, possui toque macio, caimento estruturado e modelagem confortável para o dia a dia. No verso, um logo pequeno da Amooora — um detalhe que destaca o orgulho de fazer parte da maior comunidade sáfica do Brasil. Do happy hour ao rolê cultural — ela vai com você.</p><p>Por que você vai amar:</p><ul><li>✨ Modelagem clássica com caimento confortável</li><li>✨ Algodão premium macio e resistente</li><li>✨ Estampa exclusiva Amooora em cor contrastante</li><li>✨ Logo Amooora no verso — identidade sáfica em cada detalhe</li><li>✨ Gola reforçada e acabamento de alta qualidade</li><li>✨ Peça versátil para compor looks casuais</li><li>✨ Produção nacional</li></ul><h4>Detalhes do produto</h4><p><strong>Modelagem:</strong> Regular Unissex<br><strong>Tecido:</strong> Algodão Premium<br><strong>Gola:</strong> Canelada reforçada<br><strong>Estampa:</strong> Silk de alta definição<br><strong>Toque:</strong> Macio e encorpado</p>'
WHERE name = 'Sapatão — Camiseta Roxa';

-- ------------------------------------------------------------------
-- [4/11] DE/PARA: Sapatão — Camiseta Preta
-- Atualiza description_short (card) e description_full (página do produto)
-- WHERE name = 'Sapatão — Camiseta Preta'  →  só este produto existente é alterado
-- ------------------------------------------------------------------
UPDATE "ecommerce-amooora".products
SET
  description_short = 'Preta, direta e sem rodeios. Para quem já sabe quem é e não precisa de mais nenhuma explicação além da estampa.',
  description_full = '<h3>SOBRE O PRODUTO</h3><p>A Camiseta Sapatão Preta é pra quem não precisa de muito pra dizer muito. Fundo preto, estampa que fala por si — um clássico que nunca sai de moda e que carrega uma mensagem que só vai ficando mais forte com o tempo. Elegante, versátil e cheia de atitude.</p><p>Confeccionada em algodão premium de alta qualidade, possui toque macio, caimento estruturado e modelagem pensada para o uso cotidiano. No verso, um logo pequeno da Amooora — um detalhe que destaca o orgulho de fazer parte da maior comunidade sáfica do Brasil. Uma peça que vai do dia à noite com a mesma presença.</p><p>Por que você vai amar:</p><ul><li>✨ Modelagem clássica com caimento confortável</li><li>✨ Algodão premium macio e resistente</li><li>✨ Estampa exclusiva Amooora em alto contraste</li><li>✨ Logo Amooora no verso — identidade sáfica em cada detalhe</li><li>✨ Gola reforçada e acabamento de alta qualidade</li><li>✨ Peça coringa para qualquer composição de look</li><li>✨ Produção nacional</li></ul><h4>Detalhes do produto</h4><p><strong>Modelagem:</strong> Regular Unissex<br><strong>Tecido:</strong> Algodão Premium<br><strong>Gola:</strong> Canelada reforçada<br><strong>Estampa:</strong> Silk de alta definição<br><strong>Toque:</strong> Macio e encorpado</p>'
WHERE name = 'Sapatão — Camiseta Preta';

-- ------------------------------------------------------------------
-- [5/11] DE/PARA: Quenga — Camiseta Oversized Brasil
-- Atualiza description_short (card) e description_full (página do produto)
-- WHERE name = 'Quenga — Camiseta Oversized Brasil'  →  só este produto existente é alterado
-- ------------------------------------------------------------------
UPDATE "ecommerce-amooora".products
SET
  description_short = 'Mais uma palavra que a gente tomou de volta e transformou em bandeira. Oversized, nas cores do Brasil, sem pedir desculpa por existir.',
  description_full = '<h3>SOBRE O PRODUTO</h3><p>A Camiseta Oversized Quenga nasce para quem vive sua identidade sem pedir licença. Com uma estética marcante, modelagem ampla e presença inconfundível, ela transforma uma palavra tantas vezes usada como rótulo em símbolo de orgulho, pertencimento e potência. Verde, amarelo e laranja: o Brasil que a gente quer ver, representado por quem sempre esteve aqui.</p><p>Confeccionada em algodão premium de alta qualidade, possui toque macio, caimento estruturado e modelagem oversized que veste com conforto e personalidade. No verso, um logo pequeno da Amooora — um detalhe que destaca o orgulho de fazer parte da maior comunidade sáfica do Brasil. Uma peça feita para acompanhar você em todos os lugares — do rolê ao cotidiano — sem abrir mão do estilo.</p><p>Por que você vai amar:</p><ul><li>✨ Modelagem oversized com caimento moderno e confortável</li><li>✨ Algodão premium macio e resistente</li><li>✨ Estampa exclusiva Amooora nas cores do Brasil</li><li>✨ Logo Amooora no verso — identidade sáfica em cada detalhe</li><li>✨ Gola reforçada e acabamento de alta qualidade</li><li>✨ Peça versátil para compor looks casuais ou streetwear</li><li>✨ Produção nacional</li></ul><h4>Detalhes do produto</h4><p><strong>Modelagem:</strong> Oversized Unissex<br><strong>Tecido:</strong> Algodão Premium<br><strong>Gola:</strong> Canelada reforçada<br><strong>Estampa:</strong> Silk de alta definição<br><strong>Toque:</strong> Macio e encorpado</p>'
WHERE name = 'Quenga — Camiseta Oversized Brasil';

-- ------------------------------------------------------------------
-- [6/11] DE/PARA: Sapatão — Camiseta Ringer Amarela
-- Atualiza description_short (card) e description_full (página do produto)
-- WHERE name = 'Sapatão — Camiseta Ringer Amarela'  →  só este produto existente é alterado
-- ------------------------------------------------------------------
UPDATE "ecommerce-amooora".products
SET
  description_short = 'Gola e mangas em cor contrastante, estampa com mensagem. Para quem gosta de se destacar com personalidade e muito orgulho sáfico.',
  description_full = '<h3>SOBRE O PRODUTO</h3><p>A Camiseta Ringer Sapatão traz um modelo com personalidade própria: a gola e as mangas em cor contrastante dão aquele toque retrô que nunca sai de moda, enquanto a estampa "sapatão" garante que a mensagem está bem clara. Amarelo vibrante com detalhes em verde e laranja — uma combinação que não passa despercebida e que celebra a identidade sáfica com muito estilo.</p><p>Confeccionada em algodão premium de alta qualidade, possui toque macio e caimento confortável para o dia a dia. No verso, um logo pequeno da Amooora — um detalhe que destaca o orgulho de fazer parte da maior comunidade sáfica do Brasil. Uma peça que une estética e identidade em cada detalhe.</p><p>Por que você vai amar:</p><ul><li>✨ Gola e mangas em cor contrastante</li><li>✨ Algodão premium macio e resistente</li><li>✨ Estampa exclusiva Amooora</li><li>✨ Logo Amooora no verso — identidade sáfica em cada detalhe</li><li>✨ Acabamento de alta qualidade</li><li>✨ Peça com personalidade para compor looks autorais</li><li>✨ Produção nacional</li></ul><h4>Detalhes do produto</h4><p><strong>Modelagem:</strong> Regular Unissex<br><strong>Tecido:</strong> Algodão Premium<br><strong>Gola:</strong> Canelada contrastante<br><strong>Estampa:</strong> Silk de alta definição<br><strong>Toque:</strong> Macio e encorpado</p>'
WHERE name = 'Sapatão — Camiseta Ringer Amarela';

-- ------------------------------------------------------------------
-- [7/11] DE/PARA: Sapatão de Sítio — Regata Preta
-- Atualiza description_short (card) e description_full (página do produto)
-- WHERE name = 'Sapatão de Sítio — Regata Preta'  →  só este produto existente é alterado
-- ------------------------------------------------------------------
UPDATE "ecommerce-amooora".products
SET
  description_short = 'Uma referência afetiva e bem-humorada para quem cresceu ouvindo esse apelido — e decidiu usar como troféu. Regata preta, mensagem forte.',
  description_full = '<h3>SOBRE O PRODUTO</h3><p>"Sapatão de sítio" é daqueles termos que a gente ouviu a vida inteira como se fosse um defeito, e que a comunidade foi ressignificando aos poucos — com afeto, com humor e com muito orgulho. Essa regata é pra quem abraçou essa história e quer carregar ela no corpo, com leveza e atitude.</p><p>Confeccionada em tecido leve e confortável, com modelagem soltinha ideal para os dias quentes e para o movimento do cotidiano. No verso, um logo pequeno da Amooora — um detalhe que destaca o orgulho de fazer parte da maior comunidade sáfica do Brasil. Vai bem com tudo e é perfeita para quem quer praticidade sem abrir mão de quem é.</p><p>Por que você vai amar:</p><ul><li>✨ Modelagem regata soltinha e confortável</li><li>✨ Tecido leve, ideal para o calor do Brasil</li><li>✨ Estampa exclusiva Amooora</li><li>✨ Logo Amooora no verso — identidade sáfica em cada detalhe</li><li>✨ Acabamento de alta qualidade</li><li>✨ Peça prática para o dia a dia</li><li>✨ Produção nacional</li></ul><h4>Detalhes do produto</h4><p><strong>Modelagem:</strong> Regata Unissex<br><strong>Tecido:</strong> Malha leve<br><strong>Gola:</strong> Canelada<br><strong>Estampa:</strong> Silk de alta definição<br><strong>Toque:</strong> Leve e macio</p>'
WHERE name = 'Sapatão de Sítio — Regata Preta';

-- ------------------------------------------------------------------
-- [8/11] DE/PARA: Vagitariana — Camiseta Dry Fit Roxa
-- Atualiza description_short (card) e description_full (página do produto)
-- WHERE name = 'Vagitariana — Camiseta Dry Fit Roxa'  →  só este produto existente é alterado
-- ------------------------------------------------------------------
UPDATE "ecommerce-amooora".products
SET
  description_short = 'Para treinar, passear ou simplesmente existir com muito orgulho sáfico. Dry fit roxa com estampa que fala por si — leve, respirável e sem se explicar.',
  description_full = '<h3>SOBRE O PRODUTO</h3><p>A Camiseta Dry Fit Vagitariana é pra quem leva a identidade a sério — e o bom humor também. Leve, respirável e com aquela estampa que arranca sorrisos de quem entende e faz pensar em quem ainda não entendeu. Perfeita para o treino, para o rolê ou para qualquer momento em que você queira existir com conforto e personalidade.</p><p>Confeccionada em tecido dry fit de alta performance, que afasta a umidade do corpo e mantém o conforto mesmo nos dias mais agitados. No verso, um logo pequeno da Amooora — um detalhe que destaca o orgulho de fazer parte da maior comunidade sáfica do Brasil. Uma peça que combina funcionalidade, estilo e representatividade em cada detalhe.</p><p>Por que você vai amar:</p><ul><li>✨ Tecido dry fit com tecnologia de absorção de umidade</li><li>✨ Modelagem confortável para movimento e uso diário</li><li>✨ Estampa exclusiva Amooora</li><li>✨ Logo Amooora no verso — identidade sáfica em cada detalhe</li><li>✨ Cor roxa vibrante com acabamento de qualidade</li><li>✨ Versátil — do treino ao street look</li><li>✨ Produção nacional</li></ul><h4>Detalhes do produto</h4><p><strong>Modelagem:</strong> Regular Unissex<br><strong>Tecido:</strong> Dry Fit (poliéster)<br><strong>Gola:</strong> Canelada<br><strong>Estampa:</strong> Silk de alta definição<br><strong>Toque:</strong> Leve e funcional</p>'
WHERE name = 'Vagitariana — Camiseta Dry Fit Roxa';

-- ------------------------------------------------------------------
-- [9/11] DE/PARA: Amooora — Regata Preta
-- Atualiza description_short (card) e description_full (página do produto)
-- WHERE name = 'Amooora — Regata Preta'  →  só este produto existente é alterado
-- ------------------------------------------------------------------
UPDATE "ecommerce-amooora".products
SET
  description_short = 'Mais do que uma regata — é um símbolo de pertencimento. Use e mostre que você faz parte da maior comunidade sáfica do Brasil.',
  description_full = '<h3>SOBRE O PRODUTO</h3><p>A Regata Amooora é para quem encontrou na plataforma um lugar seguro, afetuoso e com a nossa cara — e quer mostrar isso para o mundo. Preta, com o logo da Amooora estampado com orgulho, ela é mais do que uma peça de roupa: é um símbolo de que a gente existe, se encontra e se cuida.</p><p>Confeccionada em tecido leve e confortável, com modelagem soltinha perfeita para os dias quentes e para o movimento do dia a dia. No verso, um logo pequeno da Amooora — um detalhe que reforça ainda mais o pertencimento à maior comunidade sáfica do Brasil. Uma peça que conecta você à comunidade em qualquer lugar que estiver.</p><p>Por que você vai amar:</p><ul><li>✨ Modelagem regata soltinha e confortável</li><li>✨ Tecido leve, ideal para o calor do Brasil</li><li>✨ Estampa com o logo oficial da Amooora</li><li>✨ Logo Amooora no verso — identidade sáfica em cada detalhe</li><li>✨ Acabamento de alta qualidade</li><li>✨ Peça prática para o dia a dia</li><li>✨ Produção nacional</li></ul><h4>Detalhes do produto</h4><p><strong>Modelagem:</strong> Regata Unissex<br><strong>Tecido:</strong> Malha leve<br><strong>Gola:</strong> Canelada<br><strong>Estampa:</strong> Silk de alta definição<br><strong>Toque:</strong> Leve e macio</p>'
WHERE name = 'Amooora — Regata Preta';

-- ------------------------------------------------------------------
-- [10/11] DE/PARA: Sapatão — Moletom Roxo
-- Atualiza description_short (card) e description_full (página do produto)
-- WHERE name = 'Sapatão — Moletom Roxo'  →  só este produto existente é alterado
-- ------------------------------------------------------------------
UPDATE "ecommerce-amooora".products
SET
  description_short = 'Sapatão não é ofensa — é identidade, é comunidade, é orgulho. E agora também é o seu moletom favorito. Para os dias frios e para os abraços que a gente merece.',
  description_full = '<h3>SOBRE O PRODUTO</h3><p>O Moletom Sapatão Roxo é pra quem quer conforto sem abrir mão de quem é. Nos dias mais frios, ele abraça o corpo e a identidade ao mesmo tempo. A estampa "sapatão" em branco sobre o roxo vibrante é direta, bonita e cheia de significado — porque essa palavra foi ressignificada pela nossa comunidade e agora ela pertence a nós.</p><p>Confeccionado com tecido de moletom de alta qualidade, com interior felpudo para máximo conforto e canguru frontal para as mãos sempre aquecidas. No verso, um logo pequeno da Amooora — um detalhe que destaca o orgulho de fazer parte da maior comunidade sáfica do Brasil. Uma peça que vai virar a favorita — dessas que a gente coloca e não quer mais tirar.</p><p>Por que você vai amar:</p><ul><li>✨ Moletom canguru com capuz e bolso frontal</li><li>✨ Interior felpudo de alta qualidade</li><li>✨ Estampa exclusiva Amooora em alto contraste</li><li>✨ Logo Amooora no verso — identidade sáfica em cada detalhe</li><li>✨ Cor roxa vibrante com acabamento impecável</li><li>✨ Peça versátil para o inverno e além</li><li>✨ Produção nacional</li></ul><h4>Detalhes do produto</h4><p><strong>Modelagem:</strong> Canguru Unissex<br><strong>Tecido:</strong> Moletom com felpado interno<br><strong>Fechamento:</strong> Capuz com cordão<br><strong>Estampa:</strong> Silk de alta definição<br><strong>Toque:</strong> Macio e encorpado</p>'
WHERE name = 'Sapatão — Moletom Roxo';

-- ------------------------------------------------------------------
-- [11/11] DE/PARA: Sapatão — Moletom Branco
-- Atualiza description_short (card) e description_full (página do produto)
-- WHERE name = 'Sapatão — Moletom Branco'  →  só este produto existente é alterado
-- ------------------------------------------------------------------
UPDATE "ecommerce-amooora".products
SET
  description_short = 'Claro por fora, potente por dentro. Moletom branco com estampa "sapatão" — conforto e representatividade feitos com amor, para a comunidade sáfica.',
  description_full = '<h3>SOBRE O PRODUTO</h3><p>O Moletom Sapatão Branco é a versão clean e elegante da nossa peça mais aconchegante. Branco, leve na aparência e cheio de significado na estampa — para quem quer carregar a identidade sáfica com suavidade e presença ao mesmo tempo. Uma peça que combina com tudo e que vai bem em qualquer estação.</p><p>Confeccionado com tecido de moletom de alta qualidade, com interior felpudo para máximo conforto e canguru frontal para as mãos sempre aquecidas. No verso, um logo pequeno da Amooora — um detalhe que destaca o orgulho de fazer parte da maior comunidade sáfica do Brasil. Feito com amor, do jeitinho que a comunidade sáfica merece.</p><p>Por que você vai amar:</p><ul><li>✨ Moletom canguru com capuz e bolso frontal</li><li>✨ Interior felpudo de alta qualidade</li><li>✨ Estampa exclusiva Amooora</li><li>✨ Logo Amooora no verso — identidade sáfica em cada detalhe</li><li>✨ Cor branca versátil para qualquer composição de look</li><li>✨ Peça confortável para o inverno e além</li><li>✨ Produção nacional</li></ul><h4>Detalhes do produto</h4><p><strong>Modelagem:</strong> Canguru Unissex<br><strong>Tecido:</strong> Moletom com felpado interno<br><strong>Fechamento:</strong> Capuz com cordão<br><strong>Estampa:</strong> Silk de alta definição<br><strong>Toque:</strong> Macio e encorpado</p>'
WHERE name = 'Sapatão — Moletom Branco';

-- PÓS-CHECK: confira se as descrições curtas foram gravadas (início do texto novo)
SELECT name, left(description_short, 80) AS curta_preview
FROM "ecommerce-amooora".products
WHERE name IN (
  'Sapatão — Camiseta Oversized Brasil',
  'Sapatão — Camiseta Branca',
  'Sapatão — Camiseta Roxa',
  'Sapatão — Camiseta Preta',
  'Quenga — Camiseta Oversized Brasil',
  'Sapatão — Camiseta Ringer Amarela',
  'Sapatão de Sítio — Regata Preta',
  'Vagitariana — Camiseta Dry Fit Roxa',
  'Amooora — Regata Preta',
  'Sapatão — Moletom Roxo',
  'Sapatão — Moletom Branco'
)
ORDER BY name;
