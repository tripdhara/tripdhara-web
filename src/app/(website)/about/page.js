import ClientAbout from './ClientAbout.js';

export const metadata = {
    title: 'About Us - Empowering Himalayan Travel & Local Tourism',
    description: 'Learn about Tripdhara, our mission to empower local Himalayan communities, host verified homestays, licensed cab drivers, and authentic trekking experiences across Himachal Pradesh.',
    keywords: [
        'About Tripdhara',
        'Himachal Travel Platform',
        'Himalayan Tourism Marketplace',
        'Er. Mradul Sharma',
        'Tripdhara Mission',
        'Local Himachal Vendors'
    ],
    openGraph: {
        title: 'About Us | Tripdhara - Empowering Himalayan Travel',
        description: 'Empowering local Himalayan hosts, verified cab drivers, and outdoor guides with technology.',
        url: 'https://tripdhara.in/about',
        siteName: 'Tripdhara',
        type: 'website',
    },
    alternates: {
        canonical: '/about',
    }
};

export default function AboutPage() {
    return <ClientAbout />;
}
