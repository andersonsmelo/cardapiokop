import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from './auth';

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
});
