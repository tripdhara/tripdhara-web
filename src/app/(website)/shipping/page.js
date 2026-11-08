import Link from 'next/link';
import connectDB from '@/core/Config/db.js';
import { getPolicyBy } from '@/core/Helpers/queryHelpers.js';
import { sanitizeHTML } from '@/core/Helpers/security.js';
import {
    Truck,
    Clock,
    FileCheck2,
    CheckCircle2,
    Calendar,
    Phone,
    Mail,
    MapPin,
    ChevronRight,
    AlertCircle,
    Smartphone,
    Key,
    ShieldCheck
} from 'lucide-react';

export const metadata = {
    title: 'Shipping & Service Delivery Policy - Instant Voucher & Fleet Handover | Tripdhara',
    description: 'Official Shipping & Fulfillment Policy of Tripdhara covering instant digital voucher delivery, airport/station vehicle handover, and homestay check-in SLAs.',
    keywords: [
        'Tripdhara Shipping Policy',
        'Travel Service Fulfillment SLA',
        'Digital Booking Voucher Delivery',
        'Himalayan Vehicle Handover Protocol'
    ],
    openGraph: {
        title: 'Shipping & Delivery Policy | Tripdhara',
        description: 'Instant digital voucher delivery SLAs, vehicle handover protocols, and physical check-in verification.',
        url: 'https://tripdhara.com/shipping',
        siteName: 'Tripdhara',
        type: 'website',
    },
    alternates: {
        canonical: '/shipping',
    }
};

