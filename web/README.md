# Cardapio KOP - Kopenhagen Digital Menu

Cardapio digital para mesas de restaurante Kopenhagen. Clientes escaneiam o QR Code na mesa e acessam o cardapio completo pelo celular.

## Estado Atual

Verificado em **22/04/2026**:

- O cardapio publico e o admin usam o tema claro **Cafe Creme**.
- A home publica agora usa navegacao com **categorias fixas no topo** e **itens em sequencia abaixo**, com scroll ate a secao clicada.
- Falhas de acesso ao banco **nao** sao mais mascaradas como lista vazia; a UI publica mostra estado explicito de indisponibilidade.
- Login admin agora usa rate limiting por IP, validacao server-side e checks same-origin para mudancas de estado.
- O upload de imagens foi endurecido para validar o binario real, reencodar arquivos aceitos para `.webp` e limitar abuso operacional.
- O app agora envia headers de seguranca no runtime e o baseline de borda versionado inclui rate limiting no Nginx.
- O pipeline possui gate de seguranca com lint, testes, type-check, `npm audit --omit=dev` e secret scanning.
- `npm run lint`, `npm test`, `npx tsc --noEmit` e `npm run build` passam no estado atual do app.
- O ambiente operacional real nao e o ambiente local por padrao.
- O artefato em producao nao e tratado como checkout git editavel.
- O repositorio local e o artefato em producao podem ficar desalinhados; consulte o runbook privado antes de assumir ausencia de dados ou rotas.

Runbook operacional: [`docs/operations/cardapio-vps-runbook.md`](../docs/operations/cardapio-vps-runbook.md)

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS 4 |
| Backend | Next.js API Routes (Route Handlers) |
| ORM | Drizzle ORM |
| Banco | PostgreSQL 16 |
| Auth | JWT (jose) + bcryptjs |
| Upload | Filesystem local (`public/uploads/`) |
| Deploy | Systemd + Nginx na VPS |
| Security Gates | GitHub Actions + Gitleaks + Dependabot |

## Arquitetura

```
Cliente (QR Code)
    |
    v
Nginx (HTTPS / SSL Let's Encrypt)
    |
    v
Next.js Standalone (porta 3001 no VPS)
    |-- Pages SSR (/, /cafes, /chocolates, etc.)
    |-- API Routes (/api/products, /api/categories, /api/auth/*)
    |-- Upload (/api/upload -> /public/uploads/)
    |
    v
PostgreSQL 16 (localhost:5432, database: cardapio)
```

## Estrutura de Pastas

```
web/
  src/
    app/
      page.tsx              # Home - categorias no topo + itens em sequencia
      [category]/page.tsx   # Produtos por categoria
      login/page.tsx        # Login admin
      admin/page.tsx        # Dashboard admin (CRUD produtos)
      admin/products/new/   # Criar produto
      admin/products/[id]/  # Editar produto
      api/
        auth/login/         # POST - autenticacao JWT
        auth/logout/        # POST - limpa cookie
        auth/me/            # GET - usuario atual
        categories/         # GET - listar categorias
        products/           # GET/POST - listar/criar produtos
        products/[id]/      # GET/PUT/DELETE - CRUD produto
        upload/             # POST - upload de imagem
    components/             # Header, MenuContainer, CategoryNav, ProductCard, ProductForm, etc.
    contexts/AuthContext.tsx # Provider de autenticacao
    db/
      schema.ts             # Tabelas: users, categories, products
      index.ts              # Conexao PostgreSQL via Drizzle
    lib/
      auth.ts               # JWT sign/verify, bcrypt, cookies
      data.ts               # Queries: getCategories, getProducts, getAllProducts
    types/
      index.ts              # Interfaces: Product, Category
    middleware.ts           # SSR Admin protection
  public/
    assets/img/             # Imagens dos produtos (.webp)
    uploads/products/       # Uploads via admin
  scripts/
    seed-pg.ts              # Seed inicial do banco
    generate_qrcode.ts      # Gerador de QR Code
```

## Setup Local

