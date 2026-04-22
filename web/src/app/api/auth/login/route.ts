import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/index';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword, signToken, setAuthCookie } from '@/lib/auth';
import { takeRateLimitHit } from '@/lib/rate-limit';
import { assertAllowedOrigin, getClientIp } from '@/lib/request-security';
import { formatValidationError, LoginSchema } from '@/lib/validation';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
    try {
        assertAllowedOrigin(request);

        const ip = getClientIp(request);
        const rateLimit = takeRateLimitHit(`login:${ip}`, 5, 60_000);

        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: 'Muitas tentativas. Tente novamente em 1 minuto.' },
                { status: 429 }
            );
        }

        const { email, password } = LoginSchema.parse(await request.json());

        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (!user) {
            return NextResponse.json(
                { error: 'Credenciais inválidas' },
                { status: 401 }
            );
        }

        const isValid = await verifyPassword(password, user.passwordHash);
        if (!isValid) {
            return NextResponse.json(
                { error: 'Credenciais inválidas' },
                { status: 401 }
            );
        }

        const role = 'role' in user && user.role === 'admin' ? user.role : 'admin';

        const token = await signToken({
            id: user.id,
            email: user.email,
            role,
        });
        await setAuthCookie(token);

        return NextResponse.json({
            user: { id: user.id, email: user.email, role },
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(formatValidationError(error), { status: 400 });
        }

        if (error instanceof SyntaxError) {
            return NextResponse.json(
                { error: 'Payload inválido' },
                { status: 400 }
            );
        }

        if (error instanceof Error && error.message === 'FORBIDDEN_ORIGIN') {
            return NextResponse.json(
                { error: 'Origem inválida' },
                { status: 403 }
            );
        }

        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}
