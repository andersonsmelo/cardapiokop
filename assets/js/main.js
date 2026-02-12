document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

const EDITORIAL_CONFIG = {
    longListThreshold: 6,
    minimalInterval: 5
};

let productsByCategoryId = new Map();
let categoryRenderObserver = null;

function initApp() {
    renderNavigation();
    renderProducts();
    setupScrollSpy();
    setupBackToTop();
    setupProgressiveCategoryRendering();
}

function renderNavigation() {
    const navContainer = document.getElementById('categoryNav');
    navContainer.setAttribute('role', 'tablist');
    navContainer.setAttribute('aria-label', 'Categorias do cardápio');

    appData.categories.forEach((cat, index) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `nav-item ${index === 0 ? 'active' : ''}`;
        btn.textContent = cat.name;
        btn.dataset.target = cat.id;
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
        btn.setAttribute('aria-controls', cat.id);

        btn.addEventListener('click', () => {
            ensureCategoryRendered(cat.id);
            scrollToCategory(cat.id);
            setActiveTab(btn, { scrollNavIntoView: true });
        });

        navContainer.appendChild(btn);
    });
}

function renderProducts() {
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = '';

    productsByCategoryId = buildProductsIndex();

    // Create all category sections fast (titles render immediately).
    // Products are rendered progressively as user scrolls / interacts.
    let firstSectionRendered = false;
    appData.categories.forEach(cat => {
        const productsInCat = productsByCategoryId.get(cat.id) || [];

        if (productsInCat.length === 0) return;

        const section = document.createElement('section');
        section.id = cat.id;
        section.className = 'category-section';
        section.dataset.rendered = 'false';

        const title = document.createElement('h2');
        title.className = 'category-title';
        title.textContent = cat.name;
        section.appendChild(title);

        // Above-the-fold content: render first category immediately for instant usefulness.
        if (!firstSectionRendered) {
            renderCategoryProducts(section, productsInCat, { priorityImages: true });
            firstSectionRendered = true;
        }

        appContainer.appendChild(section);
    });
}

function buildProductsIndex() {
    const index = new Map();
    for (const cat of appData.categories) {
        index.set(
            cat.id,
            appData.products.filter(p => p.categoryId === cat.id)
        );
    }
    return index;
}

function renderCategoryProducts(section, productsInCat, { priorityImages = false } = {}) {
    if (!section || section.dataset.rendered === 'true') return;

    const fragment = document.createDocumentFragment();
    productsInCat.forEach((product, index) => {
        const variant = getEditorialVariant(product, index, productsInCat.length);
        const isPriority = priorityImages && index < 2;
        const card = createProductCard(product, variant, index, { priorityImage: isPriority });
        fragment.appendChild(card);
    });

    section.appendChild(fragment);
    section.dataset.rendered = 'true';
}

function ensureCategoryRendered(categoryId) {
    const section = document.getElementById(categoryId);
    if (!section) return;
    if (section.dataset.rendered === 'true') return;

    const productsInCat = productsByCategoryId.get(categoryId) || [];
    renderCategoryProducts(section, productsInCat);
}

function setupProgressiveCategoryRendering() {
    if (categoryRenderObserver) {
        categoryRenderObserver.disconnect();
        categoryRenderObserver = null;
    }

    const sections = document.querySelectorAll('.category-section');
    if (sections.length === 0) return;

    categoryRenderObserver = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                ensureCategoryRendered(entry.target.id);
            }
        },
        {
            root: null,
            rootMargin: '700px 0px',
            threshold: 0.01
        }
    );

    sections.forEach(section => categoryRenderObserver.observe(section));
}

function getEditorialVariant(product, index, productsCount) {
    if (product.featured) {
        return 'hero';
    }

    // Keep flow predictable on mobile:
    // only first item can become hero when category has no featured item.
    if (index === 0) {
        return productsCount > 2 ? 'hero' : 'horizontal';
    }

    // Minimal card appears only in long lists to create subtle rhythm,
    // without compromising usability in short categories.
    if (
        productsCount >= EDITORIAL_CONFIG.longListThreshold &&
        index % EDITORIAL_CONFIG.minimalInterval === 0
    ) {
        return 'minimal';
    }

    return 'horizontal';
}

function escapeHtml(content) {
    const div = document.createElement('div');
    div.textContent = content || '';
    return div.innerHTML;
}

