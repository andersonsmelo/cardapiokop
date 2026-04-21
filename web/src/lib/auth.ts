import { SignJWT, jwtVerify } from 'jose';
import { compare, hash } from 'bcryptjs';
import { cookies } from 'next/headers';

const secret = process.env.JWT_SECRET;
if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be set and at least 32 characters long');
}
const JWT_SECRET = new TextEncoder().encode(secret);
const COOKIE_NAME = 'auth-token';

export async function hashPassword(password: string): Promise<string> {
    return hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
}

export async function signToken(payload: { id: string; email: string }): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('24h')
        .setIssuedAt()
        .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<{ id: string; email: string } | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as unknown as { id: string; email: string };
    } catch {
        return null;
    }
}

export async function getAuthUser(): Promise<{ id: string; email: string } | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
}

export async function requireAuth(): Promise<{ id: string; email: string }> {
    const user = await getAuthUser();
    if (!user) {
        throw new Error('Unauthorized');
    }
    return user;
}

export async function setAuthCookie(token: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24, // 24 hours
    });
}

export async function clearAuthCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}
