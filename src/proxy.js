import { NextResponse } from 'next/server';

/**
 * Next.js Edge Proxy
 * Intercepts API requests at the edge for CORS, preflight, and request tracing.
 */
export function proxy(request) {
    const url = new URL(request.url);

    // Only process /api/ routes
    if (url.pathname.startsWith('/api/')) {
        const origin = request.headers.get('origin') || '*';

        // Handle preflight CORS OPTIONS request early
        if (request.method === 'OPTIONS') {
            return new NextResponse(null, {
                status: 204,
                headers: {
                    'Access-Control-Allow-Origin': origin,
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-request-id, x-client-device',
                    'Access-Control-Allow-Credentials': 'true',
                },
            });
        }

        const requestHeaders = new Headers(request.headers);
        const existingRequestId = request.headers.get('x-request-id');
        const requestId = existingRequestId || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`);
        requestHeaders.set('x-request-id', requestId);

        const response = NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });

        // Set response headers
        response.headers.set('x-request-id', requestId);
        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-request-id, x-client-device');
        response.headers.set('Access-Control-Allow-Credentials', 'true');

        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/api/:path*'],
};