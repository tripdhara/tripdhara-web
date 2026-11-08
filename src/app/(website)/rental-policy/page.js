import Link from 'next/link';
import connectDB from '@/core/Config/db.js';
import { getPolicyBy } from '@/core/Helpers/queryHelpers.js';
import { sanitizeHTML } from '@/core/Helpers/security.js';
import {
    Bike,
    Car,
    ShieldAlert,
    Scale,
    FileText,
    Calendar,
    Phone,
    Mail,
    MapPin,
    ChevronRight,
    AlertCircle,
    CheckCircle2,
    Clock,
    Gauge
} from 'lucide-react';

export const metadata = {
    title: 'Vehicle Rental & Security Deposit Policy - MVA 1988 | Tripdhara',
    description: 'Official Vehicle Rental & Security Deposit Policy of Tripdhara in compliance with Motor Vehicles Act 1988, Rent a Cab Scheme 1989, and Rent a Motorcycle Scheme 1997.',
    keywords: [
        'Tripdhara Bike Rental Policy',
        'Uttarakhand Bike Rental Security Deposit',
        'MVA 1988 Self Drive Terms',
        'Rishikesh Motorcycle Rental Rules'
    ],
    openGraph: {
        title: 'Vehicle Rental & Deposit Policy | Tripdhara',
        description: 'Comprehensive guidelines on documentation, 24-hour UPI deposit refunds, level-to-level fuel, speed limits, and traffic challans.',
        url: 'https://tripdhara.com/rental-policy',
        siteName: 'Tripdhara',
        type: 'website',
    },
    alternates: {
        canonical: '/rental-policy',
    }
};

