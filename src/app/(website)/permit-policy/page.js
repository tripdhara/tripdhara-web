import Link from 'next/link';
import connectDB from '@/core/Config/db.js';
import { getPolicyBy } from '@/core/Helpers/queryHelpers.js';
import { sanitizeHTML } from '@/core/Helpers/security.js';
import {
    FileCheck2,
    ShieldCheck,
    Globe2,
    Calendar,
    Phone,
    Mail,
    MapPin,
    ChevronRight,
    AlertCircle,
    CheckCircle2,
    Scale
} from 'lucide-react';

export const metadata = {
    title: 'Inner Line Permit (ILP) & Border Sector Policy - Indo-Tibet Sectors | Tripdhara',
    description: 'Official Inner Line Permit (ILP) & Border Sector Policy of Tripdhara covering SDM permit processing for Niti Valley, Nelang Valley, Spiti, and FRRO Form-C compliance.',
    keywords: [
        'Tripdhara Inner Line Permit Policy',
        'Niti Valley ILP Guidelines',
        'Nelang Valley Border Permit',
        'FRRO Form-C Homestay Registration Uttarakhand'
    ],
    openGraph: {
        title: 'Inner Line Permit (ILP) & Border Policy | Tripdhara',
        description: 'Permit application timelines, restricted border zone protocols, and foreigner immigration compliance in the Himalayas.',
        url: 'https://tripdhara.com/permit-policy',
        siteName: 'Tripdhara',
        type: 'website',
    },
    alternates: {
        canonical: '/permit-policy',
    }
};

