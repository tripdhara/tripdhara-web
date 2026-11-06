'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Home,
    Building,
    Tent,
    Waves,
    Mountain,
    Bike,
    Sparkles,
    Compass,
    ShieldCheck,
    Leaf,
    Users,
    HeartHandshake,
    Sun,
    CloudRain,
    Snowflake,
    Wind,
    Phone,
    Mail,
    MessageCircle,
    CheckCircle2,
    ArrowRight,
    MapPin,
    ExternalLink,
    Award
} from 'lucide-react';

const coreServices = [
    {
        number: '01',
        title: 'Homestay',
        tag: 'Cultural Immersion',
        icon: Home,
        color: 'from-amber-500/20 to-orange-500/10 text-amber-600',
        borderColor: 'hover:border-amber-400',
        description: 'Traditional wooden Kath-Kuni homes in Himachal & stone-slate dwellings in Uttarakhand. Share organic homecooked meals and experience timeless Pahadi hospitality.',
        highlights: ['Traditional Kath-Kuni Architecture', 'Homecooked Organic Meals', 'Direct Support to Mountain Families', 'Warm Bukhari Evenings']
    },
    {
        number: '02',
        title: 'Hotel & Resorts',
        tag: 'Stays & Luxury',
        icon: Building,
        color: 'from-blue-500/20 to-indigo-500/10 text-blue-600',
        borderColor: 'hover:border-blue-400',
        description: 'Handpicked budget, boutique, and 4-star luxury valley-view hotels & resorts across Rishikesh, Mussoorie, Dehradun, Nainital, Manali, Shimla, and Leh.',
        highlights: ['Valley-View Balconies', 'Boutique & Heritage Aesthetics', 'Sanitized & Verified Stays', 'In-House Mountain Dining']
    },
    {
        number: '03',
        title: 'Camping',
        tag: 'Outdoor Adventure',
        icon: Tent,
        color: 'from-emerald-500/20 to-teal-500/10 text-emerald-600',
        borderColor: 'hover:border-emerald-400',
        description: 'Luxury Swiss cottage tents with attached washrooms along the Ganga in Rishikesh, plus high-altitude expedition dome tents pitched on lush alpine bugyals in Chopta and Dayara.',
        highlights: ['Riverside Swiss Tents in Rishikesh', 'High-Altitude Alpine Dome Tents', 'Stargazing & Bonfires', 'Barbecue & Acoustic Nights']
    },
    {
        number: '04',
        title: 'White Water Rafting',
        tag: 'River Rapids',
        icon: Waves,
        color: 'from-cyan-500/20 to-blue-500/10 text-cyan-600',
        borderColor: 'hover:border-cyan-400',
        description: 'Navigate roaring Ganga rapids in Rishikesh with certified river marshals across world-famous stretches: Brahmpuri (9km), Shivpuri (16km), Marine Drive (26km), and Kaudiyala (36km).',
        highlights: ['CE-Approved Safety Gear & Kayaks', 'Roller Coaster & Golf Course Rapids', 'Cliff Jumping & Body Surfing', 'Licensed River Marshals']
    },
    {
        number: '05',
        title: 'Trekking & Expeditions',
        tag: 'Mountain Trails',
        icon: Mountain,
        color: 'from-emerald-500/20 to-green-500/10 text-emerald-700',
        borderColor: 'hover:border-emerald-500',
        description: 'Curated mountain trails from gentle meadows to high-altitude passes: Kedarkantha winter trek, Dayara Bugyal, Valley of Flowers, Har Ki Dun, Chopta, Roopkund, and Goechala.',
        highlights: ['Certified Local Trek Leaders', 'High-Altitude First-Aid & Oxygen Kits', 'Curated Seasonal Routes', 'Eco-Friendly Expedition Camps']
    },
    {
        number: '06',
        title: 'Bungee Jumping & Extreme',
        tag: 'Extreme Sports',
        icon: Sparkles,
        color: 'from-red-500/20 to-rose-500/10 text-rose-600',
        borderColor: 'hover:border-rose-400',
        description: "India's highest 83-meter fixed cantilever bungee jump in Mohan Chatti, Rishikesh. Experience high-speed tandem Giant Swing, 140 km/h Flying Fox, Bir Billing paragliding, and Auli skiing.",
        highlights: ["India's Highest 83m Cantilever Bungee", 'Asia’s Longest 1 km Flying Fox', 'Tandem Giant Swing Over River Gorge', 'Paragliding & Snow Skiing']
    },
    {
        number: '07',
        title: 'Bike & Scooter Rental',
        tag: 'Mountain Mobility',
        icon: Bike,
        color: 'from-violet-500/20 to-purple-500/10 text-violet-600',
        borderColor: 'hover:border-violet-400',
        description: 'Feel the crisp alpine air on high mountain roads. Well-serviced fleet of Royal Enfield Himalayan 411/450, Classic 350, Hunter 350, and automatic scooters across top transit hubs.',
        highlights: ['Royal Enfield Himalayan 450/411', 'Classic 350 & Automatic Scooters', 'Dual ISI Helmets & Luggage Racks', 'Pickup: Rishikesh, Dehradun, Manali']
    },
    {
        number: '08',
        title: 'Chaardham Tour',
        tag: 'Spiritual Pilgrimage',
        icon: Compass,
        color: 'from-amber-600/20 to-yellow-500/10 text-amber-700',
        borderColor: 'hover:border-amber-500',
        description: 'Sacred journeys to Yamunotri, Gangotri, Kedarnath, and Badrinath. Seamless logistical support: biometric registrations, sanitized transport, comfortable stays, and VIP helicopter charters.',
        highlights: ['Complete 4-Dham Circuit Packages', 'Express 5-Day Do Dham (Kedar-Badri)', 'VIP Same-Day Helicopter Charters', 'Senior Citizen & Family Assistance']
    },
    {
        number: '09',
        title: 'Custom Trip',
        tag: 'Bespoke Itineraries',
        icon: HeartHandshake,
        color: 'from-indigo-500/20 to-blue-500/10 text-indigo-600',
        borderColor: 'hover:border-indigo-400',
        description: '100% personalized travel crafted around your dates, pace, and interests. Bespoke itineraries for couples, families, corporate offsites, college reunions, and solo wanderers.',
        highlights: ['One-on-One Mountain Trip Coordinator', 'Innova Crysta, Thar & Tempo Travellers', 'Flexible Pacing & Handpicked Stays', 'Custom Mix of Leisure & Adventure']
    }
];

