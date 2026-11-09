import Image from 'next/image';
import Link from 'next/link';
import { Compass, Footprints, Wind, Zap, CheckCircle2, PhoneCall, ArrowRight, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';
import PageHero from '@/app/components/PageHero.js';
import { createMetadata } from '@/core/Helpers/metadata.js';

export const metadata = createMetadata({
    title: 'Himalayan Adventure Activities | Tripdhara',
    description: 'Book verified adventure activities in Rishikesh & Uttarakhand including white water river rafting, 83m bungee jump, paragliding, and guided Himalayan trekking.',
    path: '/activities',
    image: '/img/images/og-banner.png',
    keywords: [
        'Rishikesh River Rafting',
        'Bungee Jumping Rishikesh',
        'Tandem Paragliding Uttarakhand',
        'Himalayan Trekking Packages',
        'Adventure Sports Himalayas',
        'Nag Tibba Trek',
        'Chopta Tungnath Trek'
    ]
});

export default function ActivitiesPage() {
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
                        'name': 'Activities',
                        'item': `${siteUrl}/activities`
                    }
                ]
            },
            {
                '@type': 'Service',
                'name': 'Himalayan Outdoor & Adventure Sports',
                'provider': {
                    '@type': 'TravelAgency',
                    'name': 'Tripdhara',
                    'url': siteUrl,
                    'telephone': '+91-7017288052'
                },
                'serviceType': 'River Rafting, Bungee Jumping, Paragliding & Trekking',
                'areaServed': ['Rishikesh', 'Chopta', 'Bir Billing', 'Uttarakhand', 'Himachal Pradesh'],
                'description': 'Certified outdoor adventure bookings including white-water rafting in Rishikesh, 83m bungee jump, tandem paragliding, and guided Himalayan treks.'
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
                image="/img/images/hero_background.png"
                badge="High Adrenaline"
                title="Himalayan Adventure Activities"
                subtitle="From world-class Ganga white-water rapids and 83m bungee drops to soaring paragliding joyrides and alpine summit trails."
            />

            {/* Quick Activity Pillars */}
            <section className="relative -mt-10 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    <a href="#rafting" className="bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3.5 hover:shadow-xl hover:border-primary-200 transition-all group">
                        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Compass className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-sm sm:text-base">River Rafting</h3>
                            <p className="text-gray-500 text-xs hidden sm:block">Grade II to IV rapids</p>
                        </div>
                    </a>

                    <a href="#trekking" className="bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3.5 hover:shadow-xl hover:border-primary-200 transition-all group">
                        <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Footprints className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-sm sm:text-base">Guided Treks</h3>
                            <p className="text-gray-500 text-xs hidden sm:block">Easy to summit passes</p>
                        </div>
                    </a>

                    <a href="#bungee" className="bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3.5 hover:shadow-xl hover:border-primary-200 transition-all group">
                        <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Zap className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-sm sm:text-base">Bungee Jump</h3>
                            <p className="text-gray-500 text-xs hidden sm:block">83m cantilever free-fall</p>
                        </div>
                    </a>

                    <a href="#paragliding" className="bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3.5 hover:shadow-xl hover:border-primary-200 transition-all group">
                        <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Wind className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-sm sm:text-base">Paragliding</h3>
                            <p className="text-gray-500 text-xs hidden sm:block">Tandem thermal flights</p>
                        </div>
                    </a>
                </div>
            </section>

            {/* Detailed Activities Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">
                {/* 1. River Rafting */}
                <div id="rafting" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold tracking-wide uppercase">
                            <Sparkles className="w-3.5 h-3.5" />
                            2.1. White Water Rapids
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Ganga River Rafting in Rishikesh
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Rishikesh is home to some of the finest white-water rapids in the world. Navigate the emerald waters of the holy Ganga as it cuts through the rugged Shivalik gorges, led by internationally certified river captains.
                        </p>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                            <h3 className="font-bold text-gray-900 text-base">Experience Highlights:</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Rapids for Everyone:</strong> From beginner-friendly Grade II stretches (Club House, Double Trouble) to pulse-pounding Grade III+ giants (Roller Coaster, Golf Course).</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Body Surfing:</strong> Float freely on serene river currents with high-buoyancy life jackets under the supervision of your safety crew.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Cliff Jumping:</strong> Leap into natural deep-river pools from 20-30ft rock ledges along the scenic rafting route.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div className="p-4 bg-gray-100/70 rounded-xl">
                                <strong className="text-gray-900 block mb-1">Safety & Regulations</strong>
                                Certified river captain, accompanying rescue kayaker, US Coast Guard approved life jackets and helmets.
                            </div>
                            <div className="p-4 bg-gray-100/70 rounded-xl">
                                <strong className="text-gray-900 block mb-1">Operating Season</strong>
                                Late September to mid-June. Closed during monsoons (July to mid-September).
                            </div>
                        </div>

                        <div>
                            <Link
                                href="/packages?category=rafting"
                                className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-md transition-all group"
                            >
                                <span>Book Rafting Slot</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-5 relative">
                        <div className="relative h-[380px] sm:h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                            <Image
                                src="/img/images/tripdhara_rafting.png"
                                alt="White Water River Rafting Rishikesh"
                                fill
                                priority
                                loading="eager"
                                sizes="(max-width: 1024px) 100vw, 40vw"
                                className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <span className="text-xs uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md font-semibold">Ganga Rapids</span>
                                <h4 className="text-xl font-bold mt-2">12km, 16km & 24km Expeditions</h4>
                                <p className="text-sm text-gray-200">Shivpuri to NIM Beach, Rishikesh</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Guided Wilderness Trekking */}
                <div id="trekking" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-5 order-2 lg:order-1 relative">
                        <div className="relative h-[380px] sm:h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                            <Image
                                src="/img/images/tripdhara_trekking.png"
                                alt="Himalayan Guided Trekking Trails"
                                fill
                                sizes="(max-width: 1024px) 100vw, 40vw"
                                className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <span className="text-xs uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md font-semibold">Alpine Trails</span>
                                <h4 className="text-xl font-bold mt-2">Pahadi Bugyals & Glacial Passes</h4>
                                <p className="text-sm text-gray-200">Garhwal & Kumaon Himalayas</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold tracking-wide uppercase">
                            <Sparkles className="w-3.5 h-3.5" />
                            2.2. Mountain Trails
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Guided Wilderness Trekking
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Walk through ancient deodar and rhododendron groves, cross alpine ridge lines, and camp on high-altitude bugyals. We lead personalized small-group treks tailored for every experience level.
                        </p>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                            <h3 className="font-bold text-gray-900 text-base">Trek Difficulty Levels:</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Easy (Beginner-Friendly):</strong> Deoriatal-Chandrashila summit, Nag Tibba, Chopta Tungnath. Ideal for families and weekend explorers.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Moderate (Solid Fitness):</strong> Har Ki Dun, Valley of Flowers, Dayara Bugyal, Kedarkantha snow trail.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Difficult (High Altitude Passes):</strong> Roopkund, Kedartal, Bali Pass, Pin Parvati pass. Designed for seasoned mountaineers.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="p-4 bg-gray-100/70 rounded-xl text-sm text-gray-700">
                            <strong className="text-gray-900">What to Expect:</strong> Certified local mountain leaders, full porter/mule support for heavy logistics, fresh nutritious campsite meals, and high-altitude emergency oxygen kits.
                        </div>

                        <div>
                            <Link
                                href="/packages?category=trekking"
                                className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-md transition-all group"
                            >
                                <span>Explore Trek Packages</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 3. Bungee Jumping */}
                <div id="bungee" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold tracking-wide uppercase">
                            <Sparkles className="w-3.5 h-3.5" />
                            2.3. Free Fall
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            India&apos;s Highest 83m Bungee Jumping
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Take the ultimate leap of faith from India’s highest fixed-platform cantilever site at Mohan Chatti, Rishikesh. Drop 83 meters over the Hyul river tributary surrounded by cliff faces.
                        </p>
                        <p className="text-gray-600 text-base leading-relaxed">
                            Operated strictly under Australian and New Zealand safety standards with veteran Jump Masters. Triple-redundancy cords, body harnesses, and precision engineering ensure 100% safety.
                        </p>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-rose-500" />
                                <span>Safety & Eligibility FAQs:</span>
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <h4 className="font-semibold text-gray-900">Age & Weight Limits:</h4>
                                    <p className="text-gray-600 mt-0.5">Minimum age: 12 years. Minimum weight: 35 kg, Maximum weight: 110 kg.</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <h4 className="font-semibold text-gray-900">Medical Restrictions:</h4>
                                    <p className="text-gray-600 mt-0.5">Not permitted for guests with heart conditions, epilepsy, recent fractures, high blood pressure, or pregnancy.</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <Link
                                href="/packages?category=bungee"
                                className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-md transition-all group"
                            >
                                <span>Book Bungee Jump</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-5 relative">
                        <div className="relative h-[380px] sm:h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                            <Image
                                src="/img/images/tripdhara_bungee.png"
                                alt="India's Highest 83m Bungee Jump Mohan Chatti Rishikesh"
                                fill
                                sizes="(max-width: 1024px) 100vw, 40vw"
                                className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <span className="text-xs uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md font-semibold">83 Meters Drop</span>
                                <h4 className="text-xl font-bold mt-2">Mohan Chatti, Rishikesh</h4>
                                <p className="text-sm text-gray-200">International Jump Master Standards</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Paragliding */}
                <div id="paragliding" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-5 order-2 lg:order-1 relative">
                        <div className="relative h-[380px] sm:h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                            <Image
                                src="/img/images/tripdhara_paragliding.png"
                                alt="Tandem Paragliding Joyride Rishikesh Bhimtal"
                                fill
                                sizes="(max-width: 1024px) 100vw, 40vw"
                                className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <span className="text-xs uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md font-semibold">Tandem Flight</span>
                                <h4 className="text-xl font-bold mt-2">Bird&apos;s Eye Valley View</h4>
                                <p className="text-sm text-gray-200">Rishikesh Gorges & Bhimtal Lake</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold tracking-wide uppercase">
                            <Sparkles className="w-3.5 h-3.5" />
                            2.4. Soaring Skies
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Tandem Paragliding Joyrides
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Soar like a Himalayan eagle over the emerald river valleys of Rishikesh or the serene lakes of Bhimtal and Nainital. Experience the exhilaration of free flight without needing any prior training.
                        </p>
                        <p className="text-gray-600 text-base leading-relaxed">
                            You fly securely harnessed with an expert certified pilot who directs takeoff, thermal gliding, and soft grass landing.
                        </p>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                            <h3 className="font-bold text-gray-900 text-base">Safety & Flight Logistics:</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Certified Pilots:</strong> Fly exclusively with licensed veteran pilots boasting 1000+ logged mountain airtime hours.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Equipment Rigor:</strong> Pre-flight wing inspection, emergency reserve parachutes, and lightweight ballistic helmets.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Ideal Flight Season:</strong> September to November and March to June provide peak thermal lift and crystal clear visibility.</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <Link
                                href="/packages?category=paragliding"
                                className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-md transition-all group"
                            >
                                <span>Book Paragliding Flight</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Helpline / Custom Booking CTA Banner */}
            <section className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-800 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-primary-100 text-xs font-semibold uppercase tracking-wider">
                        <ShieldCheck className="w-4 h-4" />
                        100% Certified Outdoor Operators
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-display">
                        Ready for Your Next Himalayan Adventure?
                    </h2>
                    <p className="text-lg text-primary-100 max-w-2xl mx-auto font-light leading-relaxed">
                        Need combo discounts for rafting + camping + bungee? Our certified adventure guides are ready to plan your adrenaline getaway.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                        <a
                            href="tel:+917017288052"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-primary-700 hover:bg-gray-100 font-bold rounded-2xl shadow-xl transition-all"
                        >
                            <PhoneCall className="w-5 h-5 text-primary-600" />
                            <span>Call Adventure Desk: +91 70172 88052</span>
                        </a>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-800/60 hover:bg-primary-800 text-white font-semibold rounded-2xl border border-white/20 backdrop-blur-md transition-all"
                        >
                            <span>Request Adventure Quote</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

