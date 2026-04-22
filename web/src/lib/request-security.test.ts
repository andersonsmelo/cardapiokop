import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it } from 'vitest';
import { getExpectedOrigin, isAllowedOrigin } from './request-security';

describe('isAllowedOrigin', () => {
    it('accepts the configured application origin', () => {
        expect(isAllowedOrigin('https://cardapiokop.example.com', 'https://cardapiokop.example.com')).toBe(true);
    });

    it('rejects a different origin', () => {
        expect(isAllowedOrigin('https://evil.example', 'https://cardapiokop.example.com')).toBe(false);
    });
});

describe('getExpectedOrigin', () => {
    afterEach(() => {
        delete process.env.APP_ORIGIN;
    });

    it('prefers APP_ORIGIN when configured', () => {
        process.env.APP_ORIGIN = 'https://cardapiokop.example.com';
        const request = new NextRequest('http://127.0.0.1:3002/api/auth/logout');

        expect(getExpectedOrigin(request)).toBe('https://cardapiokop.example.com');
    });

    it('falls back to the current request origin when APP_ORIGIN is missing', () => {
        const request = new NextRequest('http://127.0.0.1:3002/api/auth/logout');

        expect(getExpectedOrigin(request)).toBe('http://localhost:3002');
    });
});
