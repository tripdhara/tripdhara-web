import { Suspense } from 'react';
import Link from 'next/link';
import {
    Search,
    Sparkles,
    ShieldCheck,
    Phone
} from 'lucide-react';
import PackageFilters from '@/app/components/packages/PackageFilters';
import PackageCard from '@/app/components/packages/PackageCard';
import Pagination from '@/app/components/ui/Pagination';
import createMetadata from '@/core/Helpers/metadata.js';
import api from '@/core/Api/public/index.js';

async function getPackages({
    page = 1,
    limit = 12,
    minPrice = '',
    maxPrice = '',
    format = 'flat',
    sort = '',
    q = '',
    latitude = '',
    longitude = '',
    radius = '',
    address = '',
    category = ''
} = {}) {
    try {
        const result = await api.package.getBrowse({
            page,
            limit,
            minPrice,
            maxPrice,
            format,
            sort,
            q,
            latitude,
            longitude,
            radius,
            address,
            category
        });
        if (result?.success) {
            return {
                services: result.data || [],
                pagination: result.pagination || null
            };
        }
        return { services: [], pagination: null };
    } catch (error) {
        return { services: [], pagination: null };
    }
}

async function getServices() {
    try {
        const result = await api.service.categories.getAll();
        return result.data || [];
    } catch (error) {
        return [];
    }
}

export async function generateMetadata({ searchParams }) {
    const params = (await searchParams) || {};
    const { category, q } = params;
    const categories = await getServices();
    const currentCat = categories.find(c => c.slug?.toLowerCase() === category?.toLowerCase());
    const categoryName = currentCat ? currentCat.name : category;

    let title = 'Explore Himalayan Tour Packages & Experiences';
    if (categoryName && q) {
        title = `${categoryName} Experiences in "${q}" - Tripdhara`;
    } else if (categoryName) {
        title = `${categoryName} Packages & Experiences - Tripdhara`;
    } else if (q) {
        title = `Experiences matching "${q}" - Tripdhara`;
    }

    return createMetadata({
        title,
        description: 'Direct self-employment & local booking platform for verified Himalayan homestays, trekking, rafting, camping, and tours in Uttarakhand & Himachal Pradesh. Zero middleman markup.',
        path: category ? `/packages?category=${category}` : '/packages',
    });
}

export default async function PackagesPage({ searchParams }) {
    const paramsObj = (await searchParams) || {};
    const {
        category = '',
        page: pageParam = 1,
        q = '',
        minPrice = '',
        maxPrice = '',
        sort = ''
    } = paramsObj;

    const currentPage = parseInt(pageParam, 10) || 1;
    const sanitizedQuery = (q || '').trim();
    const effectiveMinPrice = minPrice && Number(minPrice) > 0 ? minPrice : '';
    const effectiveMaxPrice = maxPrice && maxPrice !== '50000' && Number(maxPrice) > 0 ? maxPrice : '';

    const [{ services, pagination }, categories] = await Promise.all([
        getPackages({
            page: currentPage,
            limit: 12,
            minPrice: effectiveMinPrice,
            maxPrice: effectiveMaxPrice,
            category: category.toLowerCase().trim(),
            format: 'flat',
            q: sanitizedQuery,
            sort: (sort || '').trim()
        }),
        getServices()
    ]);

    const totalPages = pagination?.totalPages || 1;
    const totalCount = pagination?.total ?? services.length;
    const currentCat = categories.find(c => c.slug?.toLowerCase() === category?.toLowerCase());
    const displayCategoryTitle = currentCat ? currentCat.name : category;
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tripdhara.in';

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: displayCategoryTitle ? `${displayCategoryTitle} Packages - Tripdhara` : 'Himalayan Tour Packages & Stays - Tripdhara',
        itemListElement: (services || []).map((service, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${siteUrl}/packages/${service.id || service._id}`,
            name: service.title
        }))
    };

    return (
        <div className="bg-gray-50/50 min-h-screen font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Tripdhara Brand Hero Section (Sleek, Compact) */}
            <div className="bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 pt-28 pb-10 relative overflow-hidden border-b border-gray-800">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_50%)]" />

                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest mb-3 backdrop-blur-md">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span>Tripdhara Himalayan Network • Rishikesh & Dehradun</span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-display">
                                {displayCategoryTitle ? `${displayCategoryTitle} Experiences` : 'Direct Himalayan Stays & Adventures'}
                            </h1>

                            <p className="text-gray-300 text-sm sm:text-base mt-2 font-medium max-w-2xl">
                                Book directly with verified local Kath-Kuni homestay families, licensed Ganga raft marshals, and mountain guides with zero middleman markup.
                            </p>
                        </div>

                        {/* Helpline Link */}
                        <div className="flex items-center gap-4 text-xs font-semibold shrink-0">
                            <span className="hidden lg:flex items-center gap-1.5 text-gray-400">
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                100% Local Hosts
                            </span>
                            <a
                                href="tel:+917017288052"
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-emerald-300 border border-white/10 text-xs font-bold transition-colors"
                            >
                                <Phone className="w-3.5 h-3.5" />
                                Helpline: +91 7017288052
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Horizontal Top Filter Bar (Sticky across the top) */}
            <Suspense fallback={<div className="w-full h-24 bg-white border-b border-gray-200 animate-pulse" />}>
                <PackageFilters categories={categories} totalCount={totalCount} />
            </Suspense>

            {/* Main Full-Width Package Catalog */}
            <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {services.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {services.map((service, index) => (
                            <PackageCard
                                key={service.id || service._id || index}
                                item={service}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-white max-w-2xl mx-auto my-8 p-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 text-gray-400 shadow-sm mb-4">
                            <Search className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-950 mb-2 font-display">No Himalayan experiences found</h3>
                        <p className="text-gray-500 max-w-sm mx-auto text-sm leading-relaxed mb-6">
                            We couldn&apos;t find any verified packages matching your selected filters. Try broadening your criteria or reset all filters.
                        </p>
                        <Link
                            href="/packages"
                            className="inline-flex items-center px-6 py-2.5 bg-gray-950 text-white rounded-full font-bold text-xs uppercase tracking-wider hover:bg-gray-800 transition-colors shadow-md"
                        >
                            Reset All Filters
                        </Link>
                    </div>
                )}

                {/* Pagination Controls */}
                <Suspense fallback={<div className="mt-12 flex justify-center items-center h-12 w-full max-w-sm mx-auto bg-gray-100 rounded-2xl animate-pulse" />}>
                    <Pagination currentPage={currentPage} totalPages={totalPages} />
                </Suspense>
            </main>
        </div>
    );
}
