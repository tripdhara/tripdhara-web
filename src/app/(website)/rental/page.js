import Image from 'next/image';
import Link from 'next/link';
import { Car, Bike, ShieldCheck, CheckCircle2, PhoneCall, ArrowRight, Sparkles, UserCheck } from 'lucide-react';
import PageHero from '@/app/components/PageHero.js';
import { createMetadata } from '@/core/Helpers/metadata.js';

export const metadata = createMetadata({
    title: 'Travel & Vehicle Rental Services | Tripdhara',
    description: 'Rent self-drive cars (Thar, Scorpio), adventure motorcycles (Royal Enfield Himalayan, Classic, XPulse), or book chauffeur-driven mountain SUVs across Uttarakhand and Himachal.',
    path: '/rental',
    image: '/img/images/og-banner.png',
    keywords: [
        'Bike Rental Rishikesh',
        'Scooter Rental Dehradun',
        'Self Drive Car Rental Uttarakhand',
        'Royal Enfield Rental Himalayas',
        'Chauffeur Driven SUV Rishikesh',
        'Char Dham Cab Booking',
        'Innova Crysta Rental'
    ]
});

export default function RentalPage() {
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
                        'name': 'Travel & Rentals',
                        'item': `${siteUrl}/rental`
                    }
                ]
            },
            {
                '@type': 'Service',
                'name': 'Himalayan Mountain Travel & Vehicle Rentals',
                'provider': {
                    '@type': 'TravelAgency',
                    'name': 'Tripdhara',
                    'url': siteUrl,
                    'telephone': '+91-7017288052'
                },
                'serviceType': 'Car Rental, Bike Rental & Chauffeur SUV Booking',
                'areaServed': ['Uttarakhand', 'Himachal Pradesh', 'Dehradun', 'Rishikesh', 'Mussoorie', 'Chopta', 'Auli', 'Kedarnath', 'Badrinath'],
                'description': 'Rent adventure bikes (Royal Enfield Himalayan 450, Classic 350, XPulse 200), self-drive cars, or book veteran Pahadi mountain chauffeurs in Fortuner and Innova Crysta SUVs.'
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

            {/* Subpage Hero */}
            <PageHero
                image="/img/images/adventure_bike.png"
                badge="Himalayan Transit"
                title="Travel & Transport Services"
                subtitle="Rent reliable self-drive cars, conquer mountain curves on adventure motorcycles, or relax in premium chauffeur-driven SUVs across Uttarakhand."
            />

            {/* Quick Feature Pillars */}
            <section className="relative -mt-10 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <a href="#car-rental" className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-4 hover:shadow-xl hover:border-primary-200 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Car className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">Self-Drive Cars</h3>
                            <p className="text-gray-500 text-sm">Thar, Scorpio, Brezza with unlimited kms</p>
                        </div>
                    </a>

                    <a href="#bike-rental" className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-4 hover:shadow-xl hover:border-primary-200 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Bike className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">Adventure Bikes</h3>
                            <p className="text-gray-500 text-sm">Himalayan 450, Classic 350, XPulse & Scooters</p>
                        </div>
                    </a>

                    <a href="#chauffeur" className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-4 hover:shadow-xl hover:border-primary-200 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <UserCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">Mountain Chauffeurs</h3>
                            <p className="text-gray-500 text-sm">Innova Crysta, Fortuner & Char Dham Cabs</p>
                        </div>
                    </a>
                </div>
            </section>

            {/* Detailed Transport Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">
                {/* 1. Self-Drive Car Rentals */}
                <div id="car-rental" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold tracking-wide uppercase">
                            <Sparkles className="w-3.5 h-3.5" />
                            3.1. Self-Drive Cars
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Self-Drive Mountain Car Rentals
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Travel at your own pace with our reliable self-drive car rentals. Perfect for families or groups who desire complete privacy and the freedom to pause whenever a panoramic Himalayan viewpoint captures their eye.
                        </p>
                        <p className="text-gray-600 text-base leading-relaxed">
                            All vehicles undergo strict multi-point servicing, sanitization, and tire/brake safety checks before every handover. Enjoy transparent pricing with zero hidden surcharges.
                        </p>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                            <h3 className="font-bold text-gray-900 text-base">Vehicle Options & Benefits:</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Rugged Mountain SUVs:</strong> Mahindra Thar, Scorpio N, Brezza, and Creta with high ground clearance and tuned suspensions built for mountain gravel.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Unlimited Kilometers:</strong> Drive without mileage anxieties or unexpected per-kilometer penalties.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Fast Seamless Pickup:</strong> Simply present a valid LMV driving license and Government photo ID at our Rishikesh or Dehradun hubs.</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <Link
                                href="/packages?category=rental"
                                className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-md transition-all group"
                            >
                                <span>Rent a Self-Drive Car</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-5 relative">
                        <div className="relative h-[380px] sm:h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                            <Image
                                src="/img/images/tripdhara_car.png"
                                alt="Self Drive Car Rental Uttarakhand"
                                fill
                                sizes="(max-width: 1024px) 100vw, 40vw"
                                className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <span className="text-xs uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md font-semibold">Self-Drive Fleet</span>
                                <h4 className="text-xl font-bold mt-2">Thar 4x4, Scorpio & Brezza</h4>
                                <p className="text-sm text-gray-200">Dehradun Airport & Rishikesh Pickup</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Adventure Motorcycles & Two-Wheelers */}
                <div id="bike-rental" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-5 order-2 lg:order-1 relative">
                        <div className="relative h-[380px] sm:h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                            <Image
                                src="/img/images/tripdhara_bike.png"
                                alt="Adventure Bike Rental Royal Enfield Himalayan"
                                fill
                                sizes="(max-width: 1024px) 100vw, 40vw"
                                className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <span className="text-xs uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md font-semibold">Rider&apos;s Paradise</span>
                                <h4 className="text-xl font-bold mt-2">Himalayan 450 & Classic 350</h4>
                                <p className="text-sm text-gray-200">Includes DOT/ISI Certified Helmets</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold tracking-wide uppercase">
                            <Sparkles className="w-3.5 h-3.5" />
                            3.2. Two-Wheeler Rentals
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Adventure Motorcycles & Scooters
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            For the solo rider and two-wheeled wanderer, renting a motorcycle is the quintessential way to experience the winding mountain turns, fresh pine breeze, and secluded village roads.
                        </p>
                        <p className="text-gray-600 text-base leading-relaxed">
                            Pick up your ride along with sanitized helmets from our Tapovan, Rishikesh hub. Every two-wheeler undergoes an exhaustive 12-point pre-rental safety check (chain tension, brake pads, fluids, tires).
                        </p>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                            <h3 className="font-bold text-gray-900 text-base">Available Fleet:</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Royal Enfield Himalayan 450:</strong> The liquid-cooled powerhouse built for steep climbs, gravel tracks, and high-altitude touring.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Royal Enfield Classic 350:</strong> The iconic thump, delivering comfortable low-end torque for leisurely mountain highway cruising.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Hero XPulse 200 & Scooters:</strong> Ultra-lightweight agility for quick cafe hops, local waterfalls, and narrow dirt tracks.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="p-4 bg-gray-100/70 rounded-xl text-sm text-gray-700">
                            <strong className="text-gray-900">Mountain Rider Safety Guidelines:</strong> Always wear your helmet, stay strictly left on blind hairpin bends, avoid riding after sundown, and verify tire pressure daily before summit rides.
                        </div>

                        <div>
                            <Link
                                href="/packages?category=rental"
                                className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-md transition-all group"
                            >
                                <span>Rent an Adventure Bike</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 3. Chauffeur-Driven Mountain SUVs */}
                <div id="chauffeur" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold tracking-wide uppercase">
                            <Sparkles className="w-3.5 h-3.5" />
                            3.3. Mountain Chauffeurs
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Premium Chauffeur-Driven SUVs
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Mountain driving demands specialized skills and intense concentration. Rest your hands and savor the scenery by traveling with a professional, vetted local chauffeur who has spent decades mastering the Himalayan roads.
                        </p>
                        <p className="text-gray-600 text-base leading-relaxed">
                            Our drivers are native Pahadi experts who master downhill engine braking, slow-curve passing etiquette, and changing mountain weather conditions without risking passenger comfort.
                        </p>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                            <h3 className="font-bold text-gray-900 text-base">Why Book Chauffeur Cars:</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Stress-Free Transit:</strong> Zero worry over steep single-lane climbs, tight parking spaces, or landslide detours.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Chauffeur as Local Insider:</strong> Your driver recommends clean family-friendly dhabas, secret photo points, and verified rest stops.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Ideal Fleet for Groups:</strong> Toyota Innova Crysta, Fortuner, and Tempo Travellers tailored for Char Dham Yatra and family pilgrimages.</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <Link
                                href="/packages?category=rental"
                                className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-md transition-all group"
                            >
                                <span>Book Chauffeur-Driven SUV</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-5 relative">
                        <div className="relative h-[380px] sm:h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                            <Image
                                src="/img/images/tripdhara_chauffer_car.png"
                                alt="Premium Chauffeur Driven SUV Mountain Cabs"
                                fill
                                sizes="(max-width: 1024px) 100vw, 40vw"
                                className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <span className="text-xs uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md font-semibold">Chauffeur Fleet</span>
                                <h4 className="text-xl font-bold mt-2">Innova Crysta & Fortuner</h4>
                                <p className="text-sm text-gray-200">Char Dham, Mussoorie, Chopta & Spiti</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Helpline / Custom Booking CTA Banner */}
            <section className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-800 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-primary-100 text-xs font-semibold uppercase tracking-wider">
                        <ShieldCheck className="w-4 h-4" />
                        100% Inspected & Sanitized Vehicles
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-display">
                        Need Custom Cab Rental or Airport Transit?
                    </h2>
                    <p className="text-lg text-primary-100 max-w-2xl mx-auto font-light leading-relaxed">
                        Book instant pickup from Dehradun Jolly Grant Airport (DED), Haridwar Railway Station, or plan a multi-day Himalayan expedition.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                        <a
                            href="tel:+917017288052"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-primary-700 hover:bg-gray-100 font-bold rounded-2xl shadow-xl transition-all"
                        >
                            <PhoneCall className="w-5 h-5 text-primary-600" />
                            <span>Call Transport Desk: +91 70172 88052</span>
                        </a>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-800/60 hover:bg-primary-800 text-white font-semibold rounded-2xl border border-white/20 backdrop-blur-md transition-all"
                        >
                            <span>Request Custom Transport Quote</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
