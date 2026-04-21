import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        await requireAuth();

        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json(
                { error: 'Nenhum arquivo enviado' },
                { status: 400 }
            );
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Tipo de arquivo não permitido. Use: JPG, PNG, WebP ou GIF' },
                { status: 400 }
            );
        }

        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'Arquivo muito grande. Máximo: 5MB' },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileExt = file.name.split('.').pop() || 'webp';
        const fileName = `${Date.now()}.${fileExt}`;

        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
        await mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);

        const url = `/uploads/products/${fileName}`;

        return NextResponse.json({ url });
    } catch (error: unknown) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }
        console.error('Error uploading file:', error);
        return NextResponse.json(
            { error: 'Erro ao fazer upload' },
            { status: 500 }
        );
    }
}
