'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, MapPin, ChevronRight } from 'lucide-react';
import { BRAND_ASSETS } from '@/core/Constants/base.js';

const CATEGORY_BADGE_STYLES = {
    'homestay': 'bg-amber-600 text-white',
    'hotel': 'bg-blue-600 text-white',
    'camping': 'bg-emerald-600 text-white',
    'rafting': 'bg-cyan-600 text-white',
    'river-rafting': 'bg-cyan-600 text-white',
    'trekking': 'bg-emerald-700 text-white',
    'bungee-jumping': 'bg-rose-600 text-white',
    'bike-scooter-rental': 'bg-violet-600 text-white',
    'vehicle-rental': 'bg-violet-600 text-white',
    'chardham-tour': 'bg-amber-700 text-white',
    'custom-trip': 'bg-indigo-600 text-white'
};

export default function PackageCard({ item = {} }) {
    const id = item.id || item._id;
    const title = item.title || 'Himalayan Experience';
    const categorySlug = (item.category_slug || '').toLowerCase();
    const categoryName = item.category_name || 'Himalayan Experience';
    const address = item.address || 'Uttarakhand & Himalayas';
    const sellingPrice = item.pricing?.sellingPrice || 0;
    const basePrice = item.pricing?.basePrice;

    const [isWishlisted, setIsWishlisted] = useState(Boolean(item.wishlist));

    // Robust image URL extraction
    const rawPhoto = Array.isArray(item.photos) ? item.photos[0] : item.photos;
    const image = (typeof rawPhoto === 'string' ? rawPhoto : rawPhoto?.url) || BRAND_ASSETS.DEFAULT_COVER;
    const ratingAverage = item.rating?.average && Number(item.rating.average) > 0 ? Number(item.rating.average).toFixed(1) : null;
    const ratingCount = item.rating?.count || 0;

    const badgeStyle = CATEGORY_BADGE_STYLES[categorySlug] || 'bg-gray-900 text-white';

    return (
        <Link
            href={`/packages/${id}`}
            className="group flex flex-col bg-white rounded-2xl border border-gray-200/80 hover:border-gray-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Top-Left Category Badge */}
                <div className="absolute top-3 left-3 z-10">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm ${badgeStyle}`}>
                        {categoryName}
                    </span>
                </div>

                {/* Top-Right Wishlist Button */}
                <div className="absolute top-3 right-3 z-10">
                    <button
                        type="button"
                        aria-label="Save to Wishlist"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsWishlisted(!isWishlisted);
                        }}
                        className="w-8 h-8 rounded-full bg-white/80 hover:bg-white backdrop-blur-md flex items-center justify-center text-gray-700 shadow-sm transition-all duration-200"
                    >
                        <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? 'text-rose-500 fill-rose-500' : 'text-gray-700 hover:text-rose-500'}`} />
                    </button>
                </div>
            </div>

            {/* Card Content Body */}
            <div className="p-4 flex flex-col flex-1">
                {/* Location & Rating Header Row */}
                <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
                    <div className="flex items-center space-x-1 text-gray-500 font-medium truncate">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">{address}</span>
                    </div>

                    {ratingAverage ? (
                        <div className="flex items-center space-x-1 shrink-0 font-bold text-gray-900">
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                            <span>{ratingAverage}</span>
                            {ratingCount > 0 && (
                                <span className="text-gray-400 font-normal text-[11px]">({ratingCount})</span>
                            )}
                        </div>
                    ) : (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                            New
                        </span>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-sm sm:text-base font-extrabold text-gray-950 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug mb-3 font-display">
                    {title}
                </h3>

                {/* Pricing Footer */}
                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Direct Host Rate
                        </div>
                        <div className="flex items-baseline space-x-1">
                            <span className="text-lg sm:text-xl font-black text-gray-950 tracking-tight">
                                ₹{Number(sellingPrice).toLocaleString('en-IN')}
                            </span>
                            {basePrice && Number(basePrice) > Number(sellingPrice) && (
                                <span className="text-xs text-gray-400 line-through">
                                    ₹{Number(basePrice).toLocaleString('en-IN')}
                                </span>
                            )}
                            <span className="text-xs text-gray-500 font-medium">/ person</span>
                        </div>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-primary-600 text-gray-600 group-hover:text-white flex items-center justify-center transition-all shadow-sm">
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
