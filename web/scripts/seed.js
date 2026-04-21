require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase credentials missing!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const categories = [
    { id: 'cafes', name: 'Cafés' },
    { id: 'chocolates', name: 'Chocolates' },
    { id: 'sobremesas', name: 'Sobremesas' },
    { id: 'gelados', name: 'Gelados' },
    { id: 'sodas', name: 'Sodas' }
];

const products = [
    // Cafés
    {
        name: 'Café Expresso',
        description: 'Café expresso feito com grão arábica.',
        price: 'R$ 13,00',
        image: '/assets/img/espresso.png',
        featured: false,
        categoryId: 'cafes'
    },
    {
        name: 'Café Carioca',
        description: 'Café expresso menos intenso.',
        price: 'R$ 13,00',
        image: 'https://placehold.co/400x400/1e1e1e/c8a26a?text=Carioca',
        featured: false,
        categoryId: 'cafes'
    },
    {
        name: 'Café com Leite',
        description: 'Café expresso com leite vaporizado.',
        price: 'R$ 15,50',
        image: 'https://placehold.co/400x400/1e1e1e/c8a26a?text=Cafe+Leite',
        featured: false,
        categoryId: 'cafes'
    },
    {
        name: 'Canelinha',
        description: 'Café, leite vaporizado e canela em pó.',
        price: 'R$ 15,50',
        image: 'https://placehold.co/400x400/1e1e1e/c8a26a?text=Canelinha',
        featured: false,
        categoryId: 'cafes'
    },
    {
        name: 'Cappuccino Tradicional',
        description: 'Café expresso com leite, chocolate em lascas, acompanhado de chantilly.',
        price: 'R$ 21,90',
        image: '/assets/img/capuccino_tradicional.png',
        featured: false,
        categoryId: 'cafes'
    },
    {
        name: 'Cappuccino Língua de Gato',
        description: 'Café expresso com leite e chocolate em lascas. Acompanha uma deliciosa Língua de Gato e chantilly.',
        price: 'R$ 26,50',
        image: '/assets/img/capuccino_lingua_de_gato.png',
        featured: true,
        categoryId: 'cafes'
    },
    {
        name: 'Chocolate Quente',
        description: 'Chocolate quente saboroso feito a partir do melhor cacau.',
        price: 'R$ 16,50',
        image: '/assets/img/chocolate_quente.png',
        featured: false,
        categoryId: 'cafes'
    },
    {
        name: 'Chococcino',
        description: 'Bebida cremosa com leite vaporizado e lascas de chocolate ao leite.',
        price: 'R$ 21,90',
        image: '/assets/img/chococcino.png',
        featured: false,
        categoryId: 'cafes'
    },

    // Chocolates
    {
        name: 'Nhá Benta Tradicional',
        description: 'Marshmallow macio coberto com chocolate ao leite Kopenhagen.',
        price: 'R$ 18,90',
        image: '/assets/img/nha_benta_tradicional.png',
        featured: false,
        categoryId: 'chocolates'
    },

    // Sobremesas & Gelados
    {
        name: 'Mousse de Chocolate',
        description: 'Mousse preparado com o nosso delicioso chocolate Kopenhagen. (130g)',
        price: 'R$ 27,50',
        image: 'https://placehold.co/400x400/1e1e1e/c8a26a?text=Mousse',
        featured: false,
        categoryId: 'sobremesas'
    },
    {
        name: 'Brownie com Sorvete',
        description: 'Brownie Kopenhagen com sorvete Kop Krema. (215g)',
        price: 'R$ 40,50',
        image: 'https://placehold.co/400x400/1e1e1e/c8a26a?text=Brownie',
        featured: true,
        categoryId: 'sobremesas'
    },
    {
        name: 'Nhá Benta S\'mores',
        description: 'Nhá Benta com calda de chocolate, farofa de castanha e sorvete Kop Krema. (210g)',
        price: 'R$ 51,50',
        image: 'https://placehold.co/400x400/1e1e1e/c8a26a?text=Smores',
        featured: true,
        categoryId: 'sobremesas'
    },
    {
        name: 'Affogato',
        description: 'Sorvete Kop Krema, café expresso e Língua de Gato. (200g)',
        price: 'R$ 32,90',
        image: 'https://placehold.co/400x400/1e1e1e/c8a26a?text=Affogato',
        featured: false,
        categoryId: 'sobremesas'
    },


    // Gelados
    {
        name: 'Milkshake Língua de Gato',
        description: 'Baunilha, leite, chocolate ao leite, chantilly e Língua de Gato. (400ml)',
        price: 'R$ 39,50',
        image: 'https://placehold.co/400x400/1e1e1e/c8a26a?text=Milkshake+LG',
        featured: true,
        categoryId: 'gelados'
    },
    {
        name: 'Milkshake Pistache',
        description: 'Baunilha, trufa de pistache, creme de pistache e chantilly. (400ml)',
        price: 'R$ 39,50',
        image: 'https://placehold.co/400x400/1e1e1e/c8a26a?text=Milkshake+Pistache',
        featured: false,
        categoryId: 'gelados'
    },
    {
        name: 'Sundae Língua de Gato',
        description: 'Sorvete Kop Krema com calda de chocolate e Língua de Gato.',
        price: 'R$ 28,50',
        image: 'https://placehold.co/400x400/1e1e1e/c8a26a?text=Sundae',
        featured: false,
        categoryId: 'gelados'
    },
    {
        name: 'Kop Krema (Sorvete)',
        description: 'Sorvete cremoso Kopenhagen (Baunilha, Chocolate ou Misto). Sem nuts.',
        price: 'R$ 20,90',
        image: 'https://placehold.co/400x400/1e1e1e/c8a26a?text=Kop+Krema',
        featured: false,
        categoryId: 'gelados'
    },

    // Sodas
    {
        name: 'Soda Italiana',
        description: 'Sabores: Maçã verde, cranberry, limão siciliano ou pink lemonade. (400ml)',
        price: 'R$ 20,90',
        image: 'https://placehold.co/400x400/1e1e1e/c8a26a?text=Soda+Italiana',
        featured: false,
        categoryId: 'sodas'
    },
    {
        name: 'Iced Chococoffee',
        description: 'Café expresso, leite, chocolate ao leite, chantilly e gelo. (400ml)',
        price: 'R$ 32,90',
        image: 'https://placehold.co/400x400/1e1e1e/c8a26a?text=Iced+Coffee',
        featured: true,
        categoryId: 'sodas'
    },
    {
        name: 'Água',
        description: 'Com ou sem gás. (300ml)',
        price: 'R$ 9,90',
        image: 'https://placehold.co/400x400/1e1e1e/c8a26a?text=Agua',
        featured: false,
        categoryId: 'sodas'
    }
];

