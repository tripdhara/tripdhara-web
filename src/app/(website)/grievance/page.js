import Link from 'next/link';
import connectDB from '@/core/Config/db.js';
import { getPolicyBy } from '@/core/Helpers/queryHelpers.js';
import { sanitizeHTML } from '@/core/Helpers/security.js';
import {
    ShieldCheck,
    Scale,
    Clock,
    FileText,
    AlertCircle,
    CheckCircle2,
    Calendar,
    Phone,
    Mail,
    MapPin,
    ChevronRight,
    UserCheck,
    ExternalLink
} from 'lucide-react';

export const metadata = {
    title: 'Grievance Redressal Policy - IT Rules 2021 & CPA 2020 | Tripdhara',
    description: 'Official Statutory Grievance Redressal Policy of Tripdhara in compliance with Information Technology Rules 2021 and Consumer Protection E-Commerce Rules 2020.',
    keywords: [
        'Tripdhara Grievance Officer',
        'Travel Grievance Redressal Mechanism',
        'IT Rules 2021 Grievance Officer',
        'National Consumer Helpline Travel Escalation'
    ],
    openGraph: {
        title: 'Grievance Redressal Policy | Tripdhara',
        description: 'Statutory grievance officer details, escalation matrix, and resolution timelines for Himalayan travelers.',
        url: 'https://tripdhara.com/grievance',
        siteName: 'Tripdhara',
        type: 'website',
    },
    alternates: {
        canonical: '/grievance',
    }
};