### Pre-requisitos
- Node.js 20+
- Opcional: PostgreSQL 16 local, apenas se for trabalhar totalmente offline

## Production Access

Production hostnames, SSH details, and operational credentials are documented only in the private operations runbook.

See: `docs/operations/cardapio-vps-runbook.md`

### Instalacao

```bash
# Clonar e instalar
cd web
npm install
```

#### Opcao A: desenvolvimento 100% local

Use esta opcao por padrao para evitar depender de infraestrutura de producao durante o desenvolvimento.

```bash
# Configurar ambiente
cp .env.example .env.local
# Editar .env.local com suas credenciais locais

# Criar tabelas e popular banco local
npm run db:generate
npm run db:migrate
npm run db:seed

# Iniciar dev server
npm run dev
```

Acesse `http://localhost:3000`.

#### Opcao B: desenvolvimento apontando para infraestrutura privada

Quando for necessario validar contra o ambiente operacional real, siga apenas o runbook privado. Nao replique hostnames, portas, caminhos, credenciais ou comandos operacionais em documentacao compartilhada.

Runbook operacional: [`../docs/operations/cardapio-vps-runbook.md`](../docs/operations/cardapio-vps-runbook.md)

### Onde Procurar Primeiro

Se houver divergencia entre o ambiente local e o comportamento real do projeto, confira primeiro o runbook privado e valide o estado do ambiente operacional antes de assumir ausencia de dados, rotas ou configuracoes.

### Variaveis de Ambiente

| Variavel | Descricao | Exemplo |
|---|---|---|
| `DATABASE_URL` | Connection string PostgreSQL (usa pool max: 10) | `postgresql://cardapio:senha@localhost:5432/cardapio` |
| `JWT_SECRET` | Chave p/ assinar tokens (**min: 32 caracteres**) | `4206ae30778227a99...` |
| `APP_ORIGIN` | Origem canonica usada para cookies e validacoes server-side | `https://cardapiokop.example.com` |
| `ADMIN_EMAIL` | Email do admin (usado no seed) | `admin@kopenhagen.com` |
| `ADMIN_PASSWORD` | Senha do admin no seed (**min: 8 caracteres**) | `sua-senha-segura` |

Observacao importante: em producao, o usuario admin pode ja ter sofrido alteracoes manuais no banco. Se o login falhar mesmo com `ADMIN_EMAIL` e `ADMIN_PASSWORD` configurados, confirme o hash salvo em `users` antes de concluir que a API esta quebrada.

## Tema Visual

O layout atual usa a direcao **Cafe Creme**, aprovada em reuniao para clarear o cardapio sem perder a assinatura Kopenhagen.

Paleta-base:

- `#F4EADC` - fundo creme quente
- `#FFF8EE` - superficie clara
- `#8F1430` - vinho Kopenhagen
- `#C79D6B` - dourado/cafe
- `#321B13` - texto chocolate
- `#DFC7A9` - bordas suaves

Arquivos mais relevantes do tema:

- `src/app/globals.css`
- `src/components/Header.tsx`
- `src/components/MenuContainer.tsx`
- `src/components/CategoryNav.tsx`
- `src/components/ProductCard.tsx`
- `src/app/login/page.tsx`
- `src/app/admin/page.tsx`

## Fluxo Publico Atual

O comportamento atual do cardapio publico e:

1. O usuario abre `/`.
2. Encontra as categorias em uma barra fixa logo abaixo do header.
3. Ao tocar em uma categoria, a pagina faz scroll suave ate a secao correspondente.
4. Todos os produtos ficam em uma unica pagina, agrupados por categoria.
5. A rota `/<categoria>` continua existindo e mostra apenas os itens daquela categoria.

Arquivos principais desse fluxo:

- `src/app/page.tsx`
- `src/components/MenuContainer.tsx`
- `src/components/CategoryNav.tsx`
- `src/lib/data.ts`

## Seguranca e Robustez

Melhorias recentes aplicadas:

