import { NextResponse } from 'next/server';
import { db } from '@/db/index';
import { categories } from '@/db/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
    try {
        const data = await db
            .select()
            .from(categories)
            .orderBy(asc(categories.order));

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar categorias' },
            { status: 500 }
        );
    }
}
