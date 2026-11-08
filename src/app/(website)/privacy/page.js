import Link from 'next/link';
import connectDB from '@/core/Config/db.js';
import { getPolicyBy } from '@/core/Helpers/queryHelpers.js';
import { sanitizeHTML } from '@/core/Helpers/security.js';
import {
    ShieldCheck,
    FolderKanban,
    Scale,
    Lock,
    Users,
    KeyRound,
    MessageSquare,
    BarChart3,
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
    title: 'Privacy Policy - DPDP Act 2023 Compliant | Tripdhara',
    description: 'Official Privacy Policy of Tripdhara in strict compliance with India\'s Digital Personal Data Protection (DPDP) Act 2023, Information Technology Act 2000, and TRAI Regulations.',
    keywords: [
        'Tripdhara Privacy Policy',
        'DPDP Act 2023 Travel Compliance',
        'Data Protection Himalayas Tripdhara',
        'Inner Line Permit Document Privacy'
    ],
    openGraph: {
        title: 'Privacy Policy | Tripdhara',
        description: 'DPDP Act 2023 statutory compliance, data minimization, and privacy protections for Himalayan travelers.',
        url: 'https://tripdhara.com/privacy',
        siteName: 'Tripdhara',
        type: 'website',
    },
    alternates: {
        canonical: '/privacy',
    }
};

