# Guia de Estilos - Amooora

Este guia consolida os padroes visuais atuais do site para manter consistencia entre secoes e futuras evolucoes.

## 1) Cores (tokens oficiais)

- Primaria: `#93296F`
- Terciaria (apoio escuro): `#3a184f`
- Fundo claro principal: `#ffffff`
- Fundo suave: `#faf7fb`
- Texto principal: `#1a1a1a`
- Texto secundario: `#717182`

### Regras de uso

- Elementos de destaque (CTA, links de destaque, titulos com enfase, bordas de destaque): usar a cor primaria.
- Rodape: usar sempre a cor primaria.
- Textos longos: preferir texto secundario para conforto de leitura.
- Evitar criar novos tons sem necessidade; usar opacidade do token primario quando precisar de variacao (ex.: `#93296F22`, `#93296F44`).

## 2) Tipografia

- Fonte serifada de marca/titulos: `Playfair Display`
- Fonte sans para interface e corpo: `Rubik` (regular)

### Hierarquia recomendada

- Hero (titulo): 44-70px (responsivo)
- Titulos de secao: 28-56px
- Subtitulos/eyebrow: 11-12px com tracking maior e uppercase
- Corpo: 14-20px, peso leve/regular, `line-height` entre 1.7 e 1.8

## 3) Espacamento

Padrao observado no site:

- Espacamento vertical de secoes (desktop): `120px`
- Espacamento vertical de secoes (mobile): `80px`
- Padding horizontal de container (desktop): `48px`
- Padding horizontal de container (mobile): `20px`
- Gap comum de cards/blocos: `12px`, `16px`, `24px`, `40px`

## 4) Layout e responsividade

- Desktop: grades em 2 ou 4 colunas conforme secao.
- Mobile: reduzir para 1 coluna (ou 2 na galeria).
- Navegacao mobile: menu colapsado (hamburguer), sem CTA duplicado no topo.
- Priorizar legibilidade: ocultar elementos decorativos que conflitam com texto no mobile.

## 5) Componentes (padroes)

- Botao primario:
  - Fundo primario
  - Texto branco
  - Borda arredondada alta (pill)
  - Hover com leve elevacao/sombra
- Accordion:
  - Separadores finos com opacidade da primaria
  - Estado aberto com destaque de cor no titulo
- Cards de galeria:
  - Radius 16px
  - Intercalacao entre imagem e quote

## 6) Checklist rapido de consistencia

Checklist para voce revisar antes de publicar alteracoes no site (nao e avaliacao automatica):

Antes de publicar:

- Cor primaria aplicada em CTAs e rodape?
- Tipografia segue Playfair Display (titulos) e Rubik (interface/corpo)?
- Espacamentos de secao em 120/80?
- Mobile sem sobreposicao de elementos decorativos?
- Contraste e legibilidade aprovados nos textos longos?

