import './globals.css';
import Script from 'next/script';
import { ToastProvider } from '@/components/ui/ToastContext.js';
import { Plus_Jakarta_Sans, Outfit } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-sans',
    display: 'swap',
    preload: true,
});

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-display',
    display: 'swap',
    preload: true,
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tripdhara.in';

const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'Organization',
            '@id': `${siteUrl}/#organization`,
            name: 'Tripdhara',
            url: siteUrl,
            logo: `${siteUrl}/logo.png`,
            sameAs: [
                'https://www.instagram.com/tripdhara',
                'https://www.facebook.com/tripdhara'
            ],
            contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer support',
                email: 'support@tripdhara.in',
                areaServed: 'IN',
                availableLanguage: ['English', 'Hindi']
            }
        },
        {
            '@type': 'WebSite',
            '@id': `${siteUrl}/#website`,
            url: siteUrl,
            name: 'Tripdhara',
            description: 'Premier Himalayan & Mountain Travel Platform',
            publisher: {
                '@id': `${siteUrl}/#organization`
            },
            potentialAction: {
                '@type': 'SearchAction',
                target: `${siteUrl}/packages?q={search_term_string}`,
                'query-input': 'required name=search_term_string'
            }
        }
    ]
};

/** @type {import('next').Metadata} */
export const metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        template: '%s | Tripdhara',
        default: 'Tripdhara - Book Tour Packages, Cabs & Homestays',
    },
    description: 'Discover and book verified homestays, hotels, cab rentals for Spiti, Manali, Char Dham, trekking, camping, and adventure activities across Himachal Pradesh & Uttarakhand with Tripdhara.',
    applicationName: 'Tripdhara',
    authors: [{ name: 'Tripdhara Team', url: siteUrl }],
    creator: 'Tripdhara',
    publisher: 'Tripdhara',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    keywords: [
        'Tripdhara',
        'Himachal Tour Packages',
        'Uttarakhand Tour Packages',
        'Manali Tour Packages',
        'Spiti Valley Trip',
        'Char Dham Tour',
        'Kasol Homestays',
        'Himachal Cab Rental',
        'Trekking in Himalayas'
    ],
    alternates: {
        canonical: '/',
    },
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/icon.png', type: 'image/png', sizes: '512x512' },
            { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
            { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
        ],
        apple: [
            { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
        ],
        shortcut: '/favicon.ico',
    },
    openGraph: {
        title: {
            template: '%s | Tripdhara',
            default: 'Tripdhara - Book Tour Packages, Cabs & Homestays',
        },
        description: 'Discover and book verified homestays, hotels, cab rentals for Spiti, Manali, Char Dham, trekking, camping, and adventure activities across Himachal Pradesh & Uttarakhand with Tripdhara.',
        url: '/',
        siteName: 'Tripdhara',
        images: [
            {
                url: '/logo.png',
                width: 1200,
                height: 630,
                alt: 'Tripdhara - Tour Packages, Cabs & Homestays',
            }
        ],
        locale: 'en_IN',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: {
            template: '%s | Tripdhara',
            default: 'Tripdhara - Book Tour Packages, Cabs & Homestays',
        },
        description: 'Discover and book verified homestays, hotels, cab rentals for Spiti, Manali, Char Dham, trekking, camping, and adventure activities across Himachal Pradesh & Uttarakhand with Tripdhara.',
        images: ['/logo.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

/** @type {import('next').Viewport} */
export const viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
        { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
    ],
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${plusJakartaSans.variable} ${outfit.variable}`} suppressHydrationWarning>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
                />
            </head>
            <body className="antialiased font-sans">
                <ToastProvider>
                    {children}
                </ToastProvider>
                {/* Google Tag Manager (gtm.js) */}
                <Script
                    src="https://www.googletagmanager.com/gtm.js?id=GTM-WGVP8DC2"
                    strategy="afterInteractive"
                />
                <Script id="google-tag-manager" strategy="afterInteractive">
                    {`
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                    `}
                </Script>
            </body>
        </html>
    );
}
