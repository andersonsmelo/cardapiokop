# Cardapio VPS Runbook

Ultima verificacao manual: **20/04/2026**

> Documento privado de operacoes. Nao copie hostnames, portas, caminhos, comandos sensiveis ou referencias a credenciais deste arquivo para README publico, issues, PRs abertas ou transcripts de chat.

## Objetivo

Este runbook existe para reduzir tempo de diagnostico quando houver divergencia entre:

- o checkout local
- a documentacao
- o comportamento real em producao

## Fonte de Verdade Atual

No estado verificado em 20/04/2026:

- o banco real do projeto esta no **VPS**
- o app em producao esta em `/srv/cardapio`
- o service ativo e `cardapio.service`
- o banco usado pela aplicacao e `cardapio` em `127.0.0.1:5432`

Dados confirmados:

- VPS: `69.6.222.219`
- SSH: `22022`
- app: `/srv/cardapio`
- env: `/srv/cardapio/.env.local`
- banco: PostgreSQL `cardapio`

## Primeiro Checklist

Quando algo parecer errado no projeto:

1. Confirmar se o VPS esta no ar.
2. Confirmar se `cardapio.service` esta ativo.
3. Confirmar se o banco `cardapio` responde.
4. Confirmar se `/srv/cardapio` contem as rotas e arquivos esperados.
5. So depois comparar com o checkout local.

## Comandos de Acesso

```bash
ssh -p 22022 Hashi1802@69.6.222.219
```

## Comandos de Verificacao no VPS

```bash
# service
sudo systemctl status cardapio
sudo journalctl -u cardapio -n 200 --no-pager

# nginx
sudo nginx -t

# banco
sudo -u postgres psql -lqt
sudo -u postgres psql -d cardapio -c '\dt'
sudo -u postgres psql -d cardapio -c 'select count(*) from categories;'
sudo -u postgres psql -d cardapio -c 'select count(*) from products;'
sudo -u postgres psql -d cardapio -c 'select count(*) from users;'

# ambiente
sudo awk -F= '/^(DATABASE_URL|JWT_SECRET|ADMIN_EMAIL|ADMIN_PASSWORD)=/ {print $1"=<set>"}' /srv/cardapio/.env.local
```

## Hardening do Nginx

O baseline de borda deve incluir o snippet versionado em:

- `/Users/anderson/Developer/cardapiokop-main/docs/operations/snippets/cardapio-nginx-security.conf`
- `/Users/anderson/Developer/cardapiokop-main/docs/operations/snippets/cardapio-rate-limit-zones.conf`

Fluxo recomendado no VPS:

```bash
sudo install -m 0644 /srv/cardapio/docs/operations/snippets/cardapio-rate-limit-zones.conf /etc/nginx/conf.d/cardapio-rate-limit-zones.conf
sudo install -m 0644 /srv/cardapio/docs/operations/snippets/cardapio-nginx-security.conf /etc/nginx/snippets/cardapio-nginx-security.conf
sudo editor /etc/nginx/sites-available/cardapio
sudo nginx -t
sudo systemctl reload nginx
```

No bloco `server` do site, inclua explicitamente:

```nginx
include /etc/nginx/snippets/cardapio-nginx-security.conf;
```

Esse snippet cobre:

- `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` e `Permissions-Policy` com `always`
- `limit_req` dedicado para `/api/auth/login` e `/api/upload`, com zonas declaradas no contexto global via `conf.d/cardapio-rate-limit-zones.conf`

Depois do reload, valide no host publicado que os headers aparecem tambem em respostas de erro e em assets estaticos.

## Desenvolvimento Local com Banco Real

Se voce quiser reproduzir localmente usando os dados reais:

```bash
# abrir tunel
ssh -p 22022 -N -L 6543:127.0.0.1:5432 Hashi1802@69.6.222.219
```

No `web/.env.local`, configure o `DATABASE_URL` apontando para `127.0.0.1:6543`.

Exemplo:

```env
DATABASE_URL=postgresql://usuario:senha@127.0.0.1:6543/cardapio
```

Depois:

```bash
cd web
npm run dev -- --hostname 127.0.0.1 --port 3002
```

## Divergencia Importante Encontrada

Em 20/04/2026, o diretorio `/srv/cardapio`:

- estava rodando normalmente
- continha `src/app/api/*`
- **nao era um checkout git**

Implicacao pratica:

- nao assuma que `git pull` em producao funciona
- nao assuma que o repositório local representa exatamente o que esta publicado
- se faltarem arquivos locais, confira o VPS antes de concluir que eles nunca existiram

## Rotas Encontradas no Artefato em Producao

Rotas confirmadas no VPS:

- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/logout/route.ts`
- `src/app/api/auth/me/route.ts`
- `src/app/api/categories/route.ts`
- `src/app/api/products/route.ts`
- `src/app/api/products/[id]/route.ts`
- `src/app/api/upload/route.ts`

## Observacao Sobre Login Admin

O email do admin pode existir no banco sem que a senha do `.env.local` atual bata com o hash salvo em `users`.

Se o login responder `401`:

1. confirme se o usuario existe
2. confirme se a senha do env bate com o hash armazenado
3. so depois trate como bug da API
