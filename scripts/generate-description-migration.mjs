/**
 * Gera supabase/migrations/003_update_product_descriptions.sql
 * Rodar: node scripts/generate-description-migration.mjs
 */

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

function detailsTable(rows) {
  const lines = rows.map(([label, value]) => `<strong>${label}:</strong> ${value}`);
  return `<h4>Detalhes do produto</h4>\n<p>${lines.join('<br>')}</p>`;
}

function fullDescription({ paragraphs, bullets, details }) {
  const parts = [
    '<h3>SOBRE O PRODUTO</h3>',
    ...paragraphs.map((p) => `<p>${p}</p>`),
    '<p>Por que você vai amar:</p>',
    '<ul>',
    ...bullets.map((b) => `<li>${b}</li>`),
    '</ul>',
    detailsTable(details),
  ];
  return parts.join('\n');
}

const CAMISETA_DETAILS = [
  ['Modelagem', 'Regular Unissex'],
  ['Tecido', 'Algodão Premium'],
  ['Gola', 'Canelada reforçada'],
  ['Estampa', 'Silk de alta definição'],
  ['Toque', 'Macio e encorpado'],
];

const OVERSIZED_DETAILS = [
  ['Modelagem', 'Oversized Unissex'],
  ['Tecido', 'Algodão Premium'],
  ['Gola', 'Canelada reforçada'],
  ['Estampa', 'Silk de alta definição'],
  ['Toque', 'Macio e encorpado'],
];

