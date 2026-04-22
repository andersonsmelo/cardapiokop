import { describe, expect, it } from 'vitest';
import { isAllowedOrigin } from './request-security';

describe('isAllowedOrigin', () => {
    it('accepts the configured application origin', () => {
        expect(isAllowedOrigin('https://cardapiokop.example.com', 'https://cardapiokop.example.com')).toBe(true);
    });

    it('rejects a different origin', () => {
        expect(isAllowedOrigin('https://evil.example', 'https://cardapiokop.example.com')).toBe(false);
    });
});
