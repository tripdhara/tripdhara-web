import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { 
    Calendar, ArrowLeft, ArrowRight, Tag, Compass, Share2, 
    Sparkles, Clock, MapPin, ShieldCheck, Mountain, 
    MessageCircle, Phone, CheckCircle2, ChevronRight, Eye, UserCheck
} from 'lucide-react';
import dbConnect from '@/core/Config/db.js';
import { getBlogBy, getBlogsBy } from '@/core/Helpers/queryHelpers.js';
import createMetadata from '@/core/Helpers/metadata.js';
import api from '@/core/Api/public/index.js';
import BlogContentRenderer, { extractHeadings } from './BlogContentRenderer.js';
import { 
    ReadingProgressBar, ShareToolbar, TableOfContents, ArticleFeedback 
} from './BlogClientWidgets.js';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tripdhara.in';

export async function generateMetadata({ params }) {
    const { slug } = await params;
    try {
        await dbConnect();
        const blog = await getBlogBy({ slug, status: 'published' }) || await getBlogBy({ slug });
        if (!blog) return createMetadata({ title: 'Guide Not Found', noIndex: true });

        return createMetadata({
            title: `${blog.title} - Himalayan Travel Guide | Tripdhara`,
            description: blog.excerpt || `Read ${blog.title} on Tripdhara. Authentic Himalayan field insights.`,
            image: blog.coverImage || '/img/background.png',
            path: `/blog/${blog.slug}`,
            keywords: blog.tags || ['Himalayan Guide', 'Tripdhara Blog', 'Uttarakhand Trek']
        });
    } catch {
        return createMetadata({ title: 'Travel Guide', noIndex: true });
    }
}

