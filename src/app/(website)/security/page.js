import Link from 'next/link';
import connectDB from '@/core/Config/db.js';
import { getPolicyBy } from '@/core/Helpers/queryHelpers.js';
import { sanitizeHTML } from '@/core/Helpers/security.js';
import {
    ShieldCheck,
    Lock,
    Server,
    KeyRound,
    CreditCard,
    FileCheck2,
    Calendar,
    Phone,
    Mail,
    MapPin,
    ChevronRight,
    AlertCircle,
    CheckCircle2,
    Bug,
    EyeOff,
    Terminal,
    Activity,
    Cpu,
    Layers,
    FileText,
    ArrowRight
} from 'lucide-react';

export const metadata = {
    title: 'Platform Security & Data Trust Center - End-to-End Encryption | Tripdhara',
    description: 'Official Security Policy of Tripdhara: TLS 1.3 encryption, private Cloudflare R2 presigned document protection, PCI-DSS Level 1 payment compliance, and CERT-In aligned vulnerability disclosure.',
    keywords: [
        'Tripdhara Security Policy',
        'Data Security Himalayas Tourism',
        'Inner Line Permit Document Protection',
        'Cloudflare R2 Ephemeral Storage Security',
        'PCI DSS Payment Security Uttarakhand',
        'Tripdhara Vulnerability Disclosure'
    ],
    openGraph: {
        title: 'Platform Security & Trust Center | Tripdhara',
        description: 'Bank-grade 256-bit encryption, ephemeral presigned KYC storage, tokenized payments, and zero-trust infrastructure.',
        url: 'https://tripdhara.com/security',
        siteName: 'Tripdhara',
        type: 'website',
    },
    alternates: {
        canonical: '/security',
    }
};

