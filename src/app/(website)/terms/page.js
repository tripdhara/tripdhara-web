import Link from 'next/link';
import connectDB from '@/core/Config/db.js';
import { getPolicyBy } from '@/core/Helpers/queryHelpers.js';
import { sanitizeHTML } from '@/core/Helpers/security.js';
import {
    FileText,
    IdCard,
    Bike,
    Car,
    Home,
    Compass,
    CreditCard,
    CloudRain,
    Scale,
    UserCheck,
    ChevronRight,
    CheckCircle2,
    Calendar,
    Phone,
    Mail,
    MapPin,
    AlertTriangle
} from 'lucide-react';

export const metadata = {
    title: 'Terms & Conditions - Indian Govt Compliant | Tripdhara',
    description: 'Tripdhara Terms & Conditions in strict compliance with the Motor Vehicles Act 1988, Consumer Protection Act 2019, IT Act 2000, and Uttarakhand Tourism Regulations.',
    keywords: [
        'Tripdhara Terms and Conditions',
        'Motor Vehicles Act Bike Rental Rules',
        'Inner Line Permit Guidelines Uttarakhand',
        'Himalayan Travel Safety Agreements'
    ],
    openGraph: {
        title: 'Terms & Conditions | Tripdhara',
        description: 'Statutory travel agreements, vehicle rental obligations, and mountain safety regulations.',
        url: 'https://tripdhara.com/terms',
        siteName: 'Tripdhara',
        type: 'website',
    },
    alternates: {
        canonical: '/terms',
    }
};

