# Migracao de Workspace para Fora do iCloud

## Quando usar

Use este procedimento quando um projeto estiver em `~/Desktop` ou `~/Documents` com iCloud Drive ativo e apresentar sintomas como:

- leitura de arquivos falhando ou demorando
- `git status`, `git add` ou `git commit` travando
- `npm install`, `pnpm install`, `tsc` ou builds falhando sem motivo claro
- arquivos vazios, incompletos ou indisponiveis sob demanda

## Causa raiz

O iCloud Drive nao e um local confiavel para codigo-fonte ativo. Quando `Otimizar Armazenamento do Mac` ou `Mesa e Documentos` estao ativos, o macOS pode materializar arquivos sob demanda e isso afeta Git, builds, caches e ferramentas de desenvolvimento.

## Fluxo recomendado

1. Confirmar se o projeto atual esta em `~/Desktop` ou `~/Documents`.
2. Criar um destino local fora do iCloud, de preferencia em `~/Developer`.
3. Quando houver remoto Git, clonar o repositorio para o novo caminho.
4. Repor apenas arquivos locais nao versionados, como `.env`, `.npmrc`, certificados e chaves.
5. Evitar copiar `node_modules`, `.next`, `dist`, caches e artefatos de build.
6. Validar no novo workspace com `git status`, instalacao de dependencias e build.
7. Manter a pasta antiga como backup ate a validacao final.

## Estrutura sugerida

```text
/Users/anderson/Developer/
  cardapiokop-main/
  Projeto-A/
  Projeto-B/
```

## Checklist final no macOS

- Desativar `Otimizar Armazenamento do Mac`
- Desativar `Pastas Mesa e Documentos`
- Usar iCloud apenas para documentos, nao para codigo-fonte ativo

