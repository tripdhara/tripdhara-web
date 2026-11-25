import Image from 'next/image';
import Link from 'next/link';
import {
    Compass,
    Search,
    MapPin,
    ArrowRight,
    Star,
    Sparkles,
    ShieldCheck,
    PhoneCall,
    Home,
    Tent,
    Mountain,
    Waves,
    Car,
    Bike,
    Sun,
    Snowflake,
    CloudSun,
    Leaf,
    CheckCircle2,
    Calendar,
    Users
} from 'lucide-react';
import PackageCard from '@/app/components/packages/PackageCard.js';
import { createMetadata } from '@/core/Helpers/metadata.js';
import api from '@/core/Api/public/index.js';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tripdhara.in';

export const metadata = createMetadata({
    title: 'Explore the Himalayas - Circuits, Treks, Homestays & Yatras | Tripdhara',
    description: 'Discover verified Himalayan travel circuits across Uttarakhand, Himachal Pradesh, Ladakh & Kashmir. Book local village homestays, sacred Char Dham Yatras, alpine treks, rafting & mountain 4x4 rentals.',
    path: '/explore',
    image: '/img/images/og-banner.png',
    keywords: [
        'Explore Himalayas Tripdhara',
        'Himalayan Travel Circuits',
        'Char Dham Yatra Packages',
        'Spiti Valley Road Trip',
        'Pahadi Village Homestays',
        'Rishikesh Rafting Adventure',
        'Uttarakhand Trekking Circuits',
        'Leh Ladakh 4x4 Cab Booking'
    ]
});

async function getFeaturedPackages() {
    try {
        const result = await api.package.getBrowse({
            page: 1,
            limit: 6,
            sort: '-rating.average'
        });
        return result?.data || [];
    } catch {
        return [];
    }
}

// Iconic Himalayan Circuits
const HIMALAYAN_CIRCUITS = [
    {
        id: 'circuit-chardham',
        title: 'Sacred Char Dham & Garhwal Valleys',
        region: 'Uttarakhand',
        image: '/img/images/chaardhama_yatra.png',
        tag: 'Spiritual & Alpine',
        altitude: '10,200 - 11,755 ft',
        duration: '10 - 12 Days',
        places: ['Yamunotri', 'Gangotri', 'Kedarnath', 'Badrinath', 'Chopta', 'Rishikesh'],
        desc: 'Traverse sacred mountain shrines, high alpine bugyals, and holy rivers with veteran Pahadi chauffeurs and local guides.',
        ctaLink: '/yatra'
    },
    {
        id: 'circuit-spiti',
        title: 'Spiti Valley Rugged Trans-Himalayan Loop',
        region: 'Himachal Pradesh',
        image: '/img/images/scenic_landscape.avif',
        tag: 'Road Trip & Culture',
        altitude: '10,000 - 15,060 ft',
        duration: '7 - 9 Days',
        places: ['Kaza', 'Tabo', 'Dhankar', 'Key Monastery', 'Chandratal Lake', 'Kunzum Pass'],
        desc: 'A high-altitude moonscape circuit through centuries-old Buddhist gompas, fossil villages, and turquoise glacial lakes.',
        ctaLink: '/packages?q=Spiti'
    },
    {
        id: 'circuit-kumaon',
        title: 'Kumaon Lakes, Bugyals & Himalayan Peaks',
        region: 'Uttarakhand',
        image: '/img/images/himalayan_view.webp',
        tag: 'Heritage & Homestays',
        altitude: '6,400 - 9,500 ft',
        duration: '5 - 7 Days',
        places: ['Nainital', 'Almora', 'Kausani', 'Munsiyari', 'Binsar Sanctuary', 'Ranikhet'],
        desc: 'Tranquil emerald lakes, pine-scented mountain villages, ancient Katyuri temples, and undisturbed Panchachuli peak vistas.',
        ctaLink: '/packages?category=homestay'
    },
    {
        id: 'circuit-parvati',
        title: 'Parvati Valley & Great Himalayan National Park',
        region: 'Himachal Pradesh',
        image: '/img/images/tripdhara_camping.png',
        tag: 'Treks & Forest Retreats',
        altitude: '5,500 - 12,000 ft',
        duration: '4 - 6 Days',
        places: ['Kasol', 'Tosh', 'Kheerganga', 'Jibhi', 'Tirthan Valley', 'Manali'],
        desc: 'Lush deodar valleys, natural hot sulphur springs, riverbank alpine camps, and authentic wooden Kathkuni village stays.',
        ctaLink: '/packages?category=camping'
    },
    {
        id: 'circuit-ladakh',
        title: 'Leh-Ladakh & High Mountain Passes',
        region: 'Ladakh',
        image: '/img/images/mountain_road.avif',
        tag: 'Expeditions & 4x4',
        altitude: '11,500 - 18,380 ft',
        duration: '7 - 10 Days',
        places: ['Leh', 'Pangong Tso', 'Nubra Valley', 'Khardung La', 'Magnetic Hill', 'Zanskar'],
        desc: 'Traverse the world&apos;s highest motorable passes, double-humped camel dunes in Hunder, and high-altitude cobalt lakes.',
        ctaLink: '/rental'
    },
    {
        id: 'circuit-adventure',
        title: 'Ganga Whitewater Rapids & Alpine Treks',
        region: 'Rishikesh & Garhwal',
        image: '/img/images/tripdhara_rafting.png',
        tag: 'Adrenaline & River',
        altitude: '1,200 - 8,500 ft',
        duration: '3 - 5 Days',
        places: ['Shivpuri', 'Marine Drive', 'Kaudiyala', 'Neer Waterfalls', 'Mohanchatti'],
        desc: 'Grade III/IV river rafting on the holy Ganges, bungee jumping, riverside cliff camping, and scenic waterfall treks.',
        ctaLink: '/activities'
    }
];

