import Image from 'next/image';
import Link from 'next/link';
import { Home, Hotel, Tent, CheckCircle2, PhoneCall, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import PageHero from '@/app/components/PageHero.js';
import { createMetadata } from '@/core/Helpers/metadata.js';

export const metadata = createMetadata({
    title: 'Mountain Accommodations | Tripdhara',
    description: 'Book verified local homestays, boutique hotels, and riverside luxury camping in Uttarakhand and Himachal Pradesh with Tripdhara.',
    path: '/accommodation',
    image: '/img/images/og-banner.png',
    keywords: [
        'Mountain Accommodations',
        'Himalayan Homestays',
        'Uttarakhand Hotels',
        'Riverside Camping Rishikesh',
        'Chopta Camping',
        'Pahadi Homestays',
        'Boutique Resorts Himalayas'
    ]
});

// Dynamic Data Schema for Accommodations (DRY Architecture)
const ACCOMMODATION_SECTIONS = [
    {
        id: 'homestay',
        tagline: '1.1. Authentic Stays',
        category: 'homestay',
        theme: {
            badgeBg: 'bg-emerald-50',
            badgeText: 'text-emerald-700',
            checkIcon: 'text-emerald-500'
        },
        icon: Home,
        quickPillar: {
            title: 'Local Homestays',
            subtitle: 'Authentic village culture & food'
        },
        title: 'Traditional Himalayan Homestays',
        paragraphs: [
            'A homestay is more than just a place to sleep—it’s an invitation into the local Himalayan way of life. Located in quiet mountain villages, these are real family-run homes where you can experience genuine Kumaoni and Garhwali hospitality.'
        ],
        benefitsTitle: 'Benefits of Staying in a Homestay:',
        benefits: [
            {
                label: 'Authentic Local Meals',
                text: 'Taste fresh, organic meals cooked on wood-fired stoves using local grains like madua and fresh mountain herbs.'
            },
            {
                label: 'Real Local Guidance',
                text: "Your hosts know the quiet forest walks, the best spots to catch the sunrise, and the local legends that aren't in any travel guide."
            },
            {
                label: 'Economic Impact',
                text: 'The money you spend goes directly to the family hosting you, helping sustain remote mountain communities.'
            }
        ],
        extraInfo: {
            label: 'Who It Is Best For',
            text: 'Perfect for travelers seeking peace over luxury, couples looking for a quiet retreat, and families who want their children to experience traditional village life.'
        },
        cta: {
            text: 'Book a Homestay Experience',
            href: '/packages?category=homestay'
        },
        image: {
            src: '/img/images/tripdhara_homestay.png',
            alt: 'Traditional Himalayan Homestay',
            tag: 'Verified Host',
            title: 'Organic Mountain Living',
            subtitle: 'Kumaon & Garhwal Heritage Villages'
        }
    },
    {
        id: 'hotel',
        tagline: '1.2. Modern Comforts',
        category: 'hotel',
        theme: {
            badgeBg: 'bg-blue-50',
            badgeText: 'text-blue-700',
            checkIcon: 'text-blue-500'
        },
        icon: Hotel,
        quickPillar: {
            title: 'Boutique Hotels',
            subtitle: '24/7 hot water, Wi-Fi & comfort'
        },
        title: 'Independent Valley-View Hotels',
        paragraphs: [
            'For travelers who prefer consistency, room service, and modern comforts after a long day of exploring, we partner with independent boutique hotels across Uttarakhand and Himachal Pradesh.',
            'We inspect each property to guarantee hot water running 24/7, clean linen, in-house kitchens serving fresh food, Wi-Fi connectivity, and secure parking.'
        ],
        benefitsTitle: 'Types of Hotels Available:',
        benefits: [
            {
                label: 'Heritage Boutique Properties',
                text: 'Restored estates with colonial character, fireplaces, and sweeping valley views.'
            },
            {
                label: 'Premium Valley-View Hotels',
                text: 'Modern structures located near major hubs like Mussoorie, Nainital, and Rishikesh.'
            },
            {
                label: 'Pilgrimage-Friendly Transit Hotels',
                text: 'Clean, sanitized properties near major transit stops along the Char Dham Yatra routes.'
            }
        ],
        cta: {
            text: 'Book a Hotel Stay',
            href: '/packages?category=hotel'
        },
        image: {
            src: '/img/images/tripdhara_hotel.png',
            alt: 'Independent Valley-View Hotel',
            tag: 'Premium Partner',
            title: 'Panoramic Valley Panoramas',
            subtitle: 'Mussoorie, Nainital, Rishikesh & Yatra Routes'
        }
    },
    {
        id: 'camping',
        tagline: '1.3. Wilderness Camps',
        category: 'camping',
        theme: {
            badgeBg: 'bg-amber-50',
            badgeText: 'text-amber-700',
            checkIcon: 'text-amber-500'
        },
        icon: Tent,
        quickPillar: {
            title: 'Wilderness Camps',
            subtitle: 'Riverside & alpine eco-camping'
        },
        title: 'Riverside & Alpine Camping',
        paragraphs: [
            'Sleep under a blanket of stars with the sound of the Ganga or the wind through pine forests. We organize verified camping experiences in designated eco-zones in Rishikesh, Chopta, and high-altitude alpine meadows.',
            'Wake up to views of snow-capped peaks, enjoy evening campfires, and spend your days trekking or river rafting. We use high-grade, double-layered waterproof tents that protect you from alpine winds and frosty nights.'
        ],
        benefitsTitle: 'Safety & Camp Facilities:',
        benefits: [
            {
                label: 'Hygienic Sanitation',
                text: 'Permanent, clean running-water western/eastern toilets at all verified basecamps.'
            },
            {
                label: 'Raised Beddings & Insulation',
                text: 'Elevated platforms and high-density foam mattresses to keep you warm and dry off the cold ground.'
            },
            {
                label: '24/7 Outdoor Guides',
                text: 'Camps managed round-the-clock by certified mountaineers with solar/power backup and emergency first-aid kits.'
            }
        ],
        cta: {
            text: 'Plan a Camping Trip',
            href: '/packages?category=camping'
        },
        image: {
            src: '/img/images/tripdhara_camping.png',
            alt: 'Riverside & Alpine Camping',
            tag: 'Eco Adventure',
            title: 'Wilderness Glamping',
            subtitle: 'Rishikesh Ganga Sands & Chopta Meadows'
        }
    }
];

export default function AccommodationPage() {
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tripdhara.in';

    const schemaJsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                    {
                        '@type': 'ListItem',
                        'position': 1,
                        'name': 'Home',
                        'item': `${siteUrl}/`
                    },
                    {
                        '@type': 'ListItem',
                        'position': 2,
                        'name': 'Accommodation',
                        'item': `${siteUrl}/accommodation`
                    }
                ]
            },
            {
                '@type': 'Service',
                'name': 'Himalayan Stays & Accommodations',
                'provider': {
                    '@type': 'TravelAgency',
                    'name': 'Tripdhara',
                    'url': siteUrl,
                    'telephone': '+91-7017288052'
                },
                'serviceType': 'Homestays, Luxury Resorts & Camping',
                'areaServed': ['Uttarakhand', 'Himachal Pradesh', 'Mukteshwar', 'Chopta', 'Auli', 'Rishikesh', 'Mussoorie', 'Manali'],
                'description': 'Pre-verified Pahadi homestays, independent mountain hotels with valley views, and riverside luxury camping.'
            }
        ]
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
            />

            {/* Subpage Hero with dedicated luxury resort image */}
            <PageHero
                image="/img/images/luxury_resort.png"
                badge="Comfort & Safety"
                title="Mountain Accommodations"
                subtitle="Experience genuine Himalayan warmth with handpicked homestays, valley-view hotels, and riverside eco-camps across Uttarakhand and Himachal."
            />

            {/* Dynamic Quick Pillars */}
            <section className="relative -mt-10 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {ACCOMMODATION_SECTIONS.map((item) => {
                        const Icon = item.icon;
                        return (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-4 hover:shadow-xl hover:border-primary-200 transition-all group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{item.quickPillar.title}</h3>
                                    <p className="text-gray-500 text-sm">{item.quickPillar.subtitle}</p>
                                </div>
                            </a>
                        );
                    })}
                </div>
            </section>

            {/* Dynamic Detailed Stays Section (DRY Component Rendering) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">
                {ACCOMMODATION_SECTIONS.map((item, index) => {
                    const isEven = index % 2 === 1;
                    return (
                        <div
                            key={item.id}
                            id={item.id}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
                        >
                            {/* Text / Content Column */}
                            <div className={`lg:col-span-7 space-y-6 ${isEven ? 'order-1 lg:order-2' : ''}`}>
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${item.theme.badgeBg} ${item.theme.badgeText} text-xs font-semibold tracking-wide uppercase`}>
                                    <Sparkles className="w-3.5 h-3.5" />
                                    {item.tagline}
                                </div>

                                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                                    {item.title}
                                </h2>

                                {item.paragraphs.map((para, pIdx) => (
                                    <p key={pIdx} className="text-gray-600 text-lg leading-relaxed">
                                        {para}
                                    </p>
                                ))}

                                {item.benefits && item.benefits.length > 0 && (
                                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                                        <h3 className="font-bold text-gray-900 text-base">{item.benefitsTitle}</h3>
                                        <ul className="space-y-3">
                                            {item.benefits.map((benefit, bIdx) => (
                                                <li key={bIdx} className="flex items-start gap-3 text-sm text-gray-600">
                                                    <CheckCircle2 className={`w-5 h-5 ${item.theme.checkIcon} flex-shrink-0 mt-0.5`} />
                                                    <span>
                                                        <strong className="text-gray-900">{benefit.label}: </strong>
                                                        {benefit.text}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {item.extraInfo && (
                                    <div className="p-4 bg-gray-100/70 rounded-xl text-sm text-gray-700">
                                        <strong className="text-gray-900">{item.extraInfo.label}: </strong>
                                        {item.extraInfo.text}
                                    </div>
                                )}

                                <div>
                                    <Link
                                        href={item.cta.href}
                                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-md transition-all group"
                                    >
                                        <span>{item.cta.text}</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>

                            {/* Image Showcase Column */}
                            <div className={`lg:col-span-5 relative ${isEven ? 'order-2 lg:order-1' : ''}`}>
                                <div className="relative h-[380px] sm:h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                                    <Image
                                        src={item.image.src}
                                        alt={item.image.alt}
                                        fill
                                        priority={index === 0}
                                        loading={index === 0 ? "eager" : "lazy"}
                                        sizes="(max-width: 1024px) 100vw, 40vw"
                                        className="object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 right-6 text-white">
                                        <span className="text-xs uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md font-semibold">
                                            {item.image.tag}
                                        </span>
                                        <h4 className="text-xl font-bold mt-2">{item.image.title}</h4>
                                        <p className="text-sm text-gray-200">{item.image.subtitle}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* Helpline / Custom Booking CTA Banner */}
            <section className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-800 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-primary-100 text-xs font-semibold uppercase tracking-wider">
                        <ShieldCheck className="w-4 h-4" />
                        100% Verified Local Stays
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-display">
                        Need Help Finding the Perfect Mountain Stay?
                    </h2>
                    <p className="text-lg text-primary-100 max-w-2xl mx-auto font-light leading-relaxed">
                        Our local Himalayan travel desk is available 24/7 to connect you with trusted hosts, arrange room bookings, or design custom village retreats.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                        <a
                            href="tel:+917017288052"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-primary-700 hover:bg-gray-100 font-bold rounded-2xl shadow-xl transition-all"
                        >
                            <PhoneCall className="w-5 h-5 text-primary-600" />
                            <span>Call Helpline: +91 70172 88052</span>
                        </a>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-800/60 hover:bg-primary-800 text-white font-semibold rounded-2xl border border-white/20 backdrop-blur-md transition-all"
                        >
                            <span>Send Custom Inquiry</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
