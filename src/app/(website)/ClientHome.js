"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    MapPin,
    Calendar,
    Users,
    Search,
    Compass,
    ShieldCheck,
    Star,
    Car,
    Bike,
    Home as HomeIcon,
    Mountain,
    Waves,
    Phone,
    MessageCircle,
    ArrowRight,
    CheckCircle2,
    Sparkles,
    Clock,
    Heart,
    BadgeCheck
} from 'lucide-react';

const CATEGORY_IMAGE_MAP = {
    'homestay': '/img/category/homestay.png',
    'hotel': '/img/category/hotel.png',
    'camping': '/img/category/camping.png',
    'bungee-jumping': '/img/category/bungee-jumping.png',
    'trekking': '/img/category/trekking.png',
    'rafting': '/img/category/rafting.png',
    'chardham-tour': '/img/category/chardham-yatra.png',
    'bike-scooter-rental': '/img/category/vehicle-rental.png',
    'custom-trip': '/img/category/custom-trip.png',
    'skiing': '/img/category/skiing.png',
    'paragliding': '/img/category/paragliding.png',
};

// 4 Core Portals
const CORE_PORTALS = [
    {
        title: 'Accommodations',
        subtitle: 'Verified Stays & Chalets',
        tag: 'Homestays & Resorts',
        desc: 'Handpicked mountain homestays, wooden cottages, and luxury camps with guaranteed hot water and peak views.',
        image: '/img/images/luxury_resort.png',
        link: '/accommodation',
        icon: HomeIcon,
        color: 'from-emerald-600/90 to-teal-800/90'
    },
    {
        title: 'Vehicle & Bike Rentals',
        subtitle: 'Self-Drive & Chauffeurs',
        tag: 'RE Himalayan & SUVs',
        desc: 'Rent Royal Enfield 450s, self-drive 4x4s, or hire veteran hill chauffeurs for safe mountain transit.',
        image: '/img/images/adventure_bike.png',
        link: '/rental',
        icon: Bike,
        color: 'from-teal-700/90 to-cyan-900/90'
    },
    {
        title: 'Adventure Sports',
        subtitle: 'Certified Guides',
        tag: 'Rafting & Paragliding',
        desc: 'High-adrenaline white-water rafting in Rishikesh, paragliding in Bir Billing, and bungee jumping.',
        image: '/img/images/hero_background.png',
        link: '/activities',
        icon: Waves,
        color: 'from-sky-700/90 to-blue-900/90'
    },
    {
        title: 'Sacred Pilgrimages',
        subtitle: 'Hassle-Free Circuits',
        tag: 'Char Dham & Kedarnath',
        desc: 'Complete spiritual itineraries with verified basecamp hotels, helicopter transit assistance, and priority darshan.',
        image: '/img/images/package.png',
        link: '/yatra',
        icon: Mountain,
        color: 'from-amber-600/90 to-orange-800/90'
    }
];

// Featured Destinations
const FEATURED_DESTINATIONS = [
    {
        title: 'Chopta & Tungnath',
        state: 'Uttarakhand',
        badge: 'Mini Switzerland',
        desc: 'Trek through alpine rhododendron meadows to the highest Shiva temple on earth.',
        image: '/img/images/scenic_landscape.avif',
        link: '/packages?query=Chopta',
        duration: '3-4 Days'
    },
    {
        title: 'Rishikesh Valley',
        state: 'Uttarakhand',
        badge: 'Adventure Capital',
        desc: 'White-water rapids on the sacred Ganga, cliff jumping, riverside camping, and Ganga Aarti.',
        image: '/img/images/hero_background.png',
        link: '/activities',
        duration: '2-3 Days'
    },
    {
        title: 'Spiti & High Passes',
        state: 'Himachal Pradesh',
        badge: 'Cold Desert',
        desc: 'Roam through rugged moonscapes, centuries-old monasteries, and high-altitude mountain passes.',
        image: '/img/images/mountain_road.avif',
        link: '/packages?query=Spiti',
        duration: '7-9 Days'
    },
    {
        title: 'Mukteshwar Ridges',
        state: 'Uttarakhand',
        badge: 'Tranquil Retreat',
        desc: 'Panoramic views of the 180° snow-clad Trishul and Nanda Devi peaks amid apple orchards.',
        image: '/img/images/luxury_resort.png',
        link: '/accommodation',
        duration: '2-4 Days'
    }
];

