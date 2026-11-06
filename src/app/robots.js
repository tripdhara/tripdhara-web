export default function robots() {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://tripdhara.in';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/', '/checkout/payment-status', '/private/'],
            },
            {
                userAgent: 'GPTBot',
                allow: ['/', '/packages', '/faq', '/llms.txt', '/llms-full.txt', '/api/v1/raw-markdown'],
                disallow: ['/admin/', '/checkout/'],
            },
            {
                userAgent: 'ChatGPT-User',
                allow: '/',
                disallow: ['/admin/', '/checkout/'],
            },
            {
                userAgent: 'PerplexityBot',
                allow: '/',
                disallow: ['/admin/', '/checkout/'],
            },
            {
                userAgent: 'Google-Extended',
                allow: '/',
                disallow: ['/admin/', '/checkout/'],
            },
            {
                userAgent: 'ClaudeBot',
                allow: '/',
                disallow: ['/admin/', '/checkout/'],
            },
            {
                userAgent: 'Bytespider',
                allow: '/',
                disallow: ['/admin/', '/checkout/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
