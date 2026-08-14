# Estilos do site — Tailwind + CSS de suporte

Última atualização: 7 de agosto de 2026

Este documento descreve **como o visual do site Amooora é estilizado** após a organização do código. Serve para quem for administrar, manter ou evoluir o front-end sem misturar padrões antigos (inline style em excesso).

---

## 1. Regra de ouro

Usamos **três camadas**, nesta ordem de preferência:

| Prioridade | Onde | Quando usar |
|---|---|---|
| **1. Tailwind** | `className="..."` nos componentes | Layout, spacing, tipografia, cores de marca, hover, responsivo |
| **2. Stylesheet de suporte** | `src/app/globals.css` + tokens no `tailwind.config.ts` | Tokens reutilizáveis, shells de seção, fundos complexos do hero |
| **3. Inline `style={{}}`** | Só quando necessário | Valor **100% dinâmico** (URL de imagem, cor do produto, parallax JS, delay de animação por índice) |

**Não fazer:**
- Voltar a colocar `padding`, `maxWidth`, `flexDirection`, `color` fixos em `style={{}}`
- Mutar estilo no hover via JavaScript (`e.currentTarget.style...`)
- Criar CSS Modules soltos por componente sem necessidade (duplica o sistema)

---

## 2. Onde ficam as coisas

```
src/
├── app/
│   └── globals.css          ← tokens CSS + classes utilitárias de seção/hero
├── components/
│   ├── ui/                  ← peças reutilizáveis (botão, label, shell, input)
│   │   ├── SectionShell.tsx
│   │   ├── SectionLabel.tsx
│   │   ├── PrimaryButton.tsx
│   │   ├── AccordionToggle.tsx
│   │   ├── EmailInput.tsx
│   │   └── TextWithBreaks.tsx
│   ├── home/                ← seções da home (1 arquivo por seção)
│   ├── layout/              ← SiteNav, SiteFooter, PrivacyModal, CookieConsent
│   ├── loja/                ← loja e detalhe de produto
│   └── icons/               ← ícones SVG compartilhados
└── lib/
    └── hooks/
        ├── useIsMobile.ts
        └── useInViewReveal.ts
tailwind.config.ts           ← mapeia tokens CSS → classes Tailwind
```

---

## 3. Tokens de cor (marca)

### Definição

Arquivo: `src/app/globals.css` → bloco `:root`

Cores base:
- `--primary` → `#932D6F`
- `--secondary` → `#3a184f`
- `--muted-fg`, `--ink`, `--off-white`, etc.

Opacidades da marca (substituem o antigo helper `pa()`):
- `--primary-2`, `--primary-4`, `--primary-8`, `--primary-10`
- `--primary-13`, `--primary-20`, `--primary-27`, `--primary-33`, `--primary-40`

Cada uma usa `color-mix` com a cor primária.

### Uso no código (Tailwind)

Mapeadas em `tailwind.config.ts` como:

| Classe | Uso típico |
|---|---|
| `bg-primary` / `text-primary` | Cor sólida da marca |
| `bg-primary-8` | Fundo suave (chip “Em breve”, toggle fechado) |
| `border-primary-13` | Bordas de accordion / FAQ |
| `bg-primary-2` / `bg-primary-4` | Cards e hover leve |
| `text-muted-fg` | Texto secundário |
| `bg-off-white` | Fundo de seções (app, galeria) |

Sombras da marca (também no `tailwind.config.ts`):
- `shadow-primary-cta` / `hover:shadow-primary-cta-hover` — botões principais
- `shadow-primary-nav` / `hover:shadow-primary-nav-hover` — CTA do header
- `shadow-primary-card` — cards mobile do accordion
- `shadow-primary-photo` — hover das fotos da galeria

**Para mudar a cor da marca:** altere `--primary` (e se precisar `--secondary`) em `globals.css`. As opacidades e sombras acompanham automaticamente.

---

## 4. Shell das seções (home)

Padrão visual das seções: largura máxima + padding horizontal + padding vertical.

### Classes CSS (`globals.css`)

| Classe | Função |
|---|---|
| `.section-shell` | `max-width: 1200px` + `px` responsivo |
| `.section-shell-narrow` | `max-width: 860px` (FAQ / newsletter) |
| `.section-pad` | `py` 80px mobile / 120px desktop |

### Componente

`src/components/ui/SectionShell.tsx`

Exemplo:

```tsx
<section id="faq" className="section-pad bg-white">
  <SectionShell narrow>
    {/* conteúdo */}
  </SectionShell>
</section>
```

**Ao criar uma nova seção na home:** use `section-pad` + `SectionShell` em vez de inventar paddings inline.

---

## 5. Componentes UI reutilizáveis

Use estes em vez de reinventar markup:

| Componente | Função |
|---|---|
| `SectionLabel` | Linha + texto em caixa alta (eyebrow de seção) |
| `PrimaryButton` | Botão arredondado primário com sombra |
| `EmailInput` | Input de e-mail padronizado |
| `AccordionToggle` | Botão `+` que gira ao abrir (FAQ / App) |
| `SectionShell` | Container horizontal da seção |
| `TextWithBreaks` | Texto com quebras de linha do conteúdo |

