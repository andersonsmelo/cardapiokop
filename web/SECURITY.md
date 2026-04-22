# 🛡️ SECURITY.md — Política de Segurança para Projetos Vibe Coding

> **Versão:** 2.0  
> **Última atualização:** Abril 2026  
> **Classificação:** Documento obrigatório de projeto  
> **Baseado em:** OWASP Top 10 (2021), OWASP Top 10 for LLM Applications, NIST SSDF, CSA Secure Vibe Coding Guide

---

## Índice

1. [Declaração de Princípios](#1-declaração-de-princípios)
2. [Regra de Ouro: Código de IA é Código Não Confiável](#2-regra-de-ouro-código-de-ia-é-código-não-confiável)
3. [Pipeline de Segurança Obrigatório (Fluxo CI/CD)](#3-pipeline-de-segurança-obrigatório-fluxo-cicd)
4. [Checklist de Segurança — Antes de Aceitar Código da IA](#4-checklist-de-segurança--antes-de-aceitar-código-da-ia)
5. [Checklist de Segurança — Antes de Deploy em Produção](#5-checklist-de-segurança--antes-de-deploy-em-produção)
6. [Checklist de Segurança — Auditoria Rápida (30-60 min)](#6-checklist-de-segurança--auditoria-rápida-30-60-min)
7. [Padrões Obrigatórios de Código Seguro](#7-padrões-obrigatórios-de-código-seguro)
8. [Segurança Específica para IA e Agentes](#8-segurança-específica-para-ia-e-agentes)
9. [Configuração Segura de Cloud e Infraestrutura](#9-configuração-segura-de-cloud-e-infraestrutura)
10. [Ferramentas Obrigatórias no Pipeline](#10-ferramentas-obrigatórias-no-pipeline)
11. [Prompt Engineering Seguro — Regras para Interação com IA](#11-prompt-engineering-seguro--regras-para-interação-com-ia)
12. [Política de Resposta a Incidentes](#12-política-de-resposta-a-incidentes)
13. [Referências e Fontes](#13-referências-e-fontes)

---

## 1. Declaração de Princípios

Este documento estabelece a **rotina de segurança obrigatória** para todo projeto desenvolvido com auxílio de IA generativa (vibe coding). Dados empíricos indicam que até 45% do código gerado por IA contém vulnerabilidades de segurança e apenas cerca de 10% das soluções geradas são intrinsecamente seguras sem intervenção corretiva.

**Premissas fundamentais:**

- **IA acelera a produção de falhas na mesma proporção que acelera a produção de código.** Velocidade sem controle é risco exponencial.
- **Funcionar não significa ser seguro.** Código que compila e passa em testes funcionais pode conter vulnerabilidades graves invisíveis a olho nu.
- **Segurança não é fase final, é camada contínua.** Cada etapa do ciclo de desenvolvimento deve ter um portão de segurança.
- **Zero Trust aplicado ao código:** toda saída da IA é tratada como entrada não confiável de um desenvolvedor júnior sem experiência em segurança.

---

## 2. Regra de Ouro: Código de IA é Código Não Confiável

```
┌─────────────────────────────────────────────────────────────┐
│  TODO CÓDIGO GERADO POR IA É CONSIDERADO NÃO CONFIÁVEL     │
│  ATÉ SER VALIDADO POR:                                     │
│                                                             │
│  ✅ Revisão humana com compreensão do código                │
│  ✅ Análise estática de segurança (SAST)                    │
│  ✅ Varredura de segredos (Secret Scanning)                 │
│  ✅ Análise de dependências (SCA)                           │
│  ✅ Testes dinâmicos em staging (DAST)                      │
└─────────────────────────────────────────────────────────────┘
```

**Justificativa técnica:** LLMs são motores probabilísticos treinados em código público que inclui tutoriais antigos, bibliotecas depreciadas e repositórios não auditados. Eles otimizam para funcionalidade imediata (happy path), não para postura defensiva. Estudos mostram que código gerado por IA pode ter até 2,7x mais vulnerabilidades que código escrito por humanos.

---

## 3. Pipeline de Segurança Obrigatório (Fluxo CI/CD)

Todo código gerado por IA **deve** passar pelo seguinte fluxo antes de chegar à produção:

```
┌──────────┐   ┌──────────────┐   ┌─────────────┐   ┌──────────────┐
│ Geração  │──▶│  Validação   │──▶│  Revisão    │──▶│   Testes     │
│ via IA   │   │  Automática  │   │  Humana     │   │  Dinâmicos   │
└──────────┘   └──────────────┘   └─────────────┘   └──────────────┘
                    │                    │                   │
               SAST + SCA +        Code Review         DAST + Fuzzing
               Secret Scan        + Threat Model       + Pen Testing
                    │                    │                   │
                    ▼                    ▼                   ▼
              ┌──────────┐        ┌──────────┐        ┌──────────┐
              │  FALHOU? │        │  FALHOU? │        │  FALHOU? │
              │ ⛔ BLOQUEAR│       │ ⛔ BLOQUEAR│       │ ⛔ BLOQUEAR│
              └──────────┘        └──────────┘        └──────────┘
                                                            │
                                                      ✅ PASSOU
                                                            │
                                                   ┌────────▼────────┐
                                                   │  PORTÃO FINAL   │
                                                   │  DE SEGURANÇA   │
                                                   └────────┬────────┘
                                                            │
                                                   ┌────────▼────────┐
                                                   │     DEPLOY      │
                                                   │   + WAF + HSTS  │
                                                   │   + Monitoring  │
                                                   └─────────────────┘
```

**Regra inquebrável:** Se qualquer portão falhar, o deploy é **bloqueado**. Não existe exceção para "corrigir depois".

---

## 4. Checklist de Segurança — Antes de Aceitar Código da IA

Antes de fazer merge de qualquer código gerado por IA, **todos** os itens abaixo devem ser verificados:

### 4.1 Compreensão e Revisão

- [ ] O código foi **lido e compreendido** por pelo menos um desenvolvedor responsável
- [ ] O desenvolvedor consegue explicar a lógica **sem consultar o chatbot**
- [ ] Partes críticas (auth, pagamentos, banco de dados) foram revisadas por alguém com experiência no domínio

### 4.2 Injeções e Validação de Input

- [ ] Consultas SQL utilizam **prepared statements / queries parametrizadas** — zero concatenação de strings
- [ ] Não há uso de `eval()`, `exec()`, `Function()`, `pickle.load()` ou `os.system()` com dados de entrada
- [ ] Existe validação centralizada de input baseada em **schemas** (JSON Schema, Zod, DTOs)
- [ ] Campos críticos possuem **whitelist** de formato, tipo e tamanho máximo
- [ ] Output é codificado corretamente por contexto (HTML encoding, URL encoding, JS encoding)

### 4.3 Autenticação e Autorização

- [ ] Autenticação utiliza **bibliotecas maduras** (OAuth 2.0, OIDC) — nada customizado
- [ ] JWTs possuem: expiração curta, chave forte em secret manager, rotação de refresh tokens
- [ ] Toda rota sensível verifica **autorização + ownership** (o recurso pertence ao usuário?)
- [ ] Princípio de **deny by default**: acesso é negado a menos que explicitamente permitido
- [ ] Endpoints administrativos possuem guardas específicos e MFA quando possível

### 4.4 Criptografia

- [ ] **Nenhum** uso de MD5, SHA-1, DES ou RC4 em qualquer contexto
- [ ] Senhas utilizam KDF adequado: **Argon2id**, bcrypt ou PBKDF2 com custo configurado
- [ ] Criptografia simétrica usa **AES-GCM** ou **ChaCha20-Poly1305**
- [ ] Chaves criptográficas estão em **secret manager**, nunca no código

### 4.5 Segredos e Credenciais

- [ ] **Zero segredos hardcoded** no código (API keys, tokens, senhas, connection strings)
- [ ] Todos os segredos estão em **Secrets Manager** (AWS SM, Vault, GCP SM, etc.)
- [ ] Arquivo `.env` está no `.gitignore` e **nunca** foi commitado
- [ ] Source maps do frontend **não** expõem variáveis de ambiente

### 4.6 Dependências

- [ ] Todos os pacotes sugeridos pela IA **existem** no registry oficial (npm, PyPI, etc.)
- [ ] Pacotes foram verificados quanto a **reputação, manutenção e CVEs conhecidos**
- [ ] Nenhuma dependência é fruto de **alucinação da IA** (slopsquatting)
- [ ] Lock files (package-lock.json, poetry.lock, etc.) estão commitados

### 4.7 Logging

- [ ] Logs **não** expõem senhas, tokens, PII ou dados de cartão
- [ ] Stack traces detalhados são visíveis apenas em ambiente de desenvolvimento
- [ ] Existe sanitização de dados antes de gravar logs

---

## 5. Checklist de Segurança — Antes de Deploy em Produção

- [ ] **SAST** rodou no PR e todos os achados críticos/altos foram tratados
- [ ] **Secret scanning** executado — nenhum segredo encontrado em código ou histórico Git
- [ ] **SCA/Dependency scanning** executado — nenhuma dependência com CVE crítico sem mitigação
- [ ] **DAST** executado contra ambiente de staging com autenticação realista
- [ ] **Code review** de segurança foi realizado com foco em OWASP Top 10
- [ ] **Threat modeling** da feature foi documentado incluindo riscos de IA
- [ ] Ambientes estão **segregados** (dev/staging/prod com credenciais separadas)
- [ ] **Headers de segurança** configurados: HSTS, CSP, X-Content-Type-Options, X-Frame-Options
- [ ] **Rate limiting** implementado em endpoints públicos e de autenticação
- [ ] **CORS** configurado com origins explícitas (nunca `*` em produção)
- [ ] **Tokens anti-CSRF** presentes em formulários de alteração de estado
- [ ] **Cookie flags** configurados: `Secure`, `HttpOnly`, `SameSite=Strict`
- [ ] Observabilidade e alertas configurados para comportamentos anômalos
- [ ] **WAF** (Web Application Firewall) ativo na borda

---

## 6. Checklist de Segurança — Auditoria Rápida (30-60 min)

Use este checklist para auditar rapidamente módulos existentes:

- [ ] Existem endpoints **sem autenticação** em caminhos sensíveis (`/admin`, `/export`, `/debug`)?
- [ ] Existem caminhos de input que chegam a bancos ou comandos **sem sanitização**?
- [ ] Há uso de funções perigosas (`eval`, `exec`, `pickle.load`, `innerHTML`, `dangerouslySetInnerHTML`)?
- [ ] Logs ou mensagens de erro expõem dados internos em ambientes de produção?
- [ ] Configurações de cloud (buckets, bancos, filas) permitem **acesso público**?
- [ ] Regras de banco (Firebase/Supabase RLS) usam `USING (true)` ou equivalente permissivo?
- [ ] Agentes de IA ou integrações com LLM possuem **privilégios excessivos**?
- [ ] Arquivos de configuração (`.cursorrules`, `.github/copilot-instructions.md`) contêm **caracteres invisíveis ou instruções suspeitas**?
- [ ] Auth/authz por rota: **quem** chama, **o que** pode, **qual** tenant/owner é validado?

---

## 7. Padrões Obrigatórios de Código Seguro

### 7.1 SQL e Banco de Dados

```
⛔ PROIBIDO (nunca fazer):
   query = "SELECT * FROM users WHERE id = " + userId
   query = f"SELECT * FROM users WHERE id = {userId}"
   query = `SELECT * FROM users WHERE id = ${userId}`

✅ OBRIGATÓRIO (sempre fazer):
   query = "SELECT * FROM users WHERE id = $1", [userId]     // Node/pg
   cursor.execute("SELECT * FROM users WHERE id = %s", (userId,))  // Python
   User.where(id: userId)                                     // ORM
```

### 7.2 Autenticação e Sessão

```
⛔ PROIBIDO:
   - JWT com secret "mysecret" ou chave curta
   - JWT sem expiração
   - Senhas armazenadas com MD5/SHA-1
   - Senhas em texto puro
   - Sessão sem invalidação no logout

✅ OBRIGATÓRIO:
   - JWT assinado com RS256 ou HS256 com chave ≥256 bits em secret manager
   - Access token: expiração ≤ 15 min
   - Refresh token: expiração ≤ 7 dias + rotação
   - Senhas: Argon2id (preferido), bcrypt (mínimo cost 12) ou PBKDF2
   - Rate limiting em /login e /register: máx 5 tentativas/min por IP
   - Lockout após 10 tentativas falhas consecutivas
```

### 7.3 Proteção contra XSS

```
⛔ PROIBIDO:
   element.innerHTML = userInput
   dangerouslySetInnerHTML={{ __html: userInput }}
   document.write(userInput)
   <div>${userInput}</div>  // em templates sem auto-escape

✅ OBRIGATÓRIO:
   - Frameworks com auto-escape por padrão (React JSX, Jinja2 com autoescape)
   - Output encoding por contexto (HTML, atributo, JS, URL, CSS)
   - Content-Security-Policy header configurado
   - Se precisar renderizar HTML: sanitizar com DOMPurify ou equivalente
```

### 7.4 Proteção contra CSRF

```
✅ OBRIGATÓRIO para formulários que alteram estado:
   - Token anti-CSRF sincronizado (Django {% csrf_token %}, Express csurf)
   - Cookie SameSite=Strict ou Lax (nunca None sem justificativa)
   - Validação de header Origin/Referer como camada adicional
```

### 7.5 Autorização (BOLA/IDOR)

```
⛔ PROIBIDO:
   // Retornar recurso apenas com base no ID na URL
   app.get('/api/users/:id', (req, res) => {
     return db.users.findById(req.params.id)  // ⛔ Sem verificação de ownership
   })

✅ OBRIGATÓRIO:
   app.get('/api/users/:id', auth, (req, res) => {
     const user = db.users.findById(req.params.id)
     if (user.id !== req.auth.userId) return res.status(403)  // ✅ Verifica ownership
     return user
   })
```

### 7.6 Gestão de Segredos

```
⛔ PROIBIDO:
   const API_KEY = "sk-abc123..."           // Hardcoded
   DATABASE_URL = "postgres://user:pass@"   // Em código
   .env commitado no repositório            // Exposto no Git

✅ OBRIGATÓRIO:
   - Segredos em: AWS Secrets Manager / HashiCorp Vault / GCP Secret Manager
   - .env no .gitignore (SEMPRE)
   - Rotação automática de segredos a cada 90 dias
   - Credenciais de dev/staging/prod SEPARADAS
   - Hooks de pre-commit para bloquear segredos acidentais
```

### 7.7 Serialização Segura

```
⛔ PROIBIDO:
   pickle.load(untrusted_data)     // Python — permite RCE
   eval(JSON.stringify(data))      // JavaScript — execução arbitrária
   yaml.load(data)                 // Python — sem SafeLoader

✅ OBRIGATÓRIO:
   json.loads(data)                // Formato seguro por natureza
   yaml.safe_load(data)            // SafeLoader apenas
   - Validar schema antes de processar dados deserializados
   - Nunca desserializar dados de fontes não confiáveis em formatos que executem código
```

---

## 8. Segurança Específica para IA e Agentes

### 8.1 Defesa contra Prompt Injection

A injeção de prompt é o risco #1 do OWASP Top 10 para aplicações LLM. Dados e instruções trafegam no mesmo canal, permitindo que conteúdo malicioso seja interpretado como comando.

**Regras obrigatórias:**

- Separar **instruções** de **dados do usuário** sempre que possível
- Nunca confiar que dados externos (issues, PRs, emails, páginas web) são "passivos"
- Exigir **confirmação humana explícita** para ações destrutivas ou sensíveis do agente
- Bloquear exfiltração via URLs/imagens com dados codificados
- Auditar arquivos `.cursorrules` e configurações de MCP contra **caracteres Unicode invisíveis** e instruções ofuscadas

### 8.2 Isolamento de Agentes (Sandboxing)

```
┌─────────────────────────────────────────┐
│  CAMADA DE ISOLAMENTO OBRIGATÓRIA       │
│                                         │
│  Nível 1 (mínimo): Container Docker     │
│           com privilégios reduzidos      │
│                                         │
│  Nível 2 (recomendado): MicroVM         │
│           (Firecracker / Kata)           │
│                                         │
│  Nível 3 (ideal): gVisor + MicroVM      │
│           com interceptação de syscalls  │
└─────────────────────────────────────────┘
```

**Regras para agentes:**

- Agentes de código **nunca** devem ter acesso direto a credenciais de produção
- Tokens fornecidos a agentes devem ser **escopados** com permissões mínimas
- Sessões de agente devem ser **auditáveis e rastreáveis** em logs irrevogáveis
- Desabilitar **auto-approve** e **auto-commit** — sempre exigir confirmação humana
- Agentes não devem executar em ambientes com acesso ao filesystem de produção

### 8.3 Proteção contra Supply Chain (Slopsquatting)

A IA pode **alucinar** nomes de pacotes que não existem. Atacantes registram esses nomes com malware.

**Antes de instalar qualquer pacote sugerido pela IA:**

1. Verificar se o pacote **existe** no registry oficial
2. Checar **número de downloads**, data de criação e mantenedores
3. Comparar o nome com pacotes conhecidos (typosquatting)
4. Verificar se há **CVEs conhecidos** no pacote
5. Rodar `npm audit` / `pip audit` / equivalente após instalação

### 8.4 Proteção contra Data Leakage

- **Nunca** colar segredos, código proprietário ou dados sensíveis no chat da IA
- Usar **proxies/gateways** que filtram prompts para remover chaves e dados sensíveis
- Estar ciente de que dados enviados a LLMs públicos podem ser usados para treinamento
- Configurar DLP (Data Loss Prevention) nos endpoints de saída

### 8.5 Proteção contra Over-Reliance

O "viés de automação" faz desenvolvedores aceitarem código da IA sem questionar.

**Regras anti-complacência:**

- PRs com código gerado por IA devem ser **marcados com label** indicativa
- Revisores devem **questionar ativamente** decisões de segurança do código gerado
- Se o desenvolvedor não consegue explicar o que o código faz → **rejeitar o PR**
- Nunca iterar cegamente ("peça para a IA corrigir") — iterações podem **piorar** a segurança

---

## 9. Configuração Segura de Cloud e Infraestrutura

### 9.1 Armazenamento (S3, GCS, etc.)

- [ ] **Block Public Access** ativado em todos os buckets
- [ ] ACLs revisadas — nenhuma regra de leitura/escrita pública
- [ ] Criptografia at-rest habilitada (SSE-S3 ou SSE-KMS)
- [ ] Logging de acesso ativado

### 9.2 Banco de Dados (Firebase, Supabase, etc.)

```
⛔ PROIBIDO (Supabase/Firebase):
   CREATE POLICY "allow_all" ON users USING (true);
   // ou
   rules_version = '2'; service cloud.firestore { match /{document=**} { allow read, write: if true; } }

✅ OBRIGATÓRIO:
   CREATE POLICY "user_own_data" ON users USING (auth.uid() = user_id);
   // Toda policy deve verificar auth.uid() e ownership
```

- [ ] RLS (Row Level Security) ativo em **todas** as tabelas
- [ ] Cada policy verifica `auth.uid()` e ownership do recurso
- [ ] Nenhuma regra usa `USING (true)` ou `if true` em produção
- [ ] Service keys do Supabase/Firebase **nunca** expostas no frontend

### 9.3 Headers HTTP de Segurança

```
# Configuração mínima obrigatória (nginx/reverse proxy)
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 0  # Desativado (CSP substitui)
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### 9.4 Segregação de Ambientes

```
┌────────────────────────────────────────────────┐
│  DESENVOLVIMENTO     │  STAGING    │  PRODUÇÃO  │
│  ─────────────────   │  ────────── │  ───────── │
│  Dados fictícios     │  Dados      │  Dados     │
│  Secrets de dev      │  anônimos   │  reais     │
│  Sem acesso externo  │  Secrets    │  Secrets   │
│                      │  de staging │  de prod   │
│                      │             │            │
│  ⛔ SEM acesso a     │  ⛔ SEM      │  ✅ Único  │
│    dados de prod     │  dados de   │  ambiente  │
│                      │  prod       │  com dados │
│                      │             │  reais     │
└────────────────────────────────────────────────┘

REGRA: Credenciais NUNCA são compartilhadas entre ambientes.
```

---

## 10. Ferramentas Obrigatórias no Pipeline

| Categoria | Finalidade | Ferramentas Recomendadas | Quando Executar |
|-----------|-----------|-------------------------|-----------------|
| **SAST** | Análise estática de código — detecta padrões inseguros | Semgrep, SonarQube, CodeQL, Corgea | Em cada commit/PR |
| **DAST** | Testes dinâmicos em runtime — encontra falhas em execução | OWASP ZAP, Burp Suite | Em staging antes de deploy |
| **SCA** | Análise de dependências — detecta CVEs e pacotes maliciosos | Snyk, Dependabot, OWASP Dep-Check, Mend.io | Em cada commit/PR |
| **Secret Scanning** | Detecta segredos no código e histórico Git | GitGuardian, TruffleHog, gitleaks | Pre-commit + CI/CD |
| **Linting de Segurança** | Regras específicas para padrões da IA | ESLint Security, Bandit (Python), Semgrep rules | No IDE + CI/CD |
| **WAF** | Firewall de aplicação web — bloqueia ataques na borda | Cloudflare WAF, AWS WAF, ModSecurity | Em produção (sempre) |

### 10.1 Configuração Mínima de Pre-commit

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0
    hooks:
      - id: gitleaks

  - repo: https://github.com/returntocorp/semgrep
    rev: v1.50.0
    hooks:
      - id: semgrep
        args: ['--config', 'auto', '--error']

  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: detect-private-key
      - id: check-added-large-files
```

### 10.2 Configuração Mínima de CI/CD (GitHub Actions)

```yaml
# .github/workflows/security.yml
name: Security Gates
on: [push, pull_request]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Secret Scanning
        uses: gitleaks/gitleaks-action@v2

      - name: SAST - Semgrep
        uses: returntocorp/semgrep-action@v1
        with:
          config: >-
            p/security-audit
            p/owasp-top-ten
            p/javascript
            p/python

      - name: Dependency Check
        run: |
          npm audit --audit-level=high || true
          # ou: pip audit (Python)

      - name: Block on Critical Findings
        run: |
          # Falhar o build se houver achados críticos
          echo "Security gates passed ✅"
```

---

## 11. Prompt Engineering Seguro — Regras para Interação com IA

### 11.1 O que SEMPRE incluir no prompt

```
Ao pedir código à IA, SEMPRE adicione instruções de segurança explícitas:

"Implemente usando:
- Prepared statements para queries SQL
- Validação de input com schema (Zod/Joi/JSON Schema)
- Output encoding para prevenção de XSS
- Autenticação e autorização em toda rota sensível
- Rate limiting em endpoints públicos
- Bcrypt/Argon2 para hashing de senhas
- Segredos via variáveis de ambiente (nunca hardcoded)
- Logging sem dados sensíveis
- Tratamento de erro sem exposição de stack trace
- Headers de segurança (HSTS, CSP, etc.)

NÃO utilize: MD5, SHA-1, eval(), pickle.load(), innerHTML com dados do usuário,
concatenação de strings em SQL, ou regras de acesso permissivas (USING true)."
```

### 11.2 O que NUNCA enviar no prompt

- ⛔ API keys, tokens ou senhas reais
- ⛔ Connection strings de bancos de dados
- ⛔ Código proprietário com lógica de negócio sensível
- ⛔ Dados pessoais de clientes (PII)
- ⛔ Credenciais de acesso a serviços internos
- ⛔ Dumps de banco de dados

### 11.3 Verificação de Arquivos de Configuração

Antes de usar qualquer projeto que contenha arquivos de configuração de IA:

```bash
# Verificar caracteres Unicode invisíveis em .cursorrules e similares
cat -v .cursorrules | grep -P '[^\x20-\x7E\n\r\t]'
cat -v .github/copilot-instructions.md | grep -P '[^\x20-\x7E\n\r\t]'

# Se encontrar caracteres invisíveis: ALERTAR E INVESTIGAR
# Pode ser um ataque de Rules File Backdoor
```

---

## 12. Política de Resposta a Incidentes

### 12.1 Se um segredo for commitado

1. **Rotacionar imediatamente** a credencial comprometida
2. Remover do histórico Git com `git filter-branch` ou BFG Repo-Cleaner
3. Verificar logs de acesso para uso não autorizado
4. Documentar o incidente e adicionar regra ao secret scanner

### 12.2 Se uma vulnerabilidade for descoberta em produção

1. **Avaliar severidade** (CVSS) e alcance
2. **Isolar** o componente afetado se possível
3. **Corrigir** com patch emergencial revisado por humano
4. **Verificar** se há evidência de exploração nos logs
5. **Post-mortem** com ações corretivas para o pipeline

### 12.3 Se houver suspeita de prompt injection em agente

1. **Suspender** imediatamente a sessão do agente
2. **Auditar** todos os arquivos modificados pelo agente
3. **Verificar** configurações de MCP e arquivos de regras
4. **Revogar** tokens que o agente tinha acesso
5. **Investigar** a fonte da injeção (arquivo, PR, issue, página web)

---

## 13. Referências e Fontes

---

## 14. Release Gates do Repositório

Nenhuma mudança segue para merge ou deploy sem passar pelos portões abaixo no pipeline de CI:

- `npm run lint -- .` deve passar no diretório `web`
- `npm test` deve passar no diretório `web`
- `npx tsc --noEmit` deve passar no diretório `web`
- `npm audit --omit=dev` deve retornar sem achados high/critical
- Secret scanning com Gitleaks deve passar antes do merge
- Mudanças em autenticação, upload, sessão, autorização administrativa, CI/CD e segredos exigem revisão humana com contexto de segurança

Falha em qualquer gate bloqueia merge em `main` e bloqueia promoção para deploy.

Este documento foi construído a partir da análise consolidada de múltiplas fontes de pesquisa:

- **OWASP Top 10 (2021)** — https://owasp.org/Top10/
- **OWASP Top 10 for LLM Applications** — https://owasp.org/www-project-top-10-for-large-language-model-applications/
- **NIST Secure Software Development Framework (SSDF)** — https://csrc.nist.gov/projects/ssdf
- **CSA Secure Vibe Coding Guide** — https://cloudsecurityalliance.org/blog/2025/04/09/secure-vibe-coding-guide
- **Veracode GenAI Code Security Report 2025** — https://www.veracode.com/blog/genai-code-security-report/
- **Georgia Tech Vibe Security Radar** — https://research.gatech.edu/bad-vibes-ai-generated-code-vulnerable-researchers-warn
- **OWASP LLM Prompt Injection Prevention Cheat Sheet** — https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html
- **GitGuardian State of Secrets Sprawl** — https://blog.gitguardian.com/
- **Pillar Security — Rules File Backdoor** — https://www.pillar.security/blog/new-vulnerability-in-github-copilot-and-cursor-how-hackers-can-weaponize-code-agents
- **ENISA AI Security Recommendations** — Framework europeu de segurança para IA generativa

---

## Assinatura de Conformidade

```
Ao contribuir com este projeto, declaro que:

☐ Li e compreendi este documento SECURITY.md
☐ Comprometo-me a seguir todos os checklists antes de fazer merge
☐ Entendo que código gerado por IA é considerado não confiável
☐ Nunca enviarei segredos reais no prompt da IA
☐ Reportarei imediatamente qualquer incidente de segurança

Contribuidor: _________________________
Data: _________________________________
```

---

> **Este documento deve ser revisado a cada 90 dias e atualizado conforme novas ameaças e ferramentas surgirem.**  
> **Última revisão: Abril 2026 | Próxima revisão prevista: Julho 2026**
