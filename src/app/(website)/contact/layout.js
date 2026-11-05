export const metadata = {
    title: 'Contact Us - Customer Support & Inquiries',
    description: 'Get in touch with Tripdhara support team for booking assistance, custom Himachal tour itineraries, cab inquiries, or vendor partnership opportunities.',
    keywords: [
        'Contact Tripdhara',
        'Tripdhara Support',
        'Himachal Cab Inquiry',
        'Tripdhara Partner Registration'
    ],
    openGraph: {
        title: 'Contact Us | Tripdhara Customer Support',
        description: 'Need help planning your Himalayan trip? Contact Tripdhara team today.',
        url: 'https://tripdhara.in/contact',
        siteName: 'Tripdhara',
        type: 'website',
    },
    alternates: {
        canonical: '/contact',
    }
};

export default function ContactLayout({ children }) {
    return <>{children}</>;
}
