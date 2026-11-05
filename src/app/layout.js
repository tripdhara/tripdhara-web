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
            <body className="antialiased font-sans">
                <ToastProvider>
                    {children}
                </ToastProvider>
                {/* Google tag (gtag.js) */}
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-1L0FGXLXS3"
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());

                      gtag('config', 'G-1L0FGXLXS3', {
                          page_path: window.location.pathname,
                      });
                    `}
                </Script>
            </body>
        </html>
    );
}
