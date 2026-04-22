import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        const user = await verifyToken(token);
        if (!user || user.role !== 'admin') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
