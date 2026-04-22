import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/index';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth';
import {
    formatValidationError,
    ProductPayloadSchema,
    UuidParamSchema,
} from '@/lib/validation';
import { ZodError } from 'zod';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = UuidParamSchema.parse(await params);

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
        if (error instanceof ZodError) {
            return NextResponse.json(formatValidationError(error), { status: 400 });
        }

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
        await requireAdmin();
        const { id } = UuidParamSchema.parse(await params);
        const { name, description, price, image_url, category_id, featured } =
            ProductPayloadSchema.parse(await request.json());

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
        if (error instanceof ZodError) {
            return NextResponse.json(formatValidationError(error), { status: 400 });
        }

        if (error instanceof SyntaxError) {
            return NextResponse.json(
                { error: 'Payload inválido' },
                { status: 400 }
            );
        }

        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }
        if (error instanceof Error && error.message === 'Forbidden') {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
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
        await requireAdmin();
        const { id } = UuidParamSchema.parse(await params);

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
        if (error instanceof ZodError) {
            return NextResponse.json(formatValidationError(error), { status: 400 });
        }

        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }
        if (error instanceof Error && error.message === 'Forbidden') {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
        }
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { error: 'Erro ao excluir produto' },
            { status: 500 }
        );
    }
}
