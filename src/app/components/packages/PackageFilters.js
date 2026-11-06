'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    Search,
    X,
    SlidersHorizontal,
    ChevronDown,
    Home,
    Building,
    Tent,
    Waves,
    Mountain,
    Bike,
    Sparkles,
    Compass,
    HeartHandshake,
    RotateCcw,
    Check
} from 'lucide-react';

const CATEGORY_ICONS = {
    'homestay': Home,
    'hotel': Building,
    'camping': Tent,
    'rafting': Waves,
    'river-rafting': Waves,
    'trekking': Mountain,
    'bungee-jumping': Sparkles,
    'bike-scooter-rental': Bike,
    'vehicle-rental': Bike,
    'chardham-tour': Compass,
    'custom-trip': HeartHandshake,
};

const BUDGET_PRESETS = [
    { label: '< ₹2.5k', value: '2500' },
    { label: '₹2.5k - ₹7.5k', value: '7500' },
    { label: '₹7.5k - ₹20k', value: '20000' },
    { label: 'All Budgets', value: '50000' }
];

const SORT_OPTIONS = [
    { label: 'Recommended', value: '' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Newest', value: 'newest' },
    { label: 'Top Rated', value: 'rating_desc' }
];

export default function PackageFilters({ categories = [], totalCount = 0 }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentCategory = (searchParams.get('category') || '').toLowerCase();
    const urlQ = searchParams.get('q') || '';
    const urlMaxPrice = searchParams.get('maxPrice') || '50000';
    const urlSort = searchParams.get('sort') || '';

    const [prevUrlQ, setPrevUrlQ] = useState(urlQ);
    const [prevUrlMax, setPrevUrlMax] = useState(urlMaxPrice);
    const [query, setQuery] = useState(urlQ);
    const [maxPrice, setMaxPrice] = useState(urlMaxPrice);

    const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

    const priceDropdownRef = useRef(null);
    const sortDropdownRef = useRef(null);

    // Sync input states on external searchParams updates
    if (prevUrlQ !== urlQ) {
        setPrevUrlQ(urlQ);
        setQuery(urlQ);
    }
    if (prevUrlMax !== urlMaxPrice) {
        setPrevUrlMax(urlMaxPrice);
        setMaxPrice(urlMaxPrice);
    }

    // Close dropdowns on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (priceDropdownRef.current && !priceDropdownRef.current.contains(event.target)) {
                setIsPriceDropdownOpen(false);
            }
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
                setIsSortDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const updateUrl = (updates) => {
        const params = new URLSearchParams(searchParams.toString());
        let hasChanges = false;

        if (updates.q !== undefined) {
            const currentParamQ = searchParams.get('q') || '';
            const newQ = (updates.q || '').trim();
            if (newQ !== currentParamQ) {
                if (newQ) params.set('q', newQ);
                else params.delete('q');
                hasChanges = true;
            }
        }

        if (updates.maxPrice !== undefined) {
            const currentParamMax = searchParams.get('maxPrice') || '50000';
            const newMax = updates.maxPrice;
            if (newMax !== '50000' && newMax !== currentParamMax) {
                params.set('maxPrice', newMax);
                hasChanges = true;
            } else if (newMax === '50000' && currentParamMax !== '50000') {
                params.delete('maxPrice');
                hasChanges = true;
            }
        }

        if (updates.sort !== undefined) {
            const currentParamSort = searchParams.get('sort') || '';
            const newSort = updates.sort;
            if (newSort !== currentParamSort) {
                if (newSort) params.set('sort', newSort);
                else params.delete('sort');
                hasChanges = true;
            }
        }

        if (hasChanges) {
            params.delete('page');
            const qs = params.toString();
            router.push(qs ? `${pathname}?${qs}` : pathname);
        }
    };

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            updateUrl({ q: query });
        }, 400);

        return () => clearTimeout(handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    const getCategoryUrl = (slug) => {
        const params = new URLSearchParams(searchParams.toString());
        if (slug) {
            params.set('category', slug);
        } else {
            params.delete('category');
        }
        params.delete('page');
        const qs = params.toString();
        return qs ? `${pathname}?${qs}` : pathname;
    };

    const hasActiveFilters = Boolean(
        currentCategory ||
        urlQ ||
        (urlMaxPrice && urlMaxPrice !== '50000') ||
        urlSort
    );

    const activeSortLabel = SORT_OPTIONS.find(s => s.value === urlSort)?.label || 'Recommended';
    const isPriceActive = urlMaxPrice && urlMaxPrice !== '50000';

    return (
        <div className="w-full bg-white border-b border-gray-200/80 shadow-sm sticky top-0 z-30">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* 1. Horizontally Scrollable 9 Categories Tabs */}
                <div className="flex items-center space-x-2 overflow-x-auto py-3 custom-scrollbar border-b border-gray-100">
                    <Link
                        href={getCategoryUrl('')}
                        className={`group flex items-center space-x-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${!currentCategory ? 'bg-gray-950 text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200/60'}`}
                    >
                        <Compass className="w-3.5 h-3.5" />
                        <span>All Experiences</span>
                    </Link>

                    {categories.map((category) => {
                        const slug = (category.slug || '').toLowerCase();
                        const IconComponent = CATEGORY_ICONS[slug] || Compass;
                        const isSelected = currentCategory === slug;

                        return (
                            <Link
                                key={category.slug || category._id}
                                href={getCategoryUrl(category.slug)}
                                className={`group flex items-center space-x-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${isSelected ? 'bg-gray-950 text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200/60'}`}
                            >
                                <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-primary-300' : 'text-gray-400 group-hover:text-primary-600'}`} />
                                <span>{category.name}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* 2. Horizontal Filter Controls & Search Bar */}
                <div className="py-3 flex flex-wrap items-center justify-between gap-3">
                    {/* Left: Search & Filter Pills */}
                    <div className="flex items-center flex-wrap gap-2.5 flex-1 min-w-[280px]">
                        {/* Search Input Pill */}
                        <div className="relative min-w-[220px] max-w-sm flex-1">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search destination, river, trek..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full pl-10 pr-8 py-2 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                            />
                            {query && (
                                <button
                                    type="button"
                                    onClick={() => { setQuery(''); updateUrl({ q: '' }); }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Budget Dropdown Pill */}
                        <div className="relative" ref={priceDropdownRef}>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsPriceDropdownOpen(!isPriceDropdownOpen);
                                    setIsSortDropdownOpen(false);
                                }}
                                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all border ${isPriceActive ? 'bg-primary-50 border-primary-300 text-primary-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                            >
                                <SlidersHorizontal className="w-3.5 h-3.5" />
                                <span>
                                    {isPriceActive ? `Max: ₹${Number(maxPrice).toLocaleString('en-IN')}` : 'Budget'}
                                </span>
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isPriceDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Budget Dropdown Popover */}
                            {isPriceDropdownOpen && (
                                <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 z-40 animate-in fade-in-50 zoom-in-95 duration-150">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Direct Host Budget</span>
                                        <span className="text-xs font-extrabold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md">
                                            {maxPrice === '50000' ? '₹50,000+' : `₹${Number(maxPrice).toLocaleString('en-IN')}`}
                                        </span>
                                    </div>

                                    <div className="py-2">
                                        <input
                                            type="range"
                                            min="500"
                                            max="50000"
                                            step="500"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                            className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-primary-600"
                                        />
                                        <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-1">
                                            <span>₹500</span>
                                            <span>₹50,000+</span>
                                        </div>
                                    </div>

                                    {/* Presets */}
                                    <div className="grid grid-cols-2 gap-1.5 mt-3 pt-3 border-t border-gray-100">
                                        {BUDGET_PRESETS.map((preset) => (
                                            <button
                                                key={preset.value}
                                                type="button"
                                                onClick={() => {
                                                    setMaxPrice(preset.value);
                                                    updateUrl({ maxPrice: preset.value });
                                                    setIsPriceDropdownOpen(false);
                                                }}
                                                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all text-center ${maxPrice === preset.value ? 'bg-primary-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/60'}`}
                                            >
                                                {preset.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Done CTA */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            updateUrl({ maxPrice });
                                            setIsPriceDropdownOpen(false);
                                        }}
                                        className="w-full mt-3 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors"
                                    >
                                        Apply Budget
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Sort Dropdown Pill */}
                        <div className="relative" ref={sortDropdownRef}>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsSortDropdownOpen(!isSortDropdownOpen);
                                    setIsPriceDropdownOpen(false);
                                }}
                                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all border ${urlSort ? 'bg-primary-50 border-primary-300 text-primary-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                            >
                                <span>{activeSortLabel}</span>
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isSortDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Sort Popover */}
                            {isSortDropdownOpen && (
                                <div className="absolute left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-200 p-1.5 z-40 animate-in fade-in-50 zoom-in-95 duration-150">
                                    {SORT_OPTIONS.map((option) => {
                                        const isSelected = urlSort === option.value;
                                        return (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => {
                                                    updateUrl({ sort: option.value });
                                                    setIsSortDropdownOpen(false);
                                                }}
                                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors text-left ${isSelected ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                                            >
                                                <span>{option.label}</span>
                                                {isSelected && <Check className="w-3.5 h-3.5 text-primary-600" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Reset All Filters Pill */}
                        {hasActiveFilters && (
                            <Link
                                href="/packages"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
                            >
                                <RotateCcw className="w-3 h-3" />
                                <span>Clear all</span>
                            </Link>
                        )}
                    </div>

                    {/* Right: Results Count */}
                    <div className="shrink-0 text-xs font-bold text-gray-500">
                        <span className="text-gray-900 font-extrabold">{totalCount}</span> {totalCount === 1 ? 'experience' : 'experiences'}
                    </div>
                </div>

            </div>
        </div>
    );
}
