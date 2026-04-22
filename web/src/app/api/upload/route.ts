import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { assertAllowedOrigin, getClientIp } from '@/lib/request-security';
import { takeRateLimitHit } from '@/lib/rate-limit';
import { buildProductUploadPath, detectImageFormat, sanitizeImageBuffer } from '@/lib/upload';
import { writeFile, mkdir } from 'fs/promises';
import { randomUUID } from 'crypto';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        await requireAdmin();
        assertAllowedOrigin(request);

        const ip = getClientIp(request);
        const rateLimit = takeRateLimitHit(`upload:${ip}`, 10, 60_000);
        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: 'Muitos uploads. Tente novamente em 1 minuto.' },
                { status: 429 }
            );
        }

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
                { error: 'Arquivo inválido. Use JPG, PNG ou WebP.' },
                { status: 400 }
            );
        }

        const sanitizedBuffer = await sanitizeImageBuffer(buffer);
        const upload = buildProductUploadPath(process.cwd(), randomUUID());
        await mkdir(path.dirname(upload.filePath), { recursive: true });
        await writeFile(upload.filePath, sanitizedBuffer);

        return NextResponse.json({ url: upload.publicUrl }, { status: 201 });
    } catch (error: unknown) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }
        if (error instanceof Error && error.message === 'Forbidden') {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
        }
        if (error instanceof Error && error.message === 'FORBIDDEN_ORIGIN') {
            return NextResponse.json({ error: 'Origem não permitida' }, { status: 403 });
        }
        if (error instanceof Error && error.message === 'APP_ORIGIN_NOT_CONFIGURED') {
            return NextResponse.json({ error: 'Configuração de origem ausente' }, { status: 500 });
        }
        if (error instanceof Error) {
            const message = error.message.toLowerCase();
            if (message.includes('input buffer') || message.includes('unsupported image format') || message.includes('corrupt')) {
                return NextResponse.json(
                    { error: 'Arquivo inválido. Não foi possível processar a imagem.' },
                    { status: 400 }
                );
            }
        }
        console.error('Error uploading file:', error);
        return NextResponse.json(
            { error: 'Erro ao fazer upload' },
            { status: 500 }
        );
    }
}
