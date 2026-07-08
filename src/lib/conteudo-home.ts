/**
 * CONTEÚDO DA HOME — Amooora
 * Edite os textos deste arquivo para atualizar a página inicial.
 * Imagens: arquivos em public/images/ — caminhos começam com /images/
 */

export const CONTEUDO_HOME = {
  site: {
    title: 'Amooora — Um mundo inteiro de acolhimento e liberdade'
  },

  nav: {
    // label = texto no menu | id = âncora da seção (sem #, sem espaços)
    links: [
      { label: 'Manifesto', id: 'manifesto' },
      { label: 'Aplicativo', id: 'aplicativo' },
      { label: 'Nossos Valores', id: 'valores' },
      { label: 'Loja Amooora', id: 'loja' },
      { label: 'FAQ', id: 'faq' }
    ],
    ctaDownload: 'Conhecer App'
  },

  hero: {
    // Imagem de fundo do banner (desktop). Arquivo em public/images/
    background: '/images/0_header_grande2.png',
    // Opcional: imagem específica para mobile. Se omitido, usa `background` com recorte responsivo.
    // backgroundMobile: '/images/0_header_mobile.png',
    eyebrow: 'Por nós e para nós',
    titleLine1: 'Um mundo inteiro',
    titleHighlight: 'de acolhimento',
    titleLine3: 'e liberdade',
    description:
      'Somos a plataforma referência para a comunidade sáfica. Chegamos para somar, criar e espalhar conteúdo, informação e serviços com a nossa cara — feitos por nós, para nós, do jeitinho que a nossa comunidade merece.',
    ctaPrimary: 'Conhecer o App',
    ctaSecondary: 'Nosso Manifesto',
    badges: ['10k+ usuárias', 'Comunidade ativa', '100% seguro']
  },

  manifesto: {
    label: 'Manifesto',
    image: '/images/manifesto.png',
    paragraphs: [
      { big: true, text: 'Nós somos Amooora' },
      {
        big: false,
        text:
          'Nascemos da urgência e do desejo de construir um mundo onde a comunidade sáfica — mulheres lésbicas, bissexuais, pansexuais, pessoas trans e não binárias que se relacionam com outras identidades femininas — possa se sentir livre, segura e pertencente.'
      },
      {
        big: false,
        text:
          'Somos uma plataforma feita por nós, para nós — um espaço onde existências plurais não apenas cabem, mas são celebradas, validadas e conectadas.'
      },
      {
        big: false,
        text:
          'A Amooora é mais do que uma plataforma online! É a resposta a um vazio histórico de visibilidade, cuidado e recursos voltados para a comunidade sáfica.'
      },
      {
        big: false,
        text:
          'É onde você pode ser quem é — sem medo, sem julgamentos, com acolhimento. \nÉ onde a gente se encontra para existir com coragem, afeto e em todo o nosso potencial.'
      }
    ]
    // Use \n para quebrar linha em qualquer parágrafo do manifesto (ex.: 'texto linha 1\nlinha 2')
  },

  app: {
    label: 'O Aplicativo Sáfico',
    title: 'Amoooora - Mi brejo, su brejo',
    intro: [
      'A gente quer se encontrar, trocar e se reconhecer. Criamos um espaço seguro, afetuoso e com a nossa cara para reunir toda a comunidade sáfica. Mais do que visibilidade, a gente quer construir conexões. Trocas reais. Entretenimento, informação útil, apoio psicológico, saúde íntima, orientação jurídica, e muito mais.',
      'As conexões aqui vão além do virtual! O virtual é a porta de entrada, mas incentivamos as conexões no mundo real. Ou seja, o olho no olho, o toque na pele e a conversa ao pé de uma mesa sem hora para acabar!',
      'Porque existem muitos brejos, e sempre vai ter um com a sua cara. \nA Amooora oferece:'
    ],
    pilot: {
      text: 'Gostaria de se cadastrar para fazer parte do grupo piloto para uso da Amooora?',
      cta: 'Quero me cadastrar!',
      placeholder: 'Seu melhor email',
      submit: 'Enviar',
      success: 'Recebemos seu interesse! Em breve entraremos em contato.',
    },
    items: [
      {
        label: 'Locais Seguros',
        blocks: [
          {
            q: 'Tem um estabelecimento que é a nossa cara?',
            a:
              'É um barzinho, um restaurante, uma loja de bicicleta ou qualquer estabelecimento simpatizante à nossa causa? Corre aqui e faça um perfil do seu espaço! Queremos promover estabelecimentos onde a comunidade sáfica se sinta segura e acolhida para ser quem é e amar quem quiser.'
          },
          {
            q: 'Quer encontrar locais seguros e acolhedores?',
            a:
              'Procurando locais onde se sinta bem-vinda e acolhida e ainda de quebra se divertir? Aqui você encontra estabelecimentos inclusivos e avaliados pela nossa comunidade.'
          }
        ]
      },
      {
        label: 'Serviços',
        blocks: [
          {
            q: 'Prestadora de serviço?',
            a:
              'É uma lésbica que oferece serviços de pequenos reparos residenciais? É uma pessoa não binária que oferece serviços gráficos? Se é alguém da nossa comunidade que quer ofertar serviços profissionais, conte conosco. Somos uma por todas e todas por uma!'
          },
          {
            q: 'Quer contratar sáficas capacitadas?',
            a:
              'Procurando ginecologista, psicóloga ou uma sáfica descolada para pregar um quadro na sua parede? Acesse o catálogo de serviços oferecidos pela nossa comunidade. Juntas vamos fomentar a economia sáfica.'
          }
        ]
      },
      {
        label: 'Eventos',
        blocks: [
          {
            q: 'O que tem para hoje?',
            a:
              'Encontre os rolês mais legais perto de você com a agenda da Amooora: festas, shows, palestras, workshops, encontros esportivos e muito mais. Se é bom e é para gente, tá aqui.'
          },
          {
            q: 'Quer divulgar um evento?',
            a:
              'Tem um evento do seu projeto ou empresa? Cadastre aqui e espalhe para a comunidade! Um espaço feito para promover o que importa para o nosso público, do jeitinho que a gente gosta.'
          }
        ]
      },
      {
        label: 'Comunidades',
        blocks: [
          {
            q: 'Grupos para todo tipo de sáfica',
            a:
              'Aqui a gente fala de tudo: do crush ao drama da mãe do pet gourmet comedor de cocô. Sempre tem um cantinho com a sua cara! Tem amor sáfico, astrologia, cuidados com a saúde, literatura queer, jogos e até o clássico "não sei o que tô fazendo, mas tamo junta". Faça parte dos nossos grupos!'
          }
        ]
      },
      {
        label: 'E muito mais',
        blocks: [
          {
            q: 'Conexões',
            a:
              'Pode ser um crush, uma amizade de rolê, uma parceria de projeto ou tudo isso junto. No nosso mapa, você encontra gente que vibra como você, para dar match nas ideias, nas conversas, nos sonhos (e quem sabe nos beijos também).'
          },
          {
            q: 'Saúde Íntima',
            a:
              'Falamos sem rodeios sobre saúde íntima — uma pauta muitas vezes negligenciada, mas que merece atenção, acolhimento e troca segura. Porque saúde íntima é direito, não tabu.'
          }
        ]
      }
    ]
  },

  values: {
    label: 'Nossos Valores',
    image: '/images/valores.png',
    titleLine1: 'No que acreditamos',
 
    items: [
      {
        title: 'Segurança essencial',
        desc:
          'Cada decisão parte do compromisso com a segurança. Um espaço protegido para navegar, se expressar e se relacionar com tranquilidade e confiança.'
      },
      {
        title: 'Representatividade',
        desc:
          'Nossos conteúdos refletem as vozes e histórias da comunidade sáfica. Valorizamos a pluralidade e rejeitamos qualquer forma de apagamento.'
      },
      {
        title: 'Liberdade de ser e amar',
        desc:
          'O amor sáfico é legítimo, belo e político. Defendemos o direito de viver identidade e afetos de forma plena, sem medo ou censura.'
      },
      {
        title: 'Conexões com propósito',
        desc:
          'Facilitamos encontros reais e significativos — pessoais, profissionais ou coletivos — baseados no respeito e cuidado mútuo.'
      },
      {
        title: 'Saúde íntima',
        desc:
          'Falamos sobre saúde íntima como autocuidado e empoderamento, com informações e serviços que respeitam corpos e desejos sáficos.'
      },
      {
        title: 'Economia do cuidado',
        desc:
          'Incentivamos saberes, serviços e talentos dentro da comunidade — apoio jurídico, de saúde, psicológico e criativo com confiança.'
      },
      {
        title: 'Construção coletiva',
        desc:
          'Valorizamos escuta ativa, participação e autonomia como formas de construir colaborativamente o futuro que queremos viver.'
      },
      {
        title: 'Talento em movimento',
        desc:
          'Damos visibilidade a talentos e conectamos pessoas a oportunidades reais. Acreditamos no trabalho como ferramenta de autonomia, crescimento e transformação.'
      }
    ]
  },

  gallery: {
    label: 'Loja Amooora',
    title: 'Vista sua identidade sáfica',
    cta: 'Acesse Nossa Loja',
    ctaUrl: '/loja',
    // Fotos do mosaico — troque os arquivos em public/images/loja/ mantendo os mesmos nomes
    photos: [
      '/images/loja/loja-1.png',
      '/images/loja/loja-2.png',
      '/images/loja/loja-3.png',
      '/images/loja/loja-4.png'
    ]
  },

  faq: {
    label: 'FAQ',
    title: 'Perguntas frequentes',
    items: [
      {
        q: 'A Amooora é uma rede social?',
        a:
          'Não exatamente. A Amooora é uma plataforma comunitária feita por e para a comunidade sáfica. Aqui, você encontra conexões, serviços, informações e acolhimento — tudo pensado para fortalecer a nossa existência coletiva.'
      },
      {
        q: 'Qual é o público da Amooora?',
        a:
          'A Amooora é prioritariamente voltada para a comunidade sáfica — mulheres lésbicas, bissexuais, pansexuais, pessoas trans e não binárias que se relacionam com outras identidades femininas. Se você se reconhece nesse espaço, ele também é seu.'
      },
      {
        q: 'Homens cis são bem-vindos na plataforma?',
        a:
          'A Amooora é um espaço seguro e afetivo construído especificamente para pessoas sáficas. Homens cis não fazem parte do público-alvo da plataforma e não podem se cadastrar.'
      },
      {
        q: 'Mulheres héteros são bem-vindas?',
        a:
          'Em um primeiro momento, a Amooora é voltada apenas para a comunidade sáfica. Mas em breve abriremos nosso portal de serviços para que mulheres héteros possam acessar nosso catálogo.'
      },
      {
        q: 'A Amooora é um app de namoro?',
        a:
          'Você quer namorar alguém? A Amooora possibilita matches, mas a proposta vai além. Sugerimos lugares seguros para encontros, conteúdos educativos e espaços de escuta e pertencimento.'
      },
      {
        q: 'É seguro usar a Amooora?',
        a:
          'Sim. Segurança é um valor inegociável para nós. Cuidamos da proteção de dados, investimos em moderação e criamos ambientes pensados para minimizar riscos e violências digitais.'
      },
      {
        q: 'Preciso pagar para usar a plataforma?',
        a:
          'Não. É só chegar! Mas teremos alguns serviços que só poderão ser acessados mediante assinatura.'
      },
      {
        q: 'Posso divulgar meus serviços na plataforma?',
        a:
          'Sim! A Amooora conta com um espaço onde é possível divulgar seus trabalhos, avaliar experiências e contratar com segurança dentro da comunidade.'
      }
    ]
  },

  newsletter: {
    title: 'Cadastre o seu email para saber as novidades em primeira mão!',
    placeholder: 'Seu melhor email',
    button: 'Inscrever-se'
  },

  footer: {
    description: 'Um mundo inteiro de acolhimento e liberdade para a comunidade sáfica.',
    instagram: '@n.amooora',
    instagramUrl: 'https://instagram.com/n.amooora',
    email: 'amooora@amooora.com.br',
    navLabel: 'Menu',
    navLinks: [
      { label: 'Manifesto', id: 'manifesto' },
      { label: 'Aplicativo', id: 'aplicativo' },
      { label: 'Nossos Valores', id: 'valores' },
      { label: 'Loja Amooora', id: 'loja' },
      { label: 'Quem Somos', id: '' },
      { label: 'FAQ', id: 'faq' }
    ],
    appLabel: 'App',
    appLinks: ['Política de Privacidade'],
    copyright: '© 2026 Amooora. Todos os direitos reservados.',
    signature: 'feito com amor ✦'
  }
} as const;

export type ConteudoHome = typeof CONTEUDO_HOME;