export default async function PrivacyPolicyPage() {
    let policy = null;
    try {
        await connectDB();
        policy = await getPolicyBy({ target: 'admin', type: 'privacy_policy' });
    } catch {
        // Fallback to static statutory policy if database record is unavailable
    }

    const lastUpdated = policy?.updatedAt
        ? new Date(policy.updatedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
        : 'September 2026';

    const tocItems = [
        { id: 'privacy-fiduciary', title: '1. Data Fiduciary & Laws', icon: ShieldCheck },
        { id: 'privacy-categories', title: '2. Categories of Data Collected', icon: FolderKanban },
        { id: 'privacy-grounds', title: '3. Lawful Processing Grounds', icon: Scale },
        { id: 'privacy-retention', title: '4. Security & Data Retention', icon: Lock },
        { id: 'privacy-sharing', title: '5. Third-Party Sharing Rules', icon: Users },
        { id: 'privacy-rights', title: '6. Data Principal Rights', icon: KeyRound },
        { id: 'privacy-whatsapp', title: '7. WhatsApp & TRAI Regulations', icon: MessageSquare },
        { id: 'privacy-cookies', title: '8. Cookies & Telemetry', icon: BarChart3 },
        { id: 'privacy-dpo', title: '9. Data Protection Officer', icon: UserCheck },
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
                        name: 'Privacy Policy',
                        description: 'Official statutory privacy policy of Tripdhara compliant with India DPDP Act 2023 and IT Act 2000.',
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
                            Digital Personal Data Protection (DPDP) Act 2023 Statutory Compliance
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-4 font-display">
                        Privacy Policy
                    </h1>
                    <div className="flex flex-wrap items-center justify-center gap-3 text-sm md:text-base text-gray-400 font-medium">
                        <span className="inline-flex items-center text-gray-300">
                            <Calendar className="w-4 h-4 mr-1.5 text-primary-400" />
                            Effective Date: {lastUpdated}
                        </span>
                        <span className="text-gray-600 hidden sm:inline">•</span>
                        <span className="text-primary-300">
                            Compliant with IT Act 2000, DPDP Act 2023 &amp; TRAI Guidelines
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

                            {/* DPO Contact Card */}
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <div className="bg-primary-50/80 rounded-2xl p-4 border border-primary-100">
                                    <div className="text-xs font-bold text-primary-900 mb-1">Data Protection Officer</div>
                                    <p className="text-xs text-gray-600 mb-3">Statutory redressal under Section 10 of DPDP Act 2023.</p>
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
                                    <section id="privacy-fiduciary" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <ShieldCheck className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                1. Data Fiduciary Identity &amp; Indian Statutory Framework
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            This Privacy Policy is published in compliance with Section 43A of the <strong>Information Technology Act, 2000</strong>, Rule 4 of the <strong>IT (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 (SPDI Rules)</strong>, and the <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong>.
                                        </p>
                                        <p className="text-gray-600 leading-relaxed">
                                            <strong>Tripdhara Travel &amp; Rentals India</strong> operates as a registered <strong>Data Fiduciary</strong> headquartered in Dehradun, Uttarakhand. We determine the purpose and means of processing personal data provided by users (&ldquo;Data Principals&rdquo;) seeking mountain transport, vehicle rentals, homestay reservations, and Himalayan adventure itineraries across Uttarakhand, Himachal Pradesh, and border regions.
                                        </p>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 2 */}
                                    <section id="privacy-categories" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <FolderKanban className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                2. Categories of Personal Data Collected (Data Minimization)
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            In accordance with the statutory principle of Data Minimization, Tripdhara collects only personal data strictly necessary to fulfill travel itineraries and satisfy statutory requirements:
                                        </p>
                                        <ul className="space-y-3 text-sm text-gray-700">
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Identity &amp; Contact Details:</strong> Full Legal Name, Mobile / WhatsApp Phone Number, Email Address, and Emergency Contact numbers.</span>
                                            </li>
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Government Identity Proofs (Statutory Mandatory):</strong> Copies of Aadhaar Card, Passport, Indian Tourist Visa (for foreign nationals), or Driving License. These are collected strictly for Inner Line Permits (ILP), SDM border passes, Army checkpost verifications, or Bureau of Immigration (Form-C) compliance.</span>
                                            </li>
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Trip Specifications &amp; Preferences:</strong> Booking dates, duration, passenger count, pickup locations, vehicle preferences, and medical self-declarations for outdoor adventure sports.</span>
                                            </li>
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Technical &amp; Device Data:</strong> IP address, device type, browser specifications, and user interaction metrics collected anonymously for web performance optimization.</span>
                                            </li>
                                        </ul>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 3 */}
                                    <section id="privacy-grounds" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <Scale className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                3. Lawful Grounds for Processing (Section 4 &amp; 7, DPDP Act 2023)
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            Tripdhara processes personal data strictly under valid statutory grounds established under Indian law:
                                        </p>
                                        <ul className="space-y-3 text-sm text-gray-700">
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Specified Consent (Section 5, DPDP Act):</strong> Consent freely given by the Data Principal when submitting web inquiry forms or initiating WhatsApp conversations with our itinerary planners.</span>
                                            </li>
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Certain Legitimate Uses (Section 7, DPDP Act):</strong> Processing necessary to fulfill statutory obligations under the Motor Vehicles Act 1988 (vehicle permits), Police Verification rules, and Tourism Board registration mandates.</span>
                                            </li>
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Emergency Medical Response:</strong> Processing necessary to respond to medical emergencies or severe weather evacuations in high-altitude zones.</span>
                                            </li>
                                        </ul>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 4 */}
                                    <section id="privacy-retention" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <Lock className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                4. Reasonable Security Practices &amp; Data Retention Limits
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            Tripdhara implements reasonable security practices and procedures as mandated under Rule 8 of the IT SPDI Rules 2011:
                                        </p>
                                        <ul className="space-y-3 text-sm text-gray-700">
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Encryption &amp; Access Controls:</strong> All digital communications are secured via TLS 1.3 encryption. Internal access to customer identity documents is restricted to authorized compliance personnel only.</span>
                                            </li>
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Purging Schedule:</strong> Government identity documents submitted for Inner Line Permits or Form-C filing are permanently deleted from active servers within <strong>30 days</strong> after trip completion.</span>
                                            </li>
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Tax Audit Archives:</strong> Booking invoices containing contact data are retained for 6 years strictly to comply with Central GST (CGST) and Income Tax Act statutory audit requirements.</span>
                                            </li>
                                        </ul>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 5 */}
                                    <section id="privacy-sharing" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <Users className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                5. Authorized Data Sharing &amp; Third-Party Restrictions
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            Tripdhara enforces a strict zero-monetization data protection policy:
                                        </p>
                                        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 sm:p-6 text-emerald-950 mb-6">
                                            <div className="flex items-start space-x-3">
                                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                                <div>
                                                    <h3 className="font-bold text-base text-emerald-900 mb-1">
                                                        Zero Commercial Sharing Guarantee
                                                    </h3>
                                                    <p className="text-sm text-emerald-900/90 leading-relaxed">
                                                        Tripdhara NEVER sells, rents, leases, or trades user personal data to third-party telemarketing companies, ad networks, or data brokers.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            Personal data is shared strictly on a need-to-know basis with:
                                        </p>
                                        <ul className="space-y-3 text-sm text-gray-700">
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Fulfillment Partners:</strong> Verified local homestay hosts, assigned mountain chauffeurs, and adventure instructors to facilitate trip logistics.</span>
                                            </li>
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Government Authorities:</strong> Sub-Divisional Magistrates (SDM), Regional Transport Offices (RTO), State Police, or Indian Army checkposts upon statutory demand or emergency safety orders.</span>
                                            </li>
                                        </ul>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 6 */}
                                    <section id="privacy-rights" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <KeyRound className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                6. Statutory Rights of Data Principals (DPDP Act 2023)
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            Under Chapter III of the Digital Personal Data Protection Act, 2023, you enjoy enforceable statutory rights:
                                        </p>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <h4 className="font-bold text-gray-900 text-sm mb-1">Right to Access Summary (Sec 11)</h4>
                                                <p className="text-xs text-gray-600">Request a complete summary of personal data processed by Tripdhara along with identities of entities.</p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <h4 className="font-bold text-gray-900 text-sm mb-1">Right to Correction &amp; Erasure (Sec 12)</h4>
                                                <p className="text-xs text-gray-600">Request correction of inaccurate data or complete deletion (&ldquo;Right to be Forgotten&rdquo;) once booking purposes are satisfied.</p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <h4 className="font-bold text-gray-900 text-sm mb-1">Right to Grievance Redressal (Sec 13)</h4>
                                                <p className="text-xs text-gray-600">Access ready means of grievance redressal provided by our Data Protection Officer.</p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <h4 className="font-bold text-gray-900 text-sm mb-1">Right to Nominate (Sec 14)</h4>
                                                <p className="text-xs text-gray-600">Nominate any individual to exercise data principal rights on your behalf in the event of death or incapacity.</p>
                                            </div>
                                        </div>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 7 */}
                                    <section id="privacy-whatsapp" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <MessageSquare className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                7. WhatsApp Direct Messaging &amp; TRAI Regulations
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            In compliance with the Telecom Commercial Communications Customer Preference Regulations (TCCCPR, 2018) issued by TRAI:
                                        </p>
                                        <ul className="space-y-3 text-sm text-gray-700">
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Explicit Opt-In:</strong> Messaging via WhatsApp is initiated voluntarily by clicking pre-formatted trip inquiry links.</span>
                                            </li>
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Opt-Out Mechanism:</strong> You can opt out of non-essential transactional updates at any time by replying &ldquo;STOP&rdquo; or notifying our helpline.</span>
                                            </li>
                                        </ul>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 8 */}
                                    <section id="privacy-cookies" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <BarChart3 className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                8. Cookies &amp; Telemetry Practices
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            Our platform utilizes Google Tag Manager and Google Analytics for aggregated telemetry:
                                        </p>
                                        <ul className="space-y-3 text-sm text-gray-700">
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span>No Personally Identifiable Information (PII) is captured via analytics cookies.</span>
                                            </li>
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span>Users can configure browser settings to block analytical cookies without affecting core booking form functionality.</span>
                                            </li>
                                        </ul>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 9 */}
                                    <section id="privacy-dpo" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <UserCheck className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                9. Statutory Data Protection Officer &amp; Grievance Redressal
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-6">
                                            In compliance with Section 10 of the DPDP Act 2023 and Rule 5(9) of the Consumer Protection (E-Commerce) Rules 2020, the contact details of our Data Protection Officer / Grievance Redressal Officer are published below:
                                        </p>

                                        <div className="bg-gray-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl shadow-gray-900/20">
                                            <div className="absolute top-0 right-0 w-48 h-48 bg-primary-600/10 rounded-bl-[4rem]"></div>
                                            <div className="relative z-10 grid sm:grid-cols-2 gap-6">
                                                <div>
                                                    <div className="text-xs font-bold text-primary-400 uppercase tracking-wider mb-2">Statutory Redressal Desk</div>
                                                    <h3 className="text-xl font-bold text-white mb-2">Designated Data Protection Officer</h3>
                                                    <div className="space-y-2 text-sm text-gray-300">
                                                        <div className="flex items-center space-x-2">
                                                            <MapPin className="w-4 h-4 text-primary-400 shrink-0" />
                                                            <span>Tripdhara Travel &amp; Rentals India, Dehradun - 248001</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Mail className="w-4 h-4 text-primary-400 shrink-0" />
                                                            <span>legal@tripdhara.com</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col justify-center sm:items-end">
                                                    <div className="text-xs text-gray-400 mb-1">Direct Grievance Helpline:</div>
                                                    <a
                                                        href="tel:+917017288052"
                                                        className="text-xl sm:text-2xl font-black text-primary-400 hover:text-primary-300 transition-colors"
                                                    >
                                                        +91 70172 88052
                                                    </a>
                                                    <span className="text-xs text-gray-400 mt-2 text-left sm:text-right">
                                                        Statutory SLA: Acknowledgment within 24 to 48 hours; resolution completed within 30 calendar days
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