async function seed() {
    console.log('Starting seed...');

    const categoryMap = {};

    // 1. Insert Categories
    for (const cat of categories) {
        console.log(`Inserting category: ${cat.name}`);
        const { data, error } = await supabase
            .from('categories')
            .upsert({
                name: cat.name,
                slug: cat.id,
                order: categories.indexOf(cat)
            }, { onConflict: 'slug' })
            .select()
            .single();

        if (error) {
            console.error('Error inserting category:', error);
            continue;
        }
        categoryMap[cat.id] = data.id; // Map 'cafes' -> 'uuid...'
        console.log(`Category created: ${cat.name} -> ${data.id}`);
    }

    // 2. Insert Products
    for (const prod of products) {
        const catUuid = categoryMap[prod.categoryId];
        if (!catUuid) {
            console.error(`Category UUID not found for ${prod.categoryId}`);
            continue;
        }

        console.log(`Inserting product: ${prod.name}`);
        const { error } = await supabase
            .from('products')
            .upsert({
                name: prod.name,
                description: prod.description,
                price: prod.price,
                image_url: prod.image,
                category_id: catUuid,
                featured: prod.featured
            });

        if (error) console.error('Error inserting product:', error);
        else console.log(`Product created: ${prod.name}`);
    }

    console.log('Seed completed!');
}

seed();
