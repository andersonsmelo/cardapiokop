// ==================== DADOS DO CARDÁPIO ====================
const menuData = {
    categories: [
        { id: 'cafes', name: 'Cafés' },
        { id: 'chocolates', name: 'Chocolates' },
        { id: 'sobremesas', name: 'Sobremesas' },
        { id: 'gelados', name: 'Gelados' }
    ],
    products: [
        // CAFÉS
        {
            category: 'cafes',
            name: 'Espresso Kop',
            description: 'Café espresso encorpado e aromático',
            price: 'R$ 9,90',
            size: '50ml',
            image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=400&fit=crop&q=80',
            featured: false
        },
        {
            category: 'cafes',
            name: 'Cappuccino Língua de Gato',
            description: 'Cappuccino premium com pedaços de Língua de Gato e chantilly',
            price: 'R$ 26,50',
            size: '150ml',
            image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&h=600&fit=crop&q=80',
            featured: true
        },
        {
            category: 'cafes',
            name: 'Café com Leite',
            description: 'Café espresso com leite vaporizado',
            price: 'R$ 15,50',
            size: '150ml',
            image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop&q=80',
            featured: false
        },
        {
            category: 'cafes',
            name: 'Capuccino Tradicional',
            description: 'Café espresso com leite, chocolate em lascas e chantilly',
            price: 'R$ 21,90',
            size: '150ml',
            image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=400&fit=crop&q=80',
            featured: false
        },
        // CHOCOLATES
        {
            category: 'chocolates',
            name: 'Nhá Benta Tradicional',
            description: 'Marshmallow macio coberto com chocolate ao leite',
            price: 'R$ 18,90',
            size: '30g',
            image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400&h=400&fit=crop&q=80',
            featured: false
        },
        {
            category: 'chocolates',
            name: 'Língua de Gato',
            description: 'O clássico chocolate ao leite em formato único',
            price: 'R$ 29,90',
            size: '100g',
            image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=400&fit=crop&q=80',
            featured: false
        },
        {
            category: 'chocolates',
            name: 'Trufa Mil Delícias',
            description: 'Diversos sabores de trufas artesanais para escolher',
            price: 'R$ 14,90',
            size: '12g',
            image: 'https://images.unsplash.com/photo-1606312619070-d48b4cde8e0f?w=400&h=400&fit=crop&q=80',
            featured: false
        },
        {
            category: 'chocolates',
            name: 'Bombom Soul Good',
            description: 'Bombom equilibrado e saudável com chocolate premium',
            price: 'R$ 19,90',
            size: '20g',
            image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=400&fit=crop&q=80',
            featured: false
        },
        // SOBREMESAS
        {
            category: 'sobremesas',
            name: 'Petit Gâteau',
            description: 'Bolo de chocolate quente com recheio cremoso e sorvete de creme',
            price: 'R$ 34,90',
            size: '215g',
            image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&h=600&fit=crop&q=80',
            featured: true
        },
        {
            category: 'sobremesas',
            name: 'Mousse de Chocolate',
            description: 'Mousse cremoso preparado com chocolate Kopenhagen',
            price: 'R$ 27,50',
            size: '130g',
            image: 'https://images.unsplash.com/photo-1541599468348-e96984315921?w=400&h=400&fit=crop&q=80',
            featured: false
        },
        {
            category: 'sobremesas',
            name: 'Brownie com Sorvete',
            description: 'Brownie Kopenhagen quentinho com sorvete Kop Krema',
            price: 'R$ 40,50',
            size: '215g',
            image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400&h=400&fit=crop&q=80',
            featured: false
        },
        {
            category: 'sobremesas',
            name: 'Affogato',
            description: 'Sorvete Kop Krema, café espresso e Língua de Gato',
            price: 'R$ 32,90',
            size: '200g',
            image: 'https://images.unsplash.com/photo-1514849302-984523450cf4?w=400&h=400&fit=crop&q=80',
            featured: false
        },
        // GELADOS
        {
            category: 'gelados',
            name: 'Milkshake Língua de Gato',
            description: 'Milkshake de baunilha, leite e chocolate ao leite com Língua de Gato',
            price: 'R$ 39,50',
            size: '400ml',
            image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=400&fit=crop&q=80',
            featured: false
        },
        {
            category: 'gelados',
            name: 'Sundae Língua de Gato',
            description: 'Sorvete Kop Krema com calda de chocolate e Língua de Gato',
            price: 'R$ 28,50',
            size: '200g',
            image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop&q=80',
            featured: false
        },
        {
            category: 'gelados',
            name: 'Milkshake de Pistache',
            description: 'Milkshake de baunilha batido com trufa de pistache e creme',
            price: 'R$ 39,50',
            size: '400ml',
            image: 'https://images.unsplash.com/photo-1625869016774-3a92be2ae2cd?w=400&h=400&fit=crop&q=80',
            featured: false
        },
        {
            category: 'gelados',
            name: 'Kop Krema Língua de Gato',
            description: 'Casquinha black com sorvete e uma deliciosa Língua de Gato',
            price: 'R$ 20,90',
            size: '120g',
            image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=400&fit=crop&q=80',
            featured: false
        }
    ]
};

