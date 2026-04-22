import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';
import { assertAllowedOrigin } from '@/lib/request-security';

export async function POST(request: NextRequest) {
    try {
        assertAllowedOrigin(request);
        await clearAuthCookie();
        return NextResponse.json({ success: true });
    } catch (error) {
        if (error instanceof Error && error.message === 'FORBIDDEN_ORIGIN') {
            return NextResponse.json({ error: 'Origem inválida' }, { status: 403 });
        }

        return NextResponse.json({ error: 'Erro ao encerrar sessão' }, { status: 500 });
    }
}
