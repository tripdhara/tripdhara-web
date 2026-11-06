import api from '@/core/Api/public/index.js';
import ClientHome from './ClientHome.js';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tripdhara.in';

export const metadata = {
    metadataBase: new URL(siteUrl),
    title: 'Tripdhara - Premier Himalayan Travel: Tour Packages, Mountain Cabs & Homestays',
    description: 'Explore the Himalayas with Tripdhara. Book verified Himachal tour packages, Spiti Valley cab rentals, Kasol homestays, Leh-Ladakh bike trips, Uttarakhand trekking, and Kashmir tour packages at best prices.',
    keywords: [
        'Tripdhara',
        'Himalayan Tour Packages',
        'Himachal Tour Packages',
        'Manali Tour Packages',
        'Spiti Valley Trip',
        'Leh Ladakh Bike Trip',
        'Kasol Homestays',
        'Himachal Cab Rental',
        'Shimla Taxi Booking',
        'Uttarakhand Tour Packages',
        'Rishikesh Adventure & Rafting',
        'Chardham Yatra Packages',
        'Uttarkashi Treks',
        'Kashmir Gulmarg Pahalgam Tour',
        'Sikkim Gangtok Darjeeling Tour',
        'Meghalaya Shillong Trip',
        'Trekking in Himalayas',
        'Mountain Cab Booking India'
    ],
    authors: [{ name: 'Tripdhara Travel Platform', url: siteUrl }],
    creator: 'Tripdhara',
    publisher: 'Tripdhara',
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'Tripdhara - Premier Himalayan Travel: Packages, Cabs, Homestays & Treks',
        description: 'Book verified Himalayan tour packages, mountain cab rentals for Spiti & Leh, cozy homestays in Kasol & Manali, and trekking across Himachal, Uttarakhand, Kashmir, Ladakh & Northeast India.',
        url: siteUrl,
        siteName: 'Tripdhara',
        images: [
            {
                url: '/logo.png',
                width: 1200,
                height: 630,
                alt: 'Tripdhara Himalayan Travel Platform',
            },
        ],
        locale: 'en_IN',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Tripdhara - Himalayan Tour Packages, Mountain Cabs & Homestays',
        description: 'Book verified Himalayan tour packages, Spiti & Leh cabs, and mountain homestays at best prices.',
        images: ['/logo.png'],
        creator: '@Tripdhara',
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

const jsonLdData = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'TravelAgency',
            '@id': `${siteUrl}/#organization`,
            'name': 'Tripdhara',
            'url': siteUrl,
            'logo': `${siteUrl}/logo.png`,
            'image': `${siteUrl}/logo.png`,
            'description': 'Tripdhara is India’s premier Himalayan travel platform offering verified mountain tour packages, cab rentals for high-altitude passes, authentic homestays, and trekking expeditions across Himachal Pradesh, Uttarakhand, Leh-Ladakh, Kashmir, and Northeast India.',
            'address': {
                '@type': 'PostalAddress',
                'addressRegion': 'Himachal Pradesh & Uttarakhand',
                'addressCountry': 'IN'
            },
            'geo': {
                '@type': 'GeoCoordinates',
                'latitude': 32.2432,
                'longitude': 77.1892
            },
            'areaServed': [
                { '@type': 'AdministrativeArea', 'name': 'Himachal Pradesh' },
                { '@type': 'AdministrativeArea', 'name': 'Uttarakhand' },
                { '@type': 'AdministrativeArea', 'name': 'Ladakh' },
                { '@type': 'AdministrativeArea', 'name': 'Jammu and Kashmir' },
                { '@type': 'AdministrativeArea', 'name': 'Sikkim' },
                { '@type': 'AdministrativeArea', 'name': 'Meghalaya' },
                { '@type': 'City', 'name': 'Manali' },
                { '@type': 'City', 'name': 'Shimla' },
                { '@type': 'City', 'name': 'Spiti Valley' },
                { '@type': 'City', 'name': 'Kasol' },
                { '@type': 'City', 'name': 'Dharamshala' },
                { '@type': 'City', 'name': 'Leh' },
                { '@type': 'City', 'name': 'Srinagar' },
                { '@type': 'City', 'name': 'Rishikesh' },
                { '@type': 'City', 'name': 'Haridwar' },
                { '@type': 'City', 'name': 'Uttarkashi' },
                { '@type': 'City', 'name': 'Gangtok' },
                { '@type': 'City', 'name': 'Shillong' }
            ],
            'priceRange': '₹₹',
            'sameAs': [
                'https://github.com/tripdhara/tripdhara-web'
            ]
        },
        {
            '@type': 'WebSite',
            '@id': `${siteUrl}/#website`,
            'url': siteUrl,
            'name': 'Tripdhara',
            'publisher': { '@id': `${siteUrl}/#organization` },
            'potentialAction': {
                '@type': 'SearchAction',
                'target': `${siteUrl}/packages?search={search_term_string}`,
                'query-input': 'required name=search_term_string'
            }
        },
        {
            '@type': 'FAQPage',
            '@id': `${siteUrl}/#faq`,
            'mainEntity': [
                {
                    '@type': 'Question',
                    'name': 'How to book a cab from Manali to Spiti Valley on Tripdhara?',
                    'acceptedAnswer': {
                        '@type': 'Answer',
                        'text': 'Bottom Line Up Front (BLUF): You can book verified SUVs (Innova/Sumo) or Tempo Travellers directly on Tripdhara with transparent per-day pricing, licensed local drivers, and instant booking confirmation.'
                    }
                },
                {
                    '@type': 'Question',
                    'name': 'What are the best tour packages for Himachal Pradesh?',
                    'acceptedAnswer': {
                        '@type': 'Answer',
                        'text': 'Tripdhara offers curated tour packages including 5-Day Manali Adventure, 7-Day Complete Spiti Circuit, Kasol Riverside Camping, and Shimla Heritage packages.'
                    }
                },
                {
                    '@type': 'Question',
                    'name': 'Are homestays listed on Tripdhara verified?',
                    'acceptedAnswer': {
                        '@type': 'Answer',
                        'text': 'Yes, all homestays on Tripdhara undergo strict physical verification for safety, hygiene, authentic local host experience, and reliable Wi-Fi.'
                    }
                }
            ]
        }
    ]
};

async function getServices() {
    try {
        const result = await api.service.categories.getAll();
        return result.data || [];
    } catch (error) {
        return [];
    }
}

export default async function Home() {
    const categories = await getServices();
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
            />
            <ClientHome categories={categories} />
        </>
    );
}
