import { describe, expect, it } from 'vitest';
import { securityHeaders } from './security-headers';

describe('securityHeaders', () => {
  it('includes strict transport and anti-framing controls', () => {
    const byKey = new Map(securityHeaders.map((header) => [header.key, header.value]));

    expect(byKey.get('Strict-Transport-Security')).toContain('max-age=63072000');
    expect(byKey.get('X-Frame-Options')).toBe('DENY');
    expect(byKey.get('X-Content-Type-Options')).toBe('nosniff');
  });

  it('ships a content security policy', () => {
    const csp = securityHeaders.find((header) => header.key === 'Content-Security-Policy');

    expect(csp?.value).toContain("default-src 'self'");
    expect(csp?.value).toContain("frame-ancestors 'none'");
  });
});
