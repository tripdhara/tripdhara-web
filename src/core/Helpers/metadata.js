const DEFAULT_TITLE = 'Tour Packages, Homestays & Cab Rentals';
const DEFAULT_DESCRIPTION = 'Discover and book verified tour packages, authentic homestays, hotels, and trekking adventures across Himachal Pradesh & Uttarakhand with Tripdhara.';
const DEFAULT_IMAGE = '/logo.png';
const DEFAULT_KEYWORDS = [
    'Tripdhara',
    'Himachal Tour Packages',
    'Uttarakhand Tour Packages',
    'Himalayan Homestays',
    'Cab Booking Himalayas'
];

/**
 * Next.js Official Standard Metadata Helper
 */
export function createMetadata({
    title = DEFAULT_TITLE,
    description = DEFAULT_DESCRIPTION,
    image = DEFAULT_IMAGE,
    path = '',
    keywords = DEFAULT_KEYWORDS,
    noIndex = false,
} = {}) {
    const canonicalPath = path ? (path.startsWith('/') ? path : `/${path}`) : '/';
    const ogImage = typeof image === 'string' && image.trim() !== '' ? image : (image?.url || (Array.isArray(image) && (image[0]?.url || image[0])) || DEFAULT_IMAGE);

    return {
        title,
        description,
        keywords,
        openGraph: {
            title,
            description,
            url: canonicalPath,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                }
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
        },
        alternates: {
            canonical: canonicalPath,
        },
        ...(noIndex && {
            robots: {
                index: false,
                follow: false,
            }
        })
    };
}

export default createMetadata;

