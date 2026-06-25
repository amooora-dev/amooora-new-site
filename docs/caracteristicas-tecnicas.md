# Características Técnicas — Amooora Site

Última atualização: 25 de junho de 2026

## Visão Geral

O projeto `amooora-site` é um site institucional e loja em Next.js, com área administrativa simples para gestão de produtos da loja. A aplicação usa renderização híbrida do Next.js, dados dinâmicos via Supabase quando configurado e fallback estático para a loja quando o banco não está disponível.

## Repositório

- Repositório Git remoto: `https://github.com/julyveiga/amooora-site-teste.git`
- Remote principal: `origin`
- Branch local atual: `main`
- Caminho local do projeto: `/Users/juveiga/Cursor-sites/amooora-site`

## Stack Principal

- Framework: `Next.js 14.2.35`
- UI/runtime: `React 18.3.1` e `React DOM 18.3.1`
- Linguagem: `TypeScript 5.7.3`
- Estilização: `Tailwind CSS 3.4.17`
- CSS pipeline: `PostCSS 8.4.49` com `Autoprefixer 10.4.20`
- Backend as a Service: `Supabase`, via `@supabase/supabase-js 2.108.1`

## Plugins e Configurações de Build

### Tailwind

Arquivo: `tailwind.config.ts`

- Usa tokens CSS globais para cores:
  - `primary`
  - `secondary`
  - `accent`
  - `tertiary`
  - `muted`
  - `ink`
- Usa fontes via variáveis CSS:
  - `--font-playfair`
  - `--font-rubik`
- Animações customizadas:
  - `fadeUp`
  - `fadeIn`
  - `floatY`
  - `marquee`
  - `pulse-ring`
- Plugins Tailwind adicionais: nenhum (`plugins: []`)

### PostCSS

Arquivo: `postcss.config.mjs`

- `tailwindcss`
- `autoprefixer`

### Next.js

Arquivo: `next.config.mjs`

- Framework: Next.js
- `images.unoptimized: true`
- `distDir` configurável por ambiente:
  - padrão de produção/build: `.next`
  - dev pode usar `NEXT_DIST_DIR`, atualmente utilizado pelo script de desenvolvimento para separar cache

## Scripts NPM

Arquivo: `package.json`

- `npm run dev`: inicia o ambiente de desenvolvimento com `scripts/dev.mjs`
- `npm run dev:clean`: limpa o cache de desenvolvimento e inicia o dev server
- `npm run build`: executa `next build`
- `npm run start`: executa `next start`
- `npm run lint`: executa `next lint`

O script `scripts/dev.mjs` foi criado para manter apenas um processo Next.js na porta do projeto e evitar conflito de cache durante desenvolvimento.

## Deploy / Vercel

Arquivo: `vercel.json`

```json
{
  "framework": "nextjs"
}
```

O projeto está preparado para deploy na Vercel como aplicação Next.js.

Não há vínculo local `.vercel` versionado/encontrado no repositório, então o ID do projeto Vercel, time/owner e domínio final não aparecem no código. Esses dados devem ser confirmados no painel da Vercel.

Variáveis relacionadas à URL pública:

- `NEXT_PUBLIC_SITE_URL`
- `VERCEL_PROJECT_PRODUCTION_URL`
- `VERCEL_URL`

O helper `src/lib/site-url.ts` usa `NEXT_PUBLIC_SITE_URL` quando válido e faz fallback para variáveis automáticas da Vercel.

## Supabase

O projeto usa Supabase para a loja dinâmica e para o CMS/admin de produtos.

### Biblioteca

- Pacote: `@supabase/supabase-js`
- Clientes definidos em: `src/lib/supabase/client.ts`

### Variáveis de ambiente

Arquivo de referência: `.env.example`

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_SCHEMA`
- `SUPABASE_STORAGE_BUCKET`

O valor real do projeto Supabase não está documentado no repositório por segurança. Ele deve estar configurado no ambiente local e/ou nas variáveis da Vercel.

### Schema e Storage

Arquivo: `src/lib/supabase/config.ts`

- Schema PostgreSQL padrão: `ecommerce-amooora`
- Bucket Storage padrão: `ecommerce-amooora-produtos`

O schema não usa `public`; ele é dedicado à loja da Amooora.

### Estrutura de banco

Migração principal: `supabase/migrations/001_loja_cms.sql`

Principais estruturas:

- Schema: `ecommerce-amooora`
- Enums:
  - `product_category`
  - `product_badge`
- Tabelas:
  - `products`
  - `product_images`
  - `product_colors`
  - `whatsapp_ctas`
  - `admin_users`
- View:
  - `store_products`
- RLS habilitado nas tabelas principais
- Grants para `anon`, `authenticated` e `service_role`

### Fallback estático

Arquivo: `src/lib/supabase/products.ts`

Se o Supabase não estiver configurado ou retornar erro, a loja usa dados estáticos de `src/lib/loja-data.ts`.

## Autenticação Admin

A área admin usa autenticação MVP própria, baseada em variáveis de ambiente e cookie assinado.

Arquivos principais:

- `src/app/admin/login/page.tsx`
- `src/app/admin/login/actions.ts`
- `src/lib/admin/auth.ts`
- `src/lib/admin/session.ts`
- `src/middleware.ts`

Variáveis:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

Cookie de sessão:

- Nome: `amooora_admin_session`
- Duração: 7 dias
- Assinatura: HMAC SHA-256 via Web Crypto
- Proteção de rotas: middleware em `/admin/:path*`

## Rotas Principais

Rotas públicas:

- `/`
- `/loja`
- `/loja/[slug]`
- `/politica-de-cookies`

Rotas admin:

- `/admin`
- `/admin/login`
- `/admin/dashboard`
- `/admin/produtos`
- `/admin/produtos/novo`
- `/admin/produtos/[id]`
- `/admin/produtos/ordenar`

## Funcionalidades

### Site institucional

- Home com seções institucionais
- Navegação responsiva
- Menu mobile
- Banner de consentimento de cookies
- Página de política de cookies/privacidade
- Conteúdo configurado em `src/lib/conteudo-home.ts`

### Loja

- Listagem de produtos
- Página de detalhe por slug
- Galeria de imagens
- Filtros por categoria
- Seleção de cor e tamanho
- CTA de compra via WhatsApp
- Dados via Supabase com fallback estático

### CMS/Admin

- Login administrativo simples
- Dashboard
- CRUD de produtos
- Upload/ordenação de imagens via Supabase Storage
- Ordenação de produtos
- Gestão de cores, tamanhos, badges, preço, descrição e CTA WhatsApp

## Variáveis de Ambiente Esperadas

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_DB_SCHEMA=ecommerce-amooora
SUPABASE_STORAGE_BUCKET=ecommerce-amooora-produtos
SUPABASE_SERVICE_ROLE_KEY=

ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=

WHATSAPP_DEFAULT_PHONE=
NEXT_PUBLIC_SITE_URL=
```

## Observações Técnicas

- O projeto não usa bibliotecas pesadas de UI externas.
- O Tailwind está configurado sem plugins adicionais.
- O Next Image está com otimização desativada (`images.unoptimized: true`).
- O app usa aliases TypeScript com `@/*` apontando para `src/*`.
- O desenvolvimento usa cache separado (`.next-dev`) para evitar conflito entre `next dev` e `next build`.
- Dados sensíveis não devem ser versionados; usar variáveis da Vercel/local.