// Experience Pillars
const EXPERIENCE_PILLARS = [
    {
        icon: Home,
        name: 'Village Homestays',
        count: 'Authentic Pahadi Stays',
        desc: 'Stay with local families, savor organic wood-fired food, and experience timeless mountain hospitality.',
        href: '/packages?category=homestay',
        color: 'from-amber-500/20 to-amber-700/10 border-amber-500/30 text-amber-600'
    },
    {
        icon: Mountain,
        name: 'Alpine Treks',
        count: 'Guided Expeditions',
        desc: 'From beginner meadows to rugged snow passes (Kedarkantha, Chopta-Tungnath, Hampta Pass).',
        href: '/packages?category=trekking',
        color: 'from-emerald-500/20 to-emerald-700/10 border-emerald-500/30 text-emerald-600'
    },
    {
        icon: Tent,
        name: 'Riverside Camping',
        count: 'Stars & Wilderness',
        desc: 'Comfortable dome tents and luxury glamping beside bubbling rivers and under starlit skies.',
        href: '/packages?category=camping',
        color: 'from-teal-500/20 to-teal-700/10 border-teal-500/30 text-teal-600'
    },
    {
        icon: Waves,
        name: 'River Rafting',
        count: 'Ganga Rapids',
        desc: 'Certified river guides, world-class rafts, and thrilling Grade III-IV rapids in Rishikesh.',
        href: '/packages?category=rafting',
        color: 'from-cyan-500/20 to-cyan-700/10 border-cyan-500/30 text-cyan-600'
    },
    {
        icon: Compass,
        name: 'Sacred Yatras',
        count: 'Pilgrimage Circuits',
        desc: 'All-inclusive Char Dham, Kedarnath helicopter support, and guided temple yatras.',
        href: '/yatra',
        color: 'from-orange-500/20 to-orange-700/10 border-orange-500/30 text-orange-600'
    },
    {
        icon: Car,
        name: 'Mountain Rentals',
        count: '4x4 SUVs & Bikes',
        desc: 'Rent Royal Enfield adventure motorcycles or book experienced local mountain cab chauffeurs.',
        href: '/rental',
        color: 'from-violet-500/20 to-violet-700/10 border-violet-500/30 text-violet-600'
    }
];

