import { NextRequest } from 'next/server';

export function isAllowedOrigin(origin: string | null, expectedOrigin: string) {
    return origin === expectedOrigin;
}

export function getExpectedOrigin(request: NextRequest) {
    return process.env.APP_ORIGIN ?? request.nextUrl.origin;
}

export function getClientIp(request: NextRequest) {
    return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        ?? request.headers.get('x-real-ip')
        ?? 'unknown';
}

export function assertAllowedOrigin(request: NextRequest) {
    const expectedOrigin = getExpectedOrigin(request);
    const origin = request.headers.get('origin');
    if (!isAllowedOrigin(origin, expectedOrigin)) {
        throw new Error('FORBIDDEN_ORIGIN');
    }
}
