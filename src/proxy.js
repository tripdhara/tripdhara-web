import { NextResponse } from 'next/server';

/**
 * Next.js Edge Proxy
 * Intercepts requests at the edge for security headers, request tracing, and CORS.
 */
export function proxy(request) {
    const url = new URL(request.url);

    // Preflight CORS OPTIONS request handling for API routes
    if (url.pathname.startsWith('/api/') && request.method === 'OPTIONS') {
        const origin = request.headers.get('origin') || '*';
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

    // Protected UI routes check - redirect unauthenticated users to /login immediately
    const PROTECTED_ROUTES = ['/admin', '/vendor', '/traveller'];
    const isProtectedRoute = PROTECTED_ROUTES.some(route =>
        url.pathname === route || url.pathname.startsWith(`${route}/`)
    );

    if (isProtectedRoute) {
        let token = null;

        // 1. Check cookies via NextRequest cookies API
        if (request.cookies && typeof request.cookies.get === 'function') {
            token = request.cookies.get('token')?.value;
        }

        // 2. Fallback to standard cookie header
        if (!token && request.headers && typeof request.headers.get === 'function') {
            const cookieHeader = request.headers.get('cookie') || '';
            const match = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
            if (match) {
                token = decodeURIComponent(match[1]);
            }
        }

        if (!token) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', url.pathname);
            return NextResponse.redirect(loginUrl);
        }
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

    // Request Tracing Header
    response.headers.set('x-request-id', requestId);

    // Industry Standard Edge Security Headers for all matched routes
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // CORS Headers for API routes
    if (url.pathname.startsWith('/api/')) {
        const origin = request.headers.get('origin') || '*';
        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-request-id, x-client-device');
        response.headers.set('Access-Control-Allow-Credentials', 'true');
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - Static asset extensions (.svg, .png, .jpg, .jpeg, .gif, .webp)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};