import { sanitizeNoSQL, sanitizeHTML, redactSensitiveData, escapeRegex, sanitizeUrl } from '@/helpers/security.js';

describe('Industry Standard: Security Helper Logic', () => {
    describe('[sanitizeNoSQL]', () => {
        it('[Success] should remove keys starting with $', () => {
            const input = { username: 'test', $where: '1' };
            const result = sanitizeNoSQL(input);
            expect(result.$where).toBeUndefined();
            expect(result.username).toBe('test');
        });

        it('[Deep] should handle nested objects', () => {
            const input = { filter: { $gt: 5, active: true } };
            const result = sanitizeNoSQL(input);
            expect(result.filter.$gt).toBeUndefined();
            expect(result.filter.active).toBe(true);
        });
    });

    describe('[redactSensitiveData]', () => {
        it('[Success] should mask sensitive keys', () => {
            const data = { email: 'test@t.com', password: 'secret123', meta: { otp: '1234' } };
            const redacted = redactSensitiveData(data);
            expect(redacted.password).toBe('***REDACTED***');
            expect(redacted.meta.otp).toBe('***REDACTED***');
            expect(redacted.email).toBe('test@t.com');
        });
    });

    describe('[sanitizeHTML]', () => {
        it('[Success] should strip dangerous script tags and preserve safe HTML', () => {
            const html = '<script>alert(1)</script><p>Hello <b>World</b></p>';
            const result = sanitizeHTML(html);
            expect(result).toBe('<p>Hello <b>World</b></p>');
        });
    });

    describe('[escapeRegex]', () => {
        it('[Security] should escape regex metacharacters to prevent ReDoS', () => {
            expect(escapeRegex('a+b*(c)?[d].^$')).toBe('a\\+b\\*\\(c\\)\\?\\[d\\]\\.\\^\\$');
        });
    });

    describe('[sanitizeUrl]', () => {
        it('[Security] should block javascript: and allow safe http/https/relative URLs', () => {
            expect(sanitizeUrl('javascript:alert(1)')).toBe('#');
            expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('#');
            expect(sanitizeUrl('https://tripdhara.in/packages')).toBe('https://tripdhara.in/packages');
            expect(sanitizeUrl('/packages/spiti')).toBe('/packages/spiti');
        });
    });
});
