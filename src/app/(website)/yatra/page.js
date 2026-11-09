import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, CheckCircle2, PhoneCall, ArrowRight, ShieldCheck, Compass } from 'lucide-react';
import PageHero from '@/app/components/PageHero.js';
import { createMetadata } from '@/core/Helpers/metadata.js';

export const metadata = createMetadata({
    title: 'Sacred Char Dham Yatras & Himalayan Treks | Tripdhara',
    description: 'Book organized Char Dham Yatras (Kedarnath, Badrinath, Gangotri, Yamunotri) and guided pilgrimage treks to Vasuki Tal & Triyuginarayan with native Pahadi guides.',
    path: '/yatra',
    image: '/img/images/og-banner.png',
    keywords: [
        'Char Dham Yatra Packages',
        'Kedarnath Yatra Package',
        'Badrinath Yatra Tour',
        'Gangotri Yamunotri Tour',
        'Vasuki Tal Trek',
        'Triyuginarayan Trek',
        'Uttarakhand Pilgrimage Tours',
        'Chardham Helicopter Assistance'
    ]
});

export default function YatraPage() {
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
                        'name': 'Yatras & Pilgrimage Treks',
                        'item': `${siteUrl}/yatra`
                    }
                ]
            },
            {
                '@type': 'Service',
                'name': 'Chardham Yatra & Himalayan Custom Tour Packages',
                'provider': {
                    '@type': 'TravelAgency',
                    'name': 'Tripdhara',
                    'url': siteUrl,
                    'telephone': '+91-7017288052'
                },
                'serviceType': 'Pilgrimage Tours, Chardham Yatra, Custom Himalayan Circuits',
                'areaServed': ['Yamunotri', 'Gangotri', 'Kedarnath', 'Badrinath', 'Chopta', 'Auli', 'Uttarakhand', 'Spiti Valley'],
                'description': 'All-inclusive Chardham Yatra pilgrimage packages, SUV travel with Pahadi chauffeurs, hotel stays, helicopter ticketing assistance, and custom itineraries.'
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
                image="/img/images/package.png"
                badge="Sacred & Scenic"
                title="Tour Packages & Yatras"
                subtitle="All-inclusive Char Dham pilgrimage circuits, sacred valley expeditions, helicopter assistance, and guided high-altitude Himalayan treks."
            />

            {/* Quick Yatra Navigation Anchor Pills */}
            <section className="relative -mt-10 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white/95 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-primary-600">
                        <Compass className="w-4 h-4" />
                        <span>Quick Circuit Navigation</span>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                        <a href="#chardham" className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-primary-50 hover:text-primary-700 text-xs font-semibold text-gray-700 transition-colors">
                            Char Dham (10D/9N)
                        </a>
                        <a href="#kedarnath-yatra" className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-primary-50 hover:text-primary-700 text-xs font-semibold text-gray-700 transition-colors">
                            Kedarnath Yatra
                        </a>
                        <a href="#badrinath-yatra" className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-primary-50 hover:text-primary-700 text-xs font-semibold text-gray-700 transition-colors">
                            Badrinath Yatra
                        </a>
                        <a href="#gangotri-yatra" className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-primary-50 hover:text-primary-700 text-xs font-semibold text-gray-700 transition-colors">
                            Gangotri Yatra
                        </a>
                        <a href="#yamunotri-yatra" className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-primary-50 hover:text-primary-700 text-xs font-semibold text-gray-700 transition-colors">
                            Yamunotri Yatra
                        </a>
                        <a href="#kedarnath-trek" className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-primary-50 hover:text-primary-700 text-xs font-semibold text-gray-700 transition-colors">
                            Kedarnath Trek (16km)
                        </a>
                        <a href="#vasukital" className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-primary-50 hover:text-primary-700 text-xs font-semibold text-gray-700 transition-colors">
                            Vasuki Tal (4,135m)
                        </a>
                        <a href="#triyuginarayan" className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-primary-50 hover:text-primary-700 text-xs font-semibold text-gray-700 transition-colors">
                            Triyuginarayan Trek
                        </a>
                    </div>
                </div>
            </section>

            {/* Detailed Yatra & Trek Circuits */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">
                {/* 4.1. Char Dham Yatra */}
                <div id="chardham" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold tracking-wide uppercase">
                            <Sparkles className="w-3.5 h-3.5" />
                            4.1. Complete Pilgrimage
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Sacred Char Dham Yatra
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            The Char Dham Yatra is one of the most sacred Hindu pilgrimages, taking you to the four holy Himalayan shrines: Yamunotri, Gangotri, Kedarnath, and Badrinath.
                        </p>
                        <p className="text-gray-600 text-base leading-relaxed">
                            Completing this Yatra is believed to wash away sins and help achieve Moksha. Each temple represents a unique spiritual energy—from Shiva&apos;s raw cosmic power at Kedarnath to Vishnu&apos;s peaceful benevolence at Badrinath.
                        </p>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                            <h3 className="font-bold text-gray-900 text-base">Package Highlights & Itinerary:</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">10 Days / 9 Nights Complete Circuit:</strong> Haridwar/Rishikesh &rarr; Barkot &rarr; Uttarkashi &rarr; Sonprayag &rarr; Badrinath &rarr; Rishikesh return.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Full Logistics Support:</strong> Pre-booked sanitized hotels, VIP temple darshan slot coordination, helicopter ticketing assistance, and emergency ground guides.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Best Travel Months:</strong> May to June (pleasant summer weather) and September to October (clear alpine skies and autumn colors).</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <Link
                                href="/packages?q=chardham"
                                className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-md transition-all group"
                            >
                                <span>Book Char Dham Yatra</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-5 relative">
                        <div className="relative h-[380px] sm:h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                            <Image
                                src="/img/images/chaardhama_yatra.png"
                                alt="Sacred Char Dham Yatra Uttarakhand"
                                fill
                                priority
                                loading="eager"
                                sizes="(max-width: 1024px) 100vw, 40vw"
                                className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <span className="text-xs uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md font-semibold">10D / 9N Circuit</span>
                                <h4 className="text-xl font-bold mt-2">Yamunotri, Gangotri, Kedarnath, Badrinath</h4>
                                <p className="text-sm text-gray-200">SUV Travel with Native Mountain Chauffeur</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4.2. Kedarnath Yatra */}
                <div id="kedarnath-yatra" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-5 order-2 lg:order-1 relative">
                        <div className="relative h-[380px] sm:h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                            <Image
                                src="/img/images/kedarnath_yatra.png"
                                alt="Kedarnath Temple Lord Shiva Abode"
                                fill
                                sizes="(max-width: 1024px) 100vw, 40vw"
                                className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <span className="text-xs uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md font-semibold">3,584m Altitude</span>
                                <h4 className="text-xl font-bold mt-2">Mandakini River Valley</h4>
                                <p className="text-sm text-gray-200">Bheem Shila Resilient Sanctuary</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold tracking-wide uppercase">
                            <Sparkles className="w-3.5 h-3.5" />
                            4.2. Shiva&apos;s Abode
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Kedarnath Yatra
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Journey to the paramount seat of Lord Shiva. Located at an altitude of 3,584 meters near the glacial source of the Mandakini River, Kedarnath is the most revered of the Panch Kedar shrines.
                        </p>
                        <p className="text-gray-600 text-base leading-relaxed">
                            The ancient monolithic stone temple is an architectural marvel that stood resilient through centuries, protected by the massive divine boulder (Bheem Shila) that rolled behind it during the 2013 floods.
                        </p>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                            <h3 className="font-bold text-gray-900 text-base">Travel & Transit Information:</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Trail Access:</strong> Accessible via a scenic 16km pedestrian/pony trail starting from Sonprayag and Gaurikund.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Aviation & Equine Support:</strong> Helicopter bookings from Phata, Guptkashi, or Sersi; authorized horse and palanquin (dandi) bookings.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Stays & Logistics:</strong> Verified warm cottage accommodation at GMVN basecamp or riverside resorts in Sonprayag & Guptkashi.</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <Link
                                href="/packages?q=kedarnath"
                                className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-md transition-all group"
                            >
                                <span>Book Kedarnath Yatra</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 4.3. Badrinath Yatra */}
                <div id="badrinath-yatra" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold tracking-wide uppercase">
                            <Sparkles className="w-3.5 h-3.5" />
                            4.3. Vishnu&apos;s Sanctuary
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Badrinath Yatra
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Visit the holy abode of Lord Vishnu nestled between the Nar and Narayana mountain ranges. Situated along the banks of the Alaknanda River at 3,133 meters, Badrinath is directly accessible by motorable road, making it exceptionally comfortable for elderly pilgrims and family groups.
                        </p>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                            <h3 className="font-bold text-gray-900 text-base">Journey Highlights:</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Tapt Kund Holy Dip:</strong> Natural sulfur thermal springs right outside the temple where pilgrims take a purifying bath before darshan.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Mana Village Excursion:</strong> Visit the official first village of India just 3km away; explore Vyas Gufa and Ganesh Gufa where the Mahabharata was written.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Saraswati River Origin:</strong> Witness the roaring Saraswati river surge from the mountain rocks under the natural Bheem Pul bridge.</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <Link
                                href="/packages?q=badrinath"
                                className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-md transition-all group"
                            >
                                <span>Book Badrinath Yatra</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-5 relative">
                        <div className="relative h-[380px] sm:h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                            <Image
                                src="/img/images/badrinath_yatra.png"
                                alt="Badrinath Temple Alaknanda River Valley"
                                fill
                                sizes="(max-width: 1024px) 100vw, 40vw"
                                className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <span className="text-xs uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md font-semibold">3,133m Elevation</span>
                                <h4 className="text-xl font-bold mt-2">Badrinath & Mana Village</h4>
                                <p className="text-sm text-gray-200">Nar-Narayana Himalayan Range</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4.4. Gangotri Yatra */}
                <div id="gangotri-yatra" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-5 order-2 lg:order-1 relative">
                        <div className="relative h-[380px] sm:h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                            <Image
                                src="/img/images/gangotri_yatra.png"
                                alt="Gangotri Temple Source of River Ganga"
                                fill
                                sizes="(max-width: 1024px) 100vw, 40vw"
                                className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <span className="text-xs uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md font-semibold">Bhagirathi Gorge</span>
                                <h4 className="text-xl font-bold mt-2">White Granite Temple</h4>
                                <p className="text-sm text-gray-200">Harsil Apple Valley & Cedar Forests</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-semibold tracking-wide uppercase">
                            <Sparkles className="w-3.5 h-3.5" />
                            4.4. Source of Ganga
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Gangotri Yatra
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Journey to the spiritual birthplace of the sacred river Ganga. Located at 3,100 meters, the magnificent white granite temple stands amidst deodar cedar forests and snow-covered peaks in the Bhagirathi valley.
                        </p>
                        <p className="text-gray-600 text-base leading-relaxed">
                            Dedicated to Goddess Ganga, marking the spot where the river descended to earth from Lord Shiva&apos;s matted locks in answer to King Bhagirath&apos;s intense penance.
                        </p>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                            <h3 className="font-bold text-gray-900 text-base">Route & Scenic Information:</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Harsil Valley Drive:</strong> Drive through the picturesque Harsil valley, renowned worldwide for organic red apple orchards and wooden deodar cabins.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Seamless Road Access:</strong> Smooth tarmac highway connecting Uttarkashi directly to the temple gates with zero strenuous uphill trekking.</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <Link
                                href="/packages?q=gangotri"
                                className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-md transition-all group"
                            >
                                <span>Book Gangotri Yatra</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 4.5. Yamunotri Yatra */}
                <div id="yamunotri-yatra" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold tracking-wide uppercase">
                            <Sparkles className="w-3.5 h-3.5" />
                            4.5. The Sun&apos;s Daughter
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Yamunotri Yatra
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            The auspicious first shrine of the traditional Char Dham pilgrimage. Tucked away in a narrow cliffside gorge of the Bandarpoonch peaks, Yamunotri is the birthplace and sacred seat of the Yamuna River.
                        </p>
                        <p className="text-gray-600 text-base leading-relaxed">
                            Dedicated to Goddess Yamuna, daughter of Surya Dev (Sun God). A holy dip in the icy river waters is believed in Vedic scriptures to protect devotees from untimely distress and Yama&apos;s judgement.
                        </p>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                            <h3 className="font-bold text-gray-900 text-base">Travel Experience:</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">The 6km Mountain Walk:</strong> A paved, scenic trail alongside river cliffs from Janki Chatti basecamp (ponies & palanquins available).</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Surya Kund Thermal Prasad:</strong> Natural boiling sulfur springs where pilgrims immerse rice and potatoes in cloth bags to cook consecrated prasad.</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <Link
                                href="/packages?q=yamunotri"
                                className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-md transition-all group"
                            >
                                <span>Book Yamunotri Yatra</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-5 relative">
                        <div className="relative h-[380px] sm:h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                            <Image
                                src="/img/images/yamunotri_yatra.png"
                                alt="Yamunotri Temple Bandarpoonch Gorge"
                                fill
                                sizes="(max-width: 1024px) 100vw, 40vw"
                                className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <span className="text-xs uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md font-semibold">First Dhama</span>
                                <h4 className="text-xl font-bold mt-2">Surya Kund & Divya Shila</h4>
                                <p className="text-sm text-gray-200">Janki Chatti to Yamunotri Gorge</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4.6. Kedarnath Trek Package */}
                <div id="kedarnath-trek" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-5 order-2 lg:order-1 relative">
                        <div className="relative h-[380px] sm:h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                            <Image
                                src="/img/images/kedarnath_trek_package.png"
                                alt="Kedarnath 16km Trekking Package Trail"
                                fill
                                sizes="(max-width: 1024px) 100vw, 40vw"
                                className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <span className="text-xs uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md font-semibold">16km Mountain Trail</span>
                                <h4 className="text-xl font-bold mt-2">Gaurikund to Kedarnath Dham</h4>
                                <p className="text-sm text-gray-200">Lincholi, Bheembali & Jungle Chatti</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold tracking-wide uppercase">
                            <Sparkles className="w-3.5 h-3.5" />
                            4.6. Pilgrim Trail
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Kedarnath Guided Trek Package
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            A spiritually transformative walk across the heart of the Garhwal Himalayas. The 16km pedestrian trail from Gaurikund takes you through thundering waterfalls, glacial streams, and high cliff switchbacks.
                        </p>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                            <h3 className="font-bold text-gray-900 text-base">Preparation & Trail Details:</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Difficulty Grade:</strong> Moderate to Demanding. Elevation surges from 1,980m at Gaurikund to 3,584m at the temple shrine.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Rest Halts & Acclimatization:</strong> Verified overnight stops at Lincholi or Bheembali with insulated tents and hot vegetarian food.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Mountain Porter Care:</strong> Experienced native porters handle luggage burdens so you can focus entirely on your pilgrimage.</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <Link
                                href="/packages?q=kedarnath"
                                className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-md transition-all group"
                            >
                                <span>Book Kedarnath Trek</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 4.7. Vasuki Tal Trek */}
                <div id="vasukital" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold tracking-wide uppercase">
                            <Sparkles className="w-3.5 h-3.5" />
                            4.7. Glacial Lakes
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Vasuki Tal High-Altitude Trek
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            For seasoned mountain lovers, this trail climbs 8km beyond the Kedarnath temple to a pristine glacial tarn situated at an astonishing 4,135 meters.
                        </p>
                        <p className="text-gray-600 text-base leading-relaxed">
                            Walk along moraines, cross the edge of the Chaturangi glacier, and gaze upon the reflection of the Chaukhamba massif in still alpine waters where the mystical Brahma Kamal flower blooms.
                        </p>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                            <h3 className="font-bold text-gray-900 text-base">Trek Specifications:</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Difficulty Grade:</strong> Strenuous. Requires solid high-altitude endurance and mandatory local certified mountaineering guides.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Optimal Season:</strong> September to October offers clear vistas, stable moraines, and minimal rainfall risks.</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <Link
                                href="/packages?q=vasukital"
                                className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-md transition-all group"
                            >
                                <span>Book Vasuki Tal Trek</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-5 relative">
                        <div className="relative h-[380px] sm:h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                            <Image
                                src="/img/images/vasuki_tal_trek.png"
                                alt="Vasuki Tal Glacial Lake Chaukhamba Peaks"
                                fill
                                sizes="(max-width: 1024px) 100vw, 40vw"
                                className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <span className="text-xs uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md font-semibold">4,135m Altitude</span>
                                <h4 className="text-xl font-bold mt-2">Brahma Kamal Glacial Sanctuary</h4>
                                <p className="text-sm text-gray-200">Beyond Kedarnath Dham Ridge</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4.8. Triyuginarayan Trek */}
                <div id="triyuginarayan" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-5 order-2 lg:order-1 relative">
                        <div className="relative h-[380px] sm:h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                            <Image
                                src="/img/images/triyuginarayan_trek.png"
                                alt="Triyuginarayan Temple Akhand Dhuni Shiva Parvati Wedding"
                                fill
                                sizes="(max-width: 1024px) 100vw, 40vw"
                                className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <span className="text-xs uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md font-semibold">Akhand Dhuni</span>
                                <h4 className="text-xl font-bold mt-2">Celestial Wedding Shrine</h4>
                                <p className="text-sm text-gray-200">Sonprayag to Triyuginarayan Forest Trail</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold tracking-wide uppercase">
                            <Sparkles className="w-3.5 h-3.5" />
                            4.8. Mythological Paths
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Triyuginarayan Celestial Trek
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Walk through serene pine forests and rustic Garhwali hamlets to the timeless stone temple where Lord Shiva and Goddess Parvati were married in the presence of Lord Vishnu and Lord Brahma.
                        </p>
                        <p className="text-gray-600 text-base leading-relaxed">
                            The temple houses the sacred perpetual flame (Akhand Dhuni) that has been kept burning continuously across millennia since the marriage took place in Satya Yuga.
                        </p>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                            <h3 className="font-bold text-gray-900 text-base">Trek Highlights:</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Gentle Trail:</strong> Easy to Moderate 9km gradual ascent starting from Sonprayag amidst bubbling mountain brooks.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                                    <span><strong className="text-gray-900">Warm Village Hospitality:</strong> Savor organic Pahadi meals and fresh herbal chai at heritage village homestays near the temple quadrangle.</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <Link
                                href="/packages?q=triyuginarayan"
                                className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-md transition-all group"
                            >
                                <span>Book Triyuginarayan Trek</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Helpline / Custom Pilgrimage Booking CTA Banner */}
            <section className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-800 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-primary-100 text-xs font-semibold uppercase tracking-wider">
                        <ShieldCheck className="w-4 h-4" />
                        100% Authorized Pilgrimage Operators
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-display">
                        Planning a Custom Char Dham or High-Altitude Yatra?
                    </h2>
                    <p className="text-lg text-primary-100 max-w-2xl mx-auto font-light leading-relaxed">
                        Our Haridwar and Rishikesh pilgrimage coordinators will craft custom family itineraries, VIP darshan passes, and luxury SUV transit tailored to your schedule.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                        <a
                            href="tel:+917017288052"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-primary-700 hover:bg-gray-100 font-bold rounded-2xl shadow-xl transition-all"
                        >
                            <PhoneCall className="w-5 h-5 text-primary-600" />
                            <span>Call Pilgrimage Desk: +91 70172 88052</span>
                        </a>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-800/60 hover:bg-primary-800 text-white font-semibold rounded-2xl border border-white/20 backdrop-blur-md transition-all"
                        >
                            <span>Inquire for Custom Circuit</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
