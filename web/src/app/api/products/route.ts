import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/index';
import { products, categories } from '@/db/schema';
import { eq, desc, asc } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('category_id');
        const sort = searchParams.get('sort');

        let query = db
            .select({
                id: products.id,
                name: products.name,
                description: products.description,
                price: products.price,
                image_url: products.imageUrl,
                category_id: products.categoryId,
                featured: products.featured,
                created_at: products.createdAt,
                category_name: categories.name,
            })
            .from(products)
            .leftJoin(categories, eq(products.categoryId, categories.id));

        if (categoryId) {
            query = query.where(eq(products.categoryId, categoryId)) as typeof query;
        }

        if (sort === 'name') {
            query = query.orderBy(asc(products.name)) as typeof query;
        } else {
            query = query.orderBy(desc(products.createdAt)) as typeof query;
        }

        const data = await query;

        const formatted = data.map((row) => ({
            id: row.id,
            name: row.name,
            description: row.description,
            price: row.price,
            image_url: row.image_url,
            category_id: row.category_id,
            featured: row.featured,
            created_at: row.created_at,
            categories: row.category_name ? { name: row.category_name } : null,
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar produtos' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await requireAuth();

        const body = await request.json();
        const { name, description, price, image_url, category_id, featured } = body;

        const [newProduct] = await db
            .insert(products)
            .values({
                name,
                description,
                price,
                imageUrl: image_url,
                categoryId: category_id,
                featured: featured ?? false,
            })
            .returning();

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error: unknown) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }
        console.error('Error creating product:', error);
        return NextResponse.json(
            { error: 'Erro ao criar produto' },
            { status: 500 }
        );
    }
}
