'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
    Camera,
    ChevronLeft,
    ChevronRight,
    X,
    Maximize2,
    Sparkles
} from 'lucide-react';
import { BRAND_ASSETS } from '@/core/Constants/base.js';

export default function PackageGallery({ photos = [], title = 'Himalayan Experience' }) {
    const rawList = Array.isArray(photos) ? photos : [photos];
    const cleanList = rawList
        .map(p => (typeof p === 'string' ? p : p?.url))
        .filter(Boolean);

    const galleryPhotos = cleanList.length > 0 ? cleanList : [BRAND_ASSETS.DEFAULT_COVER];
    const totalPhotos = galleryPhotos.length;

    const [activeIndex, setActiveIndex] = useState(0);
    const [lightboxIndex, setLightboxIndex] = useState(null);

    const openLightbox = (index) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);

    const handlePrev = useCallback((e) => {
        if (e) e.stopPropagation();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalPhotos - 1));
    }, [totalPhotos]);

    const handleNext = useCallback((e) => {
        if (e) e.stopPropagation();
        setActiveIndex((prev) => (prev < totalPhotos - 1 ? prev + 1 : 0));
    }, [totalPhotos]);

    const showLightboxPrev = useCallback(() => {
        setLightboxIndex((prev) => (prev > 0 ? prev - 1 : totalPhotos - 1));
    }, [totalPhotos]);

    const showLightboxNext = useCallback(() => {
        setLightboxIndex((prev) => (prev < totalPhotos - 1 ? prev + 1 : 0));
    }, [totalPhotos]);

    // Keyboard navigation for Lightbox
    useEffect(() => {
        if (lightboxIndex === null) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showLightboxPrev();
            if (e.key === 'ArrowRight') showLightboxNext();
        };

        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [lightboxIndex, showLightboxPrev, showLightboxNext]);

    return (
        <section
            aria-label="Experience Photo Gallery"
            className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-100 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.05)] ring-1 ring-gray-900/5 hover:border-gray-200 transition-all duration-300"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 to-secondary-500 text-white flex items-center justify-center shadow-md shadow-primary-500/25 shrink-0">
                        <Camera className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-primary-600 block">
                            Visual Showcase
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-gray-950 font-display tracking-tight">
                            Experience Photos ({totalPhotos})
                        </h2>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => openLightbox(activeIndex)}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition shadow-sm cursor-pointer"
                >
                    <Maximize2 className="w-3.5 h-3.5 text-primary-600" />
                    <span>Fullscreen</span>
                </button>
            </div>

            {/* Featured Active Image Container */}
            <div
                onClick={() => openLightbox(activeIndex)}
                className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-gray-950 group cursor-pointer shadow-md"
            >
                <Image
                    src={galleryPhotos[activeIndex]}
                    alt={`${title} - Photo ${activeIndex + 1}`}
                    fill
                    priority
                    loading="eager"
                    sizes="(max-width: 1024px) 100vw, 65vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Left/Right Next/Prev Buttons on Main Image */}
                {totalPhotos > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={handlePrev}
                            aria-label="Previous photo"
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-gray-950/70 hover:bg-gray-950 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition hover:scale-110 active:scale-95 shadow-lg"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            aria-label="Next photo"
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-gray-950/70 hover:bg-gray-950 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition hover:scale-110 active:scale-95 shadow-lg"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}

                {/* Photo Badge bottom-left */}
                <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-gray-950/80 backdrop-blur-md text-white text-[11px] font-bold border border-white/20 flex items-center gap-1.5 shadow-md">
                        <Sparkles className="w-3 h-3 text-secondary-400" />
                        Photo {activeIndex + 1} of {totalPhotos}
                    </span>
                </div>

                {/* Expand Pill bottom-right */}
                <div className="absolute bottom-3 right-3 z-10">
                    <span className="px-3 py-1 rounded-full bg-gray-950/80 backdrop-blur-md text-white text-[11px] font-bold border border-white/20 flex items-center gap-1.5 shadow-md group-hover:bg-primary-600 transition-colors">
                        <Maximize2 className="w-3 h-3" />
                        <span>Click to expand</span>
                    </span>
                </div>
            </div>

            {/* Thumbnail Strip (if multiple photos) */}
            {totalPhotos > 1 && (
                <div className="mt-4 grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                    {galleryPhotos.map((thumbUrl, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveIndex(idx)}
                            aria-label={`Select photo ${idx + 1}`}
                            className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                                idx === activeIndex
                                    ? 'border-primary-600 ring-2 ring-primary-500/30 scale-[1.02] shadow-md'
                                    : 'border-gray-200/80 hover:border-gray-300 opacity-75 hover:opacity-100'
                            }`}
                        >
                            <Image
                                src={thumbUrl}
                                alt={`Thumbnail ${idx + 1}`}
                                fill
                                sizes="120px"
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Lightbox Modal (Fullscreen) */}
            {lightboxIndex !== null && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Photo Lightbox"
                    className="fixed inset-0 z-50 bg-gray-950/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 animate-fadeIn"
                >
                    {/* Top Bar */}
                    <div className="flex items-center justify-between z-10">
                        <div className="flex items-center gap-3">
                            <span className="px-3.5 py-1 rounded-full bg-white/10 text-white border border-white/15 text-xs font-bold backdrop-blur-md">
                                {lightboxIndex + 1} / {totalPhotos}
                            </span>
                            <span className="text-sm font-semibold text-gray-300 truncate max-w-xs sm:max-w-md hidden sm:inline">
                                {title}
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={closeLightbox}
                            aria-label="Close Lightbox"
                            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition border border-white/20 cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Main Image Area with Prev/Next Controls */}
                    <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
                        {totalPhotos > 1 && (
                            <button
                                type="button"
                                onClick={showLightboxPrev}
                                aria-label="Previous photo"
                                className="absolute left-2 sm:left-4 z-20 w-12 h-12 rounded-full bg-gray-900/80 hover:bg-gray-900 text-white flex items-center justify-center border border-white/20 transition-all hover:scale-110 active:scale-95 shadow-xl cursor-pointer"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        )}

                        <div className="relative w-full h-full max-w-5xl max-h-[75vh]">
                            <Image
                                src={galleryPhotos[lightboxIndex]}
                                alt={`${title} photo ${lightboxIndex + 1}`}
                                fill
                                sizes="100vw"
                                className="object-contain"
                                priority
                            />
                        </div>

                        {totalPhotos > 1 && (
                            <button
                                type="button"
                                onClick={showLightboxNext}
                                aria-label="Next photo"
                                className="absolute right-2 sm:right-4 z-20 w-12 h-12 rounded-full bg-gray-900/80 hover:bg-gray-900 text-white flex items-center justify-center border border-white/20 transition-all hover:scale-110 active:scale-95 shadow-xl cursor-pointer"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        )}
                    </div>

                    {/* Bottom Thumbnail Strip */}
                    {totalPhotos > 1 && (
                        <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 z-10 custom-scrollbar">
                            {galleryPhotos.map((thumbUrl, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setLightboxIndex(idx)}
                                    aria-label={`Jump to photo ${idx + 1}`}
                                    className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200 cursor-pointer ${
                                        idx === lightboxIndex
                                            ? 'border-primary-500 scale-105 shadow-lg shadow-primary-500/30'
                                            : 'border-white/20 opacity-50 hover:opacity-100'
                                    }`}
                                >
                                    <Image
                                        src={thumbUrl}
                                        alt={`Thumbnail ${idx + 1}`}
                                        fill
                                        sizes="64px"
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
