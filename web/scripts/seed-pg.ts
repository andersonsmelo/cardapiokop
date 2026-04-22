import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { hash } from 'bcryptjs';
import { users, categories, products } from '../src/db/schema';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    console.error('DATABASE_URL not set');
    process.exit(1);
}

const client = postgres(connectionString);
const db = drizzle(client);

const categoriesData = [
    { slug: 'cafes', name: 'Cafés', order: 0 },
    { slug: 'chocolates', name: 'Chocolates', order: 1 },
    { slug: 'sobremesas', name: 'Sobremesas', order: 2 },
    { slug: 'gelados', name: 'Gelados', order: 3 },
    { slug: 'sodas', name: 'Sodas', order: 4 },
];

const productsData = [
    // Cafés
    { name: 'Café Expresso', description: 'Café expresso feito com grão arábica.', price: 'R$ 13,00', image_url: '/assets/img/espresso.webp', featured: false, categorySlug: 'cafes' },
    { name: 'Café Carioca', description: 'Café expresso menos intenso.', price: 'R$ 13,00', image_url: '/assets/img/placeholder_product.webp', featured: false, categorySlug: 'cafes' },
    { name: 'Café com Leite', description: 'Café expresso com leite vaporizado.', price: 'R$ 15,50', image_url: '/assets/img/placeholder_product.webp', featured: false, categorySlug: 'cafes' },
    { name: 'Canelinha', description: 'Café, leite vaporizado e canela em pó.', price: 'R$ 15,50', image_url: '/assets/img/placeholder_product.webp', featured: false, categorySlug: 'cafes' },
    { name: 'Cappuccino Tradicional', description: 'Café expresso com leite, chocolate em lascas, acompanhado de chantilly.', price: 'R$ 21,90', image_url: '/assets/img/capuccino_tradicional.webp', featured: false, categorySlug: 'cafes' },
    { name: 'Cappuccino Língua de Gato', description: 'Café expresso com leite e chocolate em lascas. Acompanha uma deliciosa Língua de Gato e chantilly.', price: 'R$ 26,50', image_url: '/assets/img/capuccino_lingua_de_gato.png', featured: true, categorySlug: 'cafes' },
    { name: 'Chocolate Quente', description: 'Chocolate quente saboroso feito a partir do melhor cacau.', price: 'R$ 16,50', image_url: '/assets/img/chocolate_quente.webp', featured: false, categorySlug: 'cafes' },
    { name: 'Chococcino', description: 'Bebida cremosa com leite vaporizado e lascas de chocolate ao leite.', price: 'R$ 21,90', image_url: '/assets/img/chococcino.webp', featured: false, categorySlug: 'cafes' },
    // Chocolates
    { name: 'Nhá Benta Tradicional', description: 'Marshmallow macio coberto com chocolate ao leite Kopenhagen.', price: 'R$ 18,90', image_url: '/assets/img/nha_benta_tradicional.webp', featured: false, categorySlug: 'chocolates' },
    // Sobremesas
    { name: 'Mousse de Chocolate', description: 'Mousse preparado com o nosso delicioso chocolate Kopenhagen. (130g)', price: 'R$ 27,50', image_url: '/assets/img/placeholder_product.webp', featured: false, categorySlug: 'sobremesas' },
    { name: 'Brownie com Sorvete', description: 'Brownie Kopenhagen com sorvete Kop Krema. (215g)', price: 'R$ 40,50', image_url: '/assets/img/placeholder_product.webp', featured: true, categorySlug: 'sobremesas' },
    { name: 'Nhá Benta S\'mores', description: 'Nhá Benta com calda de chocolate, farofa de castanha e sorvete Kop Krema. (210g)', price: 'R$ 51,50', image_url: '/assets/img/placeholder_product.webp', featured: true, categorySlug: 'sobremesas' },
    { name: 'Affogato', description: 'Sorvete Kop Krema, café expresso e Língua de Gato. (200g)', price: 'R$ 32,90', image_url: '/assets/img/placeholder_product.webp', featured: false, categorySlug: 'sobremesas' },

    // Gelados
    { name: 'Milkshake Língua de Gato', description: 'Baunilha, leite, chocolate ao leite, chantilly e Língua de Gato. (400ml)', price: 'R$ 39,50', image_url: '/assets/img/placeholder_product.webp', featured: true, categorySlug: 'gelados' },
    { name: 'Milkshake Pistache', description: 'Baunilha, trufa de pistache, creme de pistache e chantilly. (400ml)', price: 'R$ 39,50', image_url: '/assets/img/placeholder_product.webp', featured: false, categorySlug: 'gelados' },
    { name: 'Sundae Língua de Gato', description: 'Sorvete Kop Krema com calda de chocolate e Língua de Gato.', price: 'R$ 28,50', image_url: '/assets/img/placeholder_product.webp', featured: false, categorySlug: 'gelados' },
    { name: 'Kop Krema (Sorvete)', description: 'Sorvete cremoso Kopenhagen (Baunilha, Chocolate ou Misto). Sem nuts.', price: 'R$ 20,90', image_url: '/assets/img/placeholder_product.webp', featured: false, categorySlug: 'gelados' },
    // Sodas
    { name: 'Soda Italiana', description: 'Sabores: Maçã verde, cranberry, limão siciliano ou pink lemonade. (400ml)', price: 'R$ 20,90', image_url: '/assets/img/placeholder_product.webp', featured: false, categorySlug: 'sodas' },
    { name: 'Iced Chococoffee', description: 'Café expresso, leite, chocolate ao leite, chantilly e gelo. (400ml)', price: 'R$ 32,90', image_url: '/assets/img/placeholder_product.webp', featured: true, categorySlug: 'sodas' },
    { name: 'Água', description: 'Com ou sem gás. (300ml)', price: 'R$ 9,90', image_url: '/assets/img/placeholder_product.webp', featured: false, categorySlug: 'sodas' },
];

