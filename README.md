# Cardápio Digital Kopenhagen

Projeto de cardápio digital mobile-first para a Kopenhagen, acessível via QR Code.

## 📁 Estrutura do Projeto

```
kopenhagen-cardapio/
├── index.html              # Página principal
├── assets/
│   ├── css/
│   │   ├── variables.css   # Variáveis CSS (cores, espaçamentos)
│   │   └── style.css       # Estilos principais
│   ├── js/
│   │   ├── data.js         # Dados dos produtos
│   │   └── main.js         # Lógica da aplicação
│   └── img/
│       └── logo.svg        # Logo Kopenhagen
```

## 🚀 Como Visualizar

### Opção 1: Abrir diretamente no navegador
1. Navegue até a pasta `kopenhagen-cardapio`
2. Abra o arquivo `index.html` em um navegador

### Opção 2: Servidor Local (Recomendado)
```bash
cd kopenhagen-cardapio
python3 -m http.server 8000
```
Depois acesse: `http://localhost:8000`

## 🎨 Design

### Paleta de Cores (Brand Kopenhagen)
- **Background**: #f6f1e8 (off-white quente)
- **Surface**: #ffffff (branco)
- **Brand Red**: #9e1b32 (vermelho profundo)
- **Gold**: #c8a26a (dourado quente)
- **Text**: #2a1b12 (marrom chocolate)

### Tipografia
- **Headings**: Playfair Display (serif elegante)
- **Body**: Inter (sans-serif limpa)

## 📱 Funcionalidades

- ✅ Design mobile-first responsivo
- ✅ Navegação por categorias com scroll suave
- ✅ Scroll spy (destaque automático da categoria ativa)
- ✅ Animações sutis de entrada
- ✅ Layout premium e clean
- ✅ Performance otimizada

## 🔄 Como Atualizar o Cardápio

Edite o arquivo `assets/js/data.js`:

```javascript
const appData = {
    categories: [
        { id: 'cafes', name: 'Cafés' },
        // Adicione mais categorias...
    ],
    products: [
        {
            id: 1,
            categoryId: 'cafes',
            name: 'Nome do Produto',
            description: 'Descrição curta',
            price: 'R$ 00,00',
            image: 'url-da-imagem',
            featured: false
        },
        // Adicione mais produtos...
    ]
};
```

## 📦 Deploy

### GitHub Pages
1. Faça commit dos arquivos no repositório
2. Vá em Settings > Pages
3. Selecione a branch `main` e pasta `/root`
4. O site estará disponível em: `https://seuusuario.github.io/cardapiokop`

### Gerar QR Code
Use qualquer gerador de QR Code online com a URL do GitHub Pages.

## ✨ Princípios de Design Aplicados

Baseado no Mini Brand Book Kopenhagen:

- **Elegante**: Tipografia refinada, espaçamento generoso
- **Premium**: Cores sofisticadas, animações sutis
- **Clean**: Mínimo de elementos, máximo de clareza
- **Mobile-first**: Otimizado para uso em smartphone
- **Sensorial**: Foco no produto e na experiência

---

**Desenvolvido com base nas diretrizes de UX e Brand Book Kopenhagen**
