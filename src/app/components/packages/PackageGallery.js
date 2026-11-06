'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Grid, ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';
import { BRAND_ASSETS } from '@/core/Constants/base.js';

export default function PackageGallery({ photos = [], title = 'Himalayan Experience' }) {
    const rawList = Array.isArray(photos) ? photos : [photos];
    const cleanList = rawList
        .map(p => (typeof p === 'string' ? p : p?.url))
        .filter(Boolean);

    const galleryPhotos = cleanList.length > 0 ? cleanList : [BRAND_ASSETS.DEFAULT_COVER];
    const totalPhotos = galleryPhotos.length;

    const [lightboxIndex, setLightboxIndex] = useState(null);

    const openLightbox = (index) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);

    const showPrev = useCallback(() => {
        setLightboxIndex((prev) => (prev > 0 ? prev - 1 : totalPhotos - 1));
    }, [totalPhotos]);

    const showNext = useCallback(() => {
        setLightboxIndex((prev) => (prev < totalPhotos - 1 ? prev + 1 : 0));
    }, [totalPhotos]);

    // Keyboard navigation
    useEffect(() => {
        if (lightboxIndex === null) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };

        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [lightboxIndex, showPrev, showNext]);

    const mainPhoto = galleryPhotos[0];
    const subPhotos = galleryPhotos.slice(1, 5);

    return (
        <section aria-label="Photo Gallery" className="relative mb-10">
            {/* Gallery Frame */}
            <div className="rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20 bg-gray-950 p-1 sm:p-2 relative group">

                {/* Multi-Photo Bento Grid (Desktop) */}
                {subPhotos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 sm:gap-3 rounded-[2rem] overflow-hidden max-h-[340px] sm:max-h-[480px]">
                        {/* Main Large Photo */}
                        <div
                            onClick={() => openLightbox(0)}
                            className="relative md:col-span-2 md:row-span-2 min-h-[280px] sm:min-h-[480px] bg-gray-900 cursor-pointer overflow-hidden group/main"
                        >
                            <Image
                                src={mainPhoto}
                                alt={`${title} - Primary Photo`}
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover group-hover/main:scale-105 transition-transform duration-700 ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent opacity-60 group-hover/main:opacity-40 transition-opacity" />

                            <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-950/70 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
                                    <Sparkles className="w-3 h-3 text-secondary-400" />
                                    Featured View
                                </span>
                            </div>
                        </div>

                        {/* Secondary Photos */}
                        {subPhotos.map((photoUrl, idx) => (
                            <div
                                key={idx}
                                onClick={() => openLightbox(idx + 1)}
                                className={`relative hidden md:block min-h-[235px] bg-gray-900 cursor-pointer overflow-hidden group/sub ${
                                    subPhotos.length === 1 ? 'col-span-2 row-span-2 min-h-[480px]' :
                                    subPhotos.length === 2 && idx === 1 ? 'col-span-2' : ''
                                }`}
                            >
                                <Image
                                    src={photoUrl}
                                    alt={`${title} - Photo ${idx + 2}`}
                                    fill
                                    sizes="25vw"
                                    className="object-cover group-hover/sub:scale-105 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/40 via-transparent to-transparent opacity-60 group-hover/sub:opacity-20 transition-opacity" />
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Single Panoramic Hero Photo */
                    <div
                        onClick={() => openLightbox(0)}
                        className="relative w-full h-[320px] sm:h-[460px] md:h-[500px] rounded-[2rem] overflow-hidden bg-gray-900 cursor-pointer group/single"
                    >
                        <Image
                            src={mainPhoto}
                            alt={title}
                            fill
                            priority
                            sizes="100vw"
                            className="object-cover group-hover/single:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent" />
                    </div>
                )}

                {/* View All Photos Button */}
                <button
                    type="button"
                    onClick={() => openLightbox(0)}
                    aria-label={`View all ${totalPhotos} photos`}
                    className="absolute bottom-5 right-5 sm:bottom-6 sm:right-6 z-20 px-4 py-2.5 rounded-2xl bg-gray-950/85 hover:bg-gray-950 text-white backdrop-blur-md border border-white/25 text-xs font-bold shadow-2xl flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                    <Grid className="w-4 h-4 text-secondary-400" />
                    <span>View all {totalPhotos} photos</span>
                </button>
            </div>

            {/* Lightbox Modal */}
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
                                onClick={showPrev}
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
                                onClick={showNext}
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