async function seed() {
    console.log('🌱 Starting seed...\n');

    // 1. Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@kopenhagen.com';
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword || adminPassword.length < 8) {
        console.error('❌ ADMIN_PASSWORD must be set and have at least 8 characters');
        process.exit(1);
    }
    const passwordHash = await hash(adminPassword, 12);

    console.log('👤 Creating admin user...');
    await db.insert(users).values({
        email: adminEmail,
        passwordHash,
    }).onConflictDoNothing();
    console.log(`   Email: ${adminEmail}`);
    console.log('   Password: <not printed>\n');

    // 2. Insert categories
    console.log('📂 Inserting categories...');
    const insertedCategories = await db.insert(categories).values(categoriesData)
        .onConflictDoNothing()
        .returning();

    // If categories already existed, fetch them
    const allCategories = insertedCategories.length > 0
        ? insertedCategories
        : await db.select().from(categories);

    const categoryMap = new Map(allCategories.map(c => [c.slug, c.id]));
    console.log(`   ${allCategories.length} categories ready\n`);

    // 3. Clear existing products (if any) to prevent duplicates
    console.log('🧹 Clearing existing products...');
    await db.delete(products);

    // 4. Insert products
    console.log('🍫 Inserting products...');
    const productsToInsert = [];
    
    for (const prod of productsData) {
        const categoryId = categoryMap.get(prod.categorySlug);
        if (!categoryId) {
            console.error(`   ❌ Category not found: ${prod.categorySlug}`);
            continue;
        }

        productsToInsert.push({
            name: prod.name,
            description: prod.description,
            price: prod.price,
            imageUrl: prod.image_url,
            categoryId,
            featured: prod.featured,
        });
    }
    
    if (productsToInsert.length > 0) {
        await db.insert(products).values(productsToInsert);
        console.log(`   ${productsToInsert.length} products inserted\n`);
    }

    console.log('✅ Seed completed!');
    await client.end();
    process.exit(0);
}

seed().catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
