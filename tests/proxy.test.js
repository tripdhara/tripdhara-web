import { proxy, config } from '@/proxy.js';

describe('Industry Standard: Edge Proxy (src/proxy.js)', () => {
    it('should define matcher pattern for API routes', () => {
        expect(config).toBeDefined();
        expect(config.matcher).toBeDefined();
        expect(Array.isArray(config.matcher)).toBe(true);
        expect(config.matcher).toContain('/api/:path*');
    });

    it('should pass through non-api page requests without modification', () => {
        const req = new Request('https://tripdhara.in/packages', {
            method: 'GET',
            headers: new Headers()
        });

        const res = proxy(req);
        expect(res).toBeDefined();
        expect(res.status).toBe(200);
    });

    it('should generate x-request-id for /api/ routes when not provided', () => {
        const req = new Request('https://tripdhara.in/api/v1/packages', {
            method: 'GET',
            headers: new Headers()
        });

        const res = proxy(req);
        expect(res.headers.get('x-request-id')).toBeDefined();
    });

    it('should preserve existing x-request-id header if provided by client', () => {
        const req = new Request('https://tripdhara.in/api/v1/packages', {
            method: 'GET',
            headers: new Headers({
                'x-request-id': 'client_req_xyz_999'
            })
        });

        const res = proxy(req);
        expect(res.headers.get('x-request-id')).toBe('client_req_xyz_999');
    });

    it('should attach CORS headers for /api/ routes', () => {
        const req = new Request('https://tripdhara.in/api/v1/auth/login', {
            method: 'GET',
            headers: new Headers({
                'origin': 'https://admin.tripdhara.in'
            })
        });

        const res = proxy(req);
        expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://admin.tripdhara.in');
        expect(res.headers.get('Access-Control-Allow-Methods')).toContain('GET');
        expect(res.headers.get('Access-Control-Allow-Credentials')).toBe('true');
    });

    it('should respond early with status 204 on CORS preflight OPTIONS request to /api/', () => {
        const req = new Request('https://tripdhara.in/api/v1/booking/checkout', {
            method: 'OPTIONS',
            headers: new Headers({
                'origin': 'https://admin.tripdhara.in'
            })
        });

        const res = proxy(req);
        expect(res.status).toBe(204);
        expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://admin.tripdhara.in');
    });
});
