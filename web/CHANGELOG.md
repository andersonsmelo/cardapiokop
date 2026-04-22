# Changelog

## 0.1.2 - 2026-04-22

### Added
- Gate de seguranca em CI com lint, testes, type-check, `npm audit --omit=dev` e secret scanning com Gitleaks.
- Dependabot semanal para dependencias npm e GitHub Actions.
- Snippet versionado de hardening do Nginx para rate limiting e headers na borda.

### Changed
- Atualizacao de dependencias sensiveis para `next@16.2.4` e `drizzle-orm@0.45.2`.
- Validacao server-side com Zod nas rotas de login e CRUD de produtos.
- Autenticacao administrativa com token JWT tipado, expiracao de 8 horas, protecao same-origin e rate limiting no login.
- Upload de imagens agora reencoda tudo para `.webp`, limita processamento e rejeita binarios invalidos.
- Headers de seguranca centralizados via Next.js: CSP, HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` e `Permissions-Policy`.

### Fixed
- Regressao de verificacao same-origin em ambiente local quando `APP_ORIGIN` nao estava definido.
- Ausencia de `403` explicito para fluxos administrativos autenticados sem permissao.
- Exposicao a abuso de upload sem limitacao por IP e sem sanitizacao de imagem no servidor.

## 0.1.1 - 2026-04-22

### Added
- Home publica com navegacao por categorias no topo e todos os produtos em sequencia abaixo.
- Estado explicito de indisponibilidade para falhas de acesso ao banco nas telas publicas.

### Changed
- Endurecimento do upload de imagens com deteccao de formato por assinatura binaria e nome de arquivo gerado no servidor.
- Separacao da suite Vitest dos testes Playwright.
- Ajuste do ESLint para ignorar scripts legados e restaurar `npm run lint` como gate valida.

### Fixed
- Risco de XSS armazenado via spoofing de MIME/extensao no upload.
- Mascara de erro de banco como cardapio vazio ou 404 incorreto.
- Falha de `npm test` por descoberta indevida de testes E2E.
- Falha de `npm run lint` por validacao de scripts CommonJS fora do escopo do app.
