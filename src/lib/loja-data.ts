/**
 * Conteúdo e assets da página /loja.
 *
 * Banner do hero — tamanho recomendado:
 *   1920 × 600 px  (proporção ~3.2:1, full-bleed desktop)
 *   Altura exibida no site: ~520–580 px (varia com a tela)
 *   Retina: exporte também 3840 × 1200 px (@2x)
 *   Deixe o foco visual no centro/direita — o texto fica à esquerda.
 *
 * Para trocar o banner:
 * 1. Substitua public/images/loja/banner-hero.png (mesmo nome), ou
 * 2. Altere hero.imagem abaixo.
 *
 * Thumbs dos produtos — tamanho recomendado:
 *   900 × 1200 px  (proporção 3:4, igual ao card)
 *   Retina (@2x): 1800 × 2400 px
 *   Formato: JPG ou WebP (menor peso); PNG só se precisar de transparência
 *   Salvar em: public/images/loja/produtos/
 *   Referenciar em: PRODUTOS_LOJA[].imagem (ex.: '/images/loja/produtos/meu-produto.jpg')
 *   No CMS, cada produto terá o campo imagem próprio.
 */
import { buildWhatsappUrl, DEFAULT_WHATSAPP_MESSAGE } from '@/lib/supabase/map-product';

const IMG = {
  regataVagitariana: '/images/loja/produtos/regata-vagitariana.png',
  capaceteSapatao: '/images/loja/produtos/capacete-sapatao-vermelho.png',
  camisetaSapataoAmarela: '/images/loja/produtos/camiseta-sapatao-amarela-ringer.png',
  camisetaQuenga: '/images/loja/produtos/camiseta-quenga-amarela.png',
  moletomSapataoRoxo: '/images/loja/produtos/moletom-sapatao-roxo.png',
  boneSapatao: '/images/loja/produtos/bone-sapatao-trucker.png',
  camisetaSapataoPreta: '/images/loja/produtos/camiseta-sapatao-preta.png',
  camisetaSapataoArcoIris: '/images/loja/produtos/camiseta-sapatao-arco-iris.png',
} as const;

export const CONTEUDO_LOJA = {
  hero: {
    imagem: '/images/loja/banner-hero.png',
    /** Referência de altura máxima do hero em px (usado no layout) */
    alturaMaxPx: 580,
    label: 'LOJA AMOOORA',
    titulo: 'Vista sua identidade sáfica',
    subtitulo: 'com muito mais orgulho',
    descricao:
      'Cada peça é feita com amor, representatividade e orgulho sáfico. Produtos feitos por nós, para nós.',
    ctaPrimario: 'Ver Coleção',
    ctaSecundario: 'Nossa História',
  },
} as const;

export type ProdutoLoja = {
  uuid: string;
  slug: string;
  id: number;
  nome: string;
  categoria: 'Camisetas' | 'Moletons' | 'Acessórios';
  preco: string;
  precoNumerico: number;
  badge: 'NOVO' | 'EDIÇÃO LIMITADA' | 'MAIS VENDIDO' | null;
  desc: string;
  descricaoCompleta: string;
  imagem: string;
  imagens: string[];
  cores: { nome: string; hex: string }[];
  tamanhos: string[];
  whatsappPhone: string;
  whatsappMessageTemplate: string;
  /** Link wa.me (atualizado conforme cor/tamanho no modal) */
  shopUrl: string;
};

export const CATEGORIAS_LOJA = [
  'Todos',
  'Camisetas',
  'Moletons',
  'Acessórios',
  'Edição Limitada',
] as const;

export type CategoriaFiltro = (typeof CATEGORIAS_LOJA)[number];

type ProdutoLojaBase = Omit<
  ProdutoLoja,
  'uuid' | 'imagens' | 'precoNumerico' | 'whatsappPhone' | 'whatsappMessageTemplate' | 'shopUrl'
>;

