import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, ArrowLeft, Tag, Compass, Share2, Sparkles } from 'lucide-react';
import dbConnect from '@/core/Config/db.js';
import { getBlogBy } from '@/core/Helpers/queryHelpers.js';
import createMetadata from '@/core/Helpers/metadata.js';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tripdhara.in';

export async function generateMetadata({ params }) {
    const { slug } = await params;
    try {
        await dbConnect();
        const blog = await getBlogBy({ slug, status: 'published' });
        if (!blog) return createMetadata({ title: 'Guide Not Found', noIndex: true });

        return createMetadata({
            title: `${blog.title} - Himalayan Travel Guide | Tripdhara`,
            description: blog.excerpt || `Read ${blog.title} on Tripdhara. Authentic Himalayan field insights.`,
            image: blog.coverImage || '/img/background.png',
            path: `/blog/${blog.slug}`,
            keywords: blog.tags || ['Himalayan Guide', 'Tripdhara Blog']
        });
    } catch {
        return createMetadata({ title: 'Travel Guide', noIndex: true });
    }
}

export default async function BlogPostPage({ params }) {
    const { slug } = await params;

    let blog = null;
    try {
        await dbConnect();
        const raw = await getBlogBy({ slug, status: 'published' });
        if (raw) {
            blog = JSON.parse(JSON.stringify(raw));
        }
    } catch {
        blog = null;
    }

    if (!blog) notFound();

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
                    name: 'Tripdhara Editorial Desk',
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
                        name: 'Guides',
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
        <article className="bg-gray-50 min-h-screen font-sans pb-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Header Hero */}
            <header className="relative pt-36 pb-20 bg-gray-950 text-white overflow-hidden">
                <Image
                    src={blog.coverImage || '/img/background.png'}
                    alt={blog.title}
                    fill
                    priority
                    loading="eager"
                    sizes="100vw"
                    className="object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to All Guides</span>
                    </Link>

                    {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {blog.tags.map((t, i) => (
                                <span key={i} className="text-xs font-bold text-primary-300 bg-primary-950/60 border border-primary-800/60 px-3 py-1 rounded-full backdrop-blur-md">
                                    #{t}
                                </span>
                            ))}
                        </div>
                    )}

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight leading-tight mb-6">
                        {blog.title}
                    </h1>

                    <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 pt-4 border-t border-white/10">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-secondary-400" />
                            {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </span>
                        <span>•</span>
                        <span>Tripdhara Field Dispatch</span>
                    </div>
                </div>
            </header>

            {/* Article Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
                <div className="bg-white rounded-3xl p-8 sm:p-14 border border-gray-200/90 shadow-xl">
                    {blog.excerpt && (
                        <p className="text-lg sm:text-xl font-medium text-gray-700 leading-relaxed pb-8 mb-8 border-b border-gray-100 italic">
                            &ldquo;{blog.excerpt}&rdquo;
                        </p>
                    )}

                    {/* Article Body */}
                    <div
                        className="prose prose-lg max-w-none text-gray-800 leading-relaxed font-normal space-y-6"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />

                    {/* Bottom Author / About Tripdhara Box */}
                    <div className="mt-16 pt-10 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-gray-50 p-6 rounded-2xl">
                        <div>
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Published by</span>
                            <h3 className="text-base font-black text-gray-900 font-display">Tripdhara Himalayan Travel Desk</h3>
                            <p className="text-xs text-gray-500 mt-0.5">Headquarters: Rishikesh & Dehradun, Uttarakhand</p>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href="/packages"
                                className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                            >
                                Explore Packages
                            </Link>
                            <Link
                                href="/contact"
                                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl text-xs font-bold transition"
                            >
                                Ask Coordinator
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </article>
    );
}

