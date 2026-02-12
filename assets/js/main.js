document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    renderNavigation();
    renderProducts();
    setupScrollSpy();
}

function renderNavigation() {
    const navContainer = document.getElementById('categoryNav');

    appData.categories.forEach((cat, index) => {
        const btn = document.createElement('div');
        btn.className = `nav-item ${index === 0 ? 'active' : ''}`;
        btn.textContent = cat.name;
        btn.dataset.target = cat.id;

        btn.addEventListener('click', () => {
            scrollToCategory(cat.id);
            setActiveTab(btn);
        });

        navContainer.appendChild(btn);
    });
}

function renderProducts() {
    const appContainer = document.getElementById('app');

    // Group products by category
    appData.categories.forEach(cat => {
        const productsInCat = appData.products.filter(p => p.categoryId === cat.id);

        if (productsInCat.length === 0) return;

        const section = document.createElement('section');
        section.id = cat.id;
        section.className = 'category-section';

        const title = document.createElement('h2');
        title.className = 'category-title';
        title.textContent = cat.name;
        section.appendChild(title);

        productsInCat.forEach((product, index) => {
            const card = createProductCard(product, index);
            section.appendChild(card);
        });

        appContainer.appendChild(section);
    });
}

function createProductCard(product, index = 0) {
    const card = document.createElement('article');
    card.className = `product-card ${product.featured ? 'featured' : ''}`;

    // Staggered animation delay
    card.style.animationDelay = `${index * 0.1}s`;

    card.innerHTML = `
        <div class="card__media">
            <img src="${product.image}" 
                 alt="${product.name}" 
                 loading="lazy"
                 width="110" 
                 height="110">
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-desc">${product.description}</p>
            <span class="product-price">${product.price}</span>
        </div>
    `;

    return card;
}

function scrollToCategory(id) {
    const element = document.getElementById(id);
    if (element) {
        const headerHeight = 110; // Approx header + nav height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
}

function setActiveTab(activeBtn) {
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');

    // Scroll nav to keep active item in view
    activeBtn.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
    });
}

function setupScrollSpy() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.category-section');

    const observerOptions = {
        root: null,
        rootMargin: '-120px 0px -70% 0px', // Trigger when section is near top
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                const activeBtn = document.querySelector(`.nav-item[data-target="${id}"]`);
                if (activeBtn) {
                    setActiveTab(activeBtn);
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}