function createProductCard(product, variant = 'horizontal', index = 0, { priorityImage = false } = {}) {
    const card = document.createElement('article');
    card.className = `product-card product-card--${variant}`;
    card.dataset.variant = variant;

    // Staggered animation delay
    card.style.animationDelay = `${Math.min(index * 0.04, 0.24)}s`;

    const safeName = escapeHtml(product.name);
    const safeDescription = escapeHtml(product.description);
    const safePrice = escapeHtml(product.price);
    const safeImage = escapeHtml(product.image);

    if (variant === 'minimal') {
        card.innerHTML = `
            <div class="product-info">
                <h3 class="product-name">${safeName}</h3>
                <span class="product-price">${safePrice}</span>
                <p class="product-desc">${safeDescription}</p>
            </div>
        `;

        return card;
    }

    const loading = priorityImage ? 'eager' : 'lazy';
    const fetchpriorityAttr = priorityImage ? 'fetchpriority="high"' : '';
    card.innerHTML = `
        <div class="card__media">
            <img src="${safeImage}"
                 alt="${safeName}"
                 loading="${loading}"
                 decoding="async"
                 ${fetchpriorityAttr}
                 width="${variant === 'hero' ? '640' : '240'}"
                 height="${variant === 'hero' ? '460' : '240'}">
        </div>
        <div class="product-info">
            <h3 class="product-name">${safeName}</h3>
            <span class="product-price">${safePrice}</span>
            <p class="product-desc">${safeDescription}</p>
        </div>
    `;

    return card;
}

function scrollToCategory(id) {
    const element = document.getElementById(id);
    if (element) {
        const header = document.querySelector('.app-header');
        const nav = document.querySelector('.category-nav');
        const headerHeight = (header?.offsetHeight || 0) + (nav?.offsetHeight || 0) + 8;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });

        const title = element.querySelector('.category-title');
        if (title) {
            title.classList.remove('flash');
            // Force reflow to restart animation if user taps repeatedly.
            void title.offsetWidth;
            title.classList.add('flash');
            window.setTimeout(() => title.classList.remove('flash'), 260);
        }
    }
}

function setActiveTab(activeBtn, { scrollNavIntoView = true } = {}) {
    if (!activeBtn) return;

    const currentActive = document.querySelector('.nav-item.active');
    if (currentActive === activeBtn) return;

    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });
    activeBtn.classList.add('active');
    activeBtn.setAttribute('aria-selected', 'true');

    // Scroll nav to keep active item in view
    if (scrollNavIntoView) {
        activeBtn.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    }
}

function setupScrollSpy() {
    const sections = document.querySelectorAll('.category-section');
    if (sections.length === 0) return;

    let lastActiveId = null;
    let rafPending = false;

    const observerOptions = {
        root: null,
        rootMargin: '-140px 0px -55% 0px',
        threshold: [0, 0.2, 0.6]
    };

    const observer = new IntersectionObserver((entries) => {
        // Batch updates to avoid layout churn during scroll.
        if (rafPending) return;
        rafPending = true;

        window.requestAnimationFrame(() => {
            rafPending = false;

            // Pick the most visible intersecting entry.
            const visible = entries
                .filter(e => e.isIntersecting)
                .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];

            if (!visible) return;
            const id = visible.target.id;
            if (!id || id === lastActiveId) return;
            lastActiveId = id;

            const activeBtn = document.querySelector(`.nav-item[data-target="${id}"]`);
            if (activeBtn) {
                setActiveTab(activeBtn, { scrollNavIntoView: false });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

function setupBackToTop() {
    const button = document.getElementById('backToTop');
    if (!button) return;
    const progressBar = document.getElementById('scrollProgressBar');

    const toggleVisibility = () => {
        const shouldShow = window.scrollY > 520;
        button.classList.toggle('visible', shouldShow);
    };

    const updateProgress = () => {
        if (!progressBar) return;
        const doc = document.documentElement;
        const max = Math.max(1, doc.scrollHeight - window.innerHeight);
        const progress = Math.min(1, Math.max(0, window.scrollY / max));
        progressBar.style.setProperty('--scroll-progress', String(progress));
    };

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    let rafPending = false;
    window.addEventListener(
        'scroll',
        () => {
            if (rafPending) return;
            rafPending = true;
            window.requestAnimationFrame(() => {
                rafPending = false;
                toggleVisibility();
                updateProgress();
            });
        },
        { passive: true }
    );
    toggleVisibility();
    updateProgress();
}
