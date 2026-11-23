import Link from 'next/link';
import Image from 'next/image';
import { 
    BookOpen, Calendar, ArrowRight, Tag, Compass, Sparkles, 
    Clock, ShieldCheck, Mountain, Search, ChevronRight 
} from 'lucide-react';
import dbConnect from '@/core/Config/db.js';
import { getBlogsBy } from '@/core/Helpers/queryHelpers.js';
import createMetadata from '@/core/Helpers/metadata.js';

export const metadata = createMetadata({
    title: 'Himalayan Travel Guides, Stories & Field Reports | Tripdhara',
    description: 'Practical guides, high-altitude acclimatization tips, village homestay etiquette, and trekking insights by verified Himalayan locals and expedition leaders.',
    path: '/blog',
    keywords: [
        'Himalayan Travel Blog',
        'Trekking Guides India',
        'Chopta Tungnath Trek Guide',
        'Spiti Valley Road Trip Advice',
        'Kedarnath Travel Tips',
        'Jibhi Homestays'
    ]
});

export default async function BlogIndexPage() {
    let blogs = [];
    try {
        await dbConnect();
        const rawBlogs = await getBlogsBy(
            { status: 'published' }, 
            'title slug excerpt coverImage tags publishedAt createdAt content', 
            null, 
            { publishedAt: -1, createdAt: -1 }
        );
        blogs = JSON.parse(JSON.stringify(rawBlogs || []));
    } catch {
        blogs = [];
    }

    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tripdhara.in';

    const blogListJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Tripdhara Himalayan Travel Field Guides',
        description: 'Authentic mountain travel dispatches, trekking field guides, and local cultural insights.',
        url: `${siteUrl}/blog`,
        blogPost: blogs.map(b => ({
            '@type': 'BlogPosting',
            headline: b.title,
            description: b.excerpt,
            url: `${siteUrl}/blog/${b.slug}`,
            datePublished: b.publishedAt || b.createdAt
        }))
    };

    const featuredBlog = blogs[0] || null;
    const regularBlogs = blogs.slice(1);

    return (
        <div className="bg-gray-50 min-h-screen font-sans selection:bg-primary-500 selection:text-white pb-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListJsonLd) }}
            />

            {/* Grand Hero Header with Mountain Gradient */}
            <div className="bg-gray-950 pt-36 sm:pt-40 pb-20 relative overflow-hidden text-white">
                <Image
                    src="/img/background.png"
                    alt="Himalayan Field Reports"
                    fill
                    priority
                    loading="eager"
                    sizes="100vw"
                    className="object-cover opacity-25 scale-105"
                />
                <div className="absolute inset-0 bg-gray-950/40 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-transparent to-transparent" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-600/90 text-white text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-lg shadow-primary-950/40 mb-4">
                        <span className="w-2 h-2 rounded-full bg-secondary-400 animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                        <BookOpen className="w-3.5 h-3.5" /> Mountain Field Guides
                    </span>
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight font-display mb-5 drop-shadow-xl">
                        Himalayan Dispatches & Insights
                    </h1>
                    <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
                        Practical route advisories, high-altitude acclimatization tips, village homestay folklore, and outdoor ethics curated by certified Pahadi hosts and expedition leaders.
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {blogs.length > 0 ? (
                    <div className="space-y-12">
                        
                        {/* Featured Hero Article */}
                        {featuredBlog && (
                            <div className="relative">
                                <Link
                                    href={`/blog/${featuredBlog.slug}`}
                                    className="group grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-200/80 transition-all duration-300 hover:-translate-y-1"
                                >
                                    {/* Featured Image (7 cols) */}
                                    <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto relative min-h-[300px] sm:min-h-[400px] bg-gray-950 overflow-hidden">
                                        <Image
                                            src={featuredBlog.coverImage || '/img/background.png'}
                                            alt={featuredBlog.title}
                                            fill
                                            priority
                                            loading="eager"
                                            sizes="(max-width: 1024px) 100vw, 60vw"
                                            className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent" />
                                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                            <span className="px-3 py-1 rounded-full bg-primary-600 text-white text-xs font-black uppercase tracking-wider shadow-md">
                                                Featured Dispatch
                                            </span>
                                            {featuredBlog.tags?.[0] && (
                                                <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
                                                    #{featuredBlog.tags[0]}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Featured Text (5 cols) */}
                                    <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                                                <span className="flex items-center gap-1.5 font-medium">
                                                    <Calendar className="w-3.5 h-3.5 text-primary-600" />
                                                    {new Date(featuredBlog.publishedAt || featuredBlog.createdAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                                <span>&bull;</span>
                                                <span className="flex items-center gap-1 text-cyan-700 font-semibold">
                                                    <Clock className="w-3.5 h-3.5 text-cyan-600" />
                                                    ~{Math.max(2, Math.ceil((featuredBlog.content || '').split(/\s+/).length / 200))} min read
                                                </span>
                                            </div>

                                            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display group-hover:text-primary-600 transition-colors tracking-tight leading-tight mb-4">
                                                {featuredBlog.title}
                                            </h2>

                                            {featuredBlog.excerpt && (
                                                <p className="text-sm sm:text-base text-gray-600 line-clamp-4 leading-relaxed mb-6 font-normal">
                                                    {featuredBlog.excerpt}
                                                </p>
                                            )}
                                        </div>

                                        <div className="pt-6 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-primary-600">
                                            <span className="uppercase tracking-wider font-display">Read Complete Field Guide</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}

                        {/* Regular Articles Grid */}
                        {regularBlogs.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-200">
                                    <h3 className="text-xl sm:text-2xl font-black font-display text-gray-900 tracking-tight">
                                        Latest Himalayan Route Reports
                                    </h3>
                                    <span className="text-xs font-bold text-gray-400 font-mono">
                                        {regularBlogs.length} {regularBlogs.length === 1 ? 'Dispatch' : 'Dispatches'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {regularBlogs.map((blog, idx) => {
                                        const wordCount = (blog.content || '').split(/\s+/).length;
                                        const readTime = Math.max(2, Math.ceil(wordCount / 200));

                                        return (
                                            <Link
                                                key={blog._id || blog.slug}
                                                href={`/blog/${blog.slug}`}
                                                className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-200/80 transition-all duration-300 hover:-translate-y-1.5"
                                            >
                                                {/* Cover Thumbnail */}
                                                <div className="aspect-[16/10] w-full relative bg-gray-950 overflow-hidden">
                                                    <Image
                                                        src={blog.coverImage || '/img/background.png'}
                                                        alt={blog.title}
                                                        fill
                                                        priority={idx < 2}
                                                        loading={idx < 2 ? "eager" : "lazy"}
                                                        sizes="(max-width: 768px) 100vw, 33vw"
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent" />
                                                    {blog.tags?.[0] && (
                                                        <span className="absolute bottom-3 left-3 text-[10px] font-bold text-white bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20">
                                                            #{blog.tags[0]}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="p-6 flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                                                            <span className="flex items-center gap-1.5">
                                                                <Calendar className="w-3.5 h-3.5 text-primary-600" />
                                                                {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-IN', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric'
                                                                })}
                                                            </span>
                                                            <span className="flex items-center gap-1 text-gray-400 font-mono text-[11px]">
                                                                <Clock className="w-3 h-3 text-cyan-600" />
                                                                ~{readTime}m
                                                            </span>
                                                        </div>

                                                        <h4 className="text-lg font-bold text-gray-900 font-display group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug mb-3">
                                                            {blog.title}
                                                        </h4>

                                                        {blog.excerpt && (
                                                            <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4">
                                                                {blog.excerpt}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-primary-600 font-bold text-xs">
                                                        <span className="uppercase tracking-wider font-display">Read Field Guide</span>
                                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Zero Data State */
                    <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-gray-200 max-w-2xl mx-auto shadow-sm">
                        <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-6">
                            <Compass className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 font-display mb-3">
                            Editorial Guides in Curation
                        </h2>
                        <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto mb-8 font-normal">
                            Our field coordinators, trek leaders, and local hosts in Rishikesh and Himachal are drafting detailed route advisories, high-altitude acclimatization guides, and Pahadi cultural stories.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href="/packages"
                                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md"
                            >
                                Explore Verified Packages
                            </Link>
                            <Link
                                href="/contact"
                                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs transition-colors"
                            >
                                Ask Our Travel Desk
                            </Link>
                        </div>
                    </div>
                )}

                {/* Grand Footer Call-to-Action Banner */}
                <section className="mt-20 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl border border-white/10">
                    <div className="absolute -right-10 -bottom-10 w-96 h-96 rounded-full bg-primary-600/10 blur-3xl pointer-events-none" />
                    <div className="relative z-10 max-w-3xl space-y-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-secondary-400 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> Travel With Mountain Locals
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight leading-tight">
                            Ready to Explore the Indian Himalayas?
                        </h2>
                        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                            Discover verified homestays, mountain cabs, and guided treks curated directly with local Pahadi families in Himachal Pradesh and Uttarakhand.
                        </p>
                        <div className="pt-4 flex flex-wrap gap-4">
                            <Link
                                href="/packages"
                                className="px-6 py-3.5 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-primary-600/30 hover:scale-105"
                            >
                                Explore All Packages
                            </Link>
                            <Link
                                href="/contact"
                                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all border border-white/20 hover:scale-105"
                            >
                                Custom Itinerary Request
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
