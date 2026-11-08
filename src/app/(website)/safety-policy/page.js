import Link from 'next/link';
import connectDB from '@/core/Config/db.js';
import { getPolicyBy } from '@/core/Helpers/queryHelpers.js';
import { sanitizeHTML } from '@/core/Helpers/security.js';
import {
    ShieldCheck,
    Compass,
    HeartPulse,
    CloudLightning,
    FileCheck2,
    Calendar,
    Phone,
    Mail,
    MapPin,
    ChevronRight,
    AlertCircle,
    CheckCircle2,
    LifeBuoy
} from 'lucide-react';

export const metadata = {
    title: 'Adventure Sports & Trekking Safety Policy - High Altitude Guidelines | Tripdhara',
    description: 'Official Adventure Tourism & Trekking Safety Policy of Tripdhara adhering to Uttarakhand Adventure Tourism Regulations, IMF mountaineering guidelines, and AMS protocols.',
    keywords: [
        'Tripdhara Adventure Safety Policy',
        'Rishikesh Rafting Safety Guidelines',
        'Himalayan Trekking AMS Protocol',
        'High Altitude Medical Waiver Uttarakhand'
    ],
    openGraph: {
        title: 'Adventure Sports & Safety Policy | Tripdhara',
        description: 'Certified gear standards, medical fitness requirements, altitude sickness management, and weather suspension refunds.',
        url: 'https://tripdhara.com/safety-policy',
        siteName: 'Tripdhara',
        type: 'website',
    },
    alternates: {
        canonical: '/safety-policy',
    }
};

