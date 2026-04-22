import path from 'path';
import sharp from 'sharp';

export type AllowedImageFormat = 'jpg' | 'png' | 'webp';

function startsWithSignature(bytes: Uint8Array, signature: number[]) {
    return signature.every((value, index) => bytes[index] === value);
}

export function detectImageFormat(bytes: Uint8Array): AllowedImageFormat | null {
    if (bytes.length >= 3 && startsWithSignature(bytes, [0xff, 0xd8, 0xff])) {
        return 'jpg';
    }

    if (bytes.length >= 8 && startsWithSignature(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
        return 'png';
    }

    if (
        bytes.length >= 12 &&
        startsWithSignature(bytes, [0x52, 0x49, 0x46, 0x46]) &&
        startsWithSignature(bytes.slice(8, 12), [0x57, 0x45, 0x42, 0x50])
    ) {
        return 'webp';
    }

    return null;
}

export async function sanitizeImageBuffer(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer, { failOn: 'error', limitInputPixels: 40_000_000 })
        .rotate()
        .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toBuffer();
}

export function buildProductUploadPath(rootDir: string, fileId: string) {
    const fileName = `${fileId}.webp`;

    return {
        filePath: path.join(rootDir, 'public', 'uploads', 'products', fileName),
        publicUrl: `/uploads/products/${fileName}`,
    };
}