- Login admin protegido com **rate limiting**, token tipado, expiracao de 8 horas e checks same-origin.
- CRUD administrativo validado com **Zod** no servidor para query params, payloads e UUIDs.
- Upload valida **assinatura binaria**, reencoda tudo para **WebP**, limita tamanho/processamento e rejeita formatos nao suportados.
- Headers de seguranca emitidos pela app: **CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy e Permissions-Policy**.
- Pipeline com **lint, testes, type-check, npm audit e Gitleaks** antes do merge.
- Falha de infraestrutura no banco agora gera estado de indisponibilidade na UI publica.
- Suite do Vitest foi isolada dos testes Playwright.
- O lint deixou de falhar por scripts legados fora do escopo do app web.

## Testes & Code Quality

O projeto conta com infraestrutura moderna para Qualidade de Software (QA):

- **Lint & Tipagem Estática**: 
  - Execute `npm run lint` para rodar a validação do ESLint.
  - Execute `npx tsc --noEmit` para validar strict types no projeto.
- **Testes Unitários / Integração**: 
  - Utilitários e funções críticas implementados com **Vitest**, **React Testing Library** e **jsdom**.
  - Comando: `npm run test` (restrito a `src/**/*.{test,spec}.{ts,tsx}`).
- **Testes E2E (End-to-End)**: 
  - Para validação de fluxos complexos como rotas de categorias via browser automation real.
  - Utilizamos **Playwright** (`/e2e`).
  - Comando: `npm run test:e2e` (Requer que a aplicação esteja rodando em `:3000`).

Checklist rapido de validacao:

```bash
npm run lint
npm test
npx tsc --noEmit
npm run build
npm audit --omit=dev
```

## Deploy (VPS)

### Infraestrutura
- O deploy atual usa VPS Linux com Nginx, systemd, PostgreSQL e um artefato Next.js empacotado.
- Coordenadas de acesso, caminhos, hostnames, portas e credenciais ficam somente no runbook privado.
- Nao assuma `git pull` em producao; confirme o processo vigente de publicacao antes de alterar o servidor.

### Deploy Manual

Siga apenas o runbook privado para verificacao, manutencao e publicacao manual em producao.

### CI/CD (GitHub Actions)

O repositorio ainda contem `.github/workflows/deploy.yml`, mas ele descreve um fluxo de FTP/cPanel que **nao representa fielmente** o ambiente atual verificado no VPS.

Antes de mexer em CI/CD, confira:

- se o workflow ainda e usado de verdade
- quem publica o artefato no servidor
- se existe outro pipeline fora deste repositorio

Os nomes reais de secrets e coordenadas de acesso devem ser consultados no runbook privado ou no cofre de segredos da equipe.

### Comandos Uteis

Consulte `../docs/operations/cardapio-vps-runbook.md` para os comandos operacionais atualizados.

## Banco de Dados

### Tabelas

**users**
- `id` UUID PK
- `email` unique
- `password_hash` bcrypt
- `created_at` timestamp

**categories**
- `id` UUID PK
- `slug` unique (cafes, chocolates, sobremesas, gelados, sodas)
- `name` display name
- `order` int (ordenacao no menu)

**products**
- `id` UUID PK
- `name`, `description`, `price` (text)
- `image_url` (path relativo: /assets/img/x.webp)
- `category_id` FK -> categories
- `featured` boolean
- `created_at` timestamp

## Admin

Acesse `/login` com as credenciais do admin. O painel em `/admin` permite:
- Listar todos os produtos
- Criar novo produto com upload de imagem
- Editar produto existente
- Deletar produto

Autenticacao via cookie HttpOnly JWT com expiracao de 8 horas, middleware server-side no perimetro `/admin/*`, validacao same-origin nas rotas mutaveis e rate limiting estrito em tentativas de login.
Endpoints de listagem e alteracao de produtos sao validados explicitamente via `zod`, e operacoes de escrita exigem contexto administrativo autenticado.

## QR Code

QR Codes gerados devem apontar para a origem canonica definida para o produto. Consulte o runbook privado antes de alterar o dominio ou regenerar materiais impressos.

Para regenerar:
```bash
npx tsx scripts/generate_qrcode.ts
```
Gera versoes gold e preto em `public/assets/img/`.
