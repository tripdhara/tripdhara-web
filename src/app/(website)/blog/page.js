import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Calendar, ArrowRight, Tag, Compass } from 'lucide-react';
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
        'Rishikesh Rafting Guide',
        'Spiti Valley Road Trip Advice',
        'Chardham Travel Tips'
    ]
});

export default async function BlogIndexPage() {
    let blogs = [];
    try {
        await dbConnect();
        const rawBlogs = await getBlogsBy({ status: 'published' }, 'title slug excerpt coverImage tags publishedAt createdAt', null, { publishedAt: -1, createdAt: -1 });
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

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListJsonLd) }}
            />

            {/* Header */}
            <div className="bg-gray-950 pt-36 pb-20 relative overflow-hidden text-white">
                <Image
                    src="/img/background.png"
                    alt="Himalayan Field Reports"
                    fill
                    priority
                    loading="eager"
                    sizes="100vw"
                    className="object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <span className="text-secondary-400 font-bold text-xs uppercase tracking-widest mb-3 inline-flex items-center gap-2 px-3.5 py-1 bg-white/10 rounded-full border border-white/20">
                        <BookOpen className="w-3.5 h-3.5" /> Mountain Field Guides
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight font-display mb-4">
                        Himalayan Dispatches & Insights
                    </h1>
                    <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto font-medium">
                        Practical route advisories, high-altitude acclimatization tips, village homestay folklore, and outdoor ethics curated by local mountain hosts.
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {blogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog, idx) => (
                            <Link
                                key={blog._id || blog.slug}
                                href={`/blog/${blog.slug}`}
                                className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-200/80 transition-all duration-300 hover:-translate-y-1.5"
                            >
                                <div className="aspect-[16/10] w-full relative bg-gray-900 overflow-hidden">
                                    <Image
                                        src={blog.coverImage || '/img/background.png'}
                                        alt={blog.title}
                                        fill
                                        priority={idx === 0}
                                        loading={idx === 0 ? "eager" : "lazy"}
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent"></div>
                                    {blog.tags && blog.tags.length > 0 && (
                                        <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5">
                                            {blog.tags.slice(0, 2).map((t, idx) => (
                                                <span key={idx} className="text-[11px] font-bold text-white bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20">
                                                    #{t}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-3">
                                            <Calendar className="w-3.5 h-3.5 text-primary-600" />
                                            <span>
                                                {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>

                                        <h2 className="text-xl font-bold text-gray-900 font-display group-hover:text-primary-600 transition-colors line-clamp-2 mb-3">
                                            {blog.title}
                                        </h2>

                                        {blog.excerpt && (
                                            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4">
                                                {blog.excerpt}
                                            </p>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-primary-600 font-bold text-xs">
                                        <span>Read Complete Dispatch</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    /* Zero Dummy Data - Authentic Mountain Editorial Empty State */
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
            </main>
        </div>
    );
}

