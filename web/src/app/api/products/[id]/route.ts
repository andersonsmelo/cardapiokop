import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/index';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const [product] = await db
            .select()
            .from(products)
            .where(eq(products.id, id))
            .limit(1);

        if (!product) {
            return NextResponse.json(
                { error: 'Produto não encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            image_url: product.imageUrl,
            category_id: product.categoryId,
            featured: product.featured,
            created_at: product.createdAt,
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar produto' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAuth();
        const { id } = await params;
        const body = await request.json();
        const { name, description, price, image_url, category_id, featured } = body;

        const [updated] = await db
            .update(products)
            .set({
                name,
                description,
                price,
                imageUrl: image_url,
                categoryId: category_id,
                featured,
            })
            .where(eq(products.id, id))
            .returning();

        if (!updated) {
            return NextResponse.json(
                { error: 'Produto não encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(updated);
    } catch (error: unknown) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }
        console.error('Error updating product:', error);
        return NextResponse.json(
            { error: 'Erro ao atualizar produto' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAuth();
        const { id } = await params;

        const [deleted] = await db
            .delete(products)
            .where(eq(products.id, id))
            .returning();

        if (!deleted) {
            return NextResponse.json(
                { error: 'Produto não encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { error: 'Erro ao excluir produto' },
            { status: 500 }
        );
    }
}
