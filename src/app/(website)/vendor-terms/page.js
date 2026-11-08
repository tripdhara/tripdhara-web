import Link from 'next/link';
import connectDB from '@/core/Config/db.js';
import { getPolicyBy } from '@/core/Helpers/queryHelpers.js';
import { sanitizeHTML } from '@/core/Helpers/security.js';
import {
    Briefcase,
    BadgePercent,
    ShieldCheck,
    CreditCard,
    Scale,
    FileText,
    Calendar,
    Phone,
    Mail,
    MapPin,
    ChevronRight,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';

export const metadata = {
    title: 'Vendor Partner Terms & Agreement - Marketplace SLAs | Tripdhara',
    description: 'Official Vendor Partner Agreement and Marketplace Terms for Himalayan homestay hosts, fleet operators, and certified adventure outfitters on Tripdhara.',
    keywords: [
        'Tripdhara Vendor Terms',
        'Himalayan Travel Marketplace Partner Agreement',
        'Homestay Host Terms Uttarakhand',
        'TDS Section 194-O Travel Operator Policy'
    ],
    openGraph: {
        title: 'Vendor Partner Terms & Agreement | Tripdhara',
        description: 'Commercial terms, commission structure, T+2 payout SLAs, quality standards, and tax compliance for verified vendors.',
        url: 'https://tripdhara.com/vendor-terms',
        siteName: 'Tripdhara',
        type: 'website',
    },
    alternates: {
        canonical: '/vendor-terms',
    }
};

export default async function VendorTermsPage() {
    let policy = null;
    try {
        await connectDB();
        policy = await getPolicyBy({ target: 'admin', type: 'vendor_terms' });
    } catch {
        // Fallback to static policy
    }

    const lastUpdated = policy?.updatedAt
        ? new Date(policy.updatedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
        : 'October 2026';

    const tocItems = [
        { id: 'vendor-onboarding', title: '1. Vendor KYC & Registration', icon: FileText },
        { id: 'vendor-commission', title: '2. Commission & T+2 Payout SLA', icon: CreditCard },
        { id: 'vendor-tax', title: '3. Tax Compliance & TDS 194-O', icon: BadgePercent },
        { id: 'vendor-quality', title: '4. Quality SLAs & Service Benchmarks', icon: ShieldCheck },
        { id: 'vendor-penalties', title: '5. Cancellation Penalties & De-listing', icon: AlertCircle }
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
                        <Briefcase className="w-4 h-4 text-primary-400 mr-2" />
                        <span className="text-xs sm:text-sm font-semibold text-primary-200 tracking-wide uppercase">
                            Marketplace Partner Agreement &amp; Governance
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-4 font-display">
                        Vendor Partner Terms
                    </h1>
                    <div className="flex flex-wrap items-center justify-center gap-3 text-sm md:text-base text-gray-400 font-medium">
                        <span className="inline-flex items-center text-gray-300">
                            <Calendar className="w-4 h-4 mr-1.5 text-primary-400" />
                            Effective Date: {lastUpdated}
                        </span>
                        <span className="text-gray-600 hidden sm:inline">•</span>
                        <span className="text-primary-300">
                            Fair Marketplace Payouts &amp; Statutory Compliance
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
                                <span>Vendor Agreement</span>
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

                            {/* Vendor Help Desk */}
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <div className="bg-primary-50/60 rounded-2xl p-4 border border-primary-100/80">
                                    <div className="flex items-center space-x-2 text-primary-900 font-bold text-xs uppercase tracking-wider mb-2">
                                        <Briefcase className="w-4 h-4 text-primary-600" />
                                        <span>Vendor Onboarding Desk</span>
                                    </div>
                                    <p className="text-xs text-gray-600">Questions about payout schedules or commission invoicing?</p>
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
                        <section id="vendor-onboarding" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary-100/70 text-primary-700 flex items-center justify-center font-black">
                                    01
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                    Vendor Verification &amp; KYC Compliance
                                </h2>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                                Tripdhara is committed to high traveler trust and safety. Every vendor partner (homestay host, transport fleet operator, adventure organizer) must complete strict verification:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 mb-4">
                                <li><strong>Homestays:</strong> Valid registration certificate with Uttarakhand Tourism Development Board (UTDB) or Himachal Pradesh Tourism Development Corporation (HPTDC), electricity bills, and owner PAN/Aadhaar.</li>
                                <li><strong>Transport Fleet:</strong> Commercial registration (yellow plate), All India Tourist Permit (AITP), commercial vehicle fitness, comprehensive insurance, and driver police verification.</li>
                                <li><strong>Adventure Guides:</strong> NIM/HMI mountaineering certifications or Swift Water Rescue permits with active commercial liability coverage.</li>
                            </ul>
                        </section>

                        {/* Section 2 */}
                        <section id="vendor-commission" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary-100/70 text-primary-700 flex items-center justify-center font-black">
                                    02
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                    Platform Commission &amp; T+2 Payout SLA
                                </h2>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                                Listing on Tripdhara is free. Tripdhara retains a transparent platform service fee on completed bookings:
                            </p>
                            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-950 space-y-2 mb-4">
                                <p><strong>Automated Payout Timeline:</strong> Vendor payouts are automatically disbursed within <strong>T+2 banking days</strong> following guest check-out or successful trip completion directly via NEFT/RTGS to the verified vendor bank account.</p>
                                <p><strong>Dispute Retention:</strong> In the event of an active guest dispute or property deficiency reported during the stay, settlement may be held for up to 7 days pending joint resolution.</p>
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section id="vendor-tax" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary-100/70 text-primary-700 flex items-center justify-center font-black">
                                    03
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                    Tax Compliance &amp; Section 194-O (TDS)
                                </h2>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                                Under Section 194-O of the Indian Income Tax Act 1961, e-commerce marketplace operators must deduct <strong>TDS at 1%</strong> on gross sales facilitated through the platform for Indian vendor residents holding a valid PAN (or 5% in the absence of PAN).
                            </p>
                            <p className="text-sm text-gray-600">
                                Quarterly TDS certificates (Form 16A) and monthly GST tax deduction summaries are available for download in the Vendor Partner Dashboard.
                            </p>
                        </section>

                        {/* Section 4 */}
                        <section id="vendor-quality" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary-100/70 text-primary-700 flex items-center justify-center font-black">
                                    04
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                    Quality Standards &amp; Guest Experience Benchmarks
                                </h2>
                            </div>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>• Clean, sanitized rooms with fresh linen, clean bathrooms, and running hot water.</li>
                                <li>• No on-spot price inflation or demanding extra cash from confirmed guests.</li>
                                <li>• Courteous communication and strict adherence to guest safety and privacy standards.</li>
                            </ul>
                        </section>

                        {/* Section 5 */}
                        <section id="vendor-penalties" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary-100/70 text-primary-700 flex items-center justify-center font-black">
                                    05
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                    Vendor Cancellation Penalties &amp; De-Listing
                                </h2>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                                Unilateral last-minute cancellations by vendors severely compromise traveler safety on remote mountain circuits. Any vendor who cancels a confirmed booking without verified force majeure closure will be subject to:
                            </p>
                            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs sm:text-sm text-rose-950 space-y-1.5">
                                <p>• A cancellation penalty equivalent to <strong>20% of the booking value</strong> deducted from subsequent payouts.</p>
                                <p>• Obligation to compensate any incremental cost required to arrange equivalent alternative lodging or transportation for the stranded guest.</p>
                                <p>• Multiple infractions result in permanent blacklisting from Tripdhara.</p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}

