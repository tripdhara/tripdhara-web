import Link from 'next/link';
import connectDB from '@/core/Config/db.js';
import { getPolicyBy } from '@/core/Helpers/queryHelpers.js';
import { sanitizeHTML } from '@/core/Helpers/security.js';
import {
    ShieldCheck,
    CreditCard,
    FileText,
    Clock,
    Scale,
    UserCheck,
    ChevronRight,
    CheckCircle2,
    Calendar,
    Phone,
    Mail,
    MapPin,
    AlertCircle
} from 'lucide-react';

export const metadata = {
    title: 'Refund Policy - RBI Directives & Statutory SLA | Tripdhara',
    description: 'Official Refund Policy of Tripdhara adhering strictly to RBI Master Directions on Payment Gateways, CGST Section 34 Credit Notes, and Consumer Protection Act 2019.',
    keywords: [
        'Tripdhara Refund Policy',
        'RBI Payment Gateway Refund Rules',
        'GST Credit Note Travel Cancellation',
        'Uttarakhand Travel Refund SLA'
    ],
    openGraph: {
        title: 'Refund Policy & Settlement SLA | Tripdhara',
        description: 'RBI-compliant source refunds, banking SLAs, and consumer protection rights for Himalayan travelers.',
        url: 'https://tripdhara.com/refund',
        siteName: 'Tripdhara',
        type: 'website',
    },
    alternates: {
        canonical: '/refund',
    }
};