export default async function SafetyPolicyPage() {
    let policy = null;
    try {
        await connectDB();
        policy = await getPolicyBy({ target: 'admin', type: 'safety_policy' });
    } catch {
        // Fallback to static policy
    }

    const lastUpdated = policy?.updatedAt
        ? new Date(policy.updatedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
        : 'October 2026';

    const tocItems = [
        { id: 'safety-medical', title: '1. Medical Fitness Declarations', icon: HeartPulse },
        { id: 'safety-ams', title: '2. High Altitude & AMS Protocol', icon: Compass },
        { id: 'safety-certified', title: '3. Certified Guides & Equipment', icon: ShieldCheck },
        { id: 'safety-weather', title: '4. Weather Cancellations & Refunds', icon: CloudLightning },
        { id: 'safety-waiver', title: '5. Voluntary Assumption of Risk', icon: FileCheck2 }
    ];

    return (
        <div className="bg-gray-50/50 min-h-screen pb-24 font-sans selection:bg-primary-500 selection:text-white">
            {/* Page Header */}
            <header className="relative bg-gray-900 overflow-hidden pt-32 pb-20">
                <div className="absolute inset-0">
                    <img
                        src="/img/background.png"
                        alt="Himalayan Mountain Background"
                        className="w-full h-full object-cover opacity-20 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary-500/15 border border-primary-400/30 backdrop-blur-md mb-6 shadow-sm">
                        <Compass className="w-4 h-4 text-primary-400 mr-2" />
                        <span className="text-xs sm:text-sm font-semibold text-primary-200 tracking-wide uppercase">
                            Uttarakhand Tourism &amp; IMF Safety Standards
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-4 font-display">
                        Adventure &amp; Trekking Safety Policy
                    </h1>
                    <div className="flex flex-wrap items-center justify-center gap-3 text-sm md:text-base text-gray-400 font-medium">
                        <span className="inline-flex items-center text-gray-300">
                            <Calendar className="w-4 h-4 mr-1.5 text-primary-400" />
                            Effective Date: {lastUpdated}
                        </span>
                        <span className="text-gray-600 hidden sm:inline">•</span>
                        <span className="text-primary-300">
                            Zero Compromise on High-Altitude Life Safety
                        </span>
                    </div>
                </div>
            </header>

            {/* Main Content Layout */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Sidebar */}
                    <aside className="hidden lg:block lg:col-span-4">
                        <div className="sticky top-28 bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 shadow-xl shadow-gray-200/30">
                            <div className="flex items-center space-x-2 text-xs font-black text-primary-800 uppercase tracking-widest mb-5">
                                <span className="w-2.5 h-2.5 rounded-full bg-primary-600 animate-pulse"></span>
                                <span>Safety Protocols</span>
                            </div>
                            <nav className="space-y-1.5">
                                {tocItems.map((item) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <a
                                            key={item.id}
                                            href={`#${item.id}`}
                                            className="flex items-center justify-between p-3 rounded-xl text-gray-600 hover:text-primary-900 hover:bg-primary-50/70 transition-all group font-medium text-sm"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <IconComponent className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
                                                <span>{item.title}</span>
                                            </div>
                                            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary-600" />
                                        </a>
                                    );
                                })}
                            </nav>

                            {/* Medical Emergency Helpline */}
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <div className="bg-rose-50/70 rounded-2xl p-4 border border-rose-100">
                                    <div className="flex items-center space-x-2 text-rose-900 font-bold text-xs uppercase tracking-wider mb-2">
                                        <HeartPulse className="w-4 h-4 text-rose-600" />
                                        <span>24/7 Mountain Rescue Desk</span>
                                    </div>
                                    <p className="text-xs text-rose-800">Direct satellite SOS &amp; medical evacuation coordination across Uttarakhand.</p>
                                    <a href="tel:+917017288052" className="mt-2.5 flex items-center text-xs font-bold text-rose-700 hover:text-rose-900">
                                        <Phone className="w-3.5 h-3.5 mr-1.5" />
                                        +91 70172 88052
                                    </a>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Content */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Section 1 */}
                        <section id="safety-medical" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary-100/70 text-primary-700 flex items-center justify-center font-black">
                                    01
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                    Medical Fitness &amp; Health Declarations
                                </h2>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                                High-altitude trekking and extreme adventure sports involve rigorous physical endurance. All participants must honestly declare pre-existing medical conditions:
                            </p>
                            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-sm text-amber-950 space-y-2 mb-4">
                                <p><strong>Mandatory Exclusion Conditions:</strong> Participants with severe coronary artery disease, recent bypass surgery, uncontrolled hypertension, chronic asthma, severe vertigo, or advanced pregnancy are medically disqualified from high-altitude summits above 10,000 ft.</p>
                            </div>
                            <p className="text-sm text-gray-600">
                                Every participant is required to submit a signed Medical Fitness Form or self-declaration at basecamp reporting before departure.
                            </p>
                        </section>

                        {/* Section 2 */}
                        <section id="safety-ams" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary-100/70 text-primary-700 flex items-center justify-center font-black">
                                    02
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                    High Altitude &amp; AMS (Mountain Sickness) Protocol
                                </h2>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                                Acute Mountain Sickness (AMS), High Altitude Pulmonary Edema (HAPE), and High Altitude Cerebral Edema (HACE) are serious medical risks in the Himalayas above 8,500 ft:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                                    <h4 className="font-bold text-gray-900 text-sm mb-1 flex items-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4 text-primary-600" /> Pulse Oximeter Monitoring
                                    </h4>
                                    <p className="text-xs text-gray-600">
                                        Trek leaders conduct mandatory morning and evening SpO2 (blood oxygen) checks and pulse readings for every trekker at all high-altitude camps.
                                    </p>
                                </div>
                                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                                    <h4 className="font-bold text-gray-900 text-sm mb-1 flex items-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4 text-primary-600" /> Immediate Descent Rule
                                    </h4>
                                    <p className="text-xs text-gray-600">
                                        If SpO2 drops below 70% or persistent ataxia/headache develops, immediate descent to a lower altitude camp is non-negotiable under guide escort.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section id="safety-certified" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary-100/70 text-primary-700 flex items-center justify-center font-black">
                                    03
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                    Certified Equipment &amp; Qualified Guides
                                </h2>
                            </div>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex items-start gap-2.5">
                                    <ShieldCheck className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                    <span><strong>River Rafting:</strong> Certified Swift Water Rescue technicians, Class V Type-III Life Jackets, self-bailing rafts, and certified kayakers trailing every commercial run on the Ganga.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <ShieldCheck className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                    <span><strong>Bungee &amp; Paragliding:</strong> Jump marshals trained by Jump Masters from New Zealand; tandem paragliding pilots with 1,000+ logged air hours licensed by Uttarakhand Civil Aviation.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <ShieldCheck className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                    <span><strong>Mountaineering Treks:</strong> Trek leaders certified by Nehru Institute of Mountaineering (NIM) or Himalayan Mountaineering Institute (HMI), carrying high-altitude medical kits and emergency oxygen canisters.</span>
                                </li>
                            </ul>
                        </section>

                        {/* Section 4 */}
                        <section id="safety-weather" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary-100/70 text-primary-700 flex items-center justify-center font-black">
                                    04
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                    Weather Suspensions &amp; 100% Refund Guarantee
                                </h2>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                                If local district administrations, State Disaster Response Force (SDRF), or safety marshals suspend river rafting, bungee jumping, or paragliding due to rain, high river discharge, or cross-winds:
                            </p>
                            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-950 font-medium">
                                Participants receive an <strong>immediate slot rescheduling</strong> at no additional cost or an <strong>instant 100% refund of the activity fee</strong> processed without any administrative deductions.
                            </div>
                        </section>

                        {/* Section 5 */}
                        <section id="safety-waiver" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary-100/70 text-primary-700 flex items-center justify-center font-black">
                                    05
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                    Voluntary Assumption of Risk &amp; Waiver
                                </h2>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                Adventure travel in the Himalayas entails inherent natural risks including sudden weather shifts, rockfalls, rough terrain, and rapid water currents. By enrolling in an adventure activity, participants voluntarily assume these recognized natural risks and agree to follow safety instructions issued by certified guides at all times.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}