export default async function GrievancePolicyPage() {
    let policy = null;
    try {
        await connectDB();
        policy = await getPolicyBy({ target: 'admin', type: 'grievance_policy' });
    } catch {
        // Fallback to static statutory policy if database record is unavailable
    }

    const lastUpdated = policy?.updatedAt
        ? new Date(policy.updatedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
        : 'October 2026';

    const tocItems = [
        { id: 'grievance-framework', title: '1. Statutory Legal Framework', icon: Scale },
        { id: 'grievance-officer', title: '2. Nodal Grievance Officer Details', icon: UserCheck },
        { id: 'grievance-sla', title: '3. Redressal SLAs & Timelines', icon: Clock },
        { id: 'grievance-matrix', title: '4. Three-Tier Escalation Matrix', icon: FileText },
        { id: 'grievance-nch', title: '5. National Consumer Helpline (NCH)', icon: ShieldCheck }
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
                        <Scale className="w-4 h-4 text-primary-400 mr-2" />
                        <span className="text-xs sm:text-sm font-semibold text-primary-200 tracking-wide uppercase">
                            IT Rules 2021 &amp; CPA 2020 Statutory Compliance
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-4 font-display">
                        Grievance Redressal Policy
                    </h1>
                    <div className="flex flex-wrap items-center justify-center gap-3 text-sm md:text-base text-gray-400 font-medium">
                        <span className="inline-flex items-center text-gray-300">
                            <Calendar className="w-4 h-4 mr-1.5 text-primary-400" />
                            Effective Date: {lastUpdated}
                        </span>
                        <span className="text-gray-600 hidden sm:inline">•</span>
                        <span className="text-primary-300">
                            Rule 3(2) Information Technology Intermediary Rules
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
                                <span>Statutory Redressal</span>
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

                            {/* Designated Officer Quick Card */}
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <div className="bg-primary-50/60 rounded-2xl p-4 border border-primary-100/80">
                                    <div className="flex items-center space-x-2 text-primary-900 font-bold text-xs uppercase tracking-wider mb-2">
                                        <UserCheck className="w-4 h-4 text-primary-600" />
                                        <span>Grievance Officer</span>
                                    </div>
                                    <p className="text-xs font-semibold text-gray-900">Mr. Gaurav Sharma</p>
                                    <p className="text-xs text-gray-600 mt-1">Tripdhara Experiences, Rajpur Road, Dehradun</p>
                                    <a href="tel:+917017288052" className="mt-3 flex items-center text-xs font-bold text-primary-700 hover:text-primary-800">
                                        <Phone className="w-3.5 h-3.5 mr-1.5" />
                                        +91 70172 88052
                                    </a>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Policy Body */}
                    <div className="lg:col-span-8 space-y-8">
                        {policy?.content ? (
                            <div
                                className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30 prose prose-teal max-w-none"
                                dangerouslySetInnerHTML={{ __html: sanitizeHTML(policy.content) }}
                            />
                        ) : (
                            <>
                                {/* Section 1 */}
                                <section id="grievance-framework" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-primary-100/70 text-primary-700 flex items-center justify-center font-black">
                                            01
                                        </div>
                                        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                            Statutory Legal Framework
                                        </h2>
                                    </div>
                                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                                        In compliance with Rule 3(2) of the <strong>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</strong>, and Rule 5(9) of the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>, Tripdhara publishes this Grievance Redressal Mechanism to ensure transparent, accountable, and time-bound resolution of consumer disputes, service complaints, and vendor discrepancies.
                                    </p>
                                    <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-xs sm:text-sm text-amber-900 leading-relaxed flex items-start space-x-3">
                                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                        <span>
                                            Tripdhara is an intermediary platform connecting travelers with verified Himalayan local transport operators, homestay hosts, and adventure guides. Every complaint is tracked with a unique digital token ID until full resolution.
                                        </span>
                                    </div>
                                </section>

                                {/* Section 2 */}
                                <section id="grievance-officer" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-primary-100/70 text-primary-700 flex items-center justify-center font-black">
                                            02
                                        </div>
                                        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                            Designated Nodal Grievance Officer
                                        </h2>
                                    </div>
                                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                                        If any dispute remains unresolved via standard support channels, travelers or vendors may directly address their complaint to our statutory Grievance Officer:
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                                            <p className="text-xs uppercase font-bold text-gray-500">Designated Officer</p>
                                            <p className="text-base font-bold text-gray-900">Mr. Gaurav Sharma</p>
                                            <p className="text-xs text-primary-700 font-semibold">Nodal Grievance &amp; Compliance Head</p>
                                        </div>
                                        <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                                            <p className="text-xs uppercase font-bold text-gray-500">Direct Helpline &amp; WhatsApp</p>
                                            <p className="text-base font-bold text-gray-900">+91 70172 88052</p>
                                            <p className="text-xs text-gray-500">Available: Mon–Sat (10:00 AM – 6:00 PM IST)</p>
                                        </div>
                                        <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                                            <p className="text-xs uppercase font-bold text-gray-500">Dedicated Grievance Email</p>
                                            <a href="mailto:grievance@tripdhara.com" className="text-base font-bold text-primary-600 hover:underline">
                                                grievance@tripdhara.com
                                            </a>
                                            <p className="text-xs text-gray-500">Cc: support@tripdhara.com</p>
                                        </div>
                                        <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                                            <p className="text-xs uppercase font-bold text-gray-500">Physical Nodal Office</p>
                                            <p className="text-sm font-semibold text-gray-800">Tripdhara Himalayan Mobility</p>
                                            <p className="text-xs text-gray-500">Rajpur Road, Jakhan, Dehradun, Uttarakhand - 248001</p>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 3 */}
                                <section id="grievance-sla" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-primary-100/70 text-primary-700 flex items-center justify-center font-black">
                                            03
                                        </div>
                                        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                            Redressal Timelines &amp; SLAs
                                        </h2>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                            <div className="w-8 h-8 rounded-xl bg-primary-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                                                48H
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm">Mandatory Acknowledgment SLA</h4>
                                                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                                                    Tripdhara generates a unique Ticket ID and acknowledges receipt of any consumer complaint within <strong>48 hours</strong> of receipt.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                            <div className="w-8 h-8 rounded-xl bg-primary-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                                                15D
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm">Final Dispute Resolution SLA</h4>
                                                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                                                    The Grievance Officer investigates with the local vendor and dispatches a comprehensive resolution, refund decision, or remediation report within <strong>15 calendar days</strong>.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                            <div className="w-8 h-8 rounded-xl bg-primary-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                                                24H
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm">Emergency Mountain Escalations</h4>
                                                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                                                    Active on-road breakdowns, weather strandings, or life-safety emergencies in high-altitude zones are escalated immediately to our 24/7 Road Concierge (+91 70172 88052) for real-time field rescue.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 4 */}
                                <section id="grievance-matrix" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-primary-100/70 text-primary-700 flex items-center justify-center font-black">
                                            04
                                        </div>
                                        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                            Three-Tier Escalation Matrix
                                        </h2>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm text-gray-600 border border-gray-200 rounded-2xl overflow-hidden">
                                            <thead className="bg-gray-100 text-gray-900 font-bold text-xs uppercase tracking-wider">
                                                <tr>
                                                    <th className="p-3.5 border-b">Tier Level</th>
                                                    <th className="p-3.5 border-b">Contact Point</th>
                                                    <th className="p-3.5 border-b">Channel</th>
                                                    <th className="p-3.5 border-b">Resolution Window</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                <tr>
                                                    <td className="p-3.5 font-bold text-gray-900">Tier 1: Frontline Support</td>
                                                    <td className="p-3.5">Customer Care Desk</td>
                                                    <td className="p-3.5 text-primary-600 font-medium">support@tripdhara.com</td>
                                                    <td className="p-3.5 font-semibold text-gray-800">24 to 72 Hours</td>
                                                </tr>
                                                <tr className="bg-primary-50/30">
                                                    <td className="p-3.5 font-bold text-primary-900">Tier 2: Statutory Officer</td>
                                                    <td className="p-3.5 font-semibold text-gray-900">Grievance Redressal Officer</td>
                                                    <td className="p-3.5 text-primary-700 font-medium">grievance@tripdhara.com</td>
                                                    <td className="p-3.5 font-bold text-primary-800">Max 15 Days</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-3.5 font-bold text-gray-900">Tier 3: Executive Review</td>
                                                    <td className="p-3.5">Appellate Compliance Board</td>
                                                    <td className="p-3.5 text-gray-700 font-medium">legal@tripdhara.com</td>
                                                    <td className="p-3.5 font-semibold text-gray-800">Binding Final Decision</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </section>

                                {/* Section 5 */}
                                <section id="grievance-nch" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-primary-100/70 text-primary-700 flex items-center justify-center font-black">
                                            05
                                        </div>
                                        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                            National Consumer Helpline (NCH) Escalation
                                        </h2>
                                    </div>
                                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                                        If a consumer is not satisfied with the resolution provided by our Grievance Redressal Officer, they may register their grievance directly with the <strong>Department of Consumer Affairs, Government of India</strong>:
                                    </p>
                                    <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">National Consumer Helpline (Toll-Free)</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Call 1915 or register online at consumerhelpline.gov.in</p>
                                        </div>
                                        <a
                                            href="https://consumerhelpline.gov.in"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition-all"
                                        >
                                            Visit NCH Portal <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    </div>
                                </section>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

