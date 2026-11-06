import PartnerClient from './PartnerClient.js';

export const metadata = {
    title: 'Partner With Tripdhara - Vendor & Local Host Onboarding',
    description: 'Empower your Himalayan travel business with Tripdhara. Partner as a verified homestay host, hotel, rafting marshal, trekking guide, or bike rental vendor. Zero setup fee, direct payments, and 24/7 support.',
    keywords: [
        'Partner with Tripdhara',
        'Tripdhara Vendor Registration',
        'Himachal Homestay Registration',
        'Rishikesh Rafting Partner',
        'Trekking Guide Onboarding',
        'Chardham Taxi Partner'
    ],
    openGraph: {
        title: 'Partner With Tripdhara | Empowering Himalayan Hosts & Operators',
        description: 'Connect directly with thousands of global explorers without paying 30-40% cuts to exploitative middlemen.',
        url: 'https://tripdhara.in/partner',
        siteName: 'Tripdhara',
        type: 'website',
    },
    alternates: {
        canonical: '/partner',
    }
};

export default function PartnerPage() {
    return <PartnerClient />;
}
