import { z, type ZodError } from 'zod';

const RelativeImagePath =
    /^\/(?:uploads\/products\/[a-f0-9-]+\.webp|assets\/img\/[a-z0-9._-]+\.(?:png|jpg|jpeg|webp))$/i;

const optionalImageUrlSchema = z
    .union([
        z.string().trim().regex(RelativeImagePath),
        z.literal(''),
        z.undefined(),
    ])
    .transform((value) => {
        if (!value) {
            return undefined;
        }

        return value.trim();
    });

export const LoginSchema = z.object({
    email: z.string().trim().email().max(254),
    password: z.string().min(8).max(128),
});

export const ProductPayloadSchema = z.object({
    name: z.string().trim().min(1).max(120),
    description: z.string().trim().min(1).max(2_000),
    price: z.string().trim().regex(/^R\$ \d{1,4},\d{2}$/),
    image_url: optionalImageUrlSchema,
    category_id: z.string().uuid(),
    featured: z.boolean().default(false),
});

export const ProductQuerySchema = z.object({
    category_id: z.preprocess(
        (value) => (value === '' ? undefined : value),
        z.string().uuid().optional()
    ),
    sort: z.preprocess(
        (value) => (value === '' ? undefined : value),
        z.enum(['name', 'recent']).optional()
    ),
});

export const UuidParamSchema = z.object({
    id: z.string().uuid(),
});

export function formatValidationError(error: ZodError) {
    return {
        error: 'Payload inválido',
        details: error.flatten(),
    };
}
