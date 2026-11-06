import Link from 'next/link';
import Image from 'next/image';
import {
    Car,
    Home,
    Bike,
    Waves,
    Mountain,
    Tent,
    ShieldCheck,
    Banknote,
    TrendingUp,
    CheckCircle2,
    ArrowRight,
    MessageCircle,
    Phone,
    MapPin,
    Sparkles,
    Users
} from 'lucide-react';
import createMetadata from '@/core/Helpers/metadata.js';

export const metadata = createMetadata({
    title: 'Earn with Tripdhara - Self-Employment & Income Platform for Himalayan Locals',
    description: 'Monetize your commercial cab, homestay, bike rental, rafting setup, or guiding skills with Tripdhara. 0% listing fee, direct traveler bookings, and guaranteed weekly bank payouts.',
    path: '/careers',
    keywords: [
        'Earn with Tripdhara',
        'Himachal Cab Driver Registration',
        'Homestay Earning Platform',
        'Rishikesh Rafting Partner',
        'Bike Rental Income Himalayas',
        'Trek Guide Income'
    ]
});

const earningStreams = [
    {
        title: 'Cab & Mountain Taxi Drivers',
        model: 'Mountain Taxi & Cab Network',
        icon: Car,
        color: 'from-blue-500/20 to-indigo-500/10 text-blue-600',
        borderColor: 'hover:border-blue-400',
        description: 'Drive outstation routes, Spiti Valley circuits, Manali transfers, and Chardham Yatra pilgrimages with your Innova, Scorpio, Dzire, or Tempo Traveller.',
        perks: ['Set your own route availability', 'Direct per-kilometer mountain rates', 'Zero commission deductions on fuel & tolls']
    },
    {
        title: 'Homestay & Cottage Hosts',
        model: 'Village Homestay & Cottage Network',
        icon: Home,
        color: 'from-amber-500/20 to-orange-500/10 text-amber-600',
        borderColor: 'hover:border-amber-400',
        description: 'Host verified travelers in your traditional Kath-Kuni wooden home, farm cottage, or spare rooms. Offer authentic Pahadi hospitality and earn steady monthly income.',
        perks: ['Retain 100% of your room tariff', 'Direct interaction with verified guests', 'Free professional listing assistance']
    },
    {
        title: 'Bike & Scooter Rental Owners',
        model: 'Two-Wheeler Mountain Mobility Network',
        icon: Bike,
        color: 'from-violet-500/20 to-purple-500/10 text-violet-600',
        borderColor: 'hover:border-violet-400',
        description: 'Rent out your Royal Enfield Himalayan 450, Classic 350, or automatic scooters to tourists in transit hubs like Rishikesh, Dehradun, Haridwar, and Manali.',
        perks: ['Daily and multi-day rental earnings', 'Verified rider identity checks', 'Luggage gear & helmet bundle support']
    },
    {
        title: 'White Water Rafting Marshals',
        model: 'Direct River Booking Desk',
        icon: Waves,
        color: 'from-cyan-500/20 to-blue-500/10 text-cyan-600',
        borderColor: 'hover:border-cyan-400',
        description: 'Secure direct group bookings for Ganga white-water rapids in Rishikesh (Brahmpuri, Shivpuri, Marine Drive, and Kaudiyala) without paying cuts to travel agents.',
        perks: ['Direct guest slot assignments', 'Full CE-gear safety compliance', 'Prompt payouts post-run confirmation']
    },
    {
        title: 'Certified Trek Leaders & Guides',
        model: 'Direct Expedition Guiding',
        icon: Mountain,
        color: 'from-emerald-500/20 to-green-500/10 text-emerald-700',
        borderColor: 'hover:border-emerald-500',
        description: 'Monetize your intimate knowledge of alpine trails. Lead trekking batches across Kedarkantha, Dayara Bugyal, Valley of Flowers, Har Ki Dun, and Chopta.',
        perks: ['Guaranteed per-day guiding rates', 'High-altitude first-aid & oxygen backing', 'Seasonal batch scheduling']
    },
    {
        title: 'Riverside & Alpine Camp Operators',
        model: 'Direct Adventure Stays',
        icon: Tent,
        color: 'from-rose-500/20 to-orange-500/10 text-rose-600',
        borderColor: 'hover:border-rose-400',
        description: 'Host outdoor campers in luxury Swiss cottage tents along the Ganga in Rishikesh, or all-weather alpine dome tents pitched on high bugyal meadows.',
        perks: ['Full stay & food package bookings', 'Advance booking deposit protection', 'Group offsite & family leads']
    }
];

