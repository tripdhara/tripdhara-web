import Link from 'next/link';
import connectDB from '@/core/Config/db.js';
import { getPolicyBy } from '@/core/Helpers/queryHelpers.js';
import { sanitizeHTML } from '@/core/Helpers/security.js';
import {
    ShieldCheck,
    CloudRain,
    RotateCcw,
    Compass,
    Car,
    CreditCard,
    Headphones,
    ChevronRight,
    AlertCircle,
    CheckCircle2,
    Calendar,
    Phone,
    Mail,
    MapPin
} from 'lucide-react';

export const metadata = {
    title: 'Cancellation & Weather Policy - Indian Govt Compliant | Tripdhara',
    description: 'Official Cancellation Policy of Tripdhara in strict compliance with Consumer Protection Act 2019, E-Commerce Rules 2020, and Section 56 Indian Contract Act 1872.',
    keywords: [
        'Tripdhara Cancellation Policy',
        'Himalayan Weather Refund Policy',
        'Char Dham Road Closure Refund',
        'Uttarakhand Travel Cancellation Slabs'
    ],
    openGraph: {
        title: 'Cancellation & Weather Policy | Tripdhara',
        description: 'Statutory cancellation terms, weather disruption refunds, and mountain travel guarantees.',
        url: 'https://tripdhara.com/cancellation',
        siteName: 'Tripdhara',
        type: 'website',
    },
    alternates: {
        canonical: '/cancellation',
    }
};

