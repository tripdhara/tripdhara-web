'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
    Search,
    Bike,
    Car,
    Home,
    CloudRain,
    FileCheck2,
    CreditCard,
    ChevronDown,
    Phone,
    MessageCircle,
    ShieldCheck,
    Clock,
    MapPin,
    AlertCircle,
    X,
    Sparkles,
    CheckCircle2
} from 'lucide-react';

const FAQ_DATA = [
    // -------------------------------------------------------------------------
    // 1. Bike & Car Rentals
    // -------------------------------------------------------------------------
    {
        id: 'rentals-docs',
        category: 'rentals',
        tag: 'MVA 1988',
        question: 'What documents do I need to rent a motorcycle or self-drive car in Uttarakhand?',
        answer: (
            <>
                <p className="mb-2">
                    Under the <strong>Motor Vehicles Act 1988</strong> and Uttarakhand Transport Department regulations, you must present:
                </p>
                <ul className="list-disc pl-5 space-y-1 mb-3 text-gray-600">
                    <li>
                        <strong>Indian Citizens:</strong> Original Driving License (LMV for self-drive cars, 2-Wheeler with gear for bikes held for a minimum of 12 months) and an original Aadhaar Card or Passport for identity verification.
                    </li>
                    <li>
                        <strong>Foreign Nationals:</strong> An original International Driving Permit (IDP) accompanied by your home country’s valid license and original Passport with a valid Indian Tourist Visa.
                    </li>
                </ul>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary-50 text-primary-700 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Paperless Handover: DigiLocker &amp; mParivahan verification accepted at Dehradun Airport &amp; Rishikesh hubs.
                </div>
            </>
        )
    },
    {
        id: 'rentals-deposit',
        category: 'rentals',
        tag: 'UPI Refund <24H',
        question: 'How does the security deposit work for bike & car rentals?',
        answer: (
            <>
                <p className="mb-2">
                    A refundable security deposit (ranging from ₹1,500 to ₹5,000 depending on the vehicle class: Scooty, Himalayan 450, Thar 4x4) is collected at vehicle handover via UPI, Cash, or Card pre-authorization.
                </p>
                <p>
                    Upon vehicle return, our fleet technicians conduct a joint 10-point inspection. The deposit is refunded <strong>within 24 hours</strong> via instant UPI after a real-time clearance check against the Uttarakhand Police e-Challan portal.
                </p>
            </>
        )
    },
    {
        id: 'rentals-helmets',
        category: 'rentals',
        tag: 'Safety Gear',
        question: 'Are helmets and protective riding gear provided with bike rentals?',
        answer: (
            <>
                <p className="mb-2">
                    Yes. Every motorcycle rental includes <strong>one sanitized ISI-certified helmet</strong> for the rider free of cost.
                </p>
                <p>
                    For high-altitude Himalayan circuits (Chopta, Mana Pass, Spiti), pillion helmets, CE-approved knee guards, armored riding jackets, gloves, and waterproof saddlebags can be added for a nominal daily rental at all pickup hubs.
                </p>
            </>
        )
    },
    {
        id: 'rentals-fuel',
        category: 'rentals',
        tag: 'Level-to-Level',
        question: 'What is the fuel policy for self-drive rentals?',
        answer: (
            <>
                <p className="mb-2">
                    All self-drive vehicles operate on a transparent <strong>Level-to-Level Fuel Policy</strong>. The vehicle is handed over with recorded fuel (marked clearly on your digital pickup manifest), and must be returned with the same fuel level.
                </p>
                <p>
                    We never impose mandatory hidden fueling surcharges unless the vehicle is returned below the recorded handover level.
                </p>
            </>
        )
    },
    {
        id: 'rentals-speed',
        category: 'rentals',
        tag: 'Speed & Hill Rules',
        question: 'What are the speed limits and off-roading restrictions in hill sectors?',
        answer: (
            <>
                <p className="mb-2">
                    In Uttarakhand hill ghats, the statutory speed limit is strictly <strong>40 km/h to 50 km/h</strong> as mandated by local district traffic authorities.
                </p>
                <p>
                    All vehicles are equipped with IoT telemetry for SOS distress tracking. Drifting, stunt driving on dry riverbeds, entering unauthorized wildlife corridors, or driving under the influence (Section 185 MVA) results in immediate vehicle impoundment and forfeiture of deposit.
                </p>
            </>
        )
    },

    // -------------------------------------------------------------------------
    // 2. Chauffeur Mountain SUVs
    // -------------------------------------------------------------------------
    {
        id: 'chauffeur-drivers',
        category: 'chauffeur',
        tag: 'Mountain Veterans',
        question: 'Are your chauffeurs experienced in extreme mountain driving?',
        answer: (
            <>
                <p className="mb-2">
                    100% Yes. Every Tripdhara chauffeur is a local mountain veteran with a minimum of <strong>5+ years of verified driving experience</strong> across steep Himalayan gradients, heavy monsoon fog, black ice, and snow routes (including Badrinath, Kedarnath, Atal Tunnel, and Spiti).
                </p>
                <p>
                    All drivers undergo mandatory police background verification, regular breathalyzer monitoring, and quarterly hill safety orientation.
                </p>
            </>
        )
    },
    {
        id: 'chauffeur-inclusions',
        category: 'chauffeur',
        tag: 'Zero Hidden Fees',
        question: 'Are toll taxes, state border entry taxes, and fuel included in cab quotes?',
        answer: (
            <>
                <p className="mb-2">
                    Yes. All chauffeur-driven package quotes on Tripdhara are <strong>all-inclusive</strong>. They cover vehicle fuel, commercial driver allowances, FASTag highway tolls, and commercial interstate entry taxes (All India Tourist Permits - AITP).
                </p>
                <p>
                    You will never encounter surprise charges or driver food levies during the ride. Dedicated parking fees at specific temples or monuments are paid per actual municipal receipts.
                </p>
            </>
        )
    },
    {
        id: 'chauffeur-duty',
        category: 'chauffeur',
        tag: 'Safety Standard',
        question: 'What are the driver duty limits and night hill driving regulations?',
        answer: (
            <>
                <p className="mb-2">
                    To eliminate driver fatigue on dangerous high-altitude hairpin bends, maximum daily driving duty is capped at <strong>10 hours or 250 km</strong>.
                </p>
                <p>
                    Driving past <strong>9:00 PM</strong> on unlit mountain ghats is strictly restricted by Uttarakhand Police and Tripdhara safety protocols, unless pre-arranged for verified flight or train terminal emergencies.
                </p>
            </>
        )
    },

    // -------------------------------------------------------------------------
    // 3. Homestays & Resorts
    // -------------------------------------------------------------------------
    {
        id: 'stays-verification',
        category: 'stays',
        tag: '100% Inspected',
        question: 'How are homestays and mountain resorts verified on Tripdhara?',
        answer: (
            <>
                <p className="mb-2">
                    Every single homestay and resort on Tripdhara is physical-ground inspected by our regional operations team. We rigorously audit:
                </p>
                <ul className="list-disc pl-5 space-y-1 mb-2 text-gray-600">
                    <li>24/7 running hot water &amp; winter heating setup.</li>
                    <li>Power backup (inverter / solar / genset) for remote hill zones.</li>
                    <li>Cleanliness, hygienic bedding, and panoramic Himalayan vistas.</li>
                    <li>Valid registration with Uttarakhand Tourism Development Board (UTDB).</li>
                </ul>
            </>
        )
    },
    {
        id: 'stays-formc',
        category: 'stays',
        tag: 'FRRO Compliant',
        question: 'What is Form-C registration for international foreign guests?',
        answer: (
            <>
                <p className="mb-2">
                    Under the <strong>Registration of Foreigners Act 1939</strong> and Bureau of Immigration rules, every hotel, resort, and homestay in India must submit Form-C online to the FRRO within 24 hours of a foreign national’s check-in.
                </p>
                <p>
                    All Tripdhara partner properties are equipped with official FRRO Portal access and assist guests with effortless photo and visa upload upon arrival.
                </p>
            </>
        )
    },
    {
        id: 'stays-food',
        category: 'stays',
        tag: 'Pahadi Cuisine',
        question: 'Are authentic local Garhwali & Himachali meals served at homestays?',
        answer: (
            <>
                <p className="mb-2">
                    Yes! One of the core highlights of staying with Tripdhara homestay hosts is experiencing authentic regional organic delicacies.
                </p>
                <p>
                    You will enjoy home-cooked Mandua (finger millet) roti, Kafuli (spinach and fenugreek gravy), Jhangora kheer, local Bhatt ki Churkani dal, and fresh Himalayan herbal teas sourced directly from adjacent terraced farms.
                </p>
            </>
        )
    },

    // -------------------------------------------------------------------------
    // 4. Weather & Landslides
    // -------------------------------------------------------------------------
    {
        id: 'weather-landslide',
        category: 'weather',
        tag: 'Section 56 ICA 1872',
        question: 'What happens if a landslide, cloudburst, or snow closes my trip route?',
        answer: (
            <>
                <p className="mb-2">
                    If official disaster authorities (IMD, BRO, Uttarakhand Police, or District Magistrates) issue road closures due to landslides, rockfalls, or heavy snowfall, our Force Majeure policy takes effect immediately under <strong>Section 56 of the Indian Contract Act 1872</strong>.
                </p>
                <ul className="list-disc pl-5 space-y-1 mb-2 text-gray-600">
                    <li>Our 24/7 ground desk immediately coordinates safe alternative rerouting, or</li>
                    <li>Issues a <strong>100% 12-Month Travel Credit Voucher</strong> with <strong>zero cancellation penalty</strong>, allowing you to reschedule your journey anytime within one full year.</li>
                </ul>
            </>
        )
    },
    {
        id: 'weather-activities',
        category: 'weather',
        tag: 'Full Refund',
        question: 'What happens if adventure activities (rafting, paragliding) are cancelled due to rain?',
        answer: (
            <>
                <p className="mb-2">
                    Outdoor adventure sports (white-water rafting in Rishikesh, bungee jumping, paragliding in Bir Billing) are strictly weather-contingent for your life safety.
                </p>
                <p>
                    If government safety marshals halt activities due to high river discharge or dangerous cross-winds, you are entitled to an immediate slot reschedule or a <strong>100% refund of the activity fee</strong> processed without any administrative deductions.
                </p>
            </>
        )
    },

    // -------------------------------------------------------------------------
    // 5. Inner Line Permits (ILP)
    // -------------------------------------------------------------------------
    {
        id: 'permits-border',
        category: 'permits',
        tag: 'Border Passes',
        question: 'Do I need special Inner Line Permits (ILP) for Chopta, Niti Valley, or Spiti?',
        answer: (
            <>
                <p className="mb-2">
                    Standard destinations like Chopta, Tungnath, Auli, and Spiti Valley (via Shimla/Kaza) do <strong>not</strong> require Inner Line Permits for Indian citizens.
                </p>
                <p>
                    However, restricted border sectors near the Indo-Tibet frontier (e.g. <strong>Niti Valley, Nelang Valley, Mana Pass interior, or foreign nationals traveling between Kaza and Rekong Peo</strong>) require Sub-Divisional Magistrate (SDM) / DC Inner Line Permits. Tripdhara facilitates end-to-end permit paperwork when Aadhaar / Passport copies are uploaded 72 hours prior to arrival.
                </p>
            </>
        )
    },
    {
        id: 'permits-open',
        category: 'permits',
        tag: 'Open Sectors',
        question: 'Are special permits required for Rishikesh, Mussoorie, Nainital, or Manali?',
        answer: (
            <>
                <p className="mb-2">
                    No. Major tourist hubs including Rishikesh, Dehradun, Mussoorie, Nainital, Corbett, Shimla, and Manali are completely open destinations.
                </p>
                <p>
                    Neither Indian travelers nor international tourists need any special passes or permits to visit these destinations beyond standard vehicle FASTag and personal photo identity cards.
                </p>
            </>
        )
    },

    // -------------------------------------------------------------------------
    // 6. Payments & Refunds
    // -------------------------------------------------------------------------
    {
        id: 'payments-methods',
        category: 'payments',
        tag: '256-bit SSL',
        question: 'What payment methods are supported on Tripdhara?',
        answer: (
            <>
                <p className="mb-2">
                    All transactions are processed securely through RBI-licensed payment gateways with 256-bit bank-grade encryption. We accept:
                </p>
                <ul className="list-disc pl-5 space-y-1 mb-2 text-gray-600">
                    <li><strong>Instant UPI:</strong> Google Pay, PhonePe, Paytm, BHIM, CRED.</li>
                    <li><strong>Cards:</strong> Visa, MasterCard, RuPay, American Express (Credit &amp; Debit).</li>
                    <li><strong>Net Banking:</strong> All 50+ Indian commercial scheduled banks.</li>
                    <li><strong>Corporate Invoicing:</strong> GST input credit tax invoices for corporate expeditions.</li>
                </ul>
            </>
        )
    },
    {
        id: 'payments-refund-sla',
        category: 'payments',
        tag: 'RBI Directive',
        question: 'How quickly will I receive my refund after cancellation?',
        answer: (
            <>
                <p className="mb-2">
                    In strict accordance with RBI Payment Settlement Guidelines and CGST Section 34 credit regulations:
                </p>
                <ul className="list-disc pl-5 space-y-1 mb-2 text-gray-600">
                    <li><strong>UPI &amp; Net Banking Refunds:</strong> Credited back within <strong>24 to 48 banking hours</strong>.</li>
                    <li><strong>Credit &amp; Debit Cards:</strong> Settled within <strong>5 to 7 banking days</strong> depending on your issuing bank.</li>
                    <li><strong>Security Deposit Refunds:</strong> Returned within 24 hours of vehicle return inspection.</li>
                </ul>
            </>
        )
    }
];