export default async function SecurityPage() {
    let policy = null;
    try {
        await connectDB();
        policy = await getPolicyBy({ target: 'admin', type: 'security_policy' });
    } catch {
        // Fallback to static statutory policy
    }

    const lastUpdated = policy?.updatedAt
        ? new Date(policy.updatedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
        : 'November 2026';

    const tocItems = [
        { id: 'sec-encryption', title: '1. Encryption & Data in Transit', icon: Lock },
        { id: 'sec-infrastructure', title: '2. Cloud Infrastructure & Storage', icon: Server },
        { id: 'sec-payments', title: '3. Payment & Transaction Security', icon: CreditCard },
        { id: 'sec-kyc', title: '4. Govt KYC & Document Safety', icon: FileCheck2 },
        { id: 'sec-access', title: '5. Identity, Access & Sessions', icon: KeyRound },
        { id: 'sec-application', title: '6. App Security & DevSecOps', icon: Terminal },
        { id: 'sec-vulnerability', title: '7. Vulnerability Disclosure & Bounty', icon: Bug },
        { id: 'sec-incident', title: '8. Threat Monitoring & Disaster Recovery', icon: Activity },
        { id: 'sec-contact', title: '9. Security Desk & Reporting Channels', icon: ShieldCheck }
    ];

    const securityStats = [
        { label: 'Transport Security', val: 'TLS 1.3 / HSTS', icon: Lock, desc: 'Enforced 256-bit encryption' },
        { label: 'Document Storage', val: 'Ephemeral Presigned', icon: EyeOff, desc: 'Zero public bucket exposure' },
        { label: 'Payment Compliance', val: 'PCI-DSS Level 1', icon: CreditCard, desc: 'Zero card data retention' },
        { label: 'Access Architecture', val: 'Zero-Trust RBAC', icon: KeyRound, desc: 'HttpOnly SameSite cookies' },
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
                        name: 'Tripdhara Security & Trust Center',
                        description: 'Official platform security policies, encryption protocols, document handling, and vulnerability disclosure standards.',
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
                            CERT-In Aligned &bull; DPDP Act 2023 Compliant &bull; Zero-Trust
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-4 font-display">
                        Platform Security &amp; Trust Center
                    </h1>
                    <div className="flex flex-wrap items-center justify-center gap-3 text-sm md:text-base text-gray-400 font-medium">
                        <span className="inline-flex items-center text-gray-300">
                            <Calendar className="w-4 h-4 mr-1.5 text-primary-400" />
                            Last Revised: {lastUpdated}
                        </span>
                        <span className="text-gray-600 hidden sm:inline">&bull;</span>
                        <span className="text-primary-300">
                            Safeguarding Himalayan Travelers, Vendors, and Border Permitting Data
                        </span>
                    </div>

                    {/* Security Snapshot Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-5xl mx-auto text-left">
                        {securityStats.map((stat, i) => {
                            const IconC = stat.icon;
                            return (
                                <div key={i} className="bg-gray-800/60 backdrop-blur-md border border-gray-700/60 rounded-2xl p-4 sm:p-5 shadow-lg">
                                    <div className="w-9 h-9 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center mb-3">
                                        <IconC className="w-5 h-5" />
                                    </div>
                                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</div>
                                    <div className="text-sm sm:text-base font-bold text-white mt-0.5">{stat.val}</div>
                                    <div className="text-xs text-gray-400 mt-1">{stat.desc}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </header>

            {/* Main Content Layout */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Sticky Sidebar Navigation */}
                    <aside className="hidden lg:block lg:col-span-4">
                        <div className="sticky top-28 bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-3xl p-6 shadow-xl shadow-gray-200/30">
                            <div className="flex items-center space-x-2 text-xs font-black text-primary-800 uppercase tracking-widest mb-5">
                                <span className="w-2.5 h-2.5 rounded-full bg-primary-600 animate-pulse"></span>
                                <span>Security Directives</span>
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

                            {/* Security Operations Center Card */}
                            <div className="mt-6 pt-5 border-t border-gray-100">
                                <div className="bg-primary-50/80 rounded-2xl p-4 border border-primary-100">
                                    <div className="flex items-center space-x-2 text-xs font-bold text-primary-900 mb-1">
                                        <ShieldCheck className="w-4 h-4 text-primary-600" />
                                        <span>Security &amp; Vulnerability Desk</span>
                                    </div>
                                    <p className="text-xs text-gray-600 mb-3">Report vulnerabilities or suspicious activity directly to our Security Operations Center.</p>
                                    <a
                                        href="mailto:security@tripdhara.com"
                                        className="inline-flex items-center justify-center w-full py-2 px-3 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-colors mb-2"
                                    >
                                        <Mail className="w-3.5 h-3.5 mr-1.5" />
                                        security@tripdhara.com
                                    </a>
                                    <a
                                        href="tel:+917017288052"
                                        className="inline-flex items-center justify-center w-full py-2 px-3 text-xs font-semibold text-primary-800 bg-white border border-primary-200 hover:bg-primary-100/60 rounded-lg shadow-2xs transition-colors"
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
                                    <section id="sec-encryption" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <Lock className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                1. Cryptographic Architecture &amp; Data in Transit
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            At <strong>Tripdhara</strong>, protecting our travelers, homestay hosts, adventure operators, and fleet partners is fundamental to our mission. All network communications across the Tripdhara ecosystem—including web portals, customer apps, vendor dashboards, and server-to-server microservices—are shielded by state-of-the-art cryptographic standards.
                                        </p>
                                        <div className="space-y-3 text-sm text-gray-700 mb-6">
                                            <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <div>
                                                    <strong className="text-gray-900 block">Mandatory TLS 1.3 with Perfect Forward Secrecy (PFS):</strong>
                                                    All traffic is routed over Transport Layer Security (TLS 1.3 / TLS 1.2 minimum). Legacy protocols (SSLv3, TLS 1.0, and TLS 1.1) and insecure ciphers are disabled platform-wide.
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <div>
                                                    <strong className="text-gray-900 block">Strict Transport Security (HSTS Preload):</strong>
                                                    Our web domains broadcast HTTP Strict Transport Security headers (<code className="text-xs bg-gray-200 px-1.5 py-0.5 rounded text-gray-800">max-age=31536000; includeSubDomains; preload</code>) ensuring browsers never downgrade to unencrypted HTTP.
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <div>
                                                    <strong className="text-gray-900 block">Data-at-Rest Encryption (AES-256):</strong>
                                                    All underlying databases, Redis cache instances, search indexes, and server disk snapshots are encrypted with hardware-accelerated AES-256 bit keys managed under strict key-rotation policies.
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 2 */}
                                    <section id="sec-infrastructure" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <Server className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                2. Cloud Infrastructure &amp; Isolated Document Storage
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            Tripdhara utilizes a zero-trust multi-cloud infrastructure designed to deliver maximum resilience across mountainous network conditions while preventing unauthorized access to sensitive tourist compliance data.
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div className="bg-primary-50/50 p-5 rounded-2xl border border-primary-100">
                                                <div className="flex items-center space-x-2 text-primary-900 font-bold text-sm mb-2">
                                                    <EyeOff className="w-4 h-4 text-primary-700" />
                                                    <span>Zero Public Bucket Exposure</span>
                                                </div>
                                                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                                                    Document uploads (such as Aadhaar cards, Driver&apos;s Licenses, Inner Line Permits, Vehicle RCs, and Vendor PANs) are stored in private Cloudflare R2 / AWS S3 buckets. Direct public enumeration and search engine crawlers are strictly blocked by bucket policies.
                                                </p>
                                            </div>
                                            <div className="bg-primary-50/50 p-5 rounded-2xl border border-primary-100">
                                                <div className="flex items-center space-x-2 text-primary-900 font-bold text-sm mb-2">
                                                    <KeyRound className="w-4 h-4 text-primary-700" />
                                                    <span>Ephemeral Presigned Uploads &amp; Access</span>
                                                </div>
                                                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                                                    File uploads and review sessions utilize cryptographically signed ephemeral URLs with a maximum 15-minute time-to-live (TTL). Once expired, the link becomes permanently invalid, eliminating persistent URL leakage risks.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/70 text-xs sm:text-sm text-gray-600">
                                            <strong>DDoS Mitigation &amp; Edge Protection:</strong> Automated Cloudflare WAF guards our edge against Layer 3/4 volumetric DDoS attacks, automated scraping bots, brute-force form flooding, and Layer 7 malicious HTTP payload injection.
                                        </div>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 3 */}
                                    <section id="sec-payments" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <CreditCard className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                3. Payment Security &amp; Zero Card Data Retention
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            Tripdhara enforces strict <strong>zero card data retention</strong> policies in compliance with Reserve Bank of India (RBI) tokenization directives and the Payment Card Industry Data Security Standard (PCI-DSS).
                                        </p>
                                        <ul className="space-y-3 text-sm text-gray-700 mb-6">
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <div>
                                                    <strong className="text-gray-900 block">PCI-DSS Level 1 Certified Gateways:</strong>
                                                    All digital transactions (UPI, Credit/Debit Cards, NetBanking, and Wallets) are processed exclusively through certified gateway partners (Razorpay / Cashfree). Raw card credentials never traverse or touch Tripdhara web servers.
                                                </div>
                                            </li>
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <div>
                                                    <strong className="text-gray-900 block">Cryptographic Webhook Verification (HMAC-SHA256):</strong>
                                                    Payment success callbacks and settlement signals are cryptographically authenticated using SHA-256 secret keys before confirming bookings, preventing spoofed transactions.
                                                </div>
                                            </li>
                                            <li className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <div>
                                                    <strong className="text-gray-900 block">No Storage of Sensitive Authentication Data (SAD):</strong>
                                                    Tripdhara strictly does not capture, store, or log card verification values (CVV), PINs, or banking passwords under any circumstance.
                                                </div>
                                            </li>
                                        </ul>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 4 */}
                                    <section id="sec-kyc" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <FileCheck2 className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                4. Government KYC &amp; Border Permit Document Protection
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            Operating in sensitive Himalayan frontiers (including Uttarkashi, Chamoli, Pithoragarh, and border valleys like Niti, Mana, and Milam) requires statutory compliance with Ministry of Home Affairs (MHA) Inner Line Permit (ILP) guidelines and local administration Form-C guest reporting.
                                        </p>
                                        <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-5 mb-6 text-sm text-amber-900">
                                            <div className="flex items-center space-x-2 font-bold mb-1 text-amber-950">
                                                <AlertCircle className="w-4 h-4 text-amber-700" />
                                                <span>Aadhaar Masking &amp; Statutory Handling</span>
                                            </div>
                                            In accordance with UIDAI regulations and the DPDP Act 2023, travelers are instructed to upload masked Aadhaar cards (showing only the last 4 digits). In the event full identity records are provided for district administration border permits, they are placed in access-restricted, encrypted storage with an automatic archival schedule.
                                        </div>
                                        <div className="space-y-3 text-sm text-gray-700">
                                            <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <div>
                                                    <strong className="text-gray-900 block">Immutable Verification Audit Trails:</strong>
                                                    Every administrative view, download, or verification of vendor business documents (GST certificates, FSSAI permits, Homestay registration certificates) is logged with timestamp, user ID, and IP address.
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <div>
                                                    <strong className="text-gray-900 block">No Unauthorized Commercial Sharing:</strong>
                                                    Tourist identification documents are shared strictly with competent government authorities (Uttarakhand Tourism Development Board, SDM Border Offices, and Local Police Verification Desks) solely for regulatory permit processing.
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 5 */}
                                    <section id="sec-access" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <KeyRound className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                5. Identity, Access Control &amp; Session Defense
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            Tripdhara enforces strict Role-Based Access Control (RBAC) to ensure that users, vendors, and staff have access only to the minimal resources necessary to perform their legitimate roles (Principle of Least Privilege).
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div className="border border-gray-200 rounded-2xl p-5 bg-white">
                                                <div className="text-xs font-bold text-primary-700 uppercase tracking-wider mb-1">Defense-in-Depth</div>
                                                <h3 className="font-bold text-gray-900 text-sm mb-2">HttpOnly &amp; SameSite Cookies</h3>
                                                <p className="text-xs sm:text-sm text-gray-600">
                                                    Session tokens are stored exclusively in <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">HttpOnly</code>, <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">Secure</code>, <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">SameSite=Lax/Strict</code> cookies, completely mitigating Cross-Site Scripting (XSS) token theft.
                                                </p>
                                            </div>
                                            <div className="border border-gray-200 rounded-2xl p-5 bg-white">
                                                <div className="text-xs font-bold text-primary-700 uppercase tracking-wider mb-1">Privilege Separation</div>
                                                <h3 className="font-bold text-gray-900 text-sm mb-2">Granular Role Validation</h3>
                                                <p className="text-xs sm:text-sm text-gray-600">
                                                    Middleware dynamically enforces distinct authentication tiers (<code className="text-xs bg-gray-100 px-1 py-0.5 rounded">traveller</code>, <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">vendor</code>, <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">admin</code>, <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">super_admin</code>), preventing horizontal and vertical privilege escalation.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-3 text-sm text-gray-700">
                                            <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <div>
                                                    <strong className="text-gray-900 block">Rate-Limited Authentication Endpoints:</strong>
                                                    Login, OTP dispatch, password reset, and registration endpoints are protected with strict sliding-window rate limiters to prevent credential stuffing and brute-force attacks.
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                                                <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                                                <div>
                                                    <strong className="text-gray-900 block">Instant Session Revocation:</strong>
                                                    Password resets, account deactivations, or privilege modifications immediately invalidate active refresh tokens across all customer devices.
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 6 */}
                                    <section id="sec-application" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <Terminal className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                6. Application Security, Input Sanitization &amp; DevSecOps
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            Tripdhara follows a comprehensive Secure Software Development Lifecycle (SSDLC). We incorporate defensive programming patterns across backend APIs and frontend UI components.
                                        </p>
                                        <div className="space-y-4 mb-6">
                                            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                                                <h3 className="font-bold text-gray-900 text-sm mb-1.5 flex items-center space-x-2">
                                                    <Layers className="w-4 h-4 text-primary-600" />
                                                    <span>NoSQL Injection &amp; Query Sanitization</span>
                                                </h3>
                                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                                    All API request payloads are sanitized recursively via <code className="text-xs bg-gray-200 px-1 py-0.5 rounded">sanitizeNoSQL</code> routines to strip dollar-prefixed operators (<code className="text-xs bg-gray-200 px-1 py-0.5 rounded">$gt</code>, <code className="text-xs bg-gray-200 px-1 py-0.5 rounded">$where</code>, <code className="text-xs bg-gray-200 px-1 py-0.5 rounded">$ne</code>), ensuring queries are strictly parameterized under Mongoose ODM schemas.
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                                                <h3 className="font-bold text-gray-900 text-sm mb-1.5 flex items-center space-x-2">
                                                    <Cpu className="w-4 h-4 text-primary-600" />
                                                    <span>XSS Neutralization &amp; Allowlist Sanitization</span>
                                                </h3>
                                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                                    Rich HTML content from policy managers is filtered through an allowlist-based sanitizer (<code className="text-xs bg-gray-200 px-1 py-0.5 rounded">sanitizeHTML</code>) that recursively strips executable tags (<code className="text-xs bg-gray-200 px-1 py-0.5 rounded">&lt;script&gt;</code>, <code className="text-xs bg-gray-200 px-1 py-0.5 rounded">&lt;iframe&gt;</code>, <code className="text-xs bg-gray-200 px-1 py-0.5 rounded">&lt;object&gt;</code>) and dangerous event handlers (<code className="text-xs bg-gray-200 px-1 py-0.5 rounded">onload</code>, <code className="text-xs bg-gray-200 px-1 py-0.5 rounded">onerror</code>).
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                                                <h3 className="font-bold text-gray-900 text-sm mb-1.5 flex items-center space-x-2">
                                                    <ShieldCheck className="w-4 h-4 text-primary-600" />
                                                    <span>Continuous Automated Dependency Audits</span>
                                                </h3>
                                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                                    All open-source dependencies are monitored continuously using automated vulnerability scanning (npm audit &amp; CI/CD security linters) to catch and remediate CVEs prior to production deployments.
                                                </p>
                                            </div>
                                        </div>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 7 */}
                                    <section id="sec-vulnerability" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <Bug className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                7. Vulnerability Disclosure Policy &amp; Safe Harbor
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            Tripdhara values the vital contributions of independent security researchers and ethical hackers worldwide. If you believe you have discovered a security flaw, vulnerability, or exposure in our systems, we encourage you to report it responsibly.
                                        </p>
                                        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-5 mb-6 text-sm text-emerald-950">
                                            <strong className="block text-emerald-900 font-bold mb-1">Safe Harbor Commitment:</strong>
                                            Tripdhara pledges that it will not initiate legal action against or involve law enforcement against researchers who discover and report vulnerabilities in compliance with our Responsible Disclosure Guidelines, conducted in good faith.
                                        </div>
                                        <div className="space-y-4 mb-6">
                                            <h3 className="font-bold text-gray-900 text-base">Guidelines for Responsible Research:</h3>
                                            <ul className="space-y-2.5 text-sm text-gray-700">
                                                <li className="flex items-start space-x-2">
                                                    <span className="text-primary-600 font-bold">&bull;</span>
                                                    <span><strong>Do Not Degrade User Experience:</strong> Never perform Denial of Service (DoS/DDoS) attacks, automated high-rate fuzzing, or spamming of production booking forms.</span>
                                                </li>
                                                <li className="flex items-start space-x-2">
                                                    <span className="text-primary-600 font-bold">&bull;</span>
                                                    <span><strong>Do Not Violate Privacy:</strong> Do not access, view, modify, or download personal data of other travelers or vendors. Use your own test accounts only.</span>
                                                </li>
                                                <li className="flex items-start space-x-2">
                                                    <span className="text-primary-600 font-bold">&bull;</span>
                                                    <span><strong>Do Not Extort or Demand Payment:</strong> Bug reports submitted with extortion threats or public disclosure ultimatums violate safe harbor protections.</span>
                                                </li>
                                                <li className="flex items-start space-x-2">
                                                    <span className="text-primary-600 font-bold">&bull;</span>
                                                    <span><strong>Give Adequate Remediation Time:</strong> Maintain confidentiality and allow our engineering team at least 30 to 60 days to patch verified issues before any public disclosure.</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl">
                                            <div className="flex items-center space-x-3 mb-3">
                                                <Mail className="w-5 h-5 text-primary-400" />
                                                <h4 className="font-bold text-base text-white">How to Submit a Security Report</h4>
                                            </div>
                                            <p className="text-xs sm:text-sm text-gray-300 mb-4 leading-relaxed">
                                                Send your detailed vulnerability report, including reproducible steps, HTTP requests, impacted endpoints, and proof-of-concept (PoC) scripts or screenshots, directly to:
                                            </p>
                                            <a
                                                href="mailto:security@tripdhara.com"
                                                className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors shadow-sm"
                                            >
                                                <span>security@tripdhara.com</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </a>
                                            <div className="text-xs text-gray-400 mt-3">
                                                Response SLA: Initial receipt acknowledgment within 48 hours; triage evaluation within 5 business days.
                                            </div>
                                        </div>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 8 */}
                                    <section id="sec-incident" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <Activity className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                8. Real-time Threat Monitoring &amp; Disaster Recovery
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            Continuous threat visibility enables our Security Operations Center to identify and neutralize anomalous behavior before it impacts customer bookings or vendor payouts.
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                                                <h3 className="font-bold text-gray-900 text-sm mb-1.5">24/7 Anomaly &amp; Log Monitoring</h3>
                                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                                    Centralized structured logging with Pino and security telemetry tracks failed logins, permission violations, abnormal request volumes, and administrative privilege grants in real time.
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                                                <h3 className="font-bold text-gray-900 text-sm mb-1.5">Geographically Isolated Backups</h3>
                                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                                    Databases are snapshot daily and encrypted with off-site replication across independent cloud availability zones, ensuring zero data loss during localized disasters.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="bg-primary-50/70 p-4 rounded-xl border border-primary-100 text-xs sm:text-sm text-primary-950">
                                            <strong>Disaster Recovery Service Level Objectives:</strong> Our incident recovery framework targets a Recovery Time Objective (RTO) of less than 4 hours and a Recovery Point Objective (RPO) of less than 1 hour for all critical traveler databases.
                                        </div>
                                    </section>

                                    <hr className="border-gray-100" />

                                    {/* Section 9 */}
                                    <section id="sec-contact" className="scroll-mt-32">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700">
                                                <ShieldCheck className="w-5 h-5" />
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                                9. Security Desk, Incident Escalation &amp; Legal Notices
                                            </h2>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-6">
                                            For security inquiries, audit verifications, data access revocation under the DPDP Act 2023, or urgent incident escalations, contact the Tripdhara Security and Compliance Directorate:
                                        </p>
                                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Security Operations Center</span>
                                                    <a href="mailto:security@tripdhara.com" className="font-semibold text-primary-600 hover:text-primary-700 flex items-center mt-1">
                                                        <Mail className="w-4 h-4 mr-1.5" />
                                                        security@tripdhara.com
                                                    </a>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Data Protection Officer (DPO)</span>
                                                    <a href="mailto:dpo@tripdhara.com" className="font-semibold text-primary-600 hover:text-primary-700 flex items-center mt-1">
                                                        <Mail className="w-4 h-4 mr-1.5" />
                                                        dpo@tripdhara.com
                                                    </a>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Security Escalation Helpline</span>
                                                    <a href="tel:+917017288052" className="font-semibold text-gray-800 hover:text-primary-600 flex items-center mt-1">
                                                        <Phone className="w-4 h-4 mr-1.5" />
                                                        +91 70172 88052
                                                    </a>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block">Registered Security Operations Office</span>
                                                    <p className="text-gray-700 font-medium flex items-start mt-1">
                                                        <MapPin className="w-4 h-4 mr-1.5 shrink-0 text-primary-600 mt-0.5" />
                                                        Tripdhara Technologies, Dehradun Road, Rishikesh, Uttarakhand - 249201, India
                                                    </p>
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