export default async function CancellationPolicyPage() {
    let policy = null;
    try {
        await connectDB();
        policy = await getPolicyBy({ target: 'admin', type: 'cancellation_policy' });
    } catch {
        // Fallback to static statutory policy if database record is unavailable
    }

    const lastUpdated = policy?.updatedAt
        ? new Date(policy.updatedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
        : 'September 2026';

    const tocItems = [
        { id: 'cancel-force-majeure', title: '1. Weather & Force Majeure', icon: CloudRain },
        { id: 'cancel-slabs', title: '2. Consumer Refund Slabs', icon: RotateCcw },
        { id: 'cancel-adventure', title: '3. Outdoor Activity Suspensions', icon: Compass },
        { id: 'cancel-breakdown', title: '4. Vehicle Breakdown Guarantee', icon: Car },
        { id: 'cancel-rbi', title: '5. RBI Refund Payment SLA', icon: CreditCard },
        { id: 'cancel-grievance', title: '6. Support & Grievance Desk', icon: Headphones },
    ];

    return (
        <div className="bg-[#fcfcfc] min-h-screen pb-24 font-sans text-gray-800 selection:bg-primary-500 selection:text-white">
            {/* Structured Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'WebPage',
                        name: 'Cancellation & Weather Policy',
                        description: 'Official statutory cancellation policy and weather guarantees for Himalayan travel services.',
                        publisher: {
                            '@type': 'Organization',
                            name: 'Tripdhara Travel & Rentals India',
                            url: 'https://tripdhara.com'
                        }
                    })
                }}
            />

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
                        <ShieldCheck className="w-4 h-4 text-primary-400 mr-2" />
                        <span className="text-xs sm:text-sm font-semibold text-primary-200 tracking-wide uppercase">
                            Consumer Protection Act 2019 Statutory Compliance
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-4 font-display">
                        Cancellation &amp; Weather Policy
                    </h1>
                    <div className="flex flex-wrap items-center justify-center gap-3 text-sm md:text-base text-gray-400 font-medium">
                        <span className="inline-flex items-center text-gray-300">
                            <Calendar className="w-4 h-4 mr-1.5 text-primary-400" />
                            Effective Date: {lastUpdated}
                        </span>
                        <span className="text-gray-600 hidden sm:inline">•</span>
                        <span className="text-primary-300">
                            Compliant with E-Commerce Rules 2020 &amp; Contract Act 1872
                        </span>
                    </div>
                </div>
            </header>

            {/* Main Content Layout */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Sticky Sidebar Navigation */}
                    <aside className="hidden lg:block lg:col-span-4">
                        <div className="sticky top-28 bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 shadow-xl shadow-gray-200/30">
                            <div className="flex items-center space-x-2 text-xs font-black text-primary-800 uppercase tracking-widest mb-5">
                                <span className="w-2.5 h-2.5 rounded-full bg-primary-600 animate-pulse"></span>
                                <span>Statutory Sections</span>
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
                                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-primary-600" />
                                        </a>
                                    );
                                })}
                            </nav>

                            {/* Need Immediate Assistance Card */}
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <div className="bg-primary-50/80 rounded-2xl p-4 border border-primary-100">
                                    <div className="text-xs font-bold text-primary-900 mb-1">Emergency Weather Queries?</div>
                                    <p className="text-xs text-gray-600 mb-3">Our Himalayan transit desk operates 24/7 during monsoon and winter seasons.</p>
                                    <a
                                        href="tel:+917017288052"
                                        className="inline-flex items-center justify-center w-full py-2 px-3 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-colors"
                                    >
                                        <Phone className="w-3.5 h-3.5 mr-1.5" />
                                        +91 70172 88052
                                    </a>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="lg:col-span-8">
                        <div className="bg-white border border-gray-200/80 rounded-[2.5rem] p-6 sm:p-10 md:p-14 shadow-2xl shadow-gray-200/30">

                            {policy?.content ? (
                                <div
                                    className="prose prose-lg prose-gray max-w-none prose-headings:font-display prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary-600"
                                    dangerouslySetInnerHTML={{ __html: sanitizeHTML(policy.content) }}
                                />
                            ) : (
                                <div className="space-y-12">

                                    {/* Section 1 */}
                                    <section id="cancel-force-majeure" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <CloudRain className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                1. Himalayan Weather &amp; Force Majeure (Section 56, Contract Act 1872)
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            Under Section 56 of the <strong>Indian Contract Act, 1872</strong>, contracts become void when performance becomes impossible due to unforeseen natural disasters or statutory government bans.
                                        </p>
                                        <p className="text-gray-600 leading-relaxed mb-6">
                                            Traveling across Himalayan passes (Uttarakhand Char Dham routes, Chopta, Auli, Spiti Valley, Leh-Ladakh) involves exposure to sudden weather disruptions. Tripdhara provides full statutory protection:
                                        </p>
                                        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 sm:p-6 text-emerald-950">
                                            <div className="flex items-start space-x-3">
                                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                                <div>
                                                    <h3 className="font-bold text-base text-emerald-900 mb-2">
                                                        Government Advisory &amp; Landslide Protection
                                                    </h3>
                                                    <p className="text-sm text-emerald-900/90 leading-relaxed mb-3">
                                                        If official advisories issued by IMD (Red/Orange Alert), District Magistrates, Border Roads Organisation (BRO), or Public Works Department (PWD) mandate road closures due to landslides, cloudbursts, or heavy snowfall:
                                                    </p>
                                                    <ul className="space-y-2 text-sm text-emerald-900">
                                                        <li className="flex items-start space-x-2">
                                                            <span className="font-bold text-emerald-700">•</span>
                                                            <span>You receive a <strong>100% Full Refund Option</strong> (minus nominal bank transaction gateway charges).</span>
                                                        </li>
                                                        <li className="flex items-start space-x-2">
                                                            <span className="font-bold text-emerald-700">•</span>
                                                            <span>OR a <strong>100% Travel Credit Voucher</strong> valid for 12 months with zero rescheduling penalties.</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 2 */}
                                    <section id="cancel-slabs" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <RotateCcw className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                2. Consumer-Initiated Cancellation Refund Slabs (E-Commerce Rules 2020)
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-6">
                                            In accordance with Rule 6(3)(b) of the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>, cancellation fees are clearly disclosed without arbitrary or unfair penalties. If you cancel a booking voluntarily for personal reasons, the following refund slabs apply:
                                        </p>

                                        {/* Slabs Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="bg-gray-50/80 hover:bg-white rounded-2xl p-5 border border-gray-200/80 transition-all hover:shadow-md">
                                                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-primary-100 text-primary-800 mb-3">
                                                    15+ Days Prior
                                                </div>
                                                <div className="text-2xl font-black text-gray-900 mb-1">
                                                    95% Cash Refund
                                                </div>
                                                <p className="text-xs text-gray-600">
                                                    Full cash refund minus nominal 5% payment gateway fee.
                                                </p>
                                            </div>

                                            <div className="bg-gray-50/80 hover:bg-white rounded-2xl p-5 border border-gray-200/80 transition-all hover:shadow-md">
                                                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-primary-100 text-primary-800 mb-3">
                                                    7 to 14 Days
                                                </div>
                                                <div className="text-2xl font-black text-gray-900 mb-1">
                                                    75% Cash / 100% Voucher
                                                </div>
                                                <p className="text-xs text-gray-600">
                                                    75% cash refund OR 100% 12-month travel credit voucher.
                                                </p>
                                            </div>

                                            <div className="bg-gray-50/80 hover:bg-white rounded-2xl p-5 border border-gray-200/80 transition-all hover:shadow-md">
                                                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-primary-100 text-primary-800 mb-3">
                                                    3 to 6 Days
                                                </div>
                                                <div className="text-2xl font-black text-gray-900 mb-1">
                                                    50% Cash / 100% Voucher
                                                </div>
                                                <p className="text-xs text-gray-600">
                                                    50% cash refund OR 100% 12-month travel credit voucher.
                                                </p>
                                            </div>

                                            <div className="bg-gray-50/80 hover:bg-white rounded-2xl p-5 border border-gray-200/80 transition-all hover:shadow-md">
                                                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 mb-3">
                                                    Under 72 Hours
                                                </div>
                                                <div className="text-2xl font-black text-gray-900 mb-1">
                                                    50% Travel Voucher
                                                </div>
                                                <p className="text-xs text-gray-600">
                                                    0% cash due to hotel pre-commitments; 50% credit voucher provided.
                                                </p>
                                            </div>
                                        </div>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 3 */}
                                    <section id="cancel-adventure" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <Compass className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                3. Outdoor Adventure Activity Suspensions
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            Outdoor adventure activities (White-Water Rafting in Rishikesh, Tandem Paragliding in Bir Billing, Bungee Jumping) operate under strict safety guidelines:
                                        </p>
                                        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200/80">
                                            <div className="flex items-start space-x-3">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <p className="text-sm text-gray-700 leading-relaxed">
                                                    <strong>Safety Suspensions:</strong> If activity operators or river safety marshals suspend rafting due to high water discharge or prohibit paragliding flights due to gusty winds, you receive a <strong>100% Full Refund</strong> for that specific activity component.
                                                </p>
                                            </div>
                                        </div>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 4 */}
                                    <section id="cancel-breakdown" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <Car className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                4. Vehicle Replacement &amp; Transit Guarantee (MVA 1988)
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            Commercial tourist vehicles operated by Tripdhara undergo rigorous mechanical fitness inspections:
                                        </p>
                                        <ul className="space-y-3 text-sm text-gray-700">
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Breakdown Guarantee:</strong> In the rare event of a mechanical breakdown during mountain transit, a replacement commercial vehicle of equal or higher category is dispatched within <strong>4 hours</strong>.</span>
                                            </li>
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Compensation:</strong> If replacement transit cannot be dispatched due to extreme remote locations, a pro-rata refund for the unfulfilled transit segment is processed immediately.</span>
                                            </li>
                                        </ul>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 5 */}
                                    <section id="cancel-rbi" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <CreditCard className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                5. RBI Refund Directives &amp; Source Payment SLA
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            In compliance with <strong>Reserve Bank of India (RBI) Digital Payment Regulations</strong>:
                                        </p>
                                        <div className="space-y-3">
                                            <div className="bg-primary-50/50 rounded-2xl p-5 border border-primary-100">
                                                <h4 className="font-bold text-gray-900 mb-1 text-sm">Original Payment Source Mandate</h4>
                                                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                                                    All cash refunds are credited directly back to the original bank account, UPI ID, or Debit/Credit Card used during booking. No forced store credits or non-withdrawable wallet points.
                                                </p>
                                            </div>
                                            <div className="bg-primary-50/50 rounded-2xl p-5 border border-primary-100">
                                                <h4 className="font-bold text-gray-900 mb-1 text-sm">Turnaround Time (SLA)</h4>
                                                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                                                    Refund requests are processed by Tripdhara within <strong>24 hours</strong> of cancellation approval. Credits reflect in the user&apos;s bank account within <strong>3 to 7 business days</strong> depending on banking channels.
                                                </p>
                                            </div>
                                        </div>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 6 */}
                                    <section id="cancel-grievance" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <Headphones className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                6. Refund Tracking &amp; Escalation Support
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-6">
                                            To request a cancellation or check refund processing status, contact our dedicated coordination cell:
                                        </p>

                                        <div className="bg-gray-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl shadow-gray-900/20">
                                            <div className="absolute top-0 right-0 w-48 h-48 bg-primary-600/10 rounded-bl-[4rem]"></div>
                                            <div className="relative z-10 grid sm:grid-cols-2 gap-6">
                                                <div>
                                                    <div className="text-xs font-bold text-primary-400 uppercase tracking-wider mb-2">Emergency Desk</div>
                                                    <h3 className="text-xl font-bold text-white mb-2">Tripdhara Travel Desk</h3>
                                                    <div className="space-y-2 text-sm text-gray-300">
                                                        <div className="flex items-center space-x-2">
                                                            <MapPin className="w-4 h-4 text-primary-400 shrink-0" />
                                                            <span>Dehradun, Uttarakhand - 248001, India</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Mail className="w-4 h-4 text-primary-400 shrink-0" />
                                                            <span>support@tripdhara.com</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col justify-center sm:items-end">
                                                    <div className="text-xs text-gray-400 mb-1">Direct Helpline &amp; WhatsApp:</div>
                                                    <a
                                                        href="tel:+917017288052"
                                                        className="text-xl sm:text-2xl font-black text-primary-400 hover:text-primary-300 transition-colors"
                                                    >
                                                        +91 70172 88052
                                                    </a>
                                                    <span className="text-xs text-gray-400 mt-2">24/7 Assistance for Active Travelers</span>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