export default async function RefundPolicyPage() {
    let policy = null;
    try {
        await connectDB();
        policy = await getPolicyBy({ target: 'admin', type: 'refund_policy' });
    } catch {
        // Fallback to static statutory policy if database record is unavailable
    }

    const lastUpdated = policy?.updatedAt
        ? new Date(policy.updatedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
        : 'September 2026';

    const tocItems = [
        { id: 'refund-rights', title: '1. Consumer Protection Rights', icon: ShieldCheck },
        { id: 'refund-rbi', title: '2. RBI Source Payment Rules', icon: CreditCard },
        { id: 'refund-gst', title: '3. GST & Tax Credit Notes', icon: FileText },
        { id: 'refund-sla', title: '4. Banking SLA & Timelines', icon: Clock },
        { id: 'refund-disputes', title: '5. Chargeback & Disputes', icon: Scale },
        { id: 'refund-nodal', title: '6. Statutory Nodal Officer', icon: UserCheck },
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
                        name: 'Refund Policy & Settlement SLA',
                        description: 'Statutory refund regulations, banking SLAs, and financial transparency under Indian law.',
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
                        <CreditCard className="w-4 h-4 text-primary-400 mr-2" />
                        <span className="text-xs sm:text-sm font-semibold text-primary-200 tracking-wide uppercase">
                            RBI Payment Directives &amp; CGST Act Statutory Compliance
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-4 font-display">
                        Refund Policy &amp; Settlement SLA
                    </h1>
                    <div className="flex flex-wrap items-center justify-center gap-3 text-sm md:text-base text-gray-400 font-medium">
                        <span className="inline-flex items-center text-gray-300">
                            <Calendar className="w-4 h-4 mr-1.5 text-primary-400" />
                            Effective Date: {lastUpdated}
                        </span>
                        <span className="text-gray-600 hidden sm:inline">•</span>
                        <span className="text-primary-300">
                            Compliant with Consumer Protection Act 2019 &amp; RBI Guidelines
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

                            {/* Help Desk Card */}
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <div className="bg-primary-50/80 rounded-2xl p-4 border border-primary-100">
                                    <div className="text-xs font-bold text-primary-900 mb-1">Financial Desk Helpline</div>
                                    <p className="text-xs text-gray-600 mb-3">For refund status checks, GST credit notes, or transaction logs.</p>
                                    <a
                                        href="tel:+917017288052"
                                        className="inline-flex items-center justify-center w-full py-2 px-3 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-colors mb-2"
                                    >
                                        <Phone className="w-3.5 h-3.5 mr-1.5" />
                                        +91 70172 88052
                                    </a>
                                    <a
                                        href="mailto:refunds@tripdhara.com"
                                        className="inline-flex items-center justify-center w-full py-2 px-3 text-xs font-bold text-primary-800 bg-white hover:bg-primary-50 border border-primary-200 rounded-lg shadow-sm transition-colors"
                                    >
                                        <Mail className="w-3.5 h-3.5 mr-1.5" />
                                        refunds@tripdhara.com
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
                                    <section id="refund-rights" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <ShieldCheck className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                1. Consumer Protection Rights (Consumer Protection Act, 2019)
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            This Refund Policy is framed pursuant to the <strong>Consumer Protection Act, 2019</strong> and the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>.
                                        </p>
                                        <p className="text-gray-600 leading-relaxed mb-6">
                                            As a registered travel and rental aggregator, <strong>Tripdhara</strong> guarantees consumers full statutory protection against deficiency of service, misrepresentation, or unfulfilled booking commitments:
                                        </p>
                                        <ul className="space-y-3 text-sm text-gray-700">
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Deficiency of Service:</strong> If an assigned chauffeured vehicle, self-drive bike, or homestay room fails to match agreed standards or is cancelled by the operator, the consumer is entitled to an immediate <strong>100% Full Refund</strong> or zero-cost upgrade.</span>
                                            </li>
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Unfair Trade Practice Protection:</strong> In compliance with Rule 6 of E-Commerce Rules 2020, Tripdhara shall not impose arbitrary, undisclosed cancellation fees or refuse lawful refund requests.</span>
                                            </li>
                                        </ul>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 2 */}
                                    <section id="refund-rbi" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <CreditCard className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                2. Original Payment Source Refund Mandate (RBI Directives)
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-6">
                                            In accordance with the <strong>Reserve Bank of India (RBI) Master Direction on Payment Aggregators and Payment Gateways</strong>:
                                        </p>
                                        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 sm:p-6 text-emerald-950">
                                            <div className="flex items-start space-x-3">
                                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                                <div>
                                                    <h3 className="font-bold text-base text-emerald-900 mb-2">
                                                        Direct Bank Credit Mandate
                                                    </h3>
                                                    <p className="text-sm text-emerald-900/90 leading-relaxed">
                                                        All statutory refunds MUST be credited directly back to the original funding account (UPI ID, Net Banking account, Debit Card, or Credit Card) used during the transaction. Tripdhara does not lock refund money into non-transferable proprietary store wallets.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 3 */}
                                    <section id="refund-gst" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                3. GST Credit Notes &amp; Tax Refund Rules (Section 34, CGST Act 2017)
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            Under Section 34 of the <strong>Central Goods and Services Tax (CGST) Act, 2017</strong>:
                                        </p>
                                        <ul className="space-y-3 text-sm text-gray-700">
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>GST Credit Note Issuance:</strong> When a booking is cancelled or partially refunded, Tripdhara issues a statutory GST Credit Note containing the original invoice reference, tax adjustment breakdown, and net refundable sum.</span>
                                            </li>
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Tax Component Refund:</strong> Applicable CGST and SGST/IGST paid during booking are fully refunded alongside the base service amount in accordance with tax authority guidelines.</span>
                                            </li>
                                        </ul>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 4 */}
                                    <section id="refund-sla" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                4. Refund Processing Timelines &amp; Banking SLA
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-6">
                                            Tripdhara adheres strictly to turnaround timelines mandated by Indian banking regulations:
                                        </p>

                                        {/* Slabs Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="bg-gray-50/80 hover:bg-white rounded-2xl p-5 border border-gray-200/80 transition-all hover:shadow-md">
                                                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-primary-100 text-primary-800 mb-3">
                                                    UPI Payments
                                                </div>
                                                <div className="text-2xl font-black text-gray-900 mb-1">
                                                    24 to 48 Hours
                                                </div>
                                                <p className="text-xs text-gray-600">
                                                    Direct instant credit to BHIM / Google Pay / PhonePe VPA.
                                                </p>
                                            </div>

                                            <div className="bg-gray-50/80 hover:bg-white rounded-2xl p-5 border border-gray-200/80 transition-all hover:shadow-md">
                                                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-primary-100 text-primary-800 mb-3">
                                                    Net Banking
                                                </div>
                                                <div className="text-2xl font-black text-gray-900 mb-1">
                                                    2 to 4 Days
                                                </div>
                                                <p className="text-xs text-gray-600">
                                                    Processed via IMPS / NEFT / RTGS banking channels.
                                                </p>
                                            </div>

                                            <div className="bg-gray-50/80 hover:bg-white rounded-2xl p-5 border border-gray-200/80 transition-all hover:shadow-md">
                                                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-primary-100 text-primary-800 mb-3">
                                                    Credit / Debit Card
                                                </div>
                                                <div className="text-2xl font-black text-gray-900 mb-1">
                                                    3 to 7 Days
                                                </div>
                                                <p className="text-xs text-gray-600">
                                                    Subject to card issuing bank settlement cycles.
                                                </p>
                                            </div>
                                        </div>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 5 */}
                                    <section id="refund-disputes" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <Scale className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                5. Chargeback, Failed Transactions &amp; Dispute Resolution
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            In case of payment debits where booking confirmation failed to generate (failed payment gateway transactions):
                                        </p>
                                        <ul className="space-y-3 text-sm text-gray-700">
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Auto-Reversal (T+1 Rule):</strong> As per RBI Harmonization of Turnaround Time (TAT) guidelines, funds debited from a user&apos;s account for unconfirmed bookings are auto-reversed by the payment gateway within 1 to 2 business days.</span>
                                            </li>
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Chargeback Verification:</strong> If a customer initiates a chargeback via their issuing bank, Tripdhara&apos;s accounts cell will verify booking logs within 48 hours to expedite resolution.</span>
                                            </li>
                                        </ul>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 6 */}
                                    <section id="refund-nodal" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <UserCheck className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                6. Statutory Refund Nodal Officer Contact
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-6">
                                            For any inquiries regarding pending refunds, payment receipts, or tax credit notes:
                                        </p>

                                        <div className="bg-gray-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl shadow-gray-900/20">
                                            <div className="absolute top-0 right-0 w-48 h-48 bg-primary-600/10 rounded-bl-[4rem]"></div>
                                            <div className="relative z-10 grid sm:grid-cols-2 gap-6">
                                                <div>
                                                    <div className="text-xs font-bold text-primary-400 uppercase tracking-wider mb-2">Statutory Nodal Authority</div>
                                                    <h3 className="text-xl font-bold text-white mb-2">Finance &amp; Accounts Desk</h3>
                                                    <div className="space-y-2 text-sm text-gray-300">
                                                        <div className="flex items-center space-x-2">
                                                            <MapPin className="w-4 h-4 text-primary-400 shrink-0" />
                                                            <span>Tripdhara Travel &amp; Rentals India, Dehradun - 248001</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Mail className="w-4 h-4 text-primary-400 shrink-0" />
                                                            <span>refunds@tripdhara.com</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col justify-center sm:items-end">
                                                    <div className="text-xs text-gray-400 mb-1">Direct Nodal Helpline:</div>
                                                    <a
                                                        href="tel:+917017288052"
                                                        className="text-xl sm:text-2xl font-black text-primary-400 hover:text-primary-300 transition-colors"
                                                    >
                                                        +91 70172 88052
                                                    </a>
                                                    <span className="text-xs text-gray-400 mt-2 text-left sm:text-right">
                                                        Resolution SLA: 24h status update; payout within 7 business days
                                                    </span>
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