export default async function ShippingPolicyPage() {
    let policy = null;
    try {
        await connectDB();
        policy = await getPolicyBy({ target: 'admin', type: 'shipping_policy' });
    } catch {
        // Fallback to static policy
    }

    const lastUpdated = policy?.updatedAt
        ? new Date(policy.updatedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
        : 'October 2026';

    const tocItems = [
        { id: 'shipping-digital', title: '1. Instant Digital Delivery', icon: Smartphone },
        { id: 'shipping-fleet', title: '2. Vehicle Handover Hubs', icon: Key },
        { id: 'shipping-homestay', title: '3. Homestay & Trek Check-In', icon: MapPin },
        { id: 'shipping-verification', title: '4. Physical Identity Protocols', icon: FileCheck2 },
        { id: 'shipping-nonfulfillment', title: '5. Non-Fulfillment & Breakdown Guarantee', icon: ShieldCheck }
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
                        <Truck className="w-4 h-4 text-primary-400 mr-2" />
                        <span className="text-xs sm:text-sm font-semibold text-primary-200 tracking-wide uppercase">
                            Digital Fulfillment &amp; Fleet Handover Protocols
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-4 font-display">
                        Shipping &amp; Delivery Policy
                    </h1>
                    <div className="flex flex-wrap items-center justify-center gap-3 text-sm md:text-base text-gray-400 font-medium">
                        <span className="inline-flex items-center text-gray-300">
                            <Calendar className="w-4 h-4 mr-1.5 text-primary-400" />
                            Effective Date: {lastUpdated}
                        </span>
                        <span className="text-gray-600 hidden sm:inline">•</span>
                        <span className="text-primary-300">
                            Instant Multi-Channel Digital Dispatch
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
                                <span>Delivery Chapters</span>
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

                            {/* Dispatch Hotline */}
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <div className="bg-primary-50/60 rounded-2xl p-4 border border-primary-100/80">
                                    <div className="flex items-center space-x-2 text-primary-900 font-bold text-xs uppercase tracking-wider mb-2">
                                        <Clock className="w-4 h-4 text-primary-600" />
                                        <span>24/7 Handover Desk</span>
                                    </div>
                                    <p className="text-xs text-gray-600">Arrived early at Dehradun Airport or Rishikesh Station?</p>
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
                        <section id="shipping-digital" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary-100/70 text-primary-700 flex items-center justify-center font-black">
                                    01
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                    Instant Digital Delivery (&lt; 60 Seconds)
                                </h2>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                                Tripdhara is a technology-enabled travel and mobility platform. We do not dispatch physical cargo via postal courier. All booking confirmations, digital boarding vouchers, GPS pickup coordinates, and GST tax invoices are delivered electronically:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                                    <h4 className="font-bold text-gray-900 text-sm mb-1 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-primary-600" /> WhatsApp Instant Push
                                    </h4>
                                    <p className="text-xs text-gray-600">
                                        Booking voucher PDF, driver contact, vehicle registration number, and pickup pin are dispatched to your registered mobile number within <strong>60 seconds</strong>.
                                    </p>
                                </div>
                                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                                    <h4 className="font-bold text-gray-900 text-sm mb-1 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-primary-600" /> Email Confirmation
                                    </h4>
                                    <p className="text-xs text-gray-600">
                                        Official tax invoice, detailed itinerary, packing recommendations, and regional emergency helpline numbers delivered in high-resolution PDF format.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Section 2 */}
                        <section id="shipping-fleet" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary-100/70 text-primary-700 flex items-center justify-center font-black">
                                    02
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                    Physical Vehicle Handover Hubs
                                </h2>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                                For self-drive motorcycles (Royal Enfield Himalayan, Scram, Hunter, Scooters) and 4x4 SUVs, physical vehicle handover takes place at verified Tripdhara Mobility Hubs:
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600 mb-6 pl-4 border-l-2 border-primary-500">
                                <li><strong>Dehradun Hub:</strong> Jolly Grant Airport (DED) Arrival Terminal &amp; ISBT Dehradun.</li>
                                <li><strong>Rishikesh Hub:</strong> Tapovan Main Market &amp; Yog Nagari Rishikesh Railway Station.</li>
                                <li><strong>Haridwar Hub:</strong> Haridwar Railway Junction Gate 1 &amp; Bilkeshwar Road.</li>
                                <li><strong>Kumaon Hub:</strong> Kathgodam Railway Terminal &amp; Haldwani Bypass.</li>
                            </ul>
                            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs sm:text-sm text-gray-700">
                                <strong>Doorstep / Hotel Delivery:</strong> Available across Dehradun, Mussoorie, and Rishikesh on request with an advance notification of 3 hours.
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section id="shipping-homestay" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary-100/70 text-primary-700 flex items-center justify-center font-black">
                                    03
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                    Homestay Check-In &amp; Trekking Departures
                                </h2>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                                • <strong>Homestay &amp; Resort Check-In:</strong> Standard check-in is <strong>12:00 PM</strong>, check-out is <strong>10:00 AM</strong>. Present your digital Tripdhara confirmation voucher at the reception for immediate room key handover.<br/>
                                • <strong>Trekking &amp; Expedition Reporting:</strong> Group departures assemble at the basecamp hub designated on your voucher (e.g. Sari village for Deoriatal-Chopta, Sankri for Kedarkantha). Basecamp managers issue high-altitude equipment upon physical arrival.
                            </p>
                        </section>

                        {/* Section 4 */}
                        <section id="shipping-verification" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary-100/70 text-primary-700 flex items-center justify-center font-black">
                                    04
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                    Physical Identity &amp; Handover Checklist
                                </h2>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                                At the time of vehicle key collection, the primary renter must physically present:
                            </p>
                            <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600 mb-6">
                                <li>Original valid Driving License (Digital DigiLocker verification accepted).</li>
                                <li>Original Aadhaar Card or Passport for identity matching.</li>
                                <li>Joint physical inspection sign-off (recording tire condition, odometer, existing scratch marks, and fuel gauge).</li>
                                <li>Payment of refundable security deposit (UPI / Cash / Card pre-auth).</li>
                            </ol>
                        </section>

                        {/* Section 5 */}
                        <section id="shipping-nonfulfillment" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary-100/70 text-primary-700 flex items-center justify-center font-black">
                                    05
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                    Non-Fulfillment &amp; Vehicle Replacement Guarantee
                                </h2>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                                In the rare circumstance that an assigned vehicle or accommodation cannot be fulfilled due to mechanical breakdown or property emergency, Tripdhara guarantees:
                            </p>
                            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-950 space-y-2">
                                <p><strong>1. Instant Equivalent or Upgraded Vehicle Replacement</strong> provided within 60 to 90 minutes at zero additional cost.</p>
                                <p><strong>2. 100% Full Refund Guarantee</strong> if no satisfactory alternative can be mobilized, processed directly to your original payment source.</p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}

