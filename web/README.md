# Cardapio KOP - Kopenhagen Digital Menu

Cardapio digital para mesas de restaurante Kopenhagen. Clientes escaneiam o QR Code na mesa e acessam o cardapio completo pelo celular.

**Producao**: https://cardapiokop.ascendcreative.com.br

## Estado Atual

Verificado em **20/04/2026**:

- O cardapio publico e o admin usam o tema claro **Cafe Creme**.
- O banco real do projeto esta no **VPS**, nao no ambiente local por padrao.
- As API routes existem e ficam em `src/app/api/*`.
- O ambiente em `/srv/cardapio` no VPS esta rodando, mas **nao e um checkout git**.
- O repositório local e o artefato em producao ficaram desalinhados em alguns pontos; sempre valide contra o VPS antes de assumir ausencia de dados ou rotas.

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
      page.tsx              # Home - lista categorias
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
    components/             # ProductCard, CategoryCard, ProductForm, etc.
    contexts/AuthContext.tsx # Provider de autenticacao
    db/
      schema.ts             # Tabelas: users, categories, products
      index.ts              # Conexao PostgreSQL via Drizzle
    lib/
      auth.ts               # JWT sign/verify, bcrypt, cookies
      data.ts               # Queries: getCategories, getProducts
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
- Acesso SSH ao VPS se quiser usar os dados reais
- Opcional: PostgreSQL 16 local, apenas se for trabalhar totalmente offline

### Instalacao

```bash
# Clonar e instalar
cd web
npm install
```

#### Opcao A: desenvolvimento apontando para o banco real do VPS

Esta e a forma mais fiel ao comportamento atual do projeto.

```bash
# 1) abrir tunel SSH para o PostgreSQL do VPS
ssh -p 22022 -N -L 6543:127.0.0.1:5432 Hashi1802@69.6.222.219

# 2) copiar os valores de /srv/cardapio/.env.local para web/.env.local
#    e trocar apenas o DATABASE_URL para apontar para 127.0.0.1:6543
#
# Exemplo:
# DATABASE_URL=postgresql://usuario:senha@127.0.0.1:6543/cardapio

# 3) iniciar o app local
npm run dev -- --hostname 127.0.0.1 --port 3002
```

Acesse `http://127.0.0.1:3002`.

#### Opcao B: desenvolvimento 100% local

Use esta opcao apenas se voce realmente quiser trabalhar sem dependencia do VPS.

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

### Onde Procurar Primeiro

Se houver divergencia entre o ambiente local e o comportamento real do projeto, a **fonte de verdade atual e o banco de producao estao no VPS**.

Verificado em **20/04/2026**:
- **VPS**: `69.6.222.219`
- **SSH**: porta `22022`
- **App em producao**: `/srv/cardapio`
- **Service**: `cardapio.service`
- **Env do deploy**: `/srv/cardapio/.env.local`
- **Banco real do projeto**: PostgreSQL local no VPS, `127.0.0.1:5432`, database `cardapio`

Estado confirmado no VPS em 20/04/2026:
- tabelas: `categories`, `products`, `users`
- contagens: `categories=5`, `products=21`, `users=2`
- rotas presentes no artefato rodando em producao:
  - `src/app/api/auth/login/route.ts`
  - `src/app/api/auth/logout/route.ts`
  - `src/app/api/auth/me/route.ts`
  - `src/app/api/categories/route.ts`
  - `src/app/api/products/route.ts`
  - `src/app/api/products/[id]/route.ts`
  - `src/app/api/upload/route.ts`

Antes de assumir que "o banco nao existe" ou que "faltam dados", confira primeiro o VPS:

```bash
ssh -p 22022 Hashi1802@69.6.222.219

# listar databases
sudo -u postgres psql -lqt

# inspecionar a base do cardapio
sudo -u postgres psql -d cardapio -c '\dt'
sudo -u postgres psql -d cardapio -c 'select count(*) from categories;'
sudo -u postgres psql -d cardapio -c 'select count(*) from products;'
sudo -u postgres psql -d cardapio -c 'select count(*) from users;'
```

### Variaveis de Ambiente

| Variavel | Descricao | Exemplo |
|---|---|---|
| `DATABASE_URL` | Connection string PostgreSQL (usa pool max: 10) | `postgresql://cardapio:senha@localhost:5432/cardapio` |
| `JWT_SECRET` | Chave p/ assinar tokens (**min: 32 caracteres**) | `4206ae30778227a99...` |
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
- `src/components/CategoryCard.tsx`
- `src/components/ProductCard.tsx`
- `src/app/login/page.tsx`
- `src/app/admin/page.tsx`

