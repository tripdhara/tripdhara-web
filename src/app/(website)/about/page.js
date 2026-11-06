import ClientAbout from './ClientAbout.js';

export const metadata = {
    title: 'About Tripdhara - Premier Himalayan Tour & Travel Platform',
    description: 'Tripdhara is a premier Himalayan Tour and Travel Company headquartered in Rishikesh & Dehradun, Uttarakhand. Empowering local homestays, trekking guides, river rafting, and adventure operators across the Himalayas.',
    keywords: [
        'About Tripdhara',
        'Tripdhara Tour and Travel Company',
        'Himalayan Travel Platform',
        'Er. Mradul Sharma',
        'Uttarakhand Tour Packages',
        'Himachal Homestays',
        'Rishikesh Rafting & Bungee',
        'Chardham Yatra Packages',
        'Kedarkantha Trekking'
    ],
    openGraph: {
        title: 'About Tripdhara | Premier Himalayan Tour & Travel Platform',
        description: 'Organizing Himalayan travel by bridging global explorers with verified local hosts, homestays, and adventure leaders.',
        url: 'https://tripdhara.in/about',
        siteName: 'Tripdhara',
        type: 'website',
    },
    alternates: {
        canonical: '/about',
    }
};

export default function AboutPage() {
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tripdhara.in';

    const aboutJsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'AboutPage',
                '@id': `${siteUrl}/about#webpage`,
                url: `${siteUrl}/about`,
                name: 'About Tripdhara',
                description: 'Overview of Tripdhara, our vision, mission, 9 core services, and leadership in Himalayan tourism.',
                isPartOf: {
                    '@type': 'WebSite',
                    '@id': `${siteUrl}/#website`,
                    name: 'Tripdhara',
                    url: siteUrl
                }
            },
            {
                '@type': 'TravelAgency',
                '@id': `${siteUrl}/#organization`,
                name: 'Tripdhara',
                url: siteUrl,
                logo: `${siteUrl}/logo.png`,
                founder: {
                    '@type': 'Person',
                    name: 'Er. Mradul Sharma',
                    jobTitle: 'Founder & Lead Architect'
                },
                address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'Rishikesh / Dehradun',
                    addressRegion: 'Uttarakhand',
                    addressCountry: 'IN'
                },
                telephone: '+91-7017288052',
                email: 'contact@tripdhara.com',
                sameAs: [
                    'https://tripdhara.com',
                    'https://tripdhara.in'
                ]
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
            />
            <ClientAbout />
        </>
    );
}