// Trust Pillars
const TRUST_PILLARS = [
    {
        icon: ShieldCheck,
        title: '100% Pre-Inspected Stays',
        desc: 'Every homestay and cottage on our platform is physically inspected for cleanliness, heating, and hygiene.'
    },
    {
        icon: Clock,
        title: '4-Hour Breakdown Guarantee',
        desc: 'In the rare event of mechanical failure on mountain routes, a replacement commercial vehicle is dispatched within 4 hours.'
    },
    {
        icon: MessageCircle,
        title: '24/7 Live Road Concierge',
        desc: 'Real-time WhatsApp coordination for sudden weather alerts, landslide detours, and local assistance.'
    },
    {
        icon: Sparkles,
        title: 'Zero Hidden Costs',
        desc: 'All taxes, driver allowances, and tolls are quoted upfront with absolute transparent pricing.'
    }
];

// Curated Testimonials
const TESTIMONIALS = [
    {
        name: 'Rohan Mehta',
        role: 'Solo Rider, New Delhi',
        rating: 5,
        review: 'Rented a Royal Enfield Himalayan 450 for a 5-day circuit to Chopta and Auli. The bike was mechanically flawless, and the team provided live WhatsApp road status during sudden snowfall.',
        initials: 'RM'
    },
    {
        name: 'Anjali Sharma',
        role: 'Family Pilgrimage, Mumbai',
        rating: 5,
        review: 'Booked an Innova Crysta for our parents during the Char Dham Yatra. Our hill driver was exceptionally patient and drove defensively. The homestays booked were warm and hygienic.',
        initials: 'AS'
    },
    {
        name: 'Priyanka Sen',
        role: 'Honeymoon Couple, Kolkata',
        rating: 5,
        review: 'The Mukteshwar wooden chalet was out of this world—waking up to unobstructed views of the Trishul peaks was pure magic. Flawless coordination from start to finish.',
        initials: 'PS'
    }
];