// Seasonal Travel Guide
const SEASONS = [
    {
        season: 'Spring (March - April)',
        icon: Leaf,
        badge: 'Rhododendron Bloom',
        badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
        weather: '12°C to 24°C • Crisp & Pleasant',
        highlights: 'Valley of Flowers awakening, crimson rhododendron forests in Chopta, clear Himalayan views, and opening of pilgrimage shrine gates.',
        bestFor: 'Pleasant hikes, wildlife photography, village homestays, and serene road trips.'
    },
    {
        season: 'Summer (May - June)',
        icon: Sun,
        badge: 'Peak Expedition Season',
        badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
        weather: '15°C to 28°C • Warm Days, Cool Nights',
        highlights: 'High-altitude mountain passes (Kunzum, Rohtang, Khardung La) open for traffic. Peak season for Char Dham Yatra and Spiti circuit.',
        bestFor: 'Family vacations, high-altitude road trips, Spiti Valley circuits, and sacred pilgrimages.'
    },
    {
        season: 'Autumn (Sept - Nov)',
        icon: CloudSun,
        badge: 'Crystal Clear Peaks',
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        weather: '8°C to 20°C • High Visibility',
        highlights: 'Post-monsoon freshness, ultra-clear visibility of snow peaks (Nanda Devi, Trishul, Shivling), golden meadows, and crisp night skies.',
        bestFor: 'High-pass trekking (Hampta, Har Ki Dun), landscape photography, and paragliding in Bir.'
    },
    {
        season: 'Winter (Dec - Feb)',
        icon: Snowflake,
        badge: 'Snow Wonderland',
        badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
        weather: '-5°C to 12°C • Alpine Snowfall',
        highlights: 'Auli slopes covered in powder snow for skiing, frozen waterfalls in Spiti, and snow treks in Kedarkantha & Brahmatal.',
        bestFor: 'Skiing & snowboarding in Auli, winter snow trekking, bonefire homestays, and snowfall chasing.'
    }
];