const missionPillars = [
    {
        title: 'Organize the Unorganized',
        description: 'Bringing digital standardization, transparent pricing, and structure to the deeply fragmented Himalayan travel market.',
        icon: Compass
    },
    {
        title: 'Empower the Local Economy',
        description: 'Bypassing exploitative middlemen so homestay owners, trek leaders, and taxi operators retain their rightful hard-earned revenue.',
        icon: Users
    },
    {
        title: 'Guarantee Authenticity',
        description: 'Strict vetting ensures every village homestay, river rapid run, or high-altitude trek is genuine, respectful, and true to the mountains.',
        icon: Award
    },
    {
        title: 'Prioritize Safety & Reliability',
        description: 'Commercial licensing, CE-approved safety equipment, altitude protocols, and secure verified booking confirmations.',
        icon: ShieldCheck
    },
    {
        title: 'Promote Sustainable Tourism',
        description: 'Advocating "Leave No Trace" principles, ecological preservation, and sustainable community growth for future generations.',
        icon: Leaf
    }
];

const coreValues = [
    {
        title: 'Sustainable & Regenerative Tourism',
        description: 'Tourism must leave the Himalayas better than it found them. We promote offbeat valleys to prevent overcrowding, enforce Leave No Trace guidelines, and prioritize eco-conscious hosts.',
        icon: Leaf,
        badge: 'Ecological Responsibility'
    },
    {
        title: 'Community First',
        description: 'The soul of the mountains lies in its people. Our economic model distributes travel spending directly to mountain families and villages rather than remote corporate intermediaries.',
        icon: Users,
        badge: 'Equitable Growth'
    },
    {
        title: 'Uncompromising Safety',
        description: 'In challenging high-altitude terrain, safety cannot be secondary. We enforce strict certified partner protocols, mountaineering first-aid, oxygen availability, and 24/7 on-ground assistance.',
        icon: ShieldCheck,
        badge: 'Zero Compromise'
    },
    {
        title: 'Preservation of Cultural Heritage',
        description: 'We treat tourism as an instrument for cultural preservation. By celebrating Pahadi cuisine, folklore, and Kath-Kuni architecture, we provide local youth an incentive to preserve their roots.',
        icon: HeartHandshake,
        badge: 'Ancestral Pride'
    }
];