export default function ClientHome({ categories = [] }) {
    // Search form state
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [guests, setGuests] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery) params.set('query', searchQuery);
        if (selectedDate) params.set('date', selectedDate);
        if (guests) params.set('guests', guests);
        router.push(`/packages?${params.toString()}`);
    };

    return (
        <div className="bg-[#fcfcfc] text-gray-900 font-sans selection:bg-[#017974] selection:text-white">

            {/* ========================================================
                1. MODERN HERO SECTION
            ======================================================== */}
            <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center pt-28 pb-20 overflow-hidden bg-gray-950">
                {/* Background Image with Gradient Overlay */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/img/background.png"
                        alt="Himalayan Mountain Range"
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover object-[center_35%] opacity-35"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
                    
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold tracking-wider uppercase mb-6"
                    >
                        <span className="w-2 h-2 rounded-full bg-[#017974] animate-pulse" />
                        <span>India&apos;s Premier Himalayan Travel Network</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6 font-display max-w-4xl"
                    >
                        Authentic Himalayan Journeys, <br className="hidden sm:inline" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-white">
                            Handcrafted by Locals.
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                        className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl font-normal leading-relaxed mb-10"
                    >
                        Verified mountain stays, rugged bike rentals, chauffeur-driven SUVs, and sacred Yatras. Handled by local coordinators who live here.
                    </motion.p>

                    {/* Search Bar Widget */}
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.35 }}
                        className="w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xl border border-white/40"
                    >
                        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                            
                            {/* Destination */}
                            <div className="sm:col-span-4 flex items-center px-4 py-3 bg-gray-50 hover:bg-gray-100/80 rounded-xl transition-colors text-left">
                                <MapPin className="w-5 h-5 text-[#017974] mr-3 shrink-0" />
                                <div className="w-full">
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                        Destination
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Where to? (e.g. Chopta, Manali)"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-transparent border-none p-0 text-sm font-bold text-gray-900 placeholder-gray-400 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Date */}
                            <div className="sm:col-span-3 flex items-center px-4 py-3 bg-gray-50 hover:bg-gray-100/80 rounded-xl transition-colors text-left">
                                <Calendar className="w-5 h-5 text-[#017974] mr-3 shrink-0" />
                                <div className="w-full">
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                        Dates
                                    </label>
                                    <input
                                        type="date"
                                        min={new Date().toISOString().split('T')[0]}
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full bg-transparent border-none p-0 text-sm font-bold text-gray-900 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Guests */}
                            <div className="sm:col-span-3 flex items-center px-4 py-3 bg-gray-50 hover:bg-gray-100/80 rounded-xl transition-colors text-left">
                                <Users className="w-5 h-5 text-[#017974] mr-3 shrink-0" />
                                <div className="w-full">
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                        Travelers
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="20"
                                        placeholder="Add guests"
                                        value={guests}
                                        onChange={(e) => setGuests(e.target.value)}
                                        className="w-full bg-transparent border-none p-0 text-sm font-bold text-gray-900 placeholder-gray-400 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="sm:col-span-2">
                                <button
                                    type="submit"
                                    className="w-full h-12 rounded-xl bg-[#017974] hover:bg-[#01625e] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                                >
                                    <Search className="w-4 h-4" />
                                    <span>Search</span>
                                </button>
                            </div>

                        </form>
                    </motion.div>

                    {/* Quick Stats Pill */}
                    <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-10 text-xs sm:text-sm font-medium text-gray-300">
                        <div className="flex items-center space-x-2">
                            <BadgeCheck className="w-4 h-4 text-emerald-400" />
                            <span>100% Pre-Inspected Stays</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-emerald-400" />
                            <span>4-Hour Vehicle Replacement SLA</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-emerald-400" />
                            <span>24/7 Road Helpline: +91 70172 88052</span>
                        </div>
                    </div>

                </div>
            </section>


            {/* ========================================================
                2. CORE TRAVEL PORTALS (Four Pillars of Tripdhara)
            ======================================================== */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <span className="text-xs font-bold text-[#017974] uppercase tracking-widest block mb-2">
                        Explore by Category
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 font-display tracking-tight">
                        What Are You Planning?
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mt-3">
                        Choose your preferred mode of exploration across Uttarakhand and Himachal Pradesh.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {CORE_PORTALS.map((portal, idx) => {
                        const IconComponent = portal.icon;
                        return (
                            <Link
                                key={idx}
                                href={portal.link}
                                className="group relative rounded-3xl overflow-hidden border border-gray-200/80 bg-white hover:border-[#017974]/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <Image
                                            src={portal.image}
                                            alt={portal.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 25vw"
                                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                        />
                                        <div className={`absolute inset-0 bg-gradient-to-t ${portal.color} opacity-40 group-hover:opacity-30 transition-opacity`} />
                                        <div className="absolute top-3 left-3">
                                            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/90 text-gray-900 shadow-sm backdrop-blur-md">
                                                {portal.tag}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[#017974] mb-3 group-hover:bg-[#017974] group-hover:text-white transition-colors">
                                            <IconComponent className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 font-display group-hover:text-[#017974] transition-colors mb-1">
                                            {portal.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 font-medium mb-3">
                                            {portal.subtitle}
                                        </p>
                                        <p className="text-xs text-gray-600 leading-relaxed">
                                            {portal.desc}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6 pt-0 flex items-center text-xs font-bold text-[#017974]">
                                    <span>Explore Options</span>
                                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 transform group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>


            {/* ========================================================
                3. DYNAMIC TRIP CATEGORIES (MongoDB Packages API)
            ======================================================== */}
            {categories && categories.length > 0 && (
                <section className="py-20 bg-gray-50/80 border-y border-gray-200/60">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                            <div>
                                <span className="text-xs font-bold text-[#017974] uppercase tracking-widest block mb-2">
                                    Curated Packages
                                </span>
                                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 font-display tracking-tight">
                                    Choose Your Experience
                                </h2>
                            </div>
                            <Link
                                href="/packages"
                                className="inline-flex items-center text-xs font-bold text-[#017974] hover:text-[#01625e] mt-4 md:mt-0"
                            >
                                <span>Browse All Packages</span>
                                <ArrowRight className="w-3.5 h-3.5 ml-1" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {categories.map((cat) => (
                                <Link
                                    key={cat._id}
                                    href={`/packages?category=${cat.slug}`}
                                    className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 block"
                                >
                                    <Image
                                        src={CATEGORY_IMAGE_MAP[cat.slug] || '/img/category/trekking.png'}
                                        alt={cat.name}
                                        fill
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/30 to-transparent" />
                                    
                                    <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end text-white">
                                        <h3 className="text-base sm:text-lg font-bold font-display group-hover:text-emerald-300 transition-colors">
                                            {cat.name}
                                        </h3>
                                        <p className="text-[11px] text-gray-300 line-clamp-2 mt-1">
                                            {cat.description || `Explore top ${cat.name} adventures.`}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}


            {/* ========================================================
                4. FEATURED HIMALAYAN DESTINATIONS
            ======================================================== */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <span className="text-xs font-bold text-[#017974] uppercase tracking-widest block mb-2">
                        Iconic Terrains
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 font-display tracking-tight">
                        Trending Mountain Escapes
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mt-3">
                        Curated routes designed with optimal driving hours and verified stopovers.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {FEATURED_DESTINATIONS.map((dest, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                        >
                            <div>
                                <div className="relative h-48 w-full overflow-hidden">
                                    <Image
                                        src={dest.image}
                                        alt={dest.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 25vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent" />
                                    <div className="absolute top-3 left-3">
                                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#017974] text-white">
                                            {dest.badge}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-3 right-3 text-[11px] font-semibold text-white bg-black/50 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                                        {dest.duration}
                                    </div>
                                </div>

                                <div className="p-5 sm:p-6">
                                    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                        {dest.state}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 font-display group-hover:text-[#017974] transition-colors mb-2">
                                        {dest.title}
                                    </h3>
                                    <p className="text-xs text-gray-600 leading-relaxed font-normal">
                                        {dest.desc}
                                    </p>
                                </div>
                            </div>

                            <div className="p-5 sm:p-6 pt-0">
                                <Link
                                    href={dest.link}
                                    className="inline-flex items-center text-xs font-bold text-[#017974] hover:text-[#01625e]"
                                >
                                    <span>View Itinerary</span>
                                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 transform group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>


            {/* ========================================================
                5. WHY TRIPDHARA (Clean Bento Grid)
            ======================================================== */}
            <section className="py-20 bg-gray-50 border-t border-gray-200/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-xs font-bold text-[#017974] uppercase tracking-widest block mb-2">
                            The Local Advantage
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 font-display tracking-tight">
                            Why Travel with Tripdhara?
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 mt-3">
                            We bridge on-ground Himalayan reality with modern booking standards.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {TRUST_PILLARS.map((item, idx) => {
                            const IconComponent = item.icon;
                            return (
                                <div
                                    key={idx}
                                    className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-200/80 shadow-sm hover:shadow-md transition-all"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#017974] mb-5">
                                        <IconComponent className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-base font-bold text-gray-900 font-display mb-2">
                                        {item.title}
                                    </h4>
                                    <p className="text-xs text-gray-600 leading-relaxed font-normal">
                                        {item.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </section>


            {/* ========================================================
                6. REAL TRAVELER STORIES (Testimonials)
            ======================================================== */}
            <section className="py-20 bg-white border-b border-gray-200/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-xs font-bold text-[#017974] uppercase tracking-widest block mb-2">
                            Guest Experiences
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 font-display tracking-tight">
                            Loved by Mountain Explorers
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {TESTIMONIALS.map((t, i) => (
                            <div
                                key={i}
                                className="bg-gray-50/70 rounded-3xl p-7 border border-gray-200/80 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center space-x-1 text-amber-400 mb-4">
                                        {[...Array(t.rating)].map((_, idx) => (
                                            <Star key={idx} className="w-4 h-4 fill-amber-400" />
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-700 leading-relaxed italic mb-6">
                                        &ldquo;{t.review}&rdquo;
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-gray-200/60 flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-[#017974] text-white font-bold text-xs flex items-center justify-center shrink-0">
                                        {t.initials}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">{t.name}</div>
                                        <div className="text-xs text-gray-500">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>


            {/* ========================================================
                7. CONCIERGE & HELP DESK CTA BANNER
            ======================================================== */}
            <section className="py-16 bg-[#017974] text-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                        <div>
                            <span className="text-xs font-bold text-teal-200 uppercase tracking-widest block mb-2">
                                24/7 Mountain Transit Support
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-black font-display text-white">
                                Planning a Custom Himalayan Trip?
                            </h3>
                            <p className="text-sm text-teal-100 max-w-xl mt-1">
                                Connect with our local travel coordinators in Dehradun &amp; Rishikesh for custom routes and instant quotes.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                            <a
                                href="tel:+917017288052"
                                className="inline-flex items-center justify-center py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-white/10 hover:bg-white/20 border border-white/25 transition-all"
                            >
                                <Phone className="w-4 h-4 mr-2" />
                                <span>+91 70172 88052</span>
                            </a>
                            <a
                                href="https://wa.me/917017288052?text=Namaste%20Tripdhara%21%20I%20would%20like%20to%20plan%20a%20mountain%20journey."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center py-3.5 px-6 rounded-xl font-bold text-sm text-gray-950 bg-white hover:bg-gray-100 shadow-lg transition-all"
                            >
                                <MessageCircle className="w-4 h-4 mr-2 text-[#017974]" />
                                <span>Chat on WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
