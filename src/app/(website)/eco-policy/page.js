import Link from 'next/link';
import connectDB from '@/core/Config/db.js';
import { getPolicyBy } from '@/core/Helpers/queryHelpers.js';
import { sanitizeHTML } from '@/core/Helpers/security.js';
import {
    Leaf,
    TreePine,
    Trash2,
    Flame,
    VolumeX,
    Calendar,
    Phone,
    Mail,
    MapPin,
    ChevronRight,
    AlertCircle,
    CheckCircle2,
    ShieldCheck
} from 'lucide-react';

export const metadata = {
    title: 'Responsible Tourism & Himalayan Eco-Policy - Leave No Trace | Tripdhara',
    description: 'Official Eco-Tourism Policy of Tripdhara adhering to National Green Tribunal (NGT) directives, Forest Department conservation, and the 7 Principles of Leave No Trace.',
    keywords: [
        'Tripdhara Eco Tourism Policy',
        'Himalayan Leave No Trace Guidelines',
        'Plastic Free Trekking Uttarakhand',
        'NGT Eco Sensitive Zone Rules'
    ],
    openGraph: {
        title: 'Himalayan Eco-Tourism & Conservation Policy | Tripdhara',
        description: 'Sustainable mountain travel practices, zero single-use plastic mandate, alpine meadow preservation, and campfire restrictions.',
        url: 'https://tripdhara.com/eco-policy',
        siteName: 'Tripdhara',
        type: 'website',
    },
    alternates: {
        canonical: '/eco-policy',
    }
};