const seasons = [
    {
        season: 'Spring',
        period: 'March - May',
        icon: Sun,
        tagline: 'Rhododendron Blooms & Alpine Awakening',
        description: 'Witness mountain valleys burst into red and pink rhododendrons. Ideal for moderate day hikes, national park wildlife safaris, and escaping the plains heat.'
    },
    {
        season: 'Summer & Monsoon',
        period: 'June - August',
        icon: CloudRain,
        tagline: 'Spiti, Ladakh & High Mountain Deserts',
        description: 'While lower foothills receive rains, the trans-Himalayan rain-shadow regions of Ladakh, Spiti, and Zanskar offer prime road-tripping and high-altitude pass crossings.'
    },
    {
        season: 'Autumn',
        period: 'September - November',
        icon: Wind,
        tagline: 'Crystal Skies & Panoramic Himalayan Views',
        description: 'The golden window for trekking and photography. Crisp weather, clear azure skies, and unobstructed vistas of the world’s most majestic 7,000m+ peaks.'
    },
    {
        season: 'Winter',
        period: 'December - February',
        icon: Snowflake,
        tagline: 'Pristine Snow Wonderlands & Ski Slopes',
        description: 'Snow trekking in Kedarkantha, world-class skiing and snowboarding in Auli, and evenings cozying up next to a crackling bukhari in an authentic wooden homestay.'
    }
];