export default async function RentalPolicyPage() {
    let policy = null;
    try {
        await connectDB();
        policy = await getPolicyBy({ target: 'admin', type: 'rental_policy' });
    } catch {
        // Fallback to static policy
    }

    const lastUpdated = policy?.updatedAt
        ? new Date(policy.updatedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
        : 'October 2026';

    const tocItems = [
        { id: 'rental-eligibility', title: '1. Renter Eligibility & Documents', icon: FileText },
        { id: 'rental-deposit', title: '2. Security Deposit Slabs & Refund', icon: Clock },
        { id: 'rental-fuel', title: '3. Level-to-Level Fuel Policy', icon: Gauge },
        { id: 'rental-speed', title: '4. Speed Limits & Geo-Fencing', icon: ShieldAlert },
        { id: 'rental-damages', title: '5. Damage Appraisal & Challans', icon: Scale }
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
                        <Bike className="w-4 h-4 text-primary-400 mr-2" />
                        <span className="text-xs sm:text-sm font-semibold text-primary-200 tracking-wide uppercase">
                            MVA 1988 &amp; Rent a Cab/Motorcycle Schemes Compliant
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-4 font-display">
                        Vehicle Rental &amp; Deposit Policy
                    </h1>
                    <div className="flex flex-wrap items-center justify-center gap-3 text-sm md:text-base text-gray-400 font-medium">
                        <span className="inline-flex items-center text-gray-300">
                            <Calendar className="w-4 h-4 mr-1.5 text-primary-400" />
                            Effective Date: {lastUpdated}
                        </span>
                        <span className="text-gray-600 hidden sm:inline">•</span>
                        <span className="text-primary-300">
                            Transparent Slabs &amp; Instant 24-Hour Deposit Clearance
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
                                <span>Rental Rules</span>
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

                            {/* Road Concierge Quick Box */}
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <div className="bg-primary-50/60 rounded-2xl p-4 border border-primary-100/80">
                                    <div className="flex items-center space-x-2 text-primary-900 font-bold text-xs uppercase tracking-wider mb-2">
                                        <Phone className="w-4 h-4 text-primary-600" />
                                        <span>24/7 Roadside Assistance</span>
                                    </div>
                                    <p className="text-xs text-gray-600">Flat tire, battery jumpstart, or mechanical assistance across Uttarakhand.</p>
                                    <a href="tel:+917017288052" className="mt-2.5 flex items-center text-xs font-bold text-primary-700 hover:text-primary-800">
                                        <Phone className="w-3.5 h-3.5 mr-1.5" />
                                        +91 70172 88052
                                    </a>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Policy Content Area */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Section 1 */}
                        <section id="rental-eligibility" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary-100/70 text-primary-700 flex items-center justify-center font-black">
                                    01
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                    Renter Eligibility &amp; Mandatory Documents
                                </h2>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                                In strict adherence to Section 3 of the <strong>Motor Vehicles Act 1988</strong> and Uttarakhand Transport Department safety directives, vehicle keys are handed over only upon satisfying all eligibility criteria:
                            </p>
                            <div className="space-y-3 my-4">
                                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-sm text-gray-700">
                                    <strong>Age Requirement:</strong> Minimum <strong>21 years of age</strong> for motorcycles up to 450cc and standard cars; minimum <strong>24 years</strong> for high-displacement 4x4 vehicles (e.g. Mahindra Thar 4x4, Toyota Fortuner).
                                </div>
                                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-sm text-gray-700">
                                    <strong>Driving License:</strong> Original valid Driving License (LMV for cars, 2-Wheeler with gear for bikes held for at least 12 continuous months). Learner&apos;s permits are strictly invalid.
                                </div>
                                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-sm text-gray-700">
                                    <strong>Foreign Travelers:</strong> An International Driving Permit (IDP) alongside home country national driving license and Passport with a valid Indian Tourist Visa.
                                </div>
                            </div>
                        </section>

                        {/* Section 2 */}
                        <section id="rental-deposit" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary-100/70 text-primary-700 flex items-center justify-center font-black">
                                    02
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                    Security Deposit Slabs &amp; 24-Hour Refund SLA
                                </h2>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                                A refundable security deposit is collected at vehicle handover. The deposit is held as security against traffic e-challans, minor damages, or late return surcharges:
                            </p>
                            <div className="overflow-x-auto my-6">
                                <table className="w-full text-left text-sm text-gray-600 border border-gray-200 rounded-2xl overflow-hidden">
                                    <thead className="bg-gray-100 text-gray-900 font-bold text-xs uppercase tracking-wider">
                                        <tr>
                                            <th className="p-3.5 border-b">Vehicle Category</th>
                                            <th className="p-3.5 border-b">Models Included</th>
                                            <th className="p-3.5 border-b">Security Deposit (₹)</th>
                                            <th className="p-3.5 border-b">Refund SLA</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        <tr>
                                            <td className="p-3.5 font-bold text-gray-900">Scooters / Activa</td>
                                            <td className="p-3.5">Honda Activa 6G, Suzuki Access 125</td>
                                            <td className="p-3.5 font-bold text-primary-700">₹1,500</td>
                                            <td className="p-3.5">&lt; 24 Hours post return</td>
                                        </tr>
                                        <tr className="bg-primary-50/20">
                                            <td className="p-3.5 font-bold text-gray-900">Adventure Bikes</td>
                                            <td className="p-3.5">Royal Enfield Himalayan 450, Hunter, Classic 350</td>
                                            <td className="p-3.5 font-bold text-primary-700">₹3,000</td>
                                            <td className="p-3.5">&lt; 24 Hours post return</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3.5 font-bold text-gray-900">Self-Drive Hatchback / Sedan</td>
                                            <td className="p-3.5">Maruti Swift, Baleno, Hyundai i20</td>
                                            <td className="p-3.5 font-bold text-primary-700">₹3,500</td>
                                            <td className="p-3.5">&lt; 24 Hours post return</td>
                                        </tr>
                                        <tr className="bg-primary-50/20">
                                            <td className="p-3.5 font-bold text-gray-900">Mountain 4x4 / SUVs</td>
                                            <td className="p-3.5">Mahindra Thar 4x4, Scorpio-N</td>
                                            <td className="p-3.5 font-bold text-primary-700">₹5,000</td>
                                            <td className="p-3.5">&lt; 24 Hours post return</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section id="rental-fuel" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary-100/70 text-primary-700 flex items-center justify-center font-black">
                                    03
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                    Level-to-Level Fuel Policy
                                </h2>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                                Tripdhara operates on a 100% fair <strong>Level-to-Level Fuel Policy</strong>. The vehicle is provided with a recorded quantity of fuel (digitally documented on your Handover Inspection Sheet). The renter must return the vehicle at the exact same fuel level:
                            </p>
                            <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-600">
                                <li>No refund or credit is issued for fuel returned in excess of the handover level.</li>
                                <li>If returned below the initial fuel level, fuel replenishment charges will be calculated at current retail market price plus an administrative refueling surcharge of ₹150.</li>
                            </ul>
                        </section>

                        {/* Section 4 */}
                        <section id="rental-speed" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary-100/70 text-primary-700 flex items-center justify-center font-black">
                                    04
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                    Speed Limits, Prohibited Zones &amp; Geo-Fencing
                                </h2>
                            </div>
                            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-sm text-rose-950 space-y-2 mb-4">
                                <p><strong>Mandatory Speed Limit:</strong> High-altitude mountain ghats in Uttarakhand have a statutory police speed limit of <strong>40 km/h to 50 km/h</strong>. On open plains (e.g. Dehradun–Haridwar Highway), speed limit is 70 km/h.</p>
                                <p><strong>Section 185 MVA Zero Tolerance:</strong> Driving under the influence of alcohol or narcotics triggers immediate police impoundment, complete forfeiture of security deposit, and legal prosecution.</p>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Stunt drifting on dry riverbeds, driving into non-designated national park buffer zones, or crossing international border check-posts without official Inner Line Permits (ILP) is strictly prohibited.
                            </p>
                        </section>

                        {/* Section 5 */}
                        <section id="rental-damages" className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/30">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary-100/70 text-primary-700 flex items-center justify-center font-black">
                                    05
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-display">
                                    Damage Appraisal &amp; Traffic e-Challan Settle
                                </h2>
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                                • <strong>Joint Inspection:</strong> Prior to key handover, high-definition photographs and digital checklists record existing scratches, mirror condition, and tire tread. The same check is repeated upon return.<br/>
                                • <strong>Traffic Challans:</strong> Before refunding the security deposit, our fleet hub verifies the Uttarakhand Police Parivahan e-Challan portal. Any unpaid traffic violations incurred during the rental window will be deducted directly from the deposit with an official challan receipt provided.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}