const products = [
  {
    name: 'Sapatão — Camiseta Oversized Brasil',
    short:
      'Tem palavras que a gente tomou de volta. "Sapatão" é uma delas. Camiseta oversized nas cores do Brasil — porque esse país também é nosso.',
    full: fullDescription({
      paragraphs: [
        'A Camiseta Oversized Brasil nasce de um ato de reapropriação: pegar uma palavra que foi usada como ofensa e transformá-la em bandeira. Verde, amarelo e laranja — as cores do Brasil estampadas com orgulho por quem sabe que esse país tem muito mais a representar do que o que nos foi ensinado.',
        'Confeccionada em algodão premium de alta qualidade, possui toque macio, caimento estruturado e modelagem oversized que veste com conforto e personalidade. No verso, um logo pequeno da Amooora — um detalhe que destaca o orgulho de fazer parte da maior comunidade sáfica do Brasil. Uma peça feita para acompanhar você em todos os lugares — do rolê ao cotidiano — sem abrir mão do estilo.',
      ],
      bullets: [
        '✨ Modelagem oversized com caimento moderno e confortável',
        '✨ Algodão premium macio e resistente',
        '✨ Estampa exclusiva Amooora nas cores do Brasil',
        '✨ Logo Amooora no verso — identidade sáfica em cada detalhe',
        '✨ Gola reforçada e acabamento de alta qualidade',
        '✨ Peça versátil para compor looks casuais ou streetwear',
        '✨ Produção nacional',
      ],
      details: OVERSIZED_DETAILS,
    }),
  },
  {
    name: 'Sapatão — Camiseta Branca',
    short:
      'Simples assim: uma peça que diz tudo sem precisar explicar nada. Clássica, atemporal e com a palavra certa estampada no peito.',
    full: fullDescription({
      paragraphs: [
        'Branca por fora, política por dentro. A Camiseta Sapatão Branca é a peça coringa da sua coleção — aquela que combina com tudo e ainda carrega uma mensagem que não passa despercebida. Porque existir com orgulho não precisa de barulho, às vezes basta a palavra certa no lugar certo.',
        'Confeccionada em algodão premium de alta qualidade, possui toque macio, caimento estruturado e modelagem que veste com conforto e presença. No verso, um logo pequeno da Amooora — um detalhe que destaca o orgulho de fazer parte da maior comunidade sáfica do Brasil. Uma peça feita para quem vive a identidade sáfica no dia a dia, sem pedir licença.',
      ],
      bullets: [
        '✨ Modelagem clássica com caimento confortável',
        '✨ Algodão premium macio e resistente',
        '✨ Estampa exclusiva Amooora em preto',
        '✨ Logo Amooora no verso — identidade sáfica em cada detalhe',
        '✨ Gola reforçada e acabamento de alta qualidade',
        '✨ Peça coringa para qualquer composição de look',
        '✨ Produção nacional',
      ],
      details: CAMISETA_DETAILS,
    }),
  },
  {
    name: 'Sapatão — Camiseta Roxa',
    short:
      'A cor que virou símbolo da nossa existência, estampada com a palavra que a gente ressignificou. Presença que não precisa se justificar.',
    full: fullDescription({
      paragraphs: [
        'Roxo não é só uma cor — é um posicionamento. A Camiseta Sapatão Roxa une a estética que marcou a identidade sáfica com uma palavra que a nossa comunidade escolheu usar com orgulho. Uma peça que carrega história, atitude e muito pertencimento em cada detalhe.',
        'Confeccionada em algodão premium de alta qualidade, possui toque macio, caimento estruturado e modelagem confortável para o dia a dia. No verso, um logo pequeno da Amooora — um detalhe que destaca o orgulho de fazer parte da maior comunidade sáfica do Brasil. Do happy hour ao rolê cultural — ela vai com você.',
      ],
      bullets: [
        '✨ Modelagem clássica com caimento confortável',
        '✨ Algodão premium macio e resistente',
        '✨ Estampa exclusiva Amooora em cor contrastante',
        '✨ Logo Amooora no verso — identidade sáfica em cada detalhe',
        '✨ Gola reforçada e acabamento de alta qualidade',
        '✨ Peça versátil para compor looks casuais',
        '✨ Produção nacional',
      ],
      details: CAMISETA_DETAILS,
    }),
  },
  {
    name: 'Sapatão — Camiseta Preta',
    short:
      'Preta, direta e sem rodeios. Para quem já sabe quem é e não precisa de mais nenhuma explicação além da estampa.',
    full: fullDescription({
      paragraphs: [
        'A Camiseta Sapatão Preta é pra quem não precisa de muito pra dizer muito. Fundo preto, estampa que fala por si — um clássico que nunca sai de moda e que carrega uma mensagem que só vai ficando mais forte com o tempo. Elegante, versátil e cheia de atitude.',
        'Confeccionada em algodão premium de alta qualidade, possui toque macio, caimento estruturado e modelagem pensada para o uso cotidiano. No verso, um logo pequeno da Amooora — um detalhe que destaca o orgulho de fazer parte da maior comunidade sáfica do Brasil. Uma peça que vai do dia à noite com a mesma presença.',
      ],
      bullets: [
        '✨ Modelagem clássica com caimento confortável',
        '✨ Algodão premium macio e resistente',
        '✨ Estampa exclusiva Amooora em alto contraste',
        '✨ Logo Amooora no verso — identidade sáfica em cada detalhe',
        '✨ Gola reforçada e acabamento de alta qualidade',
        '✨ Peça coringa para qualquer composição de look',
        '✨ Produção nacional',
      ],
      details: CAMISETA_DETAILS,
    }),
  },
  {
    name: 'Quenga — Camiseta Oversized Brasil',
    short:
      'Mais uma palavra que a gente tomou de volta e transformou em bandeira. Oversized, nas cores do Brasil, sem pedir desculpa por existir.',
    full: fullDescription({
      paragraphs: [
        'A Camiseta Oversized Quenga nasce para quem vive sua identidade sem pedir licença. Com uma estética marcante, modelagem ampla e presença inconfundível, ela transforma uma palavra tantas vezes usada como rótulo em símbolo de orgulho, pertencimento e potência. Verde, amarelo e laranja: o Brasil que a gente quer ver, representado por quem sempre esteve aqui.',
        'Confeccionada em algodão premium de alta qualidade, possui toque macio, caimento estruturado e modelagem oversized que veste com conforto e personalidade. No verso, um logo pequeno da Amooora — um detalhe que destaca o orgulho de fazer parte da maior comunidade sáfica do Brasil. Uma peça feita para acompanhar você em todos os lugares — do rolê ao cotidiano — sem abrir mão do estilo.',
      ],
      bullets: [
        '✨ Modelagem oversized com caimento moderno e confortável',
        '✨ Algodão premium macio e resistente',
        '✨ Estampa exclusiva Amooora nas cores do Brasil',
        '✨ Logo Amooora no verso — identidade sáfica em cada detalhe',
        '✨ Gola reforçada e acabamento de alta qualidade',
        '✨ Peça versátil para compor looks casuais ou streetwear',
        '✨ Produção nacional',
      ],
      details: OVERSIZED_DETAILS,
    }),
  },
  {
    name: 'Sapatão — Camiseta Ringer Amarela',
    short:
      'Gola e mangas em cor contrastante, estampa com mensagem. Para quem gosta de se destacar com personalidade e muito orgulho sáfico.',
    full: fullDescription({
      paragraphs: [
        'A Camiseta Ringer Sapatão traz um modelo com personalidade própria: a gola e as mangas em cor contrastante dão aquele toque retrô que nunca sai de moda, enquanto a estampa "sapatão" garante que a mensagem está bem clara. Amarelo vibrante com detalhes em verde e laranja — uma combinação que não passa despercebida e que celebra a identidade sáfica com muito estilo.',
        'Confeccionada em algodão premium de alta qualidade, possui toque macio e caimento confortável para o dia a dia. No verso, um logo pequeno da Amooora — um detalhe que destaca o orgulho de fazer parte da maior comunidade sáfica do Brasil. Uma peça que une estética e identidade em cada detalhe.',
      ],
      bullets: [
        '✨ Gola e mangas em cor contrastante',
        '✨ Algodão premium macio e resistente',
        '✨ Estampa exclusiva Amooora',
        '✨ Logo Amooora no verso — identidade sáfica em cada detalhe',
        '✨ Acabamento de alta qualidade',
        '✨ Peça com personalidade para compor looks autorais',
        '✨ Produção nacional',
      ],
      details: [
        ['Modelagem', 'Regular Unissex'],
        ['Tecido', 'Algodão Premium'],
        ['Gola', 'Canelada contrastante'],
        ['Estampa', 'Silk de alta definição'],
        ['Toque', 'Macio e encorpado'],
      ],
    }),
  },
  {
    name: 'Sapatão de Sítio — Regata Preta',
    short:
      'Uma referência afetiva e bem-humorada para quem cresceu ouvindo esse apelido — e decidiu usar como troféu. Regata preta, mensagem forte.',
    full: fullDescription({
      paragraphs: [
        '"Sapatão de sítio" é daqueles termos que a gente ouviu a vida inteira como se fosse um defeito, e que a comunidade foi ressignificando aos poucos — com afeto, com humor e com muito orgulho. Essa regata é pra quem abraçou essa história e quer carregar ela no corpo, com leveza e atitude.',
        'Confeccionada em tecido leve e confortável, com modelagem soltinha ideal para os dias quentes e para o movimento do cotidiano. No verso, um logo pequeno da Amooora — um detalhe que destaca o orgulho de fazer parte da maior comunidade sáfica do Brasil. Vai bem com tudo e é perfeita para quem quer praticidade sem abrir mão de quem é.',
      ],
      bullets: [
        '✨ Modelagem regata soltinha e confortável',
        '✨ Tecido leve, ideal para o calor do Brasil',
        '✨ Estampa exclusiva Amooora',
        '✨ Logo Amooora no verso — identidade sáfica em cada detalhe',
        '✨ Acabamento de alta qualidade',
        '✨ Peça prática para o dia a dia',
        '✨ Produção nacional',
      ],
      details: [
        ['Modelagem', 'Regata Unissex'],
        ['Tecido', 'Malha leve'],
        ['Gola', 'Canelada'],
        ['Estampa', 'Silk de alta definição'],
        ['Toque', 'Leve e macio'],
      ],
    }),
  },
  {
    name: 'Vagitariana — Camiseta Dry Fit Roxa',
    short:
      'Para treinar, passear ou simplesmente existir com muito orgulho sáfico. Dry fit roxa com estampa que fala por si — leve, respirável e sem se explicar.',
    full: fullDescription({
      paragraphs: [
        'A Camiseta Dry Fit Vagitariana é pra quem leva a identidade a sério — e o bom humor também. Leve, respirável e com aquela estampa que arranca sorrisos de quem entende e faz pensar em quem ainda não entendeu. Perfeita para o treino, para o rolê ou para qualquer momento em que você queira existir com conforto e personalidade.',
        'Confeccionada em tecido dry fit de alta performance, que afasta a umidade do corpo e mantém o conforto mesmo nos dias mais agitados. No verso, um logo pequeno da Amooora — um detalhe que destaca o orgulho de fazer parte da maior comunidade sáfica do Brasil. Uma peça que combina funcionalidade, estilo e representatividade em cada detalhe.',
      ],
      bullets: [
        '✨ Tecido dry fit com tecnologia de absorção de umidade',
        '✨ Modelagem confortável para movimento e uso diário',
        '✨ Estampa exclusiva Amooora',
        '✨ Logo Amooora no verso — identidade sáfica em cada detalhe',
        '✨ Cor roxa vibrante com acabamento de qualidade',
        '✨ Versátil — do treino ao street look',
        '✨ Produção nacional',
      ],
      details: [
        ['Modelagem', 'Regular Unissex'],
        ['Tecido', 'Dry Fit (poliéster)'],
        ['Gola', 'Canelada'],
        ['Estampa', 'Silk de alta definição'],
        ['Toque', 'Leve e funcional'],
      ],
    }),
  },
  {
    name: 'Amooora — Regata Preta',
    short:
      'Mais do que uma regata — é um símbolo de pertencimento. Use e mostre que você faz parte da maior comunidade sáfica do Brasil.',
    full: fullDescription({
      paragraphs: [
        'A Regata Amooora é para quem encontrou na plataforma um lugar seguro, afetuoso e com a nossa cara — e quer mostrar isso para o mundo. Preta, com o logo da Amooora estampado com orgulho, ela é mais do que uma peça de roupa: é um símbolo de que a gente existe, se encontra e se cuida.',
        'Confeccionada em tecido leve e confortável, com modelagem soltinha perfeita para os dias quentes e para o movimento do dia a dia. No verso, um logo pequeno da Amooora — um detalhe que reforça ainda mais o pertencimento à maior comunidade sáfica do Brasil. Uma peça que conecta você à comunidade em qualquer lugar que estiver.',
      ],
      bullets: [
        '✨ Modelagem regata soltinha e confortável',
        '✨ Tecido leve, ideal para o calor do Brasil',
        '✨ Estampa com o logo oficial da Amooora',
        '✨ Logo Amooora no verso — identidade sáfica em cada detalhe',
        '✨ Acabamento de alta qualidade',
        '✨ Peça prática para o dia a dia',
        '✨ Produção nacional',
      ],
      details: [
        ['Modelagem', 'Regata Unissex'],
        ['Tecido', 'Malha leve'],
        ['Gola', 'Canelada'],
        ['Estampa', 'Silk de alta definição'],
        ['Toque', 'Leve e macio'],
      ],
    }),
  },
  {
    name: 'Sapatão — Moletom Roxo',
    short:
      'Sapatão não é ofensa — é identidade, é comunidade, é orgulho. E agora também é o seu moletom favorito. Para os dias frios e para os abraços que a gente merece.',
    full: fullDescription({
      paragraphs: [
        'O Moletom Sapatão Roxo é pra quem quer conforto sem abrir mão de quem é. Nos dias mais frios, ele abraça o corpo e a identidade ao mesmo tempo. A estampa "sapatão" em branco sobre o roxo vibrante é direta, bonita e cheia de significado — porque essa palavra foi ressignificada pela nossa comunidade e agora ela pertence a nós.',
        'Confeccionado com tecido de moletom de alta qualidade, com interior felpudo para máximo conforto e canguru frontal para as mãos sempre aquecidas. No verso, um logo pequeno da Amooora — um detalhe que destaca o orgulho de fazer parte da maior comunidade sáfica do Brasil. Uma peça que vai virar a favorita — dessas que a gente coloca e não quer mais tirar.',
      ],
      bullets: [
        '✨ Moletom canguru com capuz e bolso frontal',
        '✨ Interior felpudo de alta qualidade',
        '✨ Estampa exclusiva Amooora em alto contraste',
        '✨ Logo Amooora no verso — identidade sáfica em cada detalhe',
        '✨ Cor roxa vibrante com acabamento impecável',
        '✨ Peça versátil para o inverno e além',
        '✨ Produção nacional',
      ],
      details: [
        ['Modelagem', 'Canguru Unissex'],
        ['Tecido', 'Moletom com felpado interno'],
        ['Fechamento', 'Capuz com cordão'],
        ['Estampa', 'Silk de alta definição'],
        ['Toque', 'Macio e encorpado'],
      ],
    }),
  },
  {
    name: 'Sapatão — Moletom Branco',
    short:
      'Claro por fora, potente por dentro. Moletom branco com estampa "sapatão" — conforto e representatividade feitos com amor, para a comunidade sáfica.',
    full: fullDescription({
      paragraphs: [
        'O Moletom Sapatão Branco é a versão clean e elegante da nossa peça mais aconchegante. Branco, leve na aparência e cheio de significado na estampa — para quem quer carregar a identidade sáfica com suavidade e presença ao mesmo tempo. Uma peça que combina com tudo e que vai bem em qualquer estação.',
        'Confeccionado com tecido de moletom de alta qualidade, com interior felpudo para máximo conforto e canguru frontal para as mãos sempre aquecidas. No verso, um logo pequeno da Amooora — um detalhe que destaca o orgulho de fazer parte da maior comunidade sáfica do Brasil. Feito com amor, do jeitinho que a comunidade sáfica merece.',
      ],
      bullets: [
        '✨ Moletom canguru com capuz e bolso frontal',
        '✨ Interior felpudo de alta qualidade',
        '✨ Estampa exclusiva Amooora',
        '✨ Logo Amooora no verso — identidade sáfica em cada detalhe',
        '✨ Cor branca versátil para qualquer composição de look',
        '✨ Peça confortável para o inverno e além',
        '✨ Produção nacional',
      ],
      details: [
        ['Modelagem', 'Canguru Unissex'],
        ['Tecido', 'Moletom com felpado interno'],
        ['Fechamento', 'Capuz com cordão'],
        ['Estampa', 'Silk de alta definição'],
        ['Toque', 'Macio e encorpado'],
      ],
    }),
  },
];