const PRODUTOS_BASE: ProdutoLojaBase[] = [
  {
    id: 1,
    slug: 'camiseta-sapatao-arco-iris',
    nome: 'Camiseta Sapatão Arco-íris',
    categoria: 'Camisetas',
    preco: 'R$ 84,90',
    badge: 'MAIS VENDIDO',
    desc: 'Estampa tipográfica em sete cores, roxo vibrante',
    descricaoCompleta:
      'Camiseta roxa com a palavra "sapatão" repetida em sete cores do arco-íris. Modelagem unissex, 100% algodão, ideal para o dia a dia com muito orgulho.',
    cores: [
      { nome: 'Roxo', hex: '#3a184f' },
      { nome: 'Vinho', hex: '#93296F' },
    ],
    tamanhos: ['P', 'M', 'G', 'GG'],
    imagem: IMG.camisetaSapataoArcoIris,
  },
  {
    id: 2,
    slug: 'camiseta-sapatao-preta',
    nome: 'Camiseta Sapatão Preta',
    categoria: 'Camisetas',
    preco: 'R$ 79,90',
    badge: null,
    desc: 'Estampa branca com detalhe rosa, algodão premium',
    descricaoCompleta:
      'Camiseta preta com estampa "sapatão" em branco e círculo rosa no peito. Corte confortável, tecido de alta qualidade.',
    cores: [
      { nome: 'Preto', hex: '#1a1a1a' },
      { nome: 'Vinho', hex: '#93296F' },
    ],
    tamanhos: ['P', 'M', 'G', 'GG'],
    imagem: IMG.camisetaSapataoPreta,
  },
  {
    id: 3,
    slug: 'camiseta-sapatao-ringer-amarela',
    nome: 'Camiseta Sapatão Ringer Amarela',
    categoria: 'Camisetas',
    preco: 'R$ 74,90',
    badge: 'NOVO',
    desc: 'Modelo ringer amarelo, estampa verde e detalhe laranja',
    descricaoCompleta:
      'Camiseta ringer amarela com gola e mangas verdes. Estampa "sapatão" em verde escuro com círculo laranja. Unissex e confortável.',
    cores: [
      { nome: 'Amarelo', hex: '#f5c842' },
      { nome: 'Verde', hex: '#2d5016' },
    ],
    tamanhos: ['P', 'M', 'G', 'GG'],
    imagem: IMG.camisetaSapataoAmarela,
  },
  {
    id: 4,
    slug: 'camiseta-quenga-ringer',
    nome: 'Camiseta Quenga Ringer',
    categoria: 'Camisetas',
    preco: 'R$ 74,90',
    badge: null,
    desc: 'Ringer amarela com estampa tipográfica "quenga"',
    descricaoCompleta:
      'Camiseta ringer amarela com detalhes verdes na gola. Estampa "quenga" em tipografia serifada preta. Peça ousada e cheia de personalidade.',
    cores: [
      { nome: 'Amarelo', hex: '#f5c842' },
      { nome: 'Verde', hex: '#2d5016' },
    ],
    tamanhos: ['P', 'M', 'G', 'GG'],
    imagem: IMG.camisetaQuenga,
  },
  {
    id: 5,
    slug: 'regata-vagitariana',
    nome: 'Regata Vagitariana',
    categoria: 'Camisetas',
    preco: 'R$ 69,90',
    badge: 'NOVO',
    desc: 'Tipografia serifada em branco, roxo vibrante',
    descricaoCompleta:
      'Regata em tom roxo profundo com estampa "vagitariana" em letras brancas e detalhes em rosa. Tecido leve e confortável para o calor.',
    cores: [
      { nome: 'Roxo', hex: '#3a184f' },
      { nome: 'Vinho', hex: '#93296F' },
    ],
    tamanhos: ['P', 'M', 'G', 'GG'],
    imagem: IMG.regataVagitariana,
  },
  {
    id: 6,
    slug: 'moletom-sapatao-roxo',
    nome: 'Moletom Sapatão Roxo',
    categoria: 'Moletons',
    preco: 'R$ 189,90',
    badge: 'NOVO',
    desc: 'Capuz, bolso canguru, estampa branca e detalhe rosa',
    descricaoCompleta:
      'Moletom roxo com estampa "sapatão" em branco e círculo rosa no peito. Soft fleece, capuz com cordão e bolso frontal.',
    cores: [
      { nome: 'Roxo', hex: '#3a184f' },
      { nome: 'Vinho', hex: '#93296F' },
    ],
    tamanhos: ['P', 'M', 'G', 'GG'],
    imagem: IMG.moletomSapataoRoxo,
  },
  {
    id: 7,
    slug: 'bone-trucker-sapatao',
    nome: 'Boné Trucker Sapatão',
    categoria: 'Acessórios',
    preco: 'R$ 59,90',
    badge: null,
    desc: 'Boné trucker roxo e branco, estampa Amooora',
    descricaoCompleta:
      'Boné trucker com aba roxa, tela branca e estampa "sapatão" com detalhe Amooora. Ajuste traseiro, ideal para o dia a dia.',
    cores: [
      { nome: 'Roxo', hex: '#3a184f' },
      { nome: 'Branco', hex: '#ffffff' },
    ],
    tamanhos: ['Único'],
    imagem: IMG.boneSapatao,
  },
  {
    id: 8,
    slug: 'capacete-sapatao-uvex',
    nome: 'Capacete Sapatão Uvex',
    categoria: 'Acessórios',
    preco: 'R$ 249,90',
    badge: 'EDIÇÃO LIMITADA',
    desc: 'Capacete ciclismo vermelho, parceria Uvex x Amooora',
    descricaoCompleta:
      'Capacete de ciclismo vermelho com estampa "sapatão" e branding Amooora. Parceria exclusiva com Uvex — segurança e identidade sáfica na bike.',
    cores: [
      { nome: 'Vermelho', hex: '#c41e3a' },
    ],
    tamanhos: ['P', 'M', 'G'],
    imagem: IMG.capaceteSapatao,
  },
];

function parsePrecoBRL(preco: string): number {
  return Number.parseFloat(preco.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
}

function enrichProduto(p: ProdutoLojaBase): ProdutoLoja {
  const precoNumerico = parsePrecoBRL(p.preco);
  const whatsappPhone = process.env.WHATSAPP_DEFAULT_PHONE ?? '';
  const produto: ProdutoLoja = {
    ...p,
    uuid: `static-${p.id}`,
    imagens: [p.imagem],
    precoNumerico,
    whatsappPhone,
    whatsappMessageTemplate: DEFAULT_WHATSAPP_MESSAGE,
    shopUrl: '#',
  };
  produto.shopUrl = buildWhatsappUrl(produto);
  return produto;
}

export const PRODUTOS_LOJA: ProdutoLoja[] = PRODUTOS_BASE.map(enrichProduto);

export function filtrarProdutos(produtos: ProdutoLoja[], filtro: CategoriaFiltro) {
  if (filtro === 'Todos') return produtos;
  if (filtro === 'Edição Limitada') {
    return produtos.filter((p) => p.badge === 'EDIÇÃO LIMITADA');
  }
  return produtos.filter((p) => p.categoria === filtro);
}
