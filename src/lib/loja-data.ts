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
 * Imagens dos produtos: public/images/loja/produtos/
 * No CMS, cada produto terá o campo imagem próprio.
 */
const IMG = {
  regataSapatao: '/images/loja/produtos/regata-sapatao-arco-iris.png',
  regataVagitariana: '/images/loja/produtos/regata-vagitariana.png',
  moletomSapata: '/images/loja/produtos/moletom-sapata.png',
  moletomSapataLifestyle: '/images/loja/produtos/moletom-sapata-lifestyle.png',
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
  id: number;
  nome: string;
  categoria: 'Camisetas' | 'Moletons' | 'Acessórios';
  preco: string;
  badge: 'NOVO' | 'EDIÇÃO LIMITADA' | 'MAIS VENDIDO' | null;
  desc: string;
  descricaoCompleta: string;
  imagem: string;
  cores: { nome: string; hex: string }[];
  tamanhos: string[];
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

export const PRODUTOS_LOJA: ProdutoLoja[] = [
  {
    id: 1,
    nome: 'Regata Sapatão Arco-íris',
    categoria: 'Camisetas',
    preco: 'R$ 79,90',
    badge: 'MAIS VENDIDO',
    desc: 'Estampa tipográfica em cores do arco-íris, unissex',
    descricaoCompleta:
      'Regata roxa com a palavra "sapatão" repetida em sete cores vibrantes. Modelagem unissex, 100% algodão, ideal para o calor com muito orgulho.',
    cores: [
      { nome: 'Roxo', hex: '#3a184f' },
      { nome: 'Vinho', hex: '#93296F' },
    ],
    tamanhos: ['P', 'M', 'G', 'GG'],
    shopUrl: 'https://amooora.myshopify.com',
    imagem: IMG.regataSapatao,
  },
  {
    id: 2,
    nome: 'Regata Vagitariana',
    categoria: 'Camisetas',
    preco: 'R$ 74,90',
    badge: 'NOVO',
    desc: 'Tipografia serifada em branco, roxo vibrante',
    descricaoCompleta:
      'Regata em tom roxo profundo com estampa "vagitariana" em letras brancas e detalhes em rosa. Tecido leve e confortável para o dia a dia.',
    cores: [
      { nome: 'Roxo', hex: '#3a184f' },
      { nome: 'Vinho', hex: '#93296F' },
    ],
    tamanhos: ['P', 'M', 'G', 'GG'],
    shopUrl: 'https://amooora.myshopify.com',
    imagem: IMG.regataVagitariana,
  },
  {
    id: 3,
    nome: 'Moletom Sapatã',
    categoria: 'Moletons',
    preco: 'R$ 189,90',
    badge: 'NOVO',
    desc: 'Capuz, bolso canguru, estampa "sapatã" no peito',
    descricaoCompleta:
      'Moletom em tom vinho/roxo com estampa "sapatã" em branco e ícone rosa no peito. Soft fleece, capuz com cordão e bolso frontal.',
    cores: [
      { nome: 'Vinho', hex: '#93296F' },
      { nome: 'Roxo', hex: '#3a184f' },
    ],
    tamanhos: ['P', 'M', 'G', 'GG'],
    shopUrl: 'https://amooora.myshopify.com',
    imagem: IMG.moletomSapata,
  },
  {
    id: 4,
    nome: 'Moletom Sapatã — Lifestyle',
    categoria: 'Moletons',
    preco: 'R$ 189,90',
    badge: null,
    desc: 'Mesma estampa icônica, foto lifestyle',
    descricaoCompleta:
      'O moletom Sapatã que você já ama, agora em versão lifestyle. Conforto, representatividade e estilo para qualquer ocasião.',
    cores: [
      { nome: 'Vinho', hex: '#93296F' },
      { nome: 'Roxo', hex: '#3a184f' },
    ],
    tamanhos: ['P', 'M', 'G', 'GG'],
    shopUrl: 'https://amooora.myshopify.com',
    imagem: IMG.moletomSapataLifestyle,
  },
];

export function filtrarProdutos(filtro: CategoriaFiltro) {
  if (filtro === 'Todos') return PRODUTOS_LOJA;
  if (filtro === 'Edição Limitada') {
    return PRODUTOS_LOJA.filter((p) => p.badge === 'EDIÇÃO LIMITADA');
  }
  return PRODUTOS_LOJA.filter((p) => p.categoria === filtro);
}
