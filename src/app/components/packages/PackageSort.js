'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function PackageSort() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get('sort') || '';

    const handleSort = (newSort) => {
        const params = new URLSearchParams(searchParams.toString());
        if (newSort) {
            params.set('sort', newSort);
        } else {
            params.delete('sort');
        }
        params.delete('page');
        const qs = params.toString();
        router.push(qs ? `${pathname}?${qs}` : pathname);
    };

    const isPrice = currentSort.startsWith('price');

    return (
        <div className="flex items-center space-x-1.5 bg-white border border-gray-200/80 rounded-xl p-1 shadow-sm overflow-x-auto max-w-full">
            <button
                type="button"
                onClick={() => handleSort('')}
                className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg whitespace-nowrap transition-colors ${!currentSort ? 'bg-gray-100 text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-900 font-medium'}`}
            >
                Recommended
            </button>
            <button
                type="button"
                onClick={() => handleSort(currentSort === 'price_asc' ? 'price_desc' : 'price_asc')}
                className={`px-3 py-1.5 text-xs sm:text-sm flex items-center space-x-1 rounded-lg whitespace-nowrap transition-colors ${isPrice ? 'bg-gray-100 text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-900 font-medium'}`}
            >
                <span>Price</span>
                <span className="w-3.5 h-3.5 flex-shrink-0 flex items-center justify-center">
                    {currentSort === 'price_asc' && <ArrowUp className="w-3.5 h-3.5" />}
                    {currentSort === 'price_desc' && <ArrowDown className="w-3.5 h-3.5" />}
                </span>
            </button>
            <button
                type="button"
                onClick={() => handleSort(currentSort === 'newest' ? '' : 'newest')}
                className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg whitespace-nowrap transition-colors ${currentSort === 'newest' ? 'bg-gray-100 text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-900 font-medium'}`}
            >
                Newest
            </button>
            <button
                type="button"
                onClick={() => handleSort(currentSort === 'rating_desc' ? '' : 'rating_desc')}
                className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg whitespace-nowrap transition-colors ${currentSort === 'rating_desc' ? 'bg-gray-100 text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-900 font-medium'}`}
            >
                Top Rated
            </button>
        </div>
    );
}