export default async function TermsAndConditionsPage() {
    let policy = null;
    try {
        await connectDB();
        policy = await getPolicyBy({ target: 'admin', type: 'terms_conditions' });
    } catch {
        // Fallback to static statutory policy if database record is unavailable
    }

    const lastUpdated = policy?.updatedAt
        ? new Date(policy.updatedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
        : 'September 2026';

    const tocItems = [
        { id: 'sec-preamble', title: '1. Preamble & Regulations', icon: FileText },
        { id: 'sec-identity', title: '2. Identity & Border Permits', icon: IdCard },
        { id: 'sec-rentals', title: '3. Vehicle Rentals (MVA 1988)', icon: Bike },
        { id: 'sec-chauffeur', title: '4. Chauffeur Safety & Rules', icon: Car },
        { id: 'sec-accommodation', title: '5. Stays & Form-C Rules', icon: Home },
        { id: 'sec-adventure', title: '6. Adventure Tourism Safety', icon: Compass },
        { id: 'sec-gst', title: '7. Pricing & GST Compliance', icon: CreditCard },
        { id: 'sec-force-majeure', title: '8. Force Majeure & Weather', icon: CloudRain },
        { id: 'sec-jurisdiction', title: '9. Law & Arbitration', icon: Scale },
        { id: 'sec-grievance', title: '10. Grievance Officer', icon: UserCheck },
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
                        name: 'Terms & Conditions',
                        description: 'Official statutory terms and booking conditions under Indian Law and Tourism Regulations.',
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
                        <FileText className="w-4 h-4 text-primary-400 mr-2" />
                        <span className="text-xs sm:text-sm font-semibold text-primary-200 tracking-wide uppercase">
                            Indian Govt &amp; Tourism Statutory Framework
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-4 font-display">
                        Terms &amp; Conditions
                    </h1>
                    <div className="flex flex-wrap items-center justify-center gap-3 text-sm md:text-base text-gray-400 font-medium">
                        <span className="inline-flex items-center text-gray-300">
                            <Calendar className="w-4 h-4 mr-1.5 text-primary-400" />
                            Last Revised: {lastUpdated}
                        </span>
                        <span className="text-gray-600 hidden sm:inline">•</span>
                        <span className="text-primary-300">
                            Compliant with Consumer Protection Act 2019 &amp; MVA 1988
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
                                            className="flex items-center justify-between p-2.5 rounded-xl text-gray-600 hover:text-primary-900 hover:bg-primary-50/70 transition-all group font-medium text-xs sm:text-sm"
                                        >
                                            <div className="flex items-center space-x-2.5">
                                                <IconComponent className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors shrink-0" />
                                                <span className="truncate">{item.title}</span>
                                            </div>
                                            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transform -translate-x-1 group-hover:translate-x-0 transition-all text-primary-600 shrink-0" />
                                        </a>
                                    );
                                })}
                            </nav>

                            {/* Legal Desk Card */}
                            <div className="mt-6 pt-5 border-t border-gray-100">
                                <div className="bg-primary-50/80 rounded-2xl p-4 border border-primary-100">
                                    <div className="text-xs font-bold text-primary-900 mb-1">Legal &amp; Compliance Cell</div>
                                    <p className="text-xs text-gray-600 mb-3">Statutory grievances addressed under Consumer Protection Rules 2020.</p>
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
                                    <section id="sec-preamble" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                1. Statutory Preamble &amp; Regulatory Framework
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            Welcome to <strong>Tripdhara</strong>. These Terms and Conditions govern all travel services, vehicle rentals, homestay reservations, and adventure packages arranged by Tripdhara across Uttarakhand, Himachal Pradesh, and adjacent Himalayan regions.
                                        </p>
                                        <p className="text-gray-600 leading-relaxed">
                                            This document constitutes an electronic record under the <strong>Information Technology Act, 2000</strong> and rules made thereunder, including the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>. By accessing our platform, sending an inquiry, or executing a booking via WhatsApp or web forms, you unconditionally accept and agree to be bound by these statutory terms.
                                        </p>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 2 */}
                                    <section id="sec-identity" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <IdCard className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                2. User Identity, Verification &amp; Inner Line Permits (ILP)
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            In accordance with regional security directives issued by the Ministry of Home Affairs (MHA) and local District Magistrates in Uttarakhand and Himachal Pradesh:
                                        </p>
                                        <ul className="space-y-3 text-sm text-gray-700 mb-6">
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Indian Citizens:</strong> Must produce a valid, original Government-issued Photo ID (Aadhaar Card, Passport, Voter ID, or Driving License) prior to check-in or vehicle handover. PAN card is accepted for tax identification but not as proof of address.</span>
                                            </li>
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Foreign Nationals &amp; NRIs:</strong> Must present a valid Passport along with an active Indian Tourist Visa or e-Visa. As per Ministry of External Affairs regulations, Form C registration will be processed upon check-in.</span>
                                            </li>
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Inner Line Permits (ILP) &amp; Protected Area Permits (PAP):</strong> Travelers entering restricted border sectors (such as Niti Valley, Mana, Harsil, Nelang Valley, Spiti Valley, or Kinnaur) must provide identity documents at least <strong>72 hours in advance</strong> to facilitate Sub-Divisional Magistrate (SDM) permit issuance.</span>
                                            </li>
                                        </ul>
                                        <div className="bg-primary-50 border border-primary-200 rounded-2xl p-5 text-primary-950">
                                            <div className="flex items-start space-x-3">
                                                <AlertTriangle className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <div>
                                                    <h3 className="font-bold text-sm text-primary-900 mb-1">
                                                        Mandatory Checkpoint Requirement
                                                    </h3>
                                                    <p className="text-xs sm:text-sm text-primary-900/90 leading-relaxed">
                                                        Physical printouts of Aadhaar/Passport are strictly required at Indian Army checkpoints along high-altitude border transit routes.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 3 */}
                                    <section id="sec-rentals" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <Bike className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                3. Self-Drive Vehicle Rentals (Motor Vehicles Act, 1988)
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            All self-drive cars and motorcycles operate under the <strong>Rent a Cab Scheme 1989</strong> and <strong>Rent a Motorcycle Scheme 1997</strong>:
                                        </p>
                                        <ul className="space-y-3 text-sm text-gray-700 mb-6">
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Driving License Eligibility:</strong> The hirer must possess a valid, original Driving License (LMV for cars, 2-Wheeler with gear for motorcycles) held for a minimum of 12 months. Foreign nationals must hold an International Driving Permit (IDP).</span>
                                            </li>
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Mandatory Helmet &amp; Safety Gear (Section 129 MVA):</strong> Riders and pillions must wear ISI/ECE certified helmets at all times on public roads. Riding without protective gear is grounds for immediate contract cancellation.</span>
                                            </li>
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Drunk Driving &amp; Controlled Substances (Section 185 MVA):</strong> Operating any rented vehicle under the influence of alcohol or narcotics is strictly illegal. The offender will be turned over to local police authorities, forfeit deposit, and bear 100% financial liability.</span>
                                            </li>
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Security Deposit &amp; Refund SLA:</strong> A refundable security deposit is collected prior to vehicle dispatch. Deposit refunds are initiated within <strong>24 hours</strong> of vehicle return, subject to vehicle condition inspection and deduction for unpaid challans.</span>
                                            </li>
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Prohibited Terrain:</strong> Vehicles are strictly forbidden from off-roading in riverbeds, wildlife sanctuaries, protected forest zones, or frozen lakes. Damage caused in prohibited zones voids insurance.</span>
                                            </li>
                                        </ul>
                                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-amber-950">
                                            <div className="flex items-start space-x-3">
                                                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                                <div>
                                                    <h3 className="font-bold text-sm text-amber-900 mb-1">
                                                        Traffic Violations &amp; E-Challans
                                                    </h3>
                                                    <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
                                                        E-Challans issued by State Traffic Police or Automated Speed Cameras during the rental tenure are the sole legal responsibility of the registered hirer.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 4 */}
                                    <section id="sec-chauffeur" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <Car className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                4. Chauffeur-Driven Tourist Vehicles &amp; Passenger Regulations
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            Chauffeur-driven vehicles (Fortuner, Innova Crysta, Scorpio, Ertiga, Tempo Traveller) hold valid Commercial All India Tourist Permits (AITP) and third-party insurance under Section 146 of the Motor Vehicles Act, 1988:
                                        </p>
                                        <ul className="space-y-3 text-sm text-gray-700">
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Mountain Driver Duty Limits:</strong> To prevent driver fatigue on winding terrain, driver shifts are restricted to <strong>12 hours maximum per day</strong>, ending by 8:00 PM unless navigating emergency detours.</span>
                                            </li>
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Seating Capacity Adherence:</strong> Overcrowding beyond the registered seating capacity stated in the vehicle R.C. is strictly prohibited by Regional Transport Office (RTO) norms.</span>
                                            </li>
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Passenger Conduct:</strong> Passengers must wear seatbelts (front and rear where available) as mandated by Section 194B of the MVA. Smoking or consuming alcohol inside commercial vehicles is strictly prohibited.</span>
                                            </li>
                                        </ul>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 5 */}
                                    <section id="sec-accommodation" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <Home className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                5. Accommodation, Homestays &amp; Form-C Compliance
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            All homestays, wooden luxury cottages, and valley resorts partner directly with Tripdhara under Uttarakhand &amp; Himachal Pradesh Tourism Development Board standards:
                                        </p>
                                        <ul className="space-y-3 text-sm text-gray-700">
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Standard Timings:</strong> Standard check-in is 12:00 PM and check-out is 10:00 AM unless specified otherwise. Early check-in or late check-out is subject to room availability and property tariffs.</span>
                                            </li>
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Bureau of Immigration Form-C:</strong> Foreign guests must facilitate Form-C submission by providing passport and visa scans immediately upon arrival.</span>
                                            </li>
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Eco-Sensitive Zone Rules:</strong> Guests must respect quiet hours (10:00 PM to 6:00 AM) in forest-adjacent stays and strictly avoid littering plastics in fragile alpine ecosystems.</span>
                                            </li>
                                        </ul>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 6 */}
                                    <section id="sec-adventure" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <Compass className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                6. Outdoor Adventure Tourism Rules &amp; Medical Waivers
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            Adventure activities (White-Water Rafting in Rishikesh, Tandem Paragliding in Bir Billing, High-Altitude Trekking in Kedarkantha/Valley of Flowers) adhere strictly to Uttarakhand Adventure Tourism Rules:
                                        </p>
                                        <ul className="space-y-3 text-sm text-gray-700">
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Medical Self-Declaration:</strong> Participants must disclose pre-existing medical conditions (heart ailments, epilepsy, severe asthma, recent surgery, or pregnancy). Instructors reserve the right to decline participation for safety.</span>
                                            </li>
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Safety Gear Compliance:</strong> Life jackets, helmets, harnesses, and carabiners must remain securely fastened throughout the activity.</span>
                                            </li>
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Weather Cancellations:</strong> If river water discharge exceeds dangerous levels or wind velocity is unsuitable for flight, activities will be postponed or refunded under safety guidelines.</span>
                                            </li>
                                        </ul>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 7 */}
                                    <section id="sec-gst" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <CreditCard className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                7. Pricing, Payment Terms &amp; GST Compliance
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            In accordance with the Central Goods and Services Tax (CGST) and State GST (SGST) Acts:
                                        </p>
                                        <ul className="space-y-3 text-sm text-gray-700">
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Tax Invoicing:</strong> All bookings are subject to applicable GST slabs (5% for passenger transport, 12%/18% for hotel stays/rentals). Tax invoices are issued upon final settlement.</span>
                                            </li>
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Advance Booking Deposit:</strong> A minimum advance deposit (25% to 50%) is required to lock dates. The remaining balance is payable upon arrival before service commencement.</span>
                                            </li>
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>No Hidden Convenience Fees:</strong> In compliance with the Consumer Protection E-Commerce Rules 2020, all prices quoted on Tripdhara include clear breakdowns of taxes, driver allowances, and fuel charges.</span>
                                            </li>
                                        </ul>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 8 */}
                                    <section id="sec-force-majeure" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <CloudRain className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                8. Force Majeure &amp; Himalayan Disruption (Section 56, Contract Act 1872)
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            Tripdhara is not liable for itinerary disruptions, delays, or cancellations caused by <strong>Force Majeure</strong> events beyond reasonable control, including but not limited to: cloudbursts, severe landslides, unexpected snowfall, flash floods, road blockages by Border Roads Organisation (BRO) / PWD, strikes, or sudden Government/Army travel curfews under Section 56 of the Indian Contract Act, 1872.
                                        </p>
                                        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 text-emerald-950">
                                            <div className="flex items-start space-x-3">
                                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                                <div>
                                                    <h3 className="font-bold text-sm text-emerald-900 mb-1">
                                                        Rerouting Commitment
                                                    </h3>
                                                    <p className="text-xs sm:text-sm text-emerald-900/90 leading-relaxed">
                                                        In Force Majeure cases, Tripdhara will make every effort to arrange alternative safe transit or provide trip credit vouchers usable within <strong>12 months</strong>.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 9 */}
                                    <section id="sec-jurisdiction" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <Scale className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                9. Governing Law, Arbitration &amp; Legal Jurisdiction
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            These Terms and Conditions shall be governed by and construed in accordance with the laws of the <strong>Republic of India</strong>.
                                        </p>
                                        <ul className="space-y-3 text-sm text-gray-700">
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Arbitration:</strong> Any legal dispute or claim arising out of or in connection with these terms shall be settled through binding arbitration under the <strong>Arbitration and Conciliation Act, 1996</strong> by a sole arbitrator appointed mutually by Tripdhara and the user. The seat of arbitration shall be Dehradun, Uttarakhand.</span>
                                            </li>
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <span><strong>Exclusive Jurisdiction:</strong> Subject to arbitration provisions, the Courts at <strong>Dehradun, Uttarakhand, India</strong> shall have sole and exclusive jurisdiction over all legal proceedings.</span>
                                            </li>
                                        </ul>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 10 */}
                                    <section id="sec-grievance" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <UserCheck className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                10. Statutory Grievance Redressal Officer
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-6">
                                            In compliance with Rule 5(9) of the Consumer Protection (E-Commerce) Rules, 2020 and Information Technology Act guidelines, the details of our designated Grievance Officer are provided below:
                                        </p>

                                        <div className="bg-gray-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl shadow-gray-900/20">
                                            <div className="absolute top-0 right-0 w-48 h-48 bg-primary-600/10 rounded-bl-[4rem]"></div>
                                            <div className="relative z-10 grid sm:grid-cols-2 gap-6">
                                                <div>
                                                    <div className="text-xs font-bold text-primary-400 uppercase tracking-wider mb-2">Legal Compliance Cell</div>
                                                    <h3 className="text-xl font-bold text-white mb-2">Grievance Redressal Officer</h3>
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
                                                    <div className="text-xs text-gray-400 mb-1">Direct Helpline &amp; WhatsApp:</div>
                                                    <a
                                                        href="tel:+917017288052"
                                                        className="text-xl sm:text-2xl font-black text-primary-400 hover:text-primary-300 transition-colors"
                                                    >
                                                        +91 70172 88052
                                                    </a>
                                                    <span className="text-xs text-gray-400 mt-2 text-left sm:text-right">
                                                        Statutory SLA: Acknowledgment within 48 hours; resolution completed within 30 days
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