export default async function PermitPolicyPage() {
    let policy = null;
    try {
        await connectDB();
        policy = await getPolicyBy({ target: 'admin', type: 'permit_policy' });
    } catch {
        // Fallback to static policy
    }

    const lastUpdated = policy?.updatedAt
        ? new Date(policy.updatedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
        : 'October 2026';

    const tocItems = [
        { id: 'permit-sectors', title: '1. Restricted & Open Sectors', icon: MapPin },
        { id: 'permit-timelines', title: '2. 72-Hour Application SLA', icon: Calendar },
        { id: 'permit-formc', title: '3. Form-C FRRO for Foreigners', icon: Globe2 },
        { id: 'permit-checkpoints', title: '4. ITBP & Army Checkpoint Rules', icon: ShieldCheck },
        { id: 'permit-force-majeure', title: '5. Security Denials & Refunds', icon: AlertCircle }
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
                        <FileCheck2 className="w-4 h-4 text-primary-400 mr-2" />
                        <span className="text-xs sm:text-sm font-semibold text-primary-200 tracking-wide uppercase">
                            Ministry of Home Affairs &amp; District Magistrate Compliant
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-4 font-display">
                        Inner Line Permit (ILP) Policy
                    </h1>
                    <div className="flex flex-wrap items-center justify-center gap-3 text-sm md:text-base text-gray-400 font-medium">
                        <span className="inline-flex items-center text-gray-300">
                            <Calendar className="w-4 h-4 mr-1.5 text-primary-400" />
                            Effective Date: {lastUpdated}
                        </span>
                        <span className="text-gray-600 hidden sm:inline">•</span>
                        <span className="text-primary-300">
                            Seamless Coordination for High-Altitude Frontier Expeditions
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
                                <span>Permit Guidelines</span>
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

                            {/* Permit Assistance Box */}
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <div className="bg-primary-50/60 rounded-2xl p-4 border border-primary-100/80">
                                    <div className="flex items-center space-x-2 text-primary-900 font-bold text-xs uppercase tracking-wider mb-2">
                                        <FileCheck2 className="w-4 h-4 text-primary-600" />
                                        <span>Permits &amp; Border Desk</span>
                                    </div>
                                    <p className="text-xs text-gray-600">Questions about Niti Valley, Nelang, or Spiti permits?</p>
                                    <a href="tel:+917017288052" className="mt-2.5 flex items-center text-xs font-bold text-primary-700 hover:text-primary-800">
                                        <Phone className="w-3.5 h-3.5 mr-1.5" />
                                        +91 70172 88052
                                    </a>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Policy Content */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Section 1 */}
                        <section id="permit-sectors" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary-100/70 text-primary-700 flex items-center justify-center font-black">
                                    01
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                    Restricted Border Sectors vs. Open Circuits
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                                    <h4 className="font-bold text-amber-900 text-sm mb-1.5">Permit Mandatory Sectors (ILP)</h4>
                                    <p className="text-xs text-gray-700 leading-relaxed">
                                        • <strong>Uttarakhand:</strong> Niti Valley (beyond Gamshali), Nelang Valley (Uttarkashi), Milam Glacier interior, Mana Pass beyond Badrinath.<br/>
                                        • <strong>Himachal Pradesh:</strong> Spiti Valley interior routes between Kaza and Rekong Peo (specifically for foreign nationals).
                                    </p>
                                </div>
                                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                                    <h4 className="font-bold text-emerald-900 text-sm mb-1.5">100% Open Sectors (No Permit)</h4>
                                    <p className="text-xs text-gray-700 leading-relaxed">
                                        Rishikesh, Dehradun, Mussoorie, Nainital, Chopta-Tungnath, Auli, Kausani, Shimla, Manali, Kasol, and standard Char Dham Yatra circuits require only normal vehicle registration and photo ID.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section 2 */}
                        <section id="permit-timelines" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary-100/70 text-primary-700 flex items-center justify-center font-black">
                                    02
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                    72-Hour Advance Application Protocol
                                </h2>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                                To facilitate timely processing with the respective Sub-Divisional Magistrate (SDM) and District Magistrate (DM) administrative desks, travelers visiting restricted sectors must submit documents through their Tripdhara booking portal at least <strong>72 hours prior to arrival</strong>:
                            </p>
                            <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-600">
                                <li>High-resolution scan of original Aadhaar Card / Passport (both front and back).</li>
                                <li>Two recent passport-sized color photographs.</li>
                                <li>Emergency contact telephone numbers and medical clearance self-declaration.</li>
                            </ul>
                        </section>

                        {/* Section 3 */}
                        <section id="permit-formc" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary-100/70 text-primary-700 flex items-center justify-center font-black">
                                    03
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                    FRRO Form-C Compliance for International Tourists
                                </h2>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                                In strict accordance with the <strong>Registration of Foreigners Rules 1992</strong>, all foreign nationals staying at Tripdhara partner properties must be registered on the Indian Bureau of Immigration Form-C online portal within 24 hours of arrival.
                            </p>
                            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs sm:text-sm text-gray-700">
                                Foreign guests must present original Passport and valid Indian Visa / e-Visa upon check-in. Our ground hosts complete online Form-C submission and provide a digital verification slip to the guest.
                            </div>
                        </section>

                        {/* Section 4 */}
                        <section id="permit-checkpoints" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary-100/70 text-primary-700 flex items-center justify-center font-black">
                                    04
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                    Indo-Tibetan Border Police (ITBP) Checkpoint Rules
                                </h2>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                                At border check-posts (such as Malari, Harsil, or Sumdo):
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>• Original hard copies of the Inner Line Permit and matching government photo IDs must be carried at all times.</li>
                                <li>• Photography or drone videography in the vicinity of army defense installations and ITBP check-posts is strictly prohibited by law.</li>
                            </ul>
                        </section>

                        {/* Section 5 */}
                        <section id="permit-force-majeure" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary-100/70 text-primary-700 flex items-center justify-center font-black">
                                    05
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                    Security Denials &amp; Force Majeure Travel Credits
                                </h2>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                                If border permits are denied or rescinded by district magistrates, army authorities, or disaster management bureaus due to national security exercises, weather emergencies, or flash floods:
                            </p>
                            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-950 font-medium">
                                Tripdhara reroutes travelers to an equivalent open mountain destination at no charge, or issues a <strong>100% 12-Month Travel Credit Voucher</strong> with <strong>zero cancellation penalty</strong>.
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}

