# Changelog

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