export default async function EcoPolicyPage() {
    let policy = null;
    try {
        await connectDB();
        policy = await getPolicyBy({ target: 'admin', type: 'eco_policy' });
    } catch {
        // Fallback to static policy
    }

    const lastUpdated = policy?.updatedAt
        ? new Date(policy.updatedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
        : 'October 2026';

    const tocItems = [
        { id: 'eco-vision', title: '1. Himalayan Conservation Vision', icon: TreePine },
        { id: 'eco-plastic', title: '2. Zero Single-Use Plastic Mandate', icon: Trash2 },
        { id: 'eco-meadows', title: '3. Bugyals & Alpine Meadow Rules', icon: Leaf },
        { id: 'eco-fire', title: '4. Campfire & Forest Fire Curfew', icon: Flame },
        { id: 'eco-noise', title: '5. Noise Curfew & Wildlife Corridors', icon: VolumeX }
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
                    <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 backdrop-blur-md mb-6 shadow-sm">
                        <Leaf className="w-4 h-4 text-emerald-400 mr-2" />
                        <span className="text-xs sm:text-sm font-semibold text-emerald-200 tracking-wide uppercase">
                            National Green Tribunal (NGT) &amp; Forest Conservation Directives
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-4 font-display">
                        Responsible Tourism &amp; Eco-Policy
                    </h1>
                    <div className="flex flex-wrap items-center justify-center gap-3 text-sm md:text-base text-gray-400 font-medium">
                        <span className="inline-flex items-center text-gray-300">
                            <Calendar className="w-4 h-4 mr-1.5 text-emerald-400" />
                            Effective Date: {lastUpdated}
                        </span>
                        <span className="text-gray-600 hidden sm:inline">•</span>
                        <span className="text-emerald-300">
                            Preserving the Fragile Himalayan Ecosystem for Future Generations
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
                            <div className="flex items-center space-x-2 text-xs font-black text-emerald-800 uppercase tracking-widest mb-5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                                <span>Eco Directives</span>
                            </div>
                            <nav className="space-y-1.5">
                                {tocItems.map((item) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <a
                                            key={item.id}
                                            href={`#${item.id}`}
                                            className="flex items-center justify-between p-3 rounded-xl text-gray-600 hover:text-emerald-900 hover:bg-emerald-50/70 transition-all group font-medium text-sm"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <IconComponent className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                                                <span>{item.title}</span>
                                            </div>
                                            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600" />
                                        </a>
                                    );
                                })}
                            </nav>

                            {/* Eco Officer Desk */}
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-100/80">
                                    <div className="flex items-center space-x-2 text-emerald-900 font-bold text-xs uppercase tracking-wider mb-2">
                                        <TreePine className="w-4 h-4 text-emerald-600" />
                                        <span>Green Himalayas Desk</span>
                                    </div>
                                    <p className="text-xs text-gray-600">Report trail pollution or unsustainable vendor practices.</p>
                                    <a href="mailto:eco@tripdhara.com" className="mt-2.5 flex items-center text-xs font-bold text-emerald-700 hover:text-emerald-800">
                                        <Mail className="w-3.5 h-3.5 mr-1.5" />
                                        eco@tripdhara.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Policy Content */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Section 1 */}
                        <section id="eco-vision" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center font-black">
                                    01
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                    Himalayan Conservation Vision
                                </h2>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                                The Himalayas are biologically diverse, culturally sacred, and ecologically fragile. In accordance with the <strong>Environment (Protection) Act 1986</strong> and National Green Tribunal (NGT) mandates, Tripdhara requires every traveler, homestay host, fleet driver, and trek guide to uphold the global <strong>&ldquo;Leave No Trace&rdquo; (LNT)</strong> standard.
                            </p>
                        </section>

                        {/* Section 2 */}
                        <section id="eco-plastic" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center font-black">
                                    02
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                    Zero Single-Use Plastic Mandate
                                </h2>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                                Under Uttarakhand Plastic Waste Management Rules, disposable plastic water bottles and single-use wrappers are strictly banned on high-altitude trails:
                            </p>
                            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-950 space-y-2 mb-4">
                                <p><strong>Mandatory Reusable Gear:</strong> All trekkers must carry insulated hydration flasks or reusable water bladders. Natural spring water filtered through gravity filters is provided at every Tripdhara basecamp free of charge.</p>
                                <p><strong>Pack It In, Pack It Out:</strong> Any non-biodegradable trash (snack wrappers, batteries, wet wipes) must be brought back to basecamp for segregated recycling.</p>
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section id="eco-meadows" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center font-black">
                                    03
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                    Bugyals (High Alpine Meadows) Preservation
                                </h2>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                                Under the landmark High Court of Uttarakhand ruling protecting alpine meadows (such as Dayara, Bedni, and Ali Bugyal):
                            </p>
                            <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-600">
                                <li>Commercial overnight pitching of tents on pristine bugyals is strictly restricted to designated forest transit camps.</li>
                                <li>Campers must use dry-toilet compost pit systems to prevent contamination of mountain streams and glacier aquifers.</li>
                            </ul>
                        </section>

                        {/* Section 4 */}
                        <section id="eco-fire" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center font-black">
                                    04
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                    Campfire Restrictions &amp; Forest Fire Prevention
                                </h2>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                                Open ground wood fires are strictly prohibited in pine and deodar forest belts during the summer fire season (April–June) under the Indian Forest Act 1927.
                            </p>
                            <p className="text-sm text-gray-600">
                                Designated communal campfires at homestays or permanent campsites may only use managed fallen branches with forest guard approval.
                            </p>
                        </section>

                        {/* Section 5 */}
                        <section id="eco-noise" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center font-black">
                                    05
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                    Noise Curfew &amp; Wildlife Sanctuary Corridors
                                </h2>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                                In sensitive zones such as Kedarnath Wildlife Sanctuary, Askot, and Rajaji buffer zones:
                            </p>
                            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs sm:text-sm text-gray-700 space-y-1.5">
                                <p>• High-decibel Bluetooth speakers and music systems are prohibited on trails to prevent distressing native wildlife (snow leopards, musk deer, Himalayan monal).</p>
                                <p>• A strict silence curfew applies after <strong>10:00 PM</strong> at all mountain homestays and outdoor campsites.</p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}