## Testes & Code Quality

O projeto conta com infraestrutura moderna para Qualidade de Software (QA):

- **Lint & Tipagem Estática**: 
  - Execute `npm run lint` para rodar a validação do ESLint.
  - Execute `npx tsc --noEmit` para validar strict types no projeto.
- **Testes Unitários / Integração**: 
  - Utilitários e funções críticas implementados com **Vitest**, **React Testing Library** e **jsdom**.
  - Comando: `npm run test` (testes localizados como `*.test.ts`).
- **Testes E2E (End-to-End)**: 
  - Para validação de fluxos complexos como rotas de categorias via browser automation real.
  - Utilizamos **Playwright** (`/e2e`).
  - Comando: `npm run test:e2e` (Requer que a aplicação esteja rodando em `:3000`).

## Deploy (VPS)

### Infraestrutura
- **VPS**: HostGator, Ubuntu 22.04, 1vCPU/2GB RAM
- **IP**: 69.6.222.219
- **VPS**: Servidor Remoto Ubuntu 22.04
- **SSH**: Via chave privada configurada localmente
- **SSH porta**: `22022`
- **App**: `/srv/cardapio` (Next.js ja buildado/empacotado)
- **Banco**: PostgreSQL local (database `cardapio`, user `cardapio`)
- **Arquivo de ambiente**: `/srv/cardapio/.env.local`
- **Proxy**: Nginx reverse proxy porta 443 -> 3001
- **SSL**: Let's Encrypt (auto-renew via Certbot)
- **Processo**: systemd service `cardapio.service`
- **Observacao**: em 20/04/2026, `/srv/cardapio` nao era um checkout git

### Deploy Manual

```bash
# SSH na VPS
ssh -p 22022 Hashi1802@69.6.222.219

# Verificar o service
sudo systemctl status cardapio
sudo journalctl -u cardapio -n 200 --no-pager

# Verificar o diretorio em producao
cd /srv/cardapio
ls -la
```

Nao assuma `git pull` dentro de `/srv/cardapio`.

Em 20/04/2026, o diretorio continha o app rodando, mas nao era um repositorio git. Trate o deploy atual como **artefato sincronizado/buildado**, nao como checkout editavel. Se for necessario atualizar producao manualmente, primeiro confirme o processo de publicacao vigente antes de sobrescrever arquivos no servidor.

### CI/CD (GitHub Actions)

O repositorio ainda contem `.github/workflows/deploy.yml`, mas ele descreve um fluxo de FTP/cPanel que **nao representa fielmente** o ambiente atual verificado no VPS.

Antes de mexer em CI/CD, confira:

- se o workflow ainda e usado de verdade
- quem publica os arquivos em `/srv/cardapio`
- se existe outro pipeline fora deste repositorio

Secrets necessarios no GitHub:
- `VPS_HOST` = IP do servidor
- `VPS_USER` = usuário SSH
- `VPS_SSH_KEY` = chave SSH privada

### Comandos Uteis

```bash
# Status do app
sudo systemctl status cardapio

# Logs
sudo journalctl -u cardapio -f

# Ver ambiente do deploy
sudo systemctl cat cardapio
sudo awk -F= '/^(DATABASE_URL|JWT_SECRET)=/ {print $1"=<set>"}' /srv/cardapio/.env.local

# Nginx
sudo nginx -t && sudo systemctl reload nginx

# Banco
PGPASSWORD=<senha> psql -U cardapio -h 127.0.0.1 -d cardapio

# Confirmar que /srv/cardapio nao e um checkout git
git rev-parse --is-inside-work-tree

# Certificado SSL
sudo certbot certificates
```

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

Autenticacao via cookie HttpOnly JWT (24h de expiracao) com Middleware Server-Side interceptando e bloqueando acessos ao perímetro `/admin/*` sem token válido.
Endpoints de listagem e alteração de produtos validados explicitamente via `zod`. Rate-limiting estrito habilitado em tentativas de Login.

## QR Code

QR Codes gerados apontam para `https://cardapiokop.ascendcreative.com.br` (dominio fixo, QR codes ja impressos).

Para regenerar:
```bash
npx tsx scripts/generate_qrcode.ts
```
Gera versoes gold e preto em `public/assets/img/`.