// ==================== RENDERIZAR NAVEGAÇÃO ====================
function renderNav() {
    const navList = document.getElementById('navList');
    menuData.categories.forEach((cat, index) => {
        const btn = document.createElement('button');
        btn.className = `nav-item ${index === 0 ? 'active' : ''}`;
        btn.textContent = cat.name;
        btn.dataset.category = cat.id;
        btn.onclick = () => scrollToCategory(cat.id);
        navList.appendChild(btn);
    });
}

// ==================== RENDERIZAR PRODUTOS ====================
function renderProducts() {
    const content = document.getElementById('content');

    menuData.categories.forEach(category => {
        const products = menuData.products.filter(p => p.category === category.id);
        if (!products.length) return;

        // Section
        const section = document.createElement('section');
        section.id = category.id;
        section.className = 'category';

        // Header
        const header = document.createElement('div');
        header.className = 'category-header';
        header.innerHTML = `
            <h2 class="category-title">${category.name}</h2>
            <div class="category-divider"></div>
        `;
        section.appendChild(header);

        // Grid
        const grid = document.createElement('div');
        grid.className = 'products-grid';

        products.forEach(product => {
            const card = document.createElement('article');
            card.className = `product ${product.featured ? 'featured' : ''}`;

            card.innerHTML = `
                ${product.featured ? '<div class="featured-badge">Destaque</div>' : ''}
                <div class="product-content">
                    <div class="product-image-container">
                        <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                    </div>
                    <div class="product-details">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-description">${product.description}</p>
                        <div class="product-footer">
                            <span class="product-price">${product.price}</span>
                            <span class="product-size">${product.size || ''}</span>
                        </div>
                    </div>
                </div>
            `;

            grid.appendChild(card);
        });

        section.appendChild(grid);
        content.appendChild(section);
    });
}

// ==================== SCROLL TO CATEGORY ====================
function scrollToCategory(categoryId) {
    const element = document.getElementById(categoryId);
    if (!element) return;

    const headerHeight = 140;
    const elementTop = element.offsetTop - headerHeight;

    window.scrollTo({
        top: elementTop,
        behavior: 'smooth'
    });
}

// ==================== SCROLL SPY ====================
function setupScrollSpy() {
    const sections = document.querySelectorAll('.category');
    const navItems = document.querySelectorAll('.nav-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const categoryId = entry.target.id;

                navItems.forEach(item => {
                    const isActive = item.dataset.category === categoryId;
                    item.classList.toggle('active', isActive);
                });

                // Scroll horizontal suave do nav
                const activeBtn = document.querySelector(`.nav-item[data-category="${categoryId}"]`);
                if (activeBtn) {
                    activeBtn.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'center'
                    });
                }
            }
        });
    }, {
        rootMargin: '-140px 0px -60% 0px',
        threshold: 0
    });

    sections.forEach(section => observer.observe(section));
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    renderNav();
    renderProducts();
    setupScrollSpy();
});
