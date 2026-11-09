'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    Compass,
    Home,
    Search,
    Phone,
    MessageCircle,
    ShieldCheck,
    Mountain,
    Car,
    Building2,
    Tent,
    ArrowRight,
    HeadphonesIcon,
    ArrowLeft
} from 'lucide-react';

// Verified Real Himalayan & Tripdhara Coordinates
const REAL_LOCATIONS = {
    KEDARNATH: {
        tag: 'Kedarnath',
        name: 'Kedarnath Alpine Ridge',
        lat: '30.7346° N',
        lng: '79.0669° E',
        alt: '3,583m',
        region: 'Rudraprayag, Uttarakhand'
    },
    RISHIKESH: {
        tag: 'Rishikesh HQ',
        name: 'Tripdhara HQ, Rishikesh',
        lat: '30.0869° N',
        lng: '78.2676° E',
        alt: '372m',
        region: 'Uttarakhand, India'
    },
    MANALI: {
        tag: 'Manali',
        name: 'Manali Valley Basecamp',
        lat: '32.2432° N',
        lng: '77.1892° E',
        alt: '2,050m',
        region: 'Kullu Valley, Himachal'
    }
};

export default function NotFound() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocKey, setSelectedLocKey] = useState('KEDARNATH');

    const activeLoc = REAL_LOCATIONS[selectedLocKey] || REAL_LOCATIONS.KEDARNATH;

    const handleSearch = (e) => {
        e.preventDefault();
        const trimmed = searchQuery.trim();
        if (trimmed) {
            router.push(`/packages?query=${encodeURIComponent(trimmed)}`);
        } else {
            router.push('/packages');
        }
    };

    const popularDestinations = [
        'Kedarnath Yatra',
        'Spiti Valley Circuit',
        'Manali Homestays',
        'Innova Crysta Rental',
        'Chopta Tungnath Trek'
    ];

    const rescuePillars = [
        {
            title: 'Tour Packages',
            desc: 'Char Dham, Kedarnath, Spiti & high-altitude circuits.',
            icon: Mountain,
            href: '/packages',
            badge: 'Verified'
        },
        {
            title: 'Mountain Stays',
            desc: 'Riverside chalets, cottages & hygienic pahadi homestays.',
            icon: Building2,
            href: '/accommodation',
            badge: 'Inspected'
        },
        {
            title: 'Cabs & Rentals',
            desc: 'Innova Crysta, 4x4 SUVs & bikes with 4-hr guarantee.',
            icon: Car,
            href: '/rental',
            badge: 'Hill Drivers'
        },
        {
            title: 'Treks & Adventure',
            desc: 'Valley of Flowers, rafting & alpine riverside camping.',
            icon: Tent,
            href: '/activities',
            badge: 'Certified'
        }
    ];

    return (
        <div className="min-h-screen flex flex-col justify-between bg-[#021312] text-white selection:bg-[#017974] selection:text-white relative overflow-hidden">
            {/* Mountain Atmospheric Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Image
                    src="/img/images/himalayan_view.webp"
                    alt="Himalayan Mountain Range"
                    fill
                    sizes="100vw"
                    className="object-cover opacity-15 mix-blend-luminosity scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#021312]/95 via-[#021715]/90 to-[#021312]" />
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#017974]/30 rounded-full blur-[130px]" />
                <div className="absolute top-1/2 -right-32 w-96 h-96 bg-teal-500/20 rounded-full blur-[140px]" />
            </div>

            {/* Minimal Clean Top Brand Bar (No global header) */}
            <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between border-b border-white/5">
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
                        Trip<span className="text-[#017974] group-hover:text-emerald-400 transition-colors">dhara</span>
                    </span>
                </Link>

                <div className="flex items-center gap-3 text-xs sm:text-sm">
                    <span className="hidden sm:inline text-gray-400">Need urgent route advice?</span>
                    <a
                        href="tel:+917017288052"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-emerald-300 font-semibold transition-all"
                    >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>+91 70172 88052</span>
                    </a>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="relative z-10 flex-1 flex flex-col justify-center py-10 sm:py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    {/* Top Content Row: Text & Search + 404 Telemetry Card */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center mb-12 lg:mb-16">
                        {/* Left: Heading, Search & Primary CTAs */}
                        <div className="lg:col-span-7 text-center lg:text-left space-y-6">
                            {/* Waypoint Marker Badge */}
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-emerald-300 text-xs sm:text-sm font-semibold uppercase tracking-wider backdrop-blur-md">
                                <Compass className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '12s' }} />
                                <span>Waypoint Error 404 • Trail Undefined</span>
                            </div>

                            {/* Main Heading */}
                            <div className="space-y-3">
                                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display leading-[1.15] text-white">
                                    You&apos;ve wandered <br className="hidden sm:inline" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-[#017974]">
                                        off the marked trail.
                                    </span>
                                </h1>
                                <p className="text-sm sm:text-base lg:text-lg text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                                    The Himalayan ridge, homestay, or expedition route you requested doesn&apos;t exist or was relocated. Let our local guides get you safely back on course.
                                </p>
                            </div>

                            {/* Interactive Mountain Search */}
                            <div className="max-w-xl mx-auto lg:mx-0 pt-1">
                                <form onSubmit={handleSearch} className="relative group">
                                    <div className="relative flex items-center">
                                        <Search className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-emerald-400 transition-colors" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search Kedarnath, Manali homestay, Spiti cab..."
                                            className="w-full pl-12 pr-32 sm:pr-36 py-3.5 bg-white/10 hover:bg-white/[0.12] focus:bg-white/15 border border-white/20 focus:border-emerald-400 rounded-2xl text-white placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-4 focus:ring-[#017974]/30 backdrop-blur-xl transition-all shadow-xl"
                                        />
                                        <button
                                            type="submit"
                                            className="absolute right-2 px-4 sm:px-5 py-2 bg-[#017974] hover:bg-[#016561] text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-1.5"
                                        >
                                            <span>Find Trail</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </form>

                                {/* Quick Destination Chips */}
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mt-3 text-xs">
                                    <span className="text-gray-400 font-medium">Quick Routes:</span>
                                    {popularDestinations.map((dest) => (
                                        <button
                                            key={dest}
                                            type="button"
                                            onClick={() => {
                                                setSearchQuery(dest);
                                                router.push(`/packages?query=${encodeURIComponent(dest)}`);
                                            }}
                                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white transition-all active:scale-95"
                                        >
                                            {dest}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                                <Link
                                    href="/"
                                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base bg-[#017974] hover:bg-[#016561] text-white transition-all shadow-lg shadow-[#017974]/30 hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                                >
                                    <Home className="w-4 h-4 mr-2" />
                                    Return to Basecamp
                                </Link>
                                <Link
                                    href="/packages"
                                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base bg-white/10 hover:bg-white/15 border border-white/20 text-white transition-all backdrop-blur-md hover:-translate-y-0.5 active:scale-95"
                                >
                                    <Compass className="w-4 h-4 mr-2 text-emerald-400" />
                                    Explore Packages
                                </Link>
                                <button
                                    onClick={() => router.back()}
                                    type="button"
                                    className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-3.5 rounded-xl font-semibold text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-1.5" />
                                    Previous Step
                                </button>
                            </div>
                        </div>

                        {/* Right: Glassmorphic Real GPS Telemetry Card with Illustration */}
                        <div className="lg:col-span-5 flex justify-center">
                            <div className="relative w-full max-w-sm sm:max-w-md">
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#017974]/40 via-teal-400/20 to-transparent rounded-3xl blur-2xl transform rotate-2 scale-95" />

                                <div className="relative bg-white/[0.06] border border-white/15 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden">
                                    {/* Real Coordinates Telemetry Header */}
                                    <div className="border-b border-white/10 pb-3 mb-3 text-xs font-mono">
                                        <div className="flex items-center justify-between text-gray-400 mb-1.5">
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                                <span className="text-white font-medium text-[11px] uppercase tracking-wide">
                                                    REAL HIMALAYAN COORDINATES
                                                </span>
                                            </div>
                                            <span className="text-emerald-400 font-semibold font-mono">{activeLoc.alt}</span>
                                        </div>

                                        <div className="flex items-center justify-between text-[11px] my-1">
                                            <span className="text-gray-100 font-bold tracking-wider font-mono text-xs">
                                                {activeLoc.lat}, {activeLoc.lng}
                                            </span>
                                            <span className="text-[10px] text-emerald-300 font-sans font-semibold px-2 py-0.5 rounded bg-emerald-400/10 border border-emerald-400/20">
                                                Survey Geo-Fix
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between text-[10px] text-gray-400 mt-2">
                                            <span className="truncate max-w-[150px] sm:max-w-[170px] text-gray-300">{activeLoc.name}</span>
                                            {/* Real Mountain Hub Switcher */}
                                            <div className="flex items-center gap-1 font-sans">
                                                {Object.keys(REAL_LOCATIONS).map((key) => {
                                                    const item = REAL_LOCATIONS[key];
                                                    const isSelected = selectedLocKey === key;
                                                    return (
                                                        <button
                                                            key={key}
                                                            type="button"
                                                            onClick={() => setSelectedLocKey(key)}
                                                            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                                                                isSelected
                                                                    ? 'bg-[#017974] text-white shadow-sm'
                                                                    : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                                                            }`}
                                                        >
                                                            {item.tag}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Illustration Visual */}
                                    <div className="relative aspect-square w-full max-w-[280px] sm:max-w-[320px] mx-auto flex items-center justify-center">
                                        <Image
                                            src="/img/404-illustration.png"
                                            alt="Hiker exploring Himalayan trail"
                                            fill
                                            sizes="(max-width: 768px) 100vw, 340px"
                                            className="object-contain drop-shadow-[0_20px_35px_rgba(1,121,116,0.35)]"
                                            priority
                                        />
                                    </div>

                                    {/* Status Footer */}
                                    <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                                        <span className="flex items-center gap-1.5">
                                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                            <span>Tripdhara Geo-Verified</span>
                                        </span>
                                        <span className="text-gray-300 font-mono">Error 404 • Lost Path</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: 4 Core Rescue Pillar Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                        {rescuePillars.map((pillar) => {
                            const IconComponent = pillar.icon;
                            return (
                                <Link
                                    key={pillar.title}
                                    href={pillar.href}
                                    className="group relative bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-500/40 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#017974]/30 to-teal-500/10 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-[#017974] group-hover:text-white transition-all">
                                                <IconComponent className="w-5 h-5" />
                                            </div>
                                            <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                                                {pillar.badge}
                                            </span>
                                        </div>
                                        <h2 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                                            {pillar.title}
                                        </h2>
                                        <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                                            {pillar.desc}
                                        </p>
                                    </div>

                                    <div className="mt-4 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
                                        <span>Explore</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Section 3: Concierge Assistance Strip */}
                    <div className="rounded-2xl bg-gradient-to-r from-[#013f3c] via-[#014d49] to-[#013532] border border-emerald-500/30 p-5 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-5">
                        <div className="text-center md:text-left space-y-1">
                            <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                                24/7 Road &amp; Weather Helpdesk
                            </span>
                            <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                                Lost on the road or facing sudden mountain roadblocks?
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-200">
                                Our Dehradun &amp; Manali support desks operate round-the-clock for route guidance and booking help.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
                            <a
                                href="tel:+917017288052"
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white text-[#014d49] hover:bg-gray-100 transition-all shadow-md active:scale-95"
                            >
                                <Phone className="w-4 h-4 text-[#017974]" />
                                <span>+91 70172 88052</span>
                            </a>
                            <a
                                href="https://wa.me/917017288052?text=Hi%20Tripdhara%20Team%2C%20I%20got%20lost%20on%20the%20website%20and%20need%20travel%20assistance."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#25D366] hover:bg-[#20ba59] text-white transition-all shadow-md active:scale-95"
                            >
                                <MessageCircle className="w-4 h-4" />
                                <span>WhatsApp</span>
                            </a>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
                            >
                                <HeadphonesIcon className="w-4 h-4 text-emerald-300" />
                                <span>Helpdesk</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            {/* Minimal Clean Bottom Bar (No global footer) */}
            <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
                <p>&copy; {new Date().getFullYear()} Tripdhara. All rights reserved.</p>
                <div className="flex items-center gap-4">
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <span>&bull;</span>
                    <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    <span>&bull;</span>
                    <Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link>
                </div>
            </footer>
        </div>
    );
}
