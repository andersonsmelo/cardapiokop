// @vitest-environment node

import { describe, expect, it } from 'vitest';
import sharp from 'sharp';
import { buildProductUploadPath, detectImageFormat, sanitizeImageBuffer } from './upload';

describe('upload helpers', () => {
    it('detects png signatures', () => {
        const png = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
        expect(detectImageFormat(png)).toBe('png');
    });

    it('rejects unsupported data', () => {
        expect(detectImageFormat(Uint8Array.from([0x00, 0x01, 0x02]))).toBeNull();
    });

    it('always stores product uploads as webp', () => {
        expect(buildProductUploadPath('/app', '1234')).toEqual({
            filePath: '/app/public/uploads/products/1234.webp',
            publicUrl: '/uploads/products/1234.webp',
        });
    });

    it('re-encodes accepted images to webp', async () => {
        const pngBuffer = await sharp({
            create: {
                width: 16,
                height: 16,
                channels: 3,
                background: { r: 255, g: 0, b: 0 },
            },
        })
            .png()
            .toBuffer();

        const sanitized = await sanitizeImageBuffer(pngBuffer);
        const metadata = await sharp(sanitized).metadata();

        expect(metadata.format).toBe('webp');
        expect(metadata.width).toBe(16);
        expect(metadata.height).toBe(16);
    });
});
