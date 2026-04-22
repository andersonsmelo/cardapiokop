import { NextRequest } from 'next/server';

export function isAllowedOrigin(origin: string | null, expectedOrigin: string) {
    return origin === expectedOrigin;
}

export function getClientIp(request: NextRequest) {
    return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        ?? request.headers.get('x-real-ip')
        ?? 'unknown';
}

export function assertAllowedOrigin(request: NextRequest) {
    const expectedOrigin = process.env.APP_ORIGIN;
    if (!expectedOrigin) {
        throw new Error('APP_ORIGIN_NOT_CONFIGURED');
    }

    const origin = request.headers.get('origin');
    if (!isAllowedOrigin(origin, expectedOrigin)) {
        throw new Error('FORBIDDEN_ORIGIN');
    }
}
