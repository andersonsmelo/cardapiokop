import { db } from '@/db/index';
import { categories, products } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export interface Category {
    id: string;
    slug: string;
    name: string;
    order: number;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: string;
    image: string;
    featured: boolean;
    categoryId: string;
}

export async function getCategories(): Promise<Category[]> {
    try {
        const data = await db
            .select()
            .from(categories)
            .orderBy(asc(categories.order));

        return data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

export async function getCategory(slug: string): Promise<Category | null> {
    try {
        const [data] = await db
            .select()
            .from(categories)
            .where(eq(categories.slug, slug))
            .limit(1);

        return data || null;
    } catch (error) {
        console.error(`Error fetching category ${slug}:`, error);
        return null;
    }
}

export async function getProducts(categoryId: string): Promise<Product[]> {
    try {
        const data = await db
            .select()
            .from(products)
            .where(eq(products.categoryId, categoryId))
            .orderBy(asc(products.name));

        return data.map((p) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: p.price,
            image: p.imageUrl || '',
            featured: p.featured,
            categoryId: p.categoryId,
        }));
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}