function sqlEscape(str) {
  return str.replace(/'/g, "''");
}

/** HTML em uma linha — evita strings multilinha que confundem o syntax highlight do Supabase */
function minifyHtml(html) {
  return html.replace(/\s*\n\s*/g, '');
}

const productNames = products.map((p) => p.name);
const namesList = productNames.map((n) => `'${sqlEscape(n)}'`).join(',\n  ');

const updates = products
  .map(
    (p, i) => `-- ------------------------------------------------------------------
-- [${i + 1}/${products.length}] DE/PARA: ${p.name}
-- Atualiza description_short (card) e description_full (página do produto)
-- WHERE name = '${p.name}'  →  só este produto existente é alterado
-- ------------------------------------------------------------------
UPDATE "ecommerce-amooora".products
SET
  description_short = '${sqlEscape(p.short)}',
  description_full = '${sqlEscape(minifyHtml(p.full))}'
WHERE name = '${sqlEscape(p.name)}';`
  )
  .join('\n\n');

const sql = `-- Atualiza descrições curta e longa dos produtos da loja
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
  ${namesList}
)
ORDER BY name;

${updates}

-- PÓS-CHECK: confira se as descrições curtas foram gravadas (início do texto novo)
SELECT name, left(description_short, 80) AS curta_preview
FROM "ecommerce-amooora".products
WHERE name IN (
  ${namesList}
)
ORDER BY name;
`;

const outPath = join(__dirname, '../supabase/migrations/003_update_product_descriptions.sql');
writeFileSync(outPath, sql, 'utf8');
console.log(`Wrote ${outPath} (${products.length} products)`);