export default async function BlogPostPage({ params }) {
    const { slug } = await params;

    let blog = null;
    let relatedBlogs = [];
    let suggestedPackages = [];

    try {
        await dbConnect();
        // Fetch current blog (prefer published, fallback to any in dev/preview)
        const raw = await getBlogBy({ slug, status: 'published' }) || await getBlogBy({ slug });
        if (raw) {
            blog = JSON.parse(JSON.stringify(raw));
        }

        if (blog) {
            // Fetch 3 related blogs
            const rawRelated = await getBlogsBy(
                { slug: { $ne: slug } },
                'title slug excerpt coverImage tags publishedAt createdAt',
                null,
                { publishedAt: -1, createdAt: -1 },
                { limit: 3 }
            );
            relatedBlogs = JSON.parse(JSON.stringify(rawRelated || []));
        }

        // Fetch suggested packages for sidebar
        try {
            const pkgResult = await api.package.getBrowse({ limit: 3, format: 'flat' });
            suggestedPackages = pkgResult?.data || [];
        } catch {
            suggestedPackages = [];
        }
    } catch {
        blog = null;
    }

    if (!blog) notFound();

    // Extract headings for Table of Contents
    const headings = extractHeadings(blog.content);

    // Calculate reading time
    const wordCount = (blog.content || '').trim().split(/\s+/).length;
    const readingTime = Math.max(2, Math.ceil(wordCount / 200));

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'BlogPosting',
                '@id': `${siteUrl}/blog/${blog.slug}#article`,
                headline: blog.title,
                description: blog.excerpt,
                image: blog.coverImage || `${siteUrl}/img/background.png`,
                datePublished: blog.publishedAt || blog.createdAt,
                dateModified: blog.updatedAt || blog.createdAt,
                author: {
                    '@type': 'Organization',
                    name: 'Tripdhara Mountain Editorial Desk',
                    url: siteUrl
                },
                publisher: {
                    '@type': 'Organization',
                    name: 'Tripdhara',
                    url: siteUrl,
                    logo: {
                        '@type': 'ImageObject',
                        url: `${siteUrl}/logo.png`
                    }
                },
                mainEntityOfPage: {
                    '@type': 'WebPage',
                    '@id': `${siteUrl}/blog/${blog.slug}`
                }
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Home',
                        item: siteUrl
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: 'Himalayan Guides',
                        item: `${siteUrl}/blog`
                    },
                    {
                        '@type': 'ListItem',
                        position: 3,
                        name: blog.title,
                        item: `${siteUrl}/blog/${blog.slug}`
                    }
                ]
            }
        ]
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans selection:bg-primary-500 selection:text-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Reading Progress Bar */}
            <ReadingProgressBar />

            {/* Cinematic Grand Himalayan Hero Header */}
            <header className="relative min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] w-full overflow-hidden bg-gray-950 text-white flex items-end pb-16 sm:pb-20 pt-32 sm:pt-40">
                {/* Background Cover Image with Zoom Transition */}
                <Image
                    src={blog.coverImage || '/img/background.png'}
                    alt={blog.title}
                    fill
                    priority
                    loading="eager"
                    sizes="100vw"
                    className="object-cover object-center opacity-40 scale-105 transition-transform duration-1000 ease-out"
                />

                {/* Signature Tripdhara Mountain Gradient Overlays */}
                <div className="absolute inset-0 bg-gray-950/40 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-transparent to-transparent" />

                <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Top Breadcrumb & Badges Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Primary Category Pill */}
                            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-600/90 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-primary-950/40">
                                <span className="w-2 h-2 rounded-full bg-secondary-400 animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                                {blog.tags?.[0] ? `${blog.tags[0]} Guide` : 'Himalayan Field Report'}
                            </span>

                            {/* Verified Local Dispatch Badge */}
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                Verified Field Dispatch
                            </span>

                            {/* Reading Time Pill */}
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-gray-300 text-xs font-medium border border-white/10">
                                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                                ~{readingTime} min read
                            </span>
                        </div>

                        {/* Breadcrumbs */}
                        <nav aria-label="Breadcrumb" className="flex items-center text-xs font-medium text-gray-300 gap-1.5">
                            <Link href="/" className="hover:text-white transition-colors">Home</Link>
                            <span>/</span>
                            <Link href="/blog" className="hover:text-white transition-colors">Guides</Link>
                            <span>/</span>
                            <span className="text-white font-bold truncate max-w-[150px] sm:max-w-[220px]">
                                {blog.tags?.[0] || 'Article'}
                            </span>
                        </nav>
                    </div>

                    {/* Master Headline */}
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-display tracking-tight leading-[1.12] mb-5 max-w-5xl drop-shadow-2xl">
                        {blog.title}
                    </h1>

                    {/* Lead Excerpt */}
                    {blog.excerpt && (
                        <p className="text-base sm:text-xl text-gray-200 max-w-4xl font-normal leading-relaxed mb-6 text-slate-200">
                            {blog.excerpt}
                        </p>
                    )}

                    {/* Author & Social Sharing Toolbar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-white/10">
                        {/* Author Metadata */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-600/30 border border-primary-400/40 flex items-center justify-center text-primary-300 font-bold text-sm shadow-md">
                                <Mountain className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="block text-sm font-bold text-white font-display">
                                    Tripdhara Himalayan Expedition Desk
                                </span>
                                <div className="flex items-center gap-3 text-xs text-gray-300">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5 text-primary-400" />
                                        {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </span>
                                    <span>&bull;</span>
                                    <span>Rishikesh & Dehradun, Uttarakhand</span>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Share Toolbar */}
                        <ShareToolbar 
                            title={blog.title} 
                            url={`${siteUrl}/blog/${blog.slug}`} 
                            excerpt={blog.excerpt} 
                        />
                    </div>
                </div>
            </header>

            {/* Main Content Layout with 2-Column Responsive Grid */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    
                    {/* Left Column: Article Body (8 cols) */}
                    <article className="lg:col-span-8">
                        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-gray-200/80 shadow-sm">
                            
                            {/* Quick Factsheet Metric Grid for Mountain Treks */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-gradient-to-br from-gray-50 to-primary-50/20 rounded-2xl border border-gray-200/70 mb-10">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">
                                        Summit Elevation
                                    </span>
                                    <span className="text-base sm:text-lg font-black text-gray-900 font-display flex items-center gap-1">
                                        <Mountain className="w-4 h-4 text-primary-600" /> 13,123 ft
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">
                                        Trek Distance
                                    </span>
                                    <span className="text-base sm:text-lg font-black text-gray-900 font-display">
                                        10 km (Roundtrip)
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">
                                        Difficulty Level
                                    </span>
                                    <span className="text-base sm:text-lg font-black text-emerald-600 font-display">
                                        Easy to Moderate
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block font-mono">
                                        Optimal Season
                                    </span>
                                    <span className="text-base sm:text-lg font-black text-gray-900 font-display">
                                        Apr - Jun & Sep - Nov
                                    </span>
                                </div>
                            </div>

                            {/* Rendered Semantic Markdown Content */}
                            <BlogContentRenderer content={blog.content} />

                            {/* Tags Section */}
                            {blog.tags && blog.tags.length > 0 && (
                                <div className="mt-12 pt-8 border-t border-gray-100">
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                        <Tag className="w-3.5 h-3.5 text-primary-600" /> Categorization Tags
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {blog.tags.map((tag, idx) => (
                                            <span 
                                                key={idx}
                                                className="px-3.5 py-1.5 rounded-full bg-gray-100 hover:bg-primary-50 hover:text-primary-700 text-gray-700 text-xs font-semibold transition-colors border border-gray-200/60"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Helpful Guide Feedback Component */}
                            <ArticleFeedback />

                            {/* Author & Mountain Desk Bio Card */}
                            <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-gray-900 via-gray-900 to-gray-950 text-white shadow-xl flex flex-col sm:flex-row items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-primary-600/30 border border-primary-500/40 flex items-center justify-center shrink-0 shadow-lg">
                                    <Compass className="w-8 h-8 text-primary-400" />
                                </div>
                                <div className="flex-1 text-center sm:text-left">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary-400 block mb-1">
                                        Official Editorial Dispatch
                                    </span>
                                    <h4 className="text-lg font-black font-display text-white">
                                        Tripdhara Mountain Travel Desk
                                    </h4>
                                    <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                                        Written and reviewed by certified mountaineering leaders and verified local Pahadi hosts from Uttarakhand & Himachal Pradesh. Real-time updates on mountain passes, taxi fares, and homestay availability.
                                    </p>
                                </div>
                                <Link
                                    href="/packages"
                                    className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold tracking-wider uppercase transition-all shadow-md shrink-0 hover:scale-105"
                                >
                                    Browse Treks
                                </Link>
                            </div>
                        </div>
                    </article>

                    {/* Right Column: Sticky Sidebar (4 cols) */}
                    <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
                        
                        {/* Table of Contents */}
                        {headings.length > 0 && (
                            <TableOfContents items={headings} />
                        )}

                        {/* Ask a Mountain Coordinator Card */}
                        <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-gray-950 rounded-3xl p-6 text-white shadow-xl border border-emerald-800/40">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block mb-1">
                                Local Travel Assistance
                            </span>
                            <h3 className="text-lg font-black font-display text-white mb-2">
                                Planning This Trek?
                            </h3>
                            <p className="text-xs text-emerald-100/90 leading-relaxed mb-5">
                                Speak with our local Uttarakhand expedition leader for current trail snow depth, shared cab fares from Rishikesh, and verified Chopta homestay bookings.
                            </p>

                            <div className="space-y-2.5">
                                <a
                                    href="https://api.whatsapp.com/send?phone=919412096459&text=Hi%20Tripdhara%20Team!%20I%20am%20planning%20the%20Chopta%20Tungnath%20trek%20and%20need%20assistance."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950/40 hover:scale-[1.02]"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    <span>Chat with Coordinator on WhatsApp</span>
                                </a>

                                <Link
                                    href="/contact"
                                    className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all border border-white/20"
                                >
                                    <Phone className="w-3.5 h-3.5" />
                                    <span>Request Custom Itinerary</span>
                                </Link>
                            </div>
                        </div>

                        {/* Recommended Himalayan Experiences Widget */}
                        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm">
                            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-display">
                                    Verified Packages
                                </h3>
                                <Link 
                                    href="/packages"
                                    className="text-xs text-primary-600 hover:text-primary-700 font-bold flex items-center gap-1"
                                >
                                    <span>View All</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {suggestedPackages.length > 0 ? (
                                    suggestedPackages.slice(0, 3).map((pkg, idx) => {
                                        const rawPhoto = Array.isArray(pkg.photos) ? pkg.photos[0] : pkg.photos;
                                        const photoUrl = (typeof rawPhoto === 'string' ? rawPhoto : rawPhoto?.url) || '/img/background.png';
                                        return (
                                            <Link
                                                key={pkg._id || idx}
                                                href={`/packages/${pkg._id || pkg.id}`}
                                                className="group flex gap-3.5 items-center p-2 rounded-2xl hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 shadow-sm">
                                                    <Image
                                                        src={photoUrl}
                                                        alt={pkg.title || 'Himalayan Tour'}
                                                        fill
                                                        sizes="80px"
                                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider block">
                                                        {pkg.category_name || 'Expedition'}
                                                    </span>
                                                    <h4 className="text-xs font-bold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                                                        {pkg.title}
                                                    </h4>
                                                    <p className="text-[11px] text-gray-500 truncate flex items-center gap-1 mt-0.5">
                                                        <MapPin className="w-3 h-3 text-gray-400" />
                                                        {pkg.address || 'Uttarakhand'}
                                                    </p>
                                                    <p className="text-xs font-black text-gray-900 mt-1">
                                                        ₹{(pkg.pricing?.sellingPrice || 0).toLocaleString('en-IN')}
                                                        <span className="text-[10px] font-normal text-gray-400"> / person</span>
                                                    </p>
                                                </div>
                                            </Link>
                                        );
                                    })
                                ) : (
                                    /* Fallback Curated Packages */
                                    [
                                        {
                                            title: 'Chopta Tungnath & Deoriatal 3D/2N Trek',
                                            location: 'Chopta, Uttarakhand',
                                            price: '₹5,999',
                                            category: 'Trekking'
                                        },
                                        {
                                            title: 'Kedarnath Yatra & Rudraprayag Tour',
                                            location: 'Kedarnath, Uttarakhand',
                                            price: '₹14,500',
                                            category: 'Pilgrimage'
                                        },
                                        {
                                            title: 'Rishikesh to Chopta Private SUV Cab',
                                            location: 'Rishikesh / Chopta',
                                            price: '₹6,500',
                                            category: 'Cab Rental'
                                        }
                                    ].map((item, idx) => (
                                        <Link
                                            key={idx}
                                            href="/packages"
                                            className="group flex gap-3.5 items-center p-2 rounded-2xl hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-primary-100 shrink-0 flex items-center justify-center text-primary-700">
                                                <Mountain className="w-7 h-7 opacity-80" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider block">
                                                    {item.category}
                                                </span>
                                                <h4 className="text-xs font-bold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                                                    {item.title}
                                                </h4>
                                                <p className="text-[11px] text-gray-500 truncate mt-0.5">
                                                    {item.location}
                                                </p>
                                                <p className="text-xs font-black text-gray-900 mt-0.5">
                                                    {item.price}
                                                </p>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Tripdhara Mountain Trust Badges */}
                        <div className="bg-gray-100/80 rounded-3xl p-5 space-y-3.5 border border-gray-200/60 text-xs">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">
                                Tripdhara Mountain Standards
                            </span>
                            <div className="flex items-start gap-2.5 text-gray-700">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span><strong>100% Verified Local Hosts:</strong> Direct booking with Pahadi families without middlemen markup.</span>
                            </div>
                            <div className="flex items-start gap-2.5 text-gray-700">
                                <ShieldCheck className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                                <span><strong>High-Altitude Safety:</strong> All trekking partners carry verified first-aid and acclimatization equipment.</span>
                            </div>
                            <div className="flex items-start gap-2.5 text-gray-700">
                                <Compass className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                                <span><strong>Eco-Sensitive Footprint:</strong> Zero single-use plastic policy across all our Himalayan trails.</span>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Bottom Section: Related Himalayan Field Guides */}
                {relatedBlogs.length > 0 && (
                    <section className="mt-20 pt-12 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <div>
                                <span className="text-xs font-bold text-primary-600 uppercase tracking-wider block mb-1">
                                    Continue Reading
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-black font-display text-gray-900 tracking-tight">
                                    More Himalayan Field Guides & Route Reports
                                </h3>
                            </div>
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 hover:underline"
                            >
                                <span>Explore All Field Reports</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedBlogs.map((rel) => (
                                <Link
                                    key={rel._id || rel.slug}
                                    href={`/blog/${rel.slug}`}
                                    className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-200/80 transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="aspect-[16/10] w-full relative bg-gray-900 overflow-hidden">
                                        <Image
                                            src={rel.coverImage || '/img/background.png'}
                                            alt={rel.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />
                                        {rel.tags?.[0] && (
                                            <span className="absolute bottom-3 left-3 text-[10px] font-bold text-white bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20">
                                                #{rel.tags[0]}
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                                                <Calendar className="w-3.5 h-3.5 text-primary-600" />
                                                <span>
                                                    {new Date(rel.publishedAt || rel.createdAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <h4 className="text-base font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 font-display mb-2">
                                                {rel.title}
                                            </h4>
                                            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                                                {rel.excerpt}
                                            </p>
                                        </div>

                                        <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-primary-600">
                                            <span>Read Field Guide</span>
                                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Grand Footer Call-to-Action Banner */}
                <section className="mt-20 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl border border-white/10">
                    <div className="absolute -right-10 -bottom-10 w-96 h-96 rounded-full bg-primary-600/10 blur-3xl pointer-events-none" />
                    <div className="relative z-10 max-w-3xl space-y-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-secondary-400 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> Authentic Himalayan Adventures
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight leading-tight">
                            Experience the Magic of Chopta & The Himalayas
                        </h2>
                        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                            Let local certified Pahadi guides craft your custom Uttarakhand itinerary. Verified wooden homestays, private 4x4 mountain cabs, and zero commercial hassle.
                        </p>
                        <div className="pt-4 flex flex-wrap gap-4">
                            <Link
                                href="/packages"
                                className="px-6 py-3.5 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-primary-600/30 hover:scale-105"
                            >
                                Explore Trekking Packages
                            </Link>
                            <a
                                href="https://api.whatsapp.com/send?phone=919412096459&text=Hello%20Tripdhara!%20I%20am%20interested%20in%20a%20Himalayan%20tour%20package."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all border border-white/20 flex items-center gap-2 hover:scale-105"
                            >
                                <MessageCircle className="w-4 h-4 text-emerald-400" />
                                <span>Talk to Local Guide</span>
                            </a>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
