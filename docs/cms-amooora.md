# CMS Loja Amooora — Especificação adaptada ao projeto

> Versão ajustada a partir do prompt original, alinhada ao código atual do site e usando **Supabase** (sem Prisma).

---

## Stack confirmada no projeto

| Item | Valor real no repo |
|---|---|
| Framework | Next.js 14 App Router (`src/app/`) |
| Estilização | Tailwind CSS + tokens em `src/app/globals.css` |
| Fontes | `--font-playfair` (Playfair Display) + `--font-dm-sans` (DM Sans) |
| Cor primária | `#93296F` (`--primary`) |
| Loja | `src/app/loja/page.tsx` + `src/components/loja/*` |
| Dados atuais | `src/lib/loja-data.ts` (estático, fallback até o CMS estar ativo) |

---

## Conflitos identificados e como foram resolvidos

### 1. Prisma → Supabase nativo

**Prompt original:** Prisma + PostgreSQL via Supabase.  
**Ajuste:** Schema SQL em `supabase/migrations/`, cliente `@supabase/supabase-js` + `@supabase/ssr`. Upload via **Supabase Storage** (bucket `produtos`).

### 2. Categoria "Edição Limitada"

**Prompt original:** `EDICAO_LIMITADA` como categoria no enum.  
**Site atual:** só existem 3 categorias reais — `Camisetas`, `Moletons`, `Acessórios`. O filtro **"Edição Limitada"** na UI filtra pelo **badge**, não pela categoria (ex.: Capacete Uvex = Acessórios + badge `EDIÇÃO LIMITADA`).

**Ajuste:** enum `product_category` com apenas `camisetas | moletons | acessorios`. Badge separado.

### 3. Descrição única vs duas descrições

**Prompt original:** um campo `description`.  
**Site atual:** `desc` (card) + `descricaoCompleta` (modal).

**Ajuste:** `description_short` + `description_full` no banco.

### 4. Tamanhos (sizes)

**Prompt original:** não prevê tamanhos.  
**Site atual:** seletor P / M / G / GG (ou `Único`) no modal.

**Ajuste:** coluna `sizes text[]` em `products`.

### 5. Preço

**Prompt original:** `Float`.  
**Site atual:** string formatada `"R$ 84,90"`.

**Ajuste:** `numeric(10,2)` no Postgres; formatação BRL só no frontend (`formatPrecoBRL()`).

### 6. Shopify vs WhatsApp

**Prompt original:** CTA WhatsApp.  
**Site atual:** `shopUrl` Shopify + botão carrinho + link externo.

**Ajuste:** remover `shopUrl`; botão **"Comprar via WhatsApp"** usando `whatsapp_ctas` + fallback `WHATSAPP_DEFAULT_PHONE`. Variáveis: `{produto}`, `{preco}`, `{cor}`, `{tamanho}`, `{link}`.

### 7. Autenticação

**Prompt original:** NextAuth v5 + Credentials.  
**Ajuste:** **Supabase Auth** para admin + tabela `admin_users` (allowlist). Middleware protege `/admin/*`. Menos dependências e integração natural com RLS/Storage.

MVP alternativo (sem Supabase Auth configurado): login server-side com `ADMIN_EMAIL` + `ADMIN_PASSWORD` no `.env` — migrar para Supabase Auth depois.

### 8. IDs

**Prompt original:** `cuid()`.  
**Ajuste:** `uuid` com `gen_random_uuid()` (padrão Supabase).

### 9. Múltiplas imagens

**Site atual:** uma imagem por produto; modal simula galeria com 4 slides fixos.  
**Ajuste:** tabela `product_images`; modal passa a usar fotos reais ordenadas por `sort_order`.

### 10. Conteúdo do hero da loja

**Fora do escopo v1 do CMS de produtos.** Continua em `src/lib/loja-data.ts` → `CONTEUDO_LOJA.hero`. Pode virar tabela `loja_settings` numa fase 2.

### 11. Fallback sem Supabase

Se `NEXT_PUBLIC_SUPABASE_URL` não estiver definido, a loja continua usando `PRODUTOS_LOJA` estático — build e preview não quebram.

---

## Schema dedicado: `ecommerce-amooora`

O BD Supabase é **compartilhado** com outros apps. Toda a loja/CMS usa o schema **`ecommerce-amooora`**, nunca `public`.

| Camada | Namespace |
|---|---|
| Tabelas, enums, views, RLS | `"ecommerce-amooora"` |
| Storage (upload de fotos) | bucket `ecommerce-amooora-produtos` |
| Auth admin | `auth.users` + `"ecommerce-amooora".admin_users` |

### Configuração obrigatória no Supabase Dashboard

1. **Table Editor** → schema `ecommerce-amooora` (já criado por você)
2. **Settings → API → Exposed schemas** → adicionar `ecommerce-amooora`
3. Rodar `supabase/migrations/001_loja_cms.sql` no SQL Editor (com schema selecionado ou script completo)
4. Rodar `supabase/seed.sql` para popular os 8 produtos

### Variável de ambiente

```env
SUPABASE_DB_SCHEMA=ecommerce-amooora
```

O cliente JS usa `db: { schema: 'ecommerce-amooora' }` — ver `src/lib/supabase/config.ts`.

---

## Schema Supabase

Arquivos:

- `supabase/migrations/001_loja_cms.sql` — tabelas no schema `ecommerce-amooora`, RLS, Storage
- `supabase/seed.sql` — 8 produtos atuais

---

## Rotas do CMS (inalteradas)

```
/admin/login
/admin/dashboard
/admin/produtos
/admin/produtos/novo
/admin/produtos/[id]
/admin/produtos/[id]/fotos
```

---

## API / dados

Preferir **Server Actions** + Supabase server client para o admin.  
Rotas públicas opcionais (compatíveis com o prompt):

```
GET  /api/products          → produtos ativos (loja)
GET  /api/products/[id]     → detalhe
POST /api/admin/products    → criar (auth)
PUT  /api/admin/products/[id]
DELETE /api/admin/products/[id]
```

---

## Variáveis de ambiente

Ver `.env.example` na raiz do projeto.

---

## Ordem de implementação

1. ✅ Schema SQL + seed (`supabase/`)
2. Tipos TS + client Supabase (`src/lib/supabase/`)
3. Auth admin + middleware
4. CRUD produtos (admin)
5. Upload Storage (fotos)
6. Cores + WhatsApp CTA no admin
7. Loja consumindo Supabase com fallback estático
8. Substituir carrinho/Shopify por WhatsApp no modal e cards

---

## Mapeamento banco → frontend (`ProdutoLoja`)

| Banco | Frontend |
|---|---|
| `name` | `nome` |
| `description_short` | `desc` |
| `description_full` | `descricaoCompleta` |
| `price` | `preco` (formatado) |
| `category` | `categoria` (label PT) |
| `badge` | `badge` (label PT com acento) |
| imagem `is_primary` | `imagem` |
| `product_images[]` | galeria do modal |
| `product_colors[]` | `cores` |
| `sizes[]` | `tamanhos` |
| `whatsapp_ctas` | link wa.me gerado |
