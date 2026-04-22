import { JWTPayload, SignJWT, jwtVerify } from 'jose';
import { compare, hash } from 'bcryptjs';
import { cookies } from 'next/headers';

const secret = process.env.JWT_SECRET;
if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be set and at least 32 characters long');
}
const JWT_SECRET = new TextEncoder().encode(secret);
const SESSION_TTL_SECONDS = 60 * 60 * 8;

export const AUTH_COOKIE_NAME = 'auth-token';
export type AuthRole = 'admin';

export interface AuthUser {
    id: string;
    email: string;
    role: AuthRole;
}

function isAuthUserPayload(payload: JWTPayload): payload is JWTPayload & AuthUser {
    return (
        typeof payload.id === 'string' &&
        typeof payload.email === 'string' &&
        payload.role === 'admin'
    );
}

export async function hashPassword(password: string): Promise<string> {
    return hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
}

export async function signToken(payload: AuthUser): Promise<string> {
    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
        .setIssuedAt()
        .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        if (!isAuthUserPayload(payload)) {
            return null;
        }

        return {
            id: payload.id,
            email: payload.email,
            role: payload.role,
        };
    } catch {
        return null;
    }
}

export async function getAuthUser(): Promise<AuthUser | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
}

export async function requireAuth(): Promise<AuthUser> {
    const user = await getAuthUser();
    if (!user) {
        throw new Error('Unauthorized');
    }
    return user;
}

export async function requireAdmin(): Promise<AuthUser> {
    const user = await requireAuth();
    if (user.role !== 'admin') {
        throw new Error('Forbidden');
    }

    return user;
}

export async function setAuthCookie(token: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: SESSION_TTL_SECONDS,
    });
}

export async function clearAuthCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE_NAME);
}