const CATEGORIES = [
    { id: 'all', title: 'All Questions', icon: Sparkles },
    { id: 'rentals', title: 'Bike & Car Rentals', icon: Bike },
    { id: 'chauffeur', title: 'Chauffeur Mountain SUVs', icon: Car },
    { id: 'stays', title: 'Homestays & Resorts', icon: Home },
    { id: 'weather', title: 'Weather & Landslides', icon: CloudRain },
    { id: 'permits', title: 'Inner Line Permits (ILP)', icon: FileCheck2 },
    { id: 'payments', title: 'Payments & Refunds', icon: CreditCard }
];

const QUICK_SEARCH_TAGS = [
    { label: 'Security Deposit', query: 'deposit' },
    { label: 'Driving License', query: 'license' },
    { label: 'Landslide Policy', query: 'landslide' },
    { label: 'Border Permits', query: 'permit' },
    { label: 'Chauffeur Rules', query: 'chauffeur' },
    { label: 'Refund SLA', query: 'refund' }
];

export default function FAQPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [openItemIds, setOpenItemIds] = useState(new Set(['rentals-docs']));

    // Filtered FAQs
    const filteredFaqs = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return FAQ_DATA.filter((item) => {
            const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
            if (!query) return matchesCategory;

            const qMatches = item.question.toLowerCase().includes(query);
            const tagMatches = item.tag.toLowerCase().includes(query);
            // Search basic content representation
            const textRepr = (typeof item.answer === 'string' ? item.answer : item.question).toLowerCase();
            return matchesCategory && (qMatches || tagMatches || textRepr.includes(query));
        });
    }, [searchQuery, selectedCategory]);

    // Category Counts
    const categoryCounts = useMemo(() => {
        const counts = { all: FAQ_DATA.length };
        FAQ_DATA.forEach((item) => {
            counts[item.category] = (counts[item.category] || 0) + 1;
        });
        return counts;
    }, []);

    const toggleAccordion = (id) => {
        setOpenItemIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
    };

    // JSON-LD Schema
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQ_DATA.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: typeof f.answer === 'string' ? f.answer : f.question
            }
        }))
    };

    return (
        <div className="bg-gray-50/70 min-h-screen selection:bg-primary-500 selection:text-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero Section with Integrated Search */}
            <header className="relative bg-gray-900 overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 text-white">
                <div className="absolute inset-0">
                    <img
                        src="/img/background.png"
                        alt="Himalayan Mountain Background"
                        className="w-full h-full object-cover opacity-20 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
                    <div className="absolute inset-0 bg-radial from-primary-600/10 via-transparent to-transparent pointer-events-none"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/15 border border-primary-400/30 backdrop-blur-md mb-6 shadow-sm">
                        <Sparkles className="w-4 h-4 text-primary-400" />
                        <span className="text-xs sm:text-sm font-semibold text-primary-200 tracking-wide uppercase">
                            Himalayan Help &amp; Knowledge Desk
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-4 font-display">
                        Frequently Asked <span className="text-primary-400">Questions</span>
                    </h1>

                    <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
                        Instant answers for Himalayan bike rentals, mountain chauffeur SUVs, verified homestays, landslide road credits, and border permits.
                    </p>

                    {/* Search Input Box */}
                    <div className="max-w-xl mx-auto">
                        <div className="relative flex items-center bg-gray-800/90 border border-gray-700/80 rounded-2xl shadow-2xl focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/30 transition-all p-1.5">
                            <Search className="w-5 h-5 text-gray-400 ml-3 shrink-0" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search questions (e.g. deposit, license, landslide, permit, fuel)..."
                                className="w-full bg-transparent px-3 py-2.5 text-white placeholder-gray-400 text-sm sm:text-base focus:outline-none"
                                aria-label="Search FAQ"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="p-1.5 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors mr-1"
                                    aria-label="Clear search input"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Quick Query Pills */}
                        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
                            <span className="text-gray-400 font-medium">Quick search:</span>
                            {QUICK_SEARCH_TAGS.map((tag) => (
                                <button
                                    key={tag.query}
                                    type="button"
                                    onClick={() => setSearchQuery(tag.query)}
                                    className="px-3 py-1 rounded-full bg-gray-800/60 hover:bg-primary-900/40 text-gray-300 hover:text-primary-300 border border-gray-700/60 hover:border-primary-500/50 transition-all"
                                >
                                    {tag.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            {/* Trust Badges Strip */}
            <div className="bg-white border-b border-gray-200/80 py-4 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-gray-700">
                            <ShieldCheck className="w-4 h-4 text-primary-600 shrink-0" />
                            <span>MVA 1988 &amp; CPA 2019 Compliant</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-gray-700">
                            <Clock className="w-4 h-4 text-primary-600 shrink-0" />
                            <span>Deposit Refunded &lt; 24h</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-gray-700">
                            <MapPin className="w-4 h-4 text-primary-600 shrink-0" />
                            <span>100% Ground Inspected Stays</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-gray-700">
                            <Phone className="w-4 h-4 text-primary-600 shrink-0" />
                            <a href="tel:+917017288052" className="hover:text-primary-600 transition-colors">
                                24/7 Road Helpline: +91 70172 88052
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Interactive Layout */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

                    {/* Left Sticky Sidebar */}
                    <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                        {/* Topics Card */}
                        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-lg shadow-gray-200/40">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                                <h2 className="text-base font-bold text-gray-900 font-display">FAQ Topics</h2>
                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700">
                                    {FAQ_DATA.length} Total
                                </span>
                            </div>

                            <nav className="space-y-1.5" aria-label="FAQ Categories">
                                {CATEGORIES.map((cat) => {
                                    const Icon = cat.icon;
                                    const isSelected = selectedCategory === cat.id;
                                    const count = categoryCounts[cat.id] || 0;

                                    return (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={`w-full flex items-center justify-between p-3 rounded-2xl text-left font-medium text-sm transition-all ${isSelected
                                                ? 'bg-primary-600 text-white shadow-md shadow-primary-600/25'
                                                : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <span className="truncate">{cat.title}</span>
                                            </div>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                {count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* 24/7 Road Concierge Card */}
                        <div className="bg-gradient-to-br from-primary-900 to-gray-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-primary-700/40">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl pointer-events-none"></div>

                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-primary-600/50 border border-primary-400/40 flex items-center justify-center text-primary-300">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base font-display">Road Concierge 24/7</h3>
                                    <span className="text-xs text-primary-400 font-semibold flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                        Live Mountain Desk
                                    </span>
                                </div>
                            </div>

                            <p className="text-xs text-gray-300 leading-relaxed mb-5">
                                En route to Rishikesh, Chopta, or Spiti and need urgent on-road coordination? Our emergency travel desk is available 24/7.
                            </p>

                            <div className="space-y-2.5">
                                <a
                                    href="tel:+917017288052"
                                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold shadow-md shadow-primary-600/30 transition-all"
                                >
                                    <Phone className="w-4 h-4" />
                                    Call +91 70172 88052
                                </a>

                                <a
                                    href="https://wa.me/917017288052?text=Hello%20Tripdhara%2C%20I%20have%20an%20enquiry%20regarding%20my%20Himalayan%20booking"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-emerald-300 border border-white/10 text-sm font-semibold transition-all"
                                >
                                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                                    WhatsApp Quick Desk
                                </a>
                            </div>
                        </div>
                    </aside>

                    {/* Right FAQ List Content */}
                    <section className="lg:col-span-8 space-y-6">

                        {/* Active Group Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 font-display">
                                    {searchQuery
                                        ? `Search Results for "${searchQuery}"`
                                        : CATEGORIES.find((c) => c.id === selectedCategory)?.title}
                                </h2>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    Showing {filteredFaqs.length} {filteredFaqs.length === 1 ? 'question' : 'questions'}
                                </p>
                            </div>
                            {(searchQuery || selectedCategory !== 'all') && (
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="text-xs font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-1.5 rounded-full transition-colors"
                                >
                                    Reset Filters
                                </button>
                            )}
                        </div>

                        {/* Empty Search State */}
                        {filteredFaqs.length === 0 && (
                            <div className="bg-white rounded-3xl p-10 text-center border border-gray-200/80 shadow-sm">
                                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <h3 className="text-lg font-bold text-gray-900 mb-1 font-display">
                                    No matching questions found
                                </h3>
                                <p className="text-sm text-gray-500 max-w-md mx-auto mb-5 leading-relaxed">
                                    We couldn’t find any answers matching &ldquo;{searchQuery}&rdquo;. Try another search term or get in touch with our live road desk.
                                </p>
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold shadow-sm transition-all"
                                >
                                    View All Questions
                                </button>
                            </div>
                        )}

                        {/* Accordion List */}
                        <div className="space-y-3.5">
                            {filteredFaqs.map((faq, index) => {
                                const isOpen = openItemIds.has(faq.id);
                                return (
                                    <div
                                        key={faq.id}
                                        className={`rounded-2xl transition-all duration-300 border ${isOpen
                                            ? 'bg-white border-primary-300/80 shadow-md shadow-primary-500/5'
                                            : 'bg-white/80 hover:bg-white border-gray-200/80 hover:border-gray-300 shadow-sm'
                                            }`}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => toggleAccordion(faq.id)}
                                            aria-expanded={isOpen}
                                            className="w-full px-5 py-4 sm:px-6 sm:py-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                                        >
                                            <div className="flex items-center gap-3.5 flex-grow">
                                                <span className={`text-xs font-black w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isOpen
                                                    ? 'bg-primary-600 text-white'
                                                    : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    {(index + 1).toString().padStart(2, '0')}
                                                </span>
                                                <div>
                                                    <span className={`font-bold text-base sm:text-lg block transition-colors font-display ${isOpen ? 'text-primary-700' : 'text-gray-900'
                                                        }`}>
                                                        {faq.question}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2.5 shrink-0">
                                                <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 rounded-md bg-gray-100 text-gray-600">
                                                    {faq.tag}
                                                </span>
                                                <div
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${isOpen
                                                        ? 'bg-primary-50 text-primary-600 rotate-180'
                                                        : 'bg-gray-100 text-gray-400'
                                                        }`}
                                                >
                                                    <ChevronDown className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </button>

                                        {isOpen && (
                                            <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-gray-600 leading-relaxed text-sm sm:text-base border-t border-gray-100">
                                                <div className="pl-0 sm:pl-10">
                                                    {faq.answer}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Bottom Assistance Banner */}
                        <div className="bg-gradient-to-r from-gray-900 to-primary-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-primary-800/40 mt-8">
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold font-display mb-1">
                                    Still have questions or need a customized route?
                                </h3>
                                <p className="text-sm text-gray-300">
                                    Our local Himalayan team is available 24/7 to assist with your journey.
                                </p>
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                                <a
                                    href="tel:+917017288052"
                                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm shadow-md transition-all"
                                >
                                    <Phone className="w-4 h-4" />
                                    Call +91 70172 88052
                                </a>
                                <Link
                                    href="/contact"
                                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all"
                                >
                                    Contact Desk
                                </Link>
                            </div>
                        </div>

                    </section>
                </div>
            </main>
        </div>
    );
}