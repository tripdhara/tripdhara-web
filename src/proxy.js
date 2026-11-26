import { NextResponse } from 'next/server';

const DEFAULT_ALLOWED_ORIGINS = [
    'https://tripdhara.in',
    'https://www.tripdhara.in',
    'https://admin.tripdhara.in',
];

const isAllowedOrigin = (origin) => {
    if (!origin) return false;
    const configured = (process.env.CORS_ALLOWED_ORIGINS || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
    if (process.env.NEXT_PUBLIC_APP_URL) configured.push(process.env.NEXT_PUBLIC_APP_URL.trim());
    const allowlist = new Set([...DEFAULT_ALLOWED_ORIGINS, ...configured]);
    if (allowlist.has(origin)) return true;

    try {
        const parsed = new URL(origin);
        return parsed.protocol === 'https:' && parsed.hostname.endsWith('.tripdhara.in');
    } catch {
        return false;
    }
};

const applyCorsHeaders = (headers, origin) => {
    if (!isAllowedOrigin(origin)) return;
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-request-id, x-client-device');
    headers.set('Access-Control-Allow-Credentials', 'true');
    headers.set('Vary', 'Origin');
};

/**
 * Next.js Edge Proxy
 * Intercepts requests at the edge for security headers, request tracing, and CORS.
 */
export function proxy(request) {
    const url = new URL(request.url);
    const origin = request.headers.get('origin');

    // Preflight CORS OPTIONS request handling for API routes
    if (url.pathname.startsWith('/api/') && request.method === 'OPTIONS') {
        if (origin && !isAllowedOrigin(origin)) {
            return new NextResponse(null, { status: 403 });
        }
        const headers = new Headers();
        applyCorsHeaders(headers, origin);
        return new NextResponse(null, { status: 204, headers });
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
    const requestId = existingRequestId || crypto.randomUUID();
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
    const scriptSrc = process.env.NODE_ENV === 'development'
        ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com"
        : "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com";
    response.headers.set(
        'Content-Security-Policy',
        `default-src 'self'; ${scriptSrc}; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob: https://res.cloudinary.com https://media.tripdhara.com https://images.unsplash.com https://upload.wikimedia.org; connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com https://*.r2.cloudflarestorage.com; frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`
    );

    // CORS Headers for API routes (explicit allowlist only — never reflect arbitrary origins)
    if (url.pathname.startsWith('/api/')) {
        applyCorsHeaders(response.headers, origin);
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