const howItWorks = [
    {
        step: '01',
        title: 'Free Registration',
        desc: 'Submit your vehicle permit, property details, or guide credentials online. Zero listing fee or upfront deposits.'
    },
    {
        step: '02',
        title: 'Quick Verification',
        desc: 'Our local field operations desk in Rishikesh & Dehradun verifies your listing within 24 hours.'
    },
    {
        step: '03',
        title: 'Receive Bookings & Payouts',
        desc: 'Start receiving confirmed traveler bookings. Enjoy automated weekly payouts directly to your bank account.'
    }
];

export default function EarnWithTripdharaPage() {
    return (
        <div className="bg-gray-50 min-h-screen font-sans selection:bg-primary-500 selection:text-white">

            {/* Hero Section */}
            <header className="relative pt-36 pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-gray-950 text-white">
                <Image
                    src="/img/background.png"
                    alt="Earn with Tripdhara"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover opacity-25"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-6 shadow-xl backdrop-blur-md">
                        <TrendingUp className="w-3.5 h-3.5" /> Self-Employment & Income Platform for Himalayan Locals
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight font-display mb-6 leading-tight max-w-5xl mx-auto">
                        Monetize Your Vehicle, Homestay, or{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-primary-400 to-secondary-300">
                            Mountain Skills
                        </span>
                    </h1>

                    <p className="text-base sm:text-xl text-gray-200 max-w-3xl mx-auto font-medium leading-relaxed mb-10">
                        Tripdhara is the dedicated Himalayan travel network that empowers mountain drivers, homestay families, bike fleet owners, and adventure operators to connect directly with travelers and earn dignified, sustainable livelihoods.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link
                            href="/partner"
                            className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold shadow-xl transition-all flex items-center gap-2 transform hover:scale-105 text-sm"
                        >
                            <span>Register as an Earning Partner</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <a
                            href="https://wa.me/917017288052?text=Hello%20Tripdhara!%20I%20want%20to%20register%20and%20start%20earning%20with%20my%20vehicle/homestay."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-bold backdrop-blur-md transition-all flex items-center gap-2 text-sm"
                        >
                            <MessageCircle className="w-5 h-5 text-emerald-400" />
                            <span>WhatsApp Host Desk: +91 7017288052</span>
                        </a>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 -mt-8 relative z-20">

                {/* Platform Guarantees Banner */}
                <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-xl mb-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <Banknote className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-base">0% Upfront Listing Fee</h3>
                            <p className="text-xs text-gray-500 mt-1">Completely free to list your taxi, homestay, camp, or bike rental fleet.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-base">Direct Customer Bookings</h3>
                            <p className="text-xs text-gray-500 mt-1">No middlemen eating 30-40% commissions. Keep your hard-earned money.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-secondary-50 text-secondary-600 flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-base">Guaranteed Bank Payouts</h3>
                            <p className="text-xs text-gray-500 mt-1">Automated weekly payouts transferred directly to your bank account.</p>
                        </div>
                    </div>
                </div>

                {/* 6 Earning Streams */}
                <section className="mb-24">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-primary-600 font-extrabold text-xs uppercase tracking-widest block mb-2">
                            Self-Employment Opportunities
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight font-display mb-4">
                            6 Ways to Earn with Tripdhara
                        </h2>
                        <p className="text-gray-600 text-base sm:text-lg">
                            Whether you own a commercial cab, extra rooms, two-wheelers, or outdoor adventure licenses, there is a dedicated earning model for you.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {earningStreams.map((item, idx) => {
                            const IconComp = item.icon;
                            return (
                                <div
                                    key={idx}
                                    className={`bg-white rounded-3xl p-8 border border-gray-200/90 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between ${item.borderColor} group`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-6">
                                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                                                <IconComp className="w-7 h-7" />
                                            </div>
                                            <span className="text-[10px] font-extrabold text-primary-600 uppercase tracking-wider bg-primary-50 px-2.5 py-1 rounded-full">
                                                {item.model}
                                            </span>
                                        </div>

                                        <h3 className="text-2xl font-black text-gray-900 font-display mb-3 group-hover:text-primary-600 transition-colors">
                                            {item.title}
                                        </h3>

                                        <p className="text-sm text-gray-600 leading-relaxed mb-6 font-normal">
                                            {item.description}
                                        </p>

                                        <div className="space-y-2 mb-6 pt-4 border-t border-gray-100">
                                            {item.perks.map((p, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs font-medium text-gray-700">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                                    <span>{p}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <Link
                                        href="/partner"
                                        className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-primary-600 group-hover:text-primary-700"
                                    >
                                        <span>Start Earning in this Category</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* How It Works */}
                <section className="mb-24 bg-white rounded-3xl p-8 sm:p-14 border border-gray-200 shadow-sm">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <span className="text-primary-600 font-extrabold text-xs uppercase tracking-widest block mb-2">
                            Simple Process
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 font-display">
                            How to Start Earning in 3 Steps
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {howItWorks.map((st, i) => (
                            <div key={i} className="p-6 bg-gray-50 rounded-2xl relative">
                                <span className="text-3xl font-black text-gray-300 font-mono block mb-3">
                                    {st.step}
                                </span>
                                <h3 className="text-xl font-black text-gray-900 font-display mb-2">
                                    {st.title}
                                </h3>
                                <p className="text-xs text-gray-600 leading-relaxed font-normal">
                                    {st.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Direct Onboarding Action Section */}
                <section className="bg-gradient-to-br from-gray-950 via-gray-900 to-primary-950 text-white rounded-3xl p-8 sm:p-14 lg:p-16 border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        <div className="lg:col-span-8 space-y-6">
                            <span className="text-secondary-400 font-bold text-xs uppercase tracking-widest inline-flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5" /> Local Partner Onboarding Desk
                            </span>
                            <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight leading-tight">
                                Ready to Turn Your Property, Vehicle, or Craft into Regular Income?
                            </h2>
                            <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-normal">
                                Our onboarding team is stationed at our Rishikesh & Dehradun operational headquarters. We guide you through digital profile creation, price optimization, and direct guest communication.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-2">
                                <Link
                                    href="/partner"
                                    className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-sm shadow-xl transition-all flex items-center gap-2 transform hover:scale-105"
                                >
                                    <span>Fill 3-Minute Registration Form</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <a
                                    href="https://wa.me/917017288052?text=Hello%20Tripdhara!%20I%20want%20to%20register%20as%20a%20local%20earning%20partner."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-xl transition-all flex items-center gap-2"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    <span>WhatsApp: +91 7017288052</span>
                                </a>
                            </div>

                            <p className="text-xs text-gray-400 pt-2 flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-primary-400" /> Operational Headquarters: Rishikesh / Dehradun, Uttarakhand, India
                            </p>
                        </div>

                        <div className="lg:col-span-4 bg-white/10 border border-white/20 rounded-3xl p-8 backdrop-blur-xl text-center">
                            <h3 className="text-lg font-black font-display mb-2 text-white">Have Direct Questions?</h3>
                            <p className="text-xs text-gray-300 mb-6 leading-relaxed">
                                Talk directly with our vendor coordination desk for vehicle documentation, homestay photography, or river permits.
                            </p>
                            <a
                                href="tel:+917017288052"
                                className="w-full py-3.5 bg-white hover:bg-gray-100 text-gray-900 font-bold rounded-xl text-center block transition-all shadow-md text-sm mb-3"
                            >
                                Call Helpline: +91 7017288052
                            </a>
                            <a
                                href="mailto:contact@tripdhara.com"
                                className="text-xs font-semibold text-gray-300 hover:text-white block transition-colors"
                            >
                                contact@tripdhara.com
                            </a>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}