export default async function ExplorePage() {
    const featuredPackages = await getFeaturedPackages();

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
                        'name': 'Explore the Himalayas',
                        'item': `${siteUrl}/explore`
                    }
                ]
            },
            {
                '@type': 'CollectionPage',
                'name': 'Explore the Himalayas - Tripdhara',
                'url': `${siteUrl}/explore`,
                'description': 'Comprehensive discovery guide for Himalayan circuits, verified local homestays, trekking expeditions, and Char Dham pilgrimage routes.'
            }
        ]
    };

    return (
        <div className="bg-[#fcfcfc] min-h-screen text-gray-800 font-sans selection:bg-primary-500 selection:text-white">
            {/* Structured Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
            />

            {/* Hero Section */}
            <header className="relative bg-gray-900 overflow-hidden pt-36 pb-24 md:pt-44 md:pb-32">
                <div className="absolute inset-0">
                    <Image
                        src="/img/images/hero_background.png"
                        alt="Majestic Himalayan Mountains"
                        fill
                        priority
                        className="object-cover opacity-35 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/75 to-gray-900/40"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary-500/20 border border-primary-400/30 backdrop-blur-md mb-6 shadow-sm">
                        <Sparkles className="w-4 h-4 text-primary-400 mr-2" />
                        <span className="text-xs sm:text-sm font-semibold text-primary-200 tracking-wide uppercase">
                            Direct Local Bookings &bull; Verified Pahadi Hosts &bull; Zero Middleman
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight mb-6 font-display max-w-4xl mx-auto leading-tight">
                        Explore the Soul of the <span className="text-primary-400">Himalayas</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-gray-200 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
                        From sacred Char Dham pilgrimages and rugged Trans-Himalayan Spiti road trips to quiet apple-orchard homestays and roaring Ganga rapids.
                    </p>

                    {/* Discovery Search Form */}
                    <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-xl p-2.5 sm:p-3 rounded-2xl sm:rounded-full shadow-2xl border border-white/20">
                        <form action="/packages" method="GET" className="flex flex-col sm:flex-row items-center gap-2">
                            <div className="flex items-center w-full px-4 py-2 sm:py-0">
                                <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                                <input
                                    type="text"
                                    name="q"
                                    placeholder="Search destination, trek, homestay, or activity..."
                                    className="w-full bg-transparent text-gray-900 placeholder:text-gray-400 text-sm sm:text-base focus:outline-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm sm:text-base rounded-xl sm:rounded-full transition-all shadow-md shrink-0 flex items-center justify-center gap-2"
                            >
                                <span>Discover</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                    {/* Trending Discovery Tags */}
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-6 text-xs sm:text-sm text-gray-300">
                        <span className="text-gray-400 font-medium">Trending Circuits:</span>
                        <Link href="/packages?q=Spiti" className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors">Spiti Valley</Link>
                        <Link href="/yatra" className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors">Kedarnath Yatra</Link>
                        <Link href="/packages?category=homestay" className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors">Kasol Homestays</Link>
                        <Link href="/packages?category=rafting" className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors">Rishikesh Rafting</Link>
                        <Link href="/packages?category=trekking" className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors">Chopta Trek</Link>
                    </div>
                </div>
            </header>

            {/* Experience Pillars */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                    {EXPERIENCE_PILLARS.map((pillar, i) => {
                        const IconComponent = pillar.icon;
                        return (
                            <Link
                                key={i}
                                href={pillar.href}
                                className="group bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                            >
                                <div>
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${pillar.color} border flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                        <IconComponent className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-sm group-hover:text-primary-600 transition-colors">
                                        {pillar.name}
                                    </h3>
                                    <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                                        {pillar.desc}
                                    </p>
                                </div>
                                <div className="mt-3 flex items-center text-xs font-bold text-primary-600">
                                    <span>Explore</span>
                                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-24">

                {/* Section 1: Iconic Himalayan Circuits */}
                <section>
                    <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                        <div className="inline-flex items-center space-x-2 text-xs font-black text-primary-700 uppercase tracking-widest mb-3">
                            <Compass className="w-4 h-4" />
                            <span>Legendary Routes</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight font-display">
                            Iconic Himalayan Travel Circuits
                        </h2>
                        <p className="text-gray-600 mt-3 text-base sm:text-lg">
                            Handcrafted regional journeys designed for explorers, spiritual seekers, and road-trippers across Uttarakhand, Himachal, and Ladakh.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {HIMALAYAN_CIRCUITS.map((circuit) => (
                            <div
                                key={circuit.id}
                                className="group bg-white rounded-3xl border border-gray-200/80 hover:border-gray-300 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
                            >
                                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                                    <Image
                                        src={circuit.image}
                                        alt={circuit.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>

                                    {/* Top badges */}
                                    <div className="absolute top-3 left-3 flex items-center gap-2">
                                        <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/90 text-gray-900 backdrop-blur-md shadow-sm">
                                            {circuit.region}
                                        </span>
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-600/90 text-white backdrop-blur-md">
                                            {circuit.tag}
                                        </span>
                                    </div>

                                    {/* Bottom Info on Image */}
                                    <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between text-xs font-medium">
                                        <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg">
                                            <Calendar className="w-3.5 h-3.5 text-primary-400" />
                                            <span>{circuit.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg">
                                            <Mountain className="w-3.5 h-3.5 text-primary-400" />
                                            <span>{circuit.altitude}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                                            {circuit.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-2.5 leading-relaxed">
                                            {circuit.desc}
                                        </p>

                                        {/* Places Covered */}
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2">Key Waypoints:</span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {circuit.places.map((place, idx) => (
                                                    <span key={idx} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200/60 text-gray-700">
                                                        {place}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <Link
                                            href={circuit.ctaLink}
                                            className="inline-flex items-center text-sm font-bold text-primary-600 hover:text-primary-700 group-hover:translate-x-0.5 transition-transform"
                                        >
                                            <span>Explore Experiences</span>
                                            <ArrowRight className="w-4 h-4 ml-1.5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 2: Live Featured Experiences */}
                {featuredPackages.length > 0 && (
                    <section>
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                            <div>
                                <div className="inline-flex items-center space-x-2 text-xs font-black text-primary-700 uppercase tracking-widest mb-2">
                                    <Sparkles className="w-4 h-4" />
                                    <span>Top Rated by Travelers</span>
                                </div>
                                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight font-display">
                                    Handpicked Himalayan Experiences
                                </h2>
                                <p className="text-gray-600 mt-1 text-base">
                                    Book directly with verified native tour operators, trek leaders, and homestay hosts.
                                </p>
                            </div>
                            <Link
                                href="/packages"
                                className="inline-flex items-center text-sm font-bold text-white bg-primary-600 hover:bg-primary-500 px-5 py-2.5 rounded-xl transition-colors shadow-sm self-start md:self-auto"
                            >
                                <span>Browse All Packages</span>
                                <ArrowRight className="w-4 h-4 ml-1.5" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredPackages.map((item, index) => (
                                <PackageCard key={item.id || item._id || index} item={item} priority={index < 3} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Section 3: Seasonal Himalayan Travel Calendar */}
                <section className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-10 md:p-12 shadow-xl">
                    <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
                        <div className="inline-flex items-center space-x-2 text-xs font-black text-primary-700 uppercase tracking-widest mb-2">
                            <Calendar className="w-4 h-4" />
                            <span>When to Visit</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight font-display">
                            Himalayan Seasonal Travel Calendar
                        </h2>
                        <p className="text-gray-600 mt-2 text-sm sm:text-base">
                            The mountains change character every few months. Choose the ideal window matching your travel aspirations.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {SEASONS.map((season, i) => {
                            const SeasonIcon = season.icon;
                            return (
                                <div key={i} className="bg-gray-50/70 border border-gray-200/80 rounded-2xl p-6 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-2.5">
                                                <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-primary-600 shadow-2xs">
                                                    <SeasonIcon className="w-5 h-5" />
                                                </div>
                                                <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                                                    {season.season}
                                                </h3>
                                            </div>
                                            <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${season.badgeBg}`}>
                                                {season.badge}
                                            </span>
                                        </div>

                                        <div className="text-xs font-semibold text-primary-800 bg-primary-50/80 px-3 py-1.5 rounded-lg mb-3 inline-block">
                                            Weather: {season.weather}
                                        </div>

                                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-3">
                                            {season.highlights}
                                        </p>
                                    </div>

                                    <div className="pt-3 border-t border-gray-200/60 text-xs text-gray-600">
                                        <strong className="text-gray-800">Best For: </strong>
                                        {season.bestFor}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Section 4: Responsible Tourism & Local Safety Pledge */}
                <section className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                        <Mountain className="w-96 h-96 -mr-20 -mb-20 text-white" />
                    </div>

                    <div className="relative z-10 max-w-3xl">
                        <div className="inline-flex items-center space-x-2 text-xs font-black text-primary-400 uppercase tracking-widest mb-3">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Pahadi Ethos &amp; Himalayan Safety</span>
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-display mb-4">
                            Travel Responsibly with Direct Local Impact
                        </h2>
                        <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8">
                            Tripdhara operates on a direct self-employment model. Every rupee you spend directly empowers local homestay families, licensed Himalayan trek guides, and native mountain chauffeurs.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4">
                                <CheckCircle2 className="w-5 h-5 text-primary-400 mb-2" />
                                <div className="text-sm font-bold text-white">AMS &amp; Safety First</div>
                                <div className="text-xs text-gray-300 mt-1">High altitude acclimatization protocols and emergency rescue coordination.</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4">
                                <CheckCircle2 className="w-5 h-5 text-primary-400 mb-2" />
                                <div className="text-sm font-bold text-white">Border Permit (ILP)</div>
                                <div className="text-xs text-gray-300 mt-1">Guidance on Inner Line Permits for border corridors (Mana, Niti, Milam).</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4">
                                <CheckCircle2 className="w-5 h-5 text-primary-400 mb-2" />
                                <div className="text-sm font-bold text-white">Leave No Trace</div>
                                <div className="text-xs text-gray-300 mt-1">Strict zero-plastic guidelines aligned with NGT alpine meadow protection.</div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <Link
                                href="/safety-policy"
                                className="px-5 py-2.5 rounded-xl bg-white text-gray-900 font-bold text-xs sm:text-sm hover:bg-gray-100 transition-colors shadow-sm"
                            >
                                Read Safety Policy
                            </Link>
                            <Link
                                href="/eco-policy"
                                className="px-5 py-2.5 rounded-xl bg-white/15 border border-white/20 text-white font-bold text-xs sm:text-sm hover:bg-white/25 transition-colors"
                            >
                                Eco-Tourism Mandate
                            </Link>
                            <a
                                href="tel:+917017288052"
                                className="inline-flex items-center text-xs sm:text-sm font-semibold text-primary-300 hover:text-white transition-colors"
                            >
                                <PhoneCall className="w-4 h-4 mr-1.5" />
                                +91 70172 88052 (24/7 Desk)
                            </a>
                        </div>
                    </div>
                </section>

                {/* Section 5: Custom Itinerary Call-to-Action */}
                <section className="text-center bg-primary-50/70 border border-primary-200/70 rounded-3xl p-8 sm:p-14">
                    <div className="w-14 h-14 bg-primary-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                        <Compass className="w-7 h-7" />
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-black text-gray-900 font-display tracking-tight mb-3">
                        Need a Custom Himalayan Itinerary?
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-8">
                        Whether you are planning a multi-generational family pilgrimage to Kedarnath, a solo motorcycle expedition across Spiti, or a remote workation in Kasol—our local experts will tailor the perfect circuit for you.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/contact"
                            className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl text-sm sm:text-base transition-colors shadow-md"
                        >
                            <span>Request Custom Circuit</span>
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                        <Link
                            href="/packages"
                            className="inline-flex items-center px-6 py-3 bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-bold rounded-xl text-sm sm:text-base transition-colors shadow-2xs"
                        >
                            <span>Browse All 100+ Experiences</span>
                        </Link>
                    </div>
                </section>

            </main>
        </div>
    );
}
