import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const token = request.cookies.get('auth-token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            const user = await verifyToken(token);
            if (!user) {
                return NextResponse.redirect(new URL('/login', request.url));
            }
        } catch {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
