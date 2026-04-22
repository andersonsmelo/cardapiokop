import { describe, expect, it } from 'vitest';
import {
    LoginSchema,
    ProductPayloadSchema,
    ProductQuerySchema,
    UuidParamSchema,
} from './validation';

describe('validation schemas', () => {
    it('accepts a valid login payload', () => {
        expect(
            LoginSchema.parse({
                email: 'admin@example.com',
                password: 'StrongPass123!',
            })
        ).toEqual({
            email: 'admin@example.com',
            password: 'StrongPass123!',
        });
    });

    it('rejects a malformed product payload', () => {
        expect(() =>
            ProductPayloadSchema.parse({
                name: '',
                description: '',
                price: '15.00',
                category_id: 'not-a-uuid',
                featured: 'yes',
            })
        ).toThrow();
    });

    it('accepts only known product sort values', () => {
        expect(ProductQuerySchema.parse({ sort: 'name' }).sort).toBe('name');
        expect(() => ProductQuerySchema.parse({ sort: 'random' })).toThrow();
    });

    it('normalizes an empty image url to undefined', () => {
        expect(
            ProductPayloadSchema.parse({
                name: 'Cappuccino',
                description: 'Cremoso',
                price: 'R$ 15,00',
                image_url: '',
                category_id: '11111111-1111-4111-8111-111111111111',
                featured: false,
            }).image_url
        ).toBeUndefined();
    });

    it('requires a uuid path param', () => {
        expect(() => UuidParamSchema.parse({ id: 'bad-id' })).toThrow();
    });
});