Ícones da loja: importar de `@/components/icons` (`WhatsAppIcon`, `ChevronLeftIcon`, etc.) — não copiar SVG dentro do componente.

---

## 6. Animações de entrada (reveal)

Hook: `src/lib/hooks/useInViewReveal.ts`

Padrão:

```tsx
const { ref, visible } = useInViewReveal<HTMLElement>();

<section ref={ref}>
  <div
    data-visible={visible}
    className="opacity-0 translate-y-6 transition-all duration-700 data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0"
  >
    ...
  </div>
</section>
```

- Estado controlado por `data-visible`
- Transição via **classes Tailwind** (não `style={{ opacity: visible ? 1 : 0 }}`)
- Delay por item da lista: CSS variable `--delay` no `style` (caso dinâmico aceito)

---

## 7. Responsividade

Hook: `src/lib/hooks/useIsMobile.ts` (breakpoint padrão **900px**)

Usado quando o layout muda de forma estrutural (ex.: home mobile do app vs desktop).

Para ajustes simples de spacing/tipografia, preferir classes Tailwind responsivas:

```tsx
className="px-5 py-20 md:px-12 md:py-[120px]"
```

Não misturar: se a seção já usa `md:`, não precisa de `isMobile` só para padding.

---

## 8. Quando o `style={{}}` ainda é correto

Manter inline **apenas** nestes casos:

| Caso | Exemplo |
|---|---|
| Imagem de fundo dinâmica | `style={{ backgroundImage: \`url(${src})\` }}` |
| Cor vinda do CMS/produto | `style={{ background: cor.hex }}` (ColorSwatches) |
| Valor calculado em JS | parallax: `transform: translateY(${offset}px)` |
| Delay de animação por índice | `style={{ '--delay': '0.15s' }}` |
| Altura dinâmica de prop | logo do header (`height` mobile/desktop) |
| Offset do hero da loja | `paddingTop: navOffset` / `alturaMaxPx` |

Se o valor for **fixo** (sempre 48px, sempre `max-w-[1200px]`), deve ser **classe Tailwind** ou token no CSS.

---

## 9. Hero da home (caso especial)

Arquivo: `src/components/home/HeroA.tsx`

- Fundo desktop: classe `.hero-bg-desktop` + `backgroundImage` inline (URL do conteúdo)
- Fundo mobile (split/clip-path): classes `.hero-bg-mobile-split`, `.hero-bg-mobile-left`, `.hero-bg-mobile-right` em `globals.css`

**Não** mover o `clip-path` complexo de volta para um bloco enorme de `style` no JSX. Ajuste fino do split → edite o CSS.

Conteúdo do hero (textos, imagem de fundo): `src/lib/conteudo-home.ts`.

---

## 10. Conteúdo vs estilo

| Tipo de alteração | Onde editar |
|---|---|
| Textos da home (títulos, FAQ, app…) | `src/lib/conteudo-home.ts` |
| Textos / estrutura da loja | `src/lib/loja-data.ts` + admin Supabase |
| Cor da marca | `src/app/globals.css` (`:root`) |
| Layout / espaçamento / tipografia | classes Tailwind no componente |
| Shell padrão de seção | `globals.css` (`.section-shell`, `.section-pad`) ou `SectionShell.tsx` |
| Política de cookies (modal) | `src/lib/politica-de-cookies.ts` |

---

## 11. Checklist para quem for alterar o site

Antes de abrir PR / deploy:

1. Novo layout usa **Tailwind** (ou classe do `globals.css`), não `style` de padding/cor fixa?
2. Cor da marca usa token (`text-primary`, `bg-primary-8`…), não hex solto?
3. Hover usa `hover:` / `group-hover:`, não `onMouseEnter` mutando DOM?
4. Seção nova da home usa `section-pad` + `SectionShell`?
5. Ícones reutilizados vêm de `@/components/icons`?
6. `style={{}}` só aparece se o valor for dinâmico (ver seção 8)?
7. `npm run build` passa sem erro?

---

## 12. Histórico desta organização (resumo)

Trabalho feito para deixar o código administrável:

- Remoção de código morto (`legacy/`, `backups/`, `ProdutoModal`, `tweaks-panel`, etc.)
- Extração de seções da home e componentes UI reutilizáveis
- Substituição do helper JS `pa()` por tokens CSS + classes Tailwind
- Migração de reveals/hovers de inline para `data-visible` + classes
- Documentação deste padrão neste arquivo

Meta prática: manter poucos `style={{}}` no projeto — só os dinâmicos — e o restante em Tailwind + stylesheet de suporte.

---

## 13. Comandos úteis

```bash
# desenvolvimento local
npm run dev
# → http://localhost:3000

# validar tipos + build de produção
npm run build
```

Em caso de dúvida sobre estilo: **prefira Tailwind; se for token de marca ou shell, use `globals.css`; se for valor dinâmico, aí sim inline.**