export default function ClientAbout() {
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 800], [0, 250]);
    const opacity = useTransform(scrollY, [0, 500], [1, 0.2]);

    return (
        <div className="bg-gray-50 min-h-screen font-sans selection:bg-primary-500 selection:text-white">

            {/* Cinematic Hero Section */}
            <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden bg-gray-950 pt-28 pb-20">
                <motion.div style={{ y: heroY, opacity }} className="absolute inset-0 z-0">
                    <Image
                        src="/img/background.png"
                        alt="The Majestic Himalayas - Tripdhara"
                        fill
                        sizes="100vw"
                        className="object-cover object-center opacity-40 scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-950/50 to-gray-950" />
                </motion.div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Focus Hubs Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs font-semibold uppercase tracking-wider mb-8 shadow-xl"
                    >
                        <MapPin className="w-3.5 h-3.5 text-secondary-400" />
                        <span>Uttarakhand • Kullu • Manali • Rishikesh • Joshimath • Auli • Valley of Flowers</span>
                    </motion.div>

                    {/* Main Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.15 }}
                        className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight font-display mb-6 leading-[1.1] max-w-5xl mx-auto"
                    >
                        The Digital Ecosystem for{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-secondary-300 to-emerald-400">
                            Himalayan Travel
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-lg sm:text-2xl text-gray-200 max-w-3xl mx-auto font-medium leading-relaxed mb-10"
                    >
                        Tripdhara bridges the gap between global explorers and the unsung heroes of the mountains—local homestay families, licensed trek leaders, and verified mountain operators.
                    </motion.p>

                    {/* Official Portals Badges */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.45 }}
                        className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-950/80 text-blue-200 border border-blue-800/60 backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                            Global Portal: tripdhara.com
                        </span>
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-950/80 text-amber-200 border border-amber-800/60 backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                            India Domestic Portal: tripdhara.in
                        </span>
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/80 text-emerald-200 border border-emerald-800/60 backdrop-blur-md">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            24/7 Ground Assistance
                        </span>
                    </motion.div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-24">

                {/* The Story & Vision Block */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="bg-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-gray-200/80 shadow-xl mb-24 relative overflow-hidden"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-7 space-y-6">
                            <span className="text-primary-600 font-extrabold text-xs uppercase tracking-widest block">
                                The Genesis of Tripdhara
                            </span>
                            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight font-display leading-tight">
                                Organizing the Unorganized Himalayan Frontier
                            </h2>
                            <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-normal">
                                The Himalayas have captivated humanity for centuries. Yet, navigating this vast mountain landscape has historically meant facing opaque pricing, unverified accommodations, and safety vulnerabilities. Meanwhile, the real hosts—local family homestays, licensed river marshals, and high-altitude guides—remained invisible, squeezed by layers of exploitative middlemen.
                            </p>
                            <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-normal">
                                <strong className="text-gray-900 font-bold">Tripdhara was born out of a profound love for the mountains.</strong> We are building the foundational digital infrastructure for Himalayan tourism: a transparent, verified bridge where every booking directly uplifts local mountain communities while providing travelers memories that last a lifetime.
                            </p>

                            <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-6 items-center">
                                <div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Headquarters</span>
                                    <span className="text-base font-black text-gray-900 flex items-center gap-1.5 mt-0.5">
                                        <MapPin className="w-4 h-4 text-primary-600" /> Rishikesh / Dehradun, Uttarakhand
                                    </span>
                                </div>
                                <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
                                <div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Architect & Founder</span>
                                    <span className="text-base font-black text-gray-900 mt-0.5 block">
                                        Er. Mradul Sharma
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Vision Card */}
                        <div className="lg:col-span-5 bg-gradient-to-br from-gray-950 via-gray-900 to-primary-950 text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/20 rounded-full blur-3xl pointer-events-none"></div>
                            <span className="text-secondary-400 font-extrabold text-xs uppercase tracking-widest mb-4 inline-flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4" /> Our Foundational Vision
                            </span>
                            <blockquote className="text-xl sm:text-2xl font-bold font-display leading-snug mb-6 text-gray-100">
                                &ldquo;To make every journey through the Himalayas seamless, secure, sustainable, and deeply unforgettable.&rdquo;
                            </blockquote>
                            <p className="text-gray-300 text-sm leading-relaxed mb-6 font-normal">
                                We envision a future where the majestic Himalayas are accessible without compromising their delicate ecological balance or rich cultural heritage—where tourism acts as a direct catalyst for rural prosperity.
                            </p>
                            <Link
                                href="/packages"
                                className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-bold text-sm group"
                            >
                                <span>Browse Our Curated Offerings</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </motion.section>

                {/* 5 Mission Pillars */}
                <section className="mb-24">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-primary-600 font-extrabold text-xs uppercase tracking-widest block mb-3">
                            Strategic Purpose
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight font-display mb-4">
                            Our 5 Mission Commitments
                        </h2>
                        <p className="text-gray-600 text-base sm:text-lg">
                            The standards that govern our software, operational policies, and field partnerships across the mountains.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {missionPillars.map((pillar, idx) => {
                            const IconComponent = pillar.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                                >
                                    <div>
                                        <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-5 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                            <IconComponent className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-lg font-black text-gray-900 mb-2 font-display">
                                            {pillar.title}
                                        </h3>
                                        <p className="text-xs text-gray-600 leading-relaxed font-normal">
                                            {pillar.description}
                                        </p>
                                    </div>
                                    <span className="text-[11px] font-bold text-primary-600 mt-4 block uppercase tracking-wider">
                                        Pillar 0{idx + 1}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* 9 Core Services & Offerings Showcase */}
                <section className="mb-24">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div>
                            <span className="text-primary-600 font-extrabold text-xs uppercase tracking-widest block mb-2">
                                Complete Ecosystem
                            </span>
                            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight font-display">
                                Our 9 Core Offerings
                            </h2>
                        </div>
                        <p className="text-gray-500 max-w-md text-sm font-medium">
                            From riverside Swiss tents in Rishikesh to high-altitude trans-Himalayan circuits, discover experiences engineered for safety and authentic immersion.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {coreServices.map((service, index) => {
                            const IconComp = service.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 25 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
                                    className={`bg-white rounded-3xl p-8 border border-gray-200/90 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between ${service.borderColor} group`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-6">
                                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-inner`}>
                                                <IconComp className="w-7 h-7" />
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-black text-gray-300 font-mono block">
                                                    {service.number}
                                                </span>
                                                <span className="text-[10px] font-extrabold text-primary-600 uppercase tracking-wider bg-primary-50 px-2 py-0.5 rounded-full">
                                                    {service.tag}
                                                </span>
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-black text-gray-900 mb-3 font-display group-hover:text-primary-600 transition-colors">
                                            {service.title}
                                        </h3>

                                        <p className="text-sm text-gray-600 leading-relaxed mb-6 font-normal">
                                            {service.description}
                                        </p>

                                        <div className="space-y-2 mb-6 pt-4 border-t border-gray-100">
                                            {service.highlights.map((h, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs font-medium text-gray-700">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                                    <span>{h}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <Link
                                        href="/packages"
                                        className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-primary-600 group-hover:text-primary-700"
                                    >
                                        <span>View Verified Packages</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* The Dual Ecosystem */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="bg-gray-950 text-white rounded-3xl p-8 sm:p-14 lg:p-16 mb-24 relative overflow-hidden shadow-2xl"
                >
                    <div className="max-w-3xl mb-14">
                        <span className="text-secondary-400 font-extrabold text-xs uppercase tracking-widest block mb-3">
                            Symbiotic Platform
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-display text-white mb-4">
                            The Tripdhara Ecosystem
                        </h2>
                        <p className="text-gray-300 text-base leading-relaxed">
                            A dual-sided ecosystem engineered to empower mountain vendors with digital inclusion while granting travelers complete transparency, safety, and authentic local immersion.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* For Travelers */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 text-xs font-bold uppercase tracking-wider mb-6">
                                <Compass className="w-3.5 h-3.5" /> For The Traveler
                            </div>
                            <h3 className="text-2xl font-black font-display mb-4 text-white">A Seamless Mountain Journey</h3>
                            <ul className="space-y-4 text-sm text-gray-300">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
                                    <span><strong>Transparent Local Pricing:</strong> Direct vendor rates with zero hidden markups or sudden surprises.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
                                    <span><strong>Strictly Vetted Hosts:</strong> Every homestay host, cab driver, and trek guide undergoes verified vetting.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
                                    <span><strong>Secure Checkout:</strong> Encrypted payment gateways with guaranteed booking vouchers and instant confirmation.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
                                    <span><strong>24/7 On-Ground Support:</strong> Real-time mountain weather advisories and emergency on-ground response.</span>
                                </li>
                            </ul>
                        </div>

                        {/* For Vendors */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-500/20 text-secondary-300 text-xs font-bold uppercase tracking-wider mb-6">
                                <Users className="w-3.5 h-3.5" /> For The Mountain Vendor
                            </div>
                            <h3 className="text-2xl font-black font-display mb-4 text-white">Empowerment & Growth</h3>
                            <ul className="space-y-4 text-sm text-gray-300">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-secondary-400 shrink-0 mt-0.5" />
                                    <span><strong>Digital Inclusion:</strong> Intuitive vendor dashboards designed for remote operators who have never used software before.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-secondary-400 shrink-0 mt-0.5" />
                                    <span><strong>Direct Market Reach:</strong> Connect directly with global travelers without paying 30-40% cuts to exploitative agents.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-secondary-400 shrink-0 mt-0.5" />
                                    <span><strong>Automated Operations:</strong> We handle digital marketing, secure payouts, and customer support so hosts can focus on hospitality.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-secondary-400 shrink-0 mt-0.5" />
                                    <span><strong>Capacity Workshops:</strong> Regular mountain workshops on hospitality, safety standards, and sustainable tourism.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </motion.section>

                {/* Core Values & Philosophy */}
                <section className="mb-24">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-primary-600 font-extrabold text-xs uppercase tracking-widest block mb-3">
                            Ethical Foundation
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight font-display mb-4">
                            Our Core Values & Philosophy
                        </h2>
                        <p className="text-gray-600 text-base sm:text-lg">
                            The fragile ecology and sacred heritage of the Himalayas demand deep respect. Here is how we safeguard them:
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {coreValues.map((val, i) => {
                            const IconC = val.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 25 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: i * 0.1 }}
                                    className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center">
                                            <IconC className="w-7 h-7" />
                                        </div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">
                                            {val.badge}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-3 font-display">
                                        {val.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed font-normal">
                                        {val.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* Journey Through the Seasons */}
                <section className="mb-24">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-primary-600 font-extrabold text-xs uppercase tracking-widest block mb-3">
                            Year-Round Wonder
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight font-display mb-4">
                            A Journey Through The Seasons
                        </h2>
                        <p className="text-gray-600 text-base sm:text-lg">
                            The Himalayas transform dramatically with each season, offering distinctive adventures throughout the year.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {seasons.map((s, idx) => {
                            const SIcon = s.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all"
                                >
                                    <div>
                                        <div className="w-12 h-12 rounded-xl bg-secondary-50 text-secondary-600 flex items-center justify-center mb-4">
                                            <SIcon className="w-6 h-6" />
                                        </div>
                                        <span className="text-xs font-bold text-primary-600 uppercase tracking-wider block mb-1">
                                            {s.period}
                                        </span>
                                        <h3 className="text-xl font-black text-gray-900 font-display mb-2">
                                            {s.season}
                                        </h3>
                                        <p className="text-xs font-bold text-gray-800 mb-2">
                                            {s.tagline}
                                        </p>
                                        <p className="text-xs text-gray-600 leading-relaxed font-normal">
                                            {s.description}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* Direct Connect & Action Hub */}
                <motion.section
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="bg-gradient-to-br from-gray-950 via-gray-900 to-primary-950 text-white rounded-3xl p-8 sm:p-14 lg:p-16 border border-white/10 shadow-2xl relative overflow-hidden"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
                        <div className="lg:col-span-7 space-y-6">
                            <span className="text-secondary-400 font-bold text-xs uppercase tracking-widest inline-flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5" /> 24/7 Travel Desk & Booking Support
                            </span>
                            <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight leading-tight">
                                Plan Your Himalayan Journey with Us
                            </h2>
                            <p className="text-gray-300 text-base leading-relaxed font-normal">
                                Have questions regarding high-altitude acclimatization, customized group packages, or vendor partnerships? Reach out directly to our dedicated local coordination desk in Rishikesh & Dehradun.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-2">
                                <a
                                    href="https://wa.me/917017288052?text=Hello%20Tripdhara!%20I%20would%20like%20to%20plan%20a%20trip."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 transform hover:scale-105"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    <span>WhatsApp: +91 7017288052</span>
                                </a>
                                <a
                                    href="tel:+917017288052"
                                    className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold text-sm backdrop-blur-md transition-all flex items-center gap-2"
                                >
                                    <Phone className="w-4 h-4" />
                                    <span>Call: +91 7017288052</span>
                                </a>
                                <a
                                    href="mailto:contact@tripdhara.com"
                                    className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold text-sm backdrop-blur-md transition-all flex items-center gap-2"
                                >
                                    <Mail className="w-4 h-4" />
                                    <span>contact@tripdhara.com</span>
                                </a>
                            </div>
                        </div>

                        <div className="lg:col-span-5 bg-white/10 border border-white/20 rounded-3xl p-8 backdrop-blur-xl text-center">
                            <h3 className="text-xl font-black font-display mb-2 text-white">Join the Movement</h3>
                            <p className="text-xs text-gray-300 mb-6 leading-relaxed">
                                Whether you are an explorer seeking pristine trails or a local host wanting direct market access, welcome to the Tripdhara family.
                            </p>
                            <div className="space-y-3">
                                <Link
                                    href="/packages"
                                    className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-center block transition-all shadow-md text-sm"
                                >
                                    Explore All Verified Packages
                                </Link>
                                <Link
                                    href="/partner"
                                    className="w-full py-3.5 bg-white hover:bg-gray-100 text-gray-900 font-bold rounded-xl text-center block transition-all shadow-md text-sm"
                                >
                                    Partner With Us as a Vendor
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.section>

            </main>
        </div>
    );
}
