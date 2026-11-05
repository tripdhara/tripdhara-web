import { Suspense } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import PackageFilters from '@/app/components/packages/PackageFilters';
import PackageSort from '@/app/components/packages/PackageSort';
import PackageCard from '@/app/components/packages/PackageCard';
import Pagination from '@/app/components/ui/Pagination';
import createMetadata from '@/app/helper/metadata.js';
import api from '@/core/Api/public/index.js';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop';


async function getPackages({ page = 1, limit = 12, minPrice = '', maxPrice = '', format = 'flat', sort = 'Newest', q = '', latitude = '', longitude = '', radius = '', address = '', category = '' } = {}) {
    try {
        const result = await api.package.getBrowse({ page, limit, minPrice, maxPrice, format, sort, q, latitude, longitude, radius, address, category });
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

// 2. Dynamic Metadata
export async function generateMetadata({ searchParams }) {
    const params = (await searchParams) || {};
    const { category } = params;
    const categories = await getServices();
    const currentCat = categories.find(c => c.slug?.toLowerCase() === category?.toLowerCase());
    const categoryName = currentCat ? currentCat.name : category;

    return createMetadata({
        title: categoryName ? `${categoryName} Packages` : 'All Packages',
        path: category ? `/packages?category=${category}` : '/packages',
    });
}

async function getServices() {
    try {
        const result = await api.service.categories.getAll();
        return result.data || [];
    } catch (error) {
        return [];
    }
}

export default async function PackagesPage({ searchParams }) {
    const paramsObj = (await searchParams) || {};
    const { category, page: pageParam = 1, q, maxPrice, sort } = paramsObj;
    const currentPage = parseInt(pageParam) || 1;

    // Parallel fetching using Promise.all for optimal performance
    const [{ services, pagination }, categories] = await Promise.all([
        getPackages({ page: currentPage, limit: 12, maxPrice, category, format: 'flat', q, sort }),
        getServices()
    ]);

    const totalPages = pagination?.totalPages || 1;
    const currentCat = categories.find(c => c.slug?.toLowerCase() === category?.toLowerCase());
    const displayCategoryTitle = currentCat ? currentCat.name : category;

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            {/* Top Page Header (Clean, Typography Driven) */}
            <div className="bg-gray-900 pt-32 pb-16 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <span className="text-primary-400 font-bold text-sm tracking-widest uppercase mb-3 block drop-shadow-sm">
                                {displayCategoryTitle || 'Discover'}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight font-display drop-shadow-md">
                                {displayCategoryTitle ? `${displayCategoryTitle} Experiences` : 'Explore the Himalayas'}
                            </h1>
                            <p className="text-gray-300 mt-4 text-lg max-w-2xl font-medium leading-relaxed">
                                Curated adventures, stays, and rentals from top verified local vendors.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-8xl mx-auto p-4 sm:p-6 lg:p-10">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Sidebar Filters */}
                    <Suspense fallback={<div className="w-full lg:w-[300px] h-[500px] bg-gray-100 rounded-2xl animate-pulse flex-shrink-0"></div>}>
                        <PackageFilters categories={categories} />
                    </Suspense>

                    {/* Main Content Area */}
                    <div className="w-full lg:flex-1">
                        {/* Top Action Bar */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-5 border-b border-gray-200">
                            <div>
                                <p className="text-gray-900 font-semibold">
                                    <span className="font-extrabold">{pagination?.total ?? services.length}</span> experiences found
                                </p>
                            </div>
                            <Suspense fallback={<div className="mt-4 sm:mt-0 w-64 h-10 bg-gray-100 rounded-xl animate-pulse"></div>}>
                                <PackageSort />
                            </Suspense>
                        </div>

                        {services.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {services.map((service) => (
                                    <PackageCard key={service?.id} item={service} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-24 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm mb-4">
                                    <Search className="w-6 h-6 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">No experiences found</h3>
                                <p className="text-gray-500 max-w-sm mx-auto">We couldn't find any packages matching your criteria. Try adjusting your filters.</p>
                                <Link href="/packages" className="mt-6 inline-block px-6 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                                    Clear Filters
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
                {/* Pagination Controls */}
                <Suspense fallback={<div className="mt-16 mb-8 flex justify-center items-center h-12 w-full max-w-sm mx-auto bg-gray-100 rounded-xl animate-pulse"></div>}>
                    <Pagination currentPage={currentPage} totalPages={totalPages} />
                </Suspense>
            </main>
        </div>
    );
}
