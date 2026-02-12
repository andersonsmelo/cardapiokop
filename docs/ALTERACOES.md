# Documentacao De Alteracoes (UX Mobile)

Este documento descreve as alteracoes feitas no projeto **cardapiokop** para alinhar o cardapio digital a um uso real via QR code: leitura rapida, navegacao previsivel, micro-interacoes discretas e performance percebida em mobile.

## Escopo E Objetivo

Objetivos de experiencia:
- Interface clean e intuitiva (zero curva de aprendizado)
- Fluxo de decisao rapido (nome -> preco -> descricao; imagem como suporte)
- Navegacao constante e orientacao espacial
- Micro-interacoes funcionais (feedback imediato, sem teatralidade)
- Performance percebida (conteudo util primeiro, scroll fluido, interacoes instantaneas)

## Arquitetura Atual (Frontend)

Stack atual (simples, sem build):
- HTML: `index.html`
- CSS: `assets/css/variables.css`, `assets/css/style.css`
- JS: `assets/js/data.js`, `assets/js/main.js`

Renderizacao:
- Categorias e produtos sao gerados via JS a partir de `appData` (`assets/js/data.js`).

## Mudancas Implementadas

### 1) Layout De Cards (Editorial Controlado)

Foi implementada uma variacao controlada de cards, com foco em previsibilidade:
- `product-card--horizontal`: padrao para a maioria dos itens (imagem suporte + texto legivel).
- `product-card--hero`: apenas para `featured` e, em alguns casos, o primeiro item da categoria.
- `product-card--minimal`: aparece apenas em listas longas para dar respiro, sem confundir.

Regra de composicao (em `assets/js/main.js`):
- Se `product.featured === true` -> `hero`.
- Se for o primeiro item e a categoria tiver mais de 2 itens -> `hero`.
- `minimal` somente quando a categoria e longa (threshold) e em um intervalo fixo.
- Restante -> `horizontal`.

### 2) Hierarquia Visual Mobile (Decisao Rapida)

Ordem visual do conteudo de cada produto foi padronizada:
- **Nome** (dominante)
- **Preco** (ancora)
- **Descricao** (contexto, menor contraste)
- **Imagem** como suporte (proporcao consistente)

Implementacao:
- Reordenacao do markup dos cards em `assets/js/main.js`.
- Ajustes de tipografia/contraste/espacamento em `assets/css/style.css`.

### 3) Navegacao Mobile (Fluxo E Orientacao)

Categorias persistentes no topo:
- Tabs passaram de `div` para `button` (melhor acessibilidade e previsibilidade de toque).
- `role="tablist"` e `role="tab"` com `aria-selected` e `aria-controls`.
- Estado ativo consistente por clique e por scroll (scroll spy).

Retorno rapido:
- Botao `Topo` fixo, aparece apos rolagem suficiente.

Indicador de posicao:
- Barra fina de progresso no topo indicando progresso de scroll (orientacao espacial).

Arquivos:
- HTML: `index.html`
- CSS: `assets/css/style.css`
- JS: `assets/js/main.js`

### 4) Micro-interacoes (Feedback Funcional)

Objetivo: resposta imediata sem chamar atencao para a animacao.

Inclui:
- Feedback de toque nos tabs (escala sutil em `:active`).
- Underline animado na tab ativa (discreto e consistente).
- Flash leve do titulo ao trocar categoria (orientacao e confirmacao visual).
- Animacao de entrada dos cards reduzida (curta e suave).

Respeito a acessibilidade:
- `prefers-reduced-motion` desabilita animacoes essenciais.

### 5) Performance UX (Percebida) E Scroll Fluido

Renderizacao progressiva:
- Estrutura das categorias (titulos) aparece imediatamente.
- Primeira categoria renderiza produtos de imediato (conteudo util acima da dobra).
- Demais categorias renderizam produtos sob demanda (IntersectionObserver).
- Ao clicar em uma categoria, a renderizacao e garantida antes de rolar.

Imagens:
- `decoding="async"` em imagens.
- `loading="eager"` e `fetchpriority="high"` apenas para imagens prioritarias acima da dobra.
- Demais imagens ficam `loading="lazy"`.

Scroll/Observers:
- Scroll spy e callbacks de scroll atualizam estado em batch via `requestAnimationFrame`.
- Evita churn de layout durante scroll, mantendo a sensacao de fluidez.

CSS de contencao:
- `content-visibility: auto` em secoes para reduzir custo fora da viewport.
- `contain: content` em cards para isolar layout/paint.

## Arquivos Alterados (Principais)

- `index.html`
  - Adicao do botao `Topo`
  - Adicao do indicador de progresso de scroll
- `assets/js/main.js`
  - Composicao de variantes (hero/horizontal/minimal)
  - Reordenacao de hierarquia (nome -> preco -> descricao)
  - Navegacao acessivel (tabs) + scroll spy
  - Renderizacao progressiva por categoria
  - Atualizacao de progresso e throttle via rAF
- `assets/css/style.css`
  - Estilos das variantes de card
  - Hierarquia tipografica (contraste/espacamento)
  - Micro-interacoes (active/underline/flash)
  - Botao `Topo`
  - Barra de progresso
  - Perf: `content-visibility`, `contain`, `prefers-reduced-motion`

## Como Validar (Checklist)

Mobile (emulacao ou dispositivo real):
- Abrir a pagina e ver conteudo util rapidamente (primeira categoria com produtos).
- Tabs de categoria: toque responde imediato e muda estado ativo.
- Trocar categoria: scroll vai para o local correto (offset header+nav).
- Em scroll: tab ativa acompanha a categoria atual sem ficar "pulando".
- Botao `Topo`: aparece depois de rolar, e retorna ao topo com 1 toque.
- Barra de progresso: avanca suavemente conforme rolagem.
- Cards: leitura deve ser instantanea (nome -> preco -> descricao).

Preferencias do sistema:
- `Reduced Motion` ligado: animacoes devem ser minimizadas.

Performance percebida:
- Scroll deve ser fluido (sem travar ao rolar em lista longa).
- Imagens devem carregar sob demanda (sem estourar rede inicial).

## Decisoes E Tradeoffs

- Mantivemos a variacao editorial, mas **controlada** para nao quebrar previsibilidade.
- Renderizacao progressiva reduz custo inicial e melhora "abre instantaneamente", com pequena complexidade no renderer.
- Barra de progresso e um indicador leve de orientacao; e puramente visual (`aria-hidden`).

## Proximos Passos (Opcional)

- Substituir placeholders de imagem por assets reais otimizados (WebP/AVIF) e tamanhos responsivos (`srcset`).
- Automatizar geracao de thumbnails (pipeline) para garantir proporcao consistente.
- Adicionar uma estrategia de cache (Service Worker) se o cardapio for usado offline/instavel.

