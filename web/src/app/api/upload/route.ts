import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { randomUUID } from 'crypto';
import path from 'path';

type AllowedImageFormat = 'jpg' | 'png' | 'webp' | 'gif';

function startsWithSignature(bytes: Uint8Array, signature: number[]) {
    return signature.every((value, index) => bytes[index] === value);
}

function detectImageFormat(bytes: Uint8Array): AllowedImageFormat | null {
    if (bytes.length >= 3 && startsWithSignature(bytes, [0xff, 0xd8, 0xff])) {
        return 'jpg';
    }

    if (bytes.length >= 8 && startsWithSignature(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
        return 'png';
    }

    if (
        bytes.length >= 12 &&
        startsWithSignature(bytes, [0x52, 0x49, 0x46, 0x46]) &&
        startsWithSignature(bytes.slice(8, 12), [0x57, 0x45, 0x42, 0x50])
    ) {
        return 'webp';
    }

    if (bytes.length >= 6) {
        const header = String.fromCharCode(...bytes.slice(0, 6));
        if (header === 'GIF87a' || header === 'GIF89a') {
            return 'gif';
        }
    }

    return null;
}

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

        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'Arquivo muito grande. Máximo: 5MB' },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const imageFormat = detectImageFormat(new Uint8Array(buffer));

        if (!imageFormat) {
            return NextResponse.json(
                { error: 'Arquivo inválido. Use uma imagem JPG, PNG, WebP ou GIF válida.' },
                { status: 400 }
            );
        }

        const fileName = `${randomUUID()}.${imageFormat}`;

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
