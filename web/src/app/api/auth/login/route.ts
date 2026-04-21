import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/index';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword, signToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email e senha são obrigatórios' },
                { status: 400 }
            );
        }

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

        const token = await signToken({ id: user.id, email: user.email });
        await setAuthCookie(token);

        return NextResponse.json({
            user: { id: user.id, email: user.email },
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}
