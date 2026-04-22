// @vitest-environment node

import { describe, it, expect } from 'vitest';
import { hashPassword, signToken, verifyPassword, verifyToken } from './auth';

describe('Auth Utilities', () => {
    it('should hash a password and verify it correctly', async () => {
        const password = 'my-secret-password-123';
        const hashed = await hashPassword(password);
        
        expect(hashed).not.toBe(password);
        expect(hashed.length).toBeGreaterThan(10);

        const isValid = await verifyPassword(password, hashed);
        expect(isValid).toBe(true);

        const isInvalid = await verifyPassword('wrong-password', hashed);
        expect(isInvalid).toBe(false);
    });

    it('signs and verifies a token with the admin role', async () => {
        const token = await signToken({
            id: '11111111-1111-1111-1111-111111111111',
            email: 'admin@example.com',
            role: 'admin',
        });

        await expect(verifyToken(token)).resolves.toEqual({
            id: '11111111-1111-1111-1111-111111111111',
            email: 'admin@example.com',
            role: 'admin',
        });
    });
});
