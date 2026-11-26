/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ['sharp', 'tesseract.js', '@react-pdf/renderer'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'upload.wikimedia.org',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
            {
                protocol: 'https',
                hostname: 'media.tripdhara.com',
            },
        ],
    },
    experimental: {
        proxyClientMaxBodySize: '50mb',
        optimizePackageImports: ['recharts', 'lucide-react', 'framer-motion'],
    },
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    allowedDevOrigins: [
        '10.192.91.197',
        '10.192.91.197:3000',
        'localhost:3000',
        'tripdhara.in',
        'tripdhara.com',
        '*.tripdhara.in',
        '*.tripdhara.com',
    ],
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload'
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin'
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()'
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://checkout.razorpay.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob: https://res.cloudinary.com https://media.tripdhara.com https://images.unsplash.com https://upload.wikimedia.org; connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com https://*.r2.cloudflarestorage.com; frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"
                    }
                ]
            }
        ];
    },
    async rewrites() {
        return {
            fallback: [
                {
                    source: '/api/v1/:path((?!vendor|traveller|raw-markdown).*)',
                    destination: '/api/:path*'
                }
            ]
        };
    }
};

export default nextConfig;
