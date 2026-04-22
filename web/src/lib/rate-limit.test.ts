import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearRateLimitBuckets, takeRateLimitHit } from './rate-limit';

describe('takeRateLimitHit', () => {
    beforeEach(() => {
        clearRateLimitBuckets();
        vi.useRealTimers();
    });

    it('allows requests until the limit is reached', () => {
        expect(takeRateLimitHit('login:127.0.0.1', 2, 60_000).allowed).toBe(true);
        expect(takeRateLimitHit('login:127.0.0.1', 2, 60_000).allowed).toBe(true);
        expect(takeRateLimitHit('login:127.0.0.1', 2, 60_000).allowed).toBe(false);
    });

    it('resets the bucket after the window expires', () => {
        vi.useFakeTimers();
        const start = new Date('2026-04-22T12:00:00.000Z');
        vi.setSystemTime(start);

        expect(takeRateLimitHit('login:127.0.0.1', 1, 1_000).allowed).toBe(true);
        expect(takeRateLimitHit('login:127.0.0.1', 1, 1_000).allowed).toBe(false);

        vi.setSystemTime(new Date(start.getTime() + 1_001));

        expect(takeRateLimitHit('login:127.0.0.1', 1, 1_000).allowed).toBe(true);
    });
});
