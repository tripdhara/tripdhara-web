export const metadata = {
    title: 'Frequently Asked Questions (FAQ) - Help Center',
    description: 'Find clear answers about booking tour packages, cab rentals for Spiti & Manali, verified homestays, trust & safety guarantees, and cancellation policies on Tripdhara.',
    keywords: [
        'Tripdhara FAQ',
        'Himachal Tour Package Booking FAQ',
        'Spiti Cab Rental Charges',
        'Kasol Homestay Verification',
        'Tripdhara Cancellation Policy'
    ],
    openGraph: {
        title: 'Frequently Asked Questions (FAQ) | Tripdhara',
        description: 'Get answers to all your questions about Himachal tour packages, cab rentals, homestays, and payments on Tripdhara.',
        url: 'https://tripdhara.in/faq',
        siteName: 'Tripdhara',
        type: 'website',
    },
    alternates: {
        canonical: '/faq',
    }
};

export default function FAQLayout({ children }) {
    return <>{children}</>;
}
