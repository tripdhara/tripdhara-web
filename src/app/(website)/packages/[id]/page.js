import { cache } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import PackageGallery from '@/app/components/packages/PackageGallery.js';
import PackageBookingForm from '@/app/components/packages/PackageBookingForm.js';
import PackageCard from '@/app/components/packages/PackageCard.js';
import QuickStatsBar from '@/app/components/packages/QuickStatsBar.js';
import PackageShareButton from '@/app/components/packages/PackageShareButton.js';
import PackageMobileBookingBar from '@/app/components/packages/PackageMobileBookingBar.js';

import createMetadata from '@/core/Helpers/metadata.js';
import api from '@/core/Api/public/index.js';
import { getLogger } from '@/core/Lib/logger.js';
import { BRAND_ASSETS } from '@/core/Constants/base.js';

import {
    MapPin,
    Clock,
    CheckCircle,
    Info,
    ShieldCheck,
    Map,
    FileText,
    ShieldAlert,
    Check,
    UserCheck,
    Star,
    Sparkles,
    Phone,
    HeartHandshake,
    Compass,
    ChevronRight,
    MessageCircle
} from 'lucide-react';

const DEFAULT_IMAGE = BRAND_ASSETS.DEFAULT_COVER;
const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tripdhara.in';

const getPackageDetails = cache(async (id) => {
    try {
        const result = await api.package.getById(id);
        return result?.data || null;
    } catch (error) {
        getLogger().error({ err: error, id }, '[PackageDetailPage] Failed to fetch package details');
        return null;
    }
});

const getSuggestedPackage = cache(async (currentId) => {
    try {
        const results = await api.package.getBrowse({ limit: 5, format: 'flat' });
        const allPackages = results?.data || [];
        const currentIdStr = String(currentId);
        return allPackages
            .filter(p => String(p._id) !== currentIdStr && String(p.id) !== currentIdStr)
            .slice(0, 4);
    } catch (error) {
        getLogger().error({ err: error, currentId }, '[PackageDetailPage] Failed to fetch suggested packages');
        return [];
    }
});

// Dynamic SEO & Social Sharing Metadata
export async function generateMetadata({ params }) {
    try {
        const { id } = await params;
        const service = await getPackageDetails(id);
        if (!service) {
            return createMetadata({ title: 'Package Not Found', noIndex: true });
        }

        const title = service.title || 'Himalayan Experience';
        const address = service.address || 'Uttarakhand & Himalayas, India';
        const category = service.category_name || 'Experience';
        const metaTitle = `${title} - ${category} in ${address}`;

        const description = service.description || `Book ${title} in ${address} directly with verified local hosts on Tripdhara.`;
        const rawPhoto = Array.isArray(service.photos) ? service.photos[0] : service.photos;
        const image = (typeof rawPhoto === 'string' ? rawPhoto : rawPhoto?.url) || DEFAULT_IMAGE;

        return createMetadata({
            title: metaTitle,
            description,
            image,
            path: `packages/${id}`
        });
    } catch (error) {
        getLogger().error({ err: error }, '[PackageDetailPage] Failed to generate metadata');
        return createMetadata({ title: 'Package Details', noIndex: true });
    }
}

export default async function ServiceDetailPage({ params }) {
    const { id } = await params;
    const [service, suggestions] = await Promise.all([
        getPackageDetails(id),
        getSuggestedPackage(id)
    ]);

    if (!service) {
        return (
            <div className="min-h-[75vh] bg-gray-950 flex items-center justify-center py-24 px-4 text-center">
                <div className="max-w-md">
                    <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-6 text-secondary-400 shadow-2xl">
                        <MapPin className="w-8 h-8" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest border border-white/20 mb-3 inline-block">
                        Tripdhara Catalog
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 font-display">Experience Not Found</h2>
                    <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                        The Himalayan stay, trek, or adventure you are looking for has been archived or is temporarily unavailable.
                    </p>
                    <Link
                        href="/packages"
                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-primary-500/25 hover:scale-105"
                    >
                        <Compass className="w-4 h-4" />
                        <span>Explore All Packages</span>
                    </Link>
                </div>
            </div>
        );
    }

    const title = service.title || 'Himalayan Experience';
    const description = service.description;
    const address = service.address || 'Uttarakhand & Himalayas, India';
    const price = service.pricing?.sellingPrice || 0;
    const category = service.category_name || 'Experience';

    // Photos list
    const rawPhotos = service.photos || [];
    const photosList = (Array.isArray(rawPhotos) ? rawPhotos : [rawPhotos])
        .map(p => (typeof p === 'string' ? p : p?.url))
        .filter(Boolean);

    const displayPhotos = photosList.length > 0 ? photosList : [DEFAULT_IMAGE];
    const mainPhoto = displayPhotos[0];

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': category?.toLowerCase()?.includes('homestay') || category?.toLowerCase()?.includes('hotel') ? 'VacationRental' : 'TouristTrip',
                '@id': `${siteUrl}/packages/${id}#experience`,
                name: title,
                description: description || `${title} in ${address}`,
                image: mainPhoto,
                touristType: ['Adventure', 'Nature', 'Culture'],
                provider: {
                    '@type': 'TravelAgency',
                    name: 'Tripdhara',
                    url: siteUrl,
                },
                offers: {
                    '@type': 'Offer',
                    price: price || 0,
                    priceCurrency: 'INR',
                    availability: 'https://schema.org/InStock',
                    url: `${siteUrl}/packages/${id}`,
                },
                ...(service.location?.coordinates?.coordinates && {
                    geo: {
                        '@type': 'GeoCoordinates',
                        latitude: service.location.coordinates.coordinates[1],
                        longitude: service.location.coordinates.coordinates[0],
                    }
                }),
                ...(address && {
                    contentLocation: {
                        '@type': 'Place',
                        name: address,
                        address: {
                            '@type': 'PostalAddress',
                            addressRegion: address,
                            addressCountry: 'IN'
                        }
                    }
                })
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Home',
                        item: siteUrl,
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: 'Packages',
                        item: `${siteUrl}/packages`,
                    },
                    {
                        '@type': 'ListItem',
                        position: 3,
                        name: title,
                        item: `${siteUrl}/packages/${id}`,
                    }
                ]
            }
        ]
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-24 font-sans selection:bg-primary-500 selection:text-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Cinematic Himalayan Hero Banner */}
            <header className="relative bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white pt-28 sm:pt-32 pb-16 lg:pb-24 overflow-hidden border-b border-gray-800/80">
                {/* Atmospheric Radial Glows */}
                <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-primary-600/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-secondary-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.12),transparent_70%)] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Breadcrumbs Navigation */}
                    <nav aria-label="Breadcrumb" className="flex items-center text-xs font-semibold text-gray-400 gap-2 mb-6 overflow-x-auto whitespace-nowrap custom-scrollbar py-1">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-600 shrink-0" />
                        <Link href="/packages" className="hover:text-white transition-colors">Packages</Link>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-600 shrink-0" />
                        {service.category_slug && (
                            <>
                                <Link
                                    href={`/packages?category=${service.category_slug}`}
                                    className="hover:text-white transition-colors capitalize text-secondary-400"
                                >
                                    {category}
                                </Link>
                                <ChevronRight className="w-3.5 h-3.5 text-gray-600 shrink-0" />
                            </>
                        )}
                        <span className="text-gray-200 truncate font-bold">{title}</span>
                    </nav>

                    {/* Badge Row & Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                        <div className="flex flex-wrap items-center gap-2.5">
                            {/* Category Pill with Glowing Pulse Dot */}
                            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/20 text-primary-300 border border-primary-500/30 text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-lg shadow-primary-950/30">
                                <span className="w-2 h-2 rounded-full bg-secondary-400 animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                                {category}
                            </span>

                            {/* Verified Local Host Pill */}
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold backdrop-blur-md">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                Verified Himalayan Partner
                            </span>

                            {/* Rating Badge */}
                            {service.rating?.average > 0 && (
                                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-white border border-white/15 text-xs font-bold backdrop-blur-md">
                                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                    <span>{service.rating.average}</span>
                                    {service.rating.count ? <span className="text-gray-400 font-normal">({service.rating.count} reviews)</span> : null}
                                </span>
                            )}

                            {/* Meals or Special Perk Pill */}
                            {service.mealsIncluded && (
                                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold backdrop-blur-md">
                                    <Check className="w-3.5 h-3.5 text-amber-400" />
                                    {service.mealType || 'Organic Pahadi Meals'}
                                </span>
                            )}
                        </div>

                        {/* Direct Action Toolbar */}
                        <div className="flex items-center gap-2.5">
                            <PackageShareButton title={title} />

                            <a
                                href="tel:+917017288052"
                                aria-label="Call Tripdhara Helpline"
                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md text-xs font-bold transition-all duration-200 shadow-sm hover:scale-[1.02] active:scale-95"
                            >
                                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Desk: +91 7017288052</span>
                            </a>
                        </div>
                    </div>

                    {/* Master Headline */}
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-display tracking-tight leading-[1.1] max-w-5xl drop-shadow-md">
                        {title}
                    </h1>

                    {/* Location Badge */}
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-300 font-medium">
                        <span className="flex items-center gap-1.5 text-gray-200 font-semibold">
                            <MapPin className="w-4 h-4 text-primary-400 shrink-0" />
                            <span>{address}</span>
                        </span>
                        <span className="hidden sm:inline text-gray-600">•</span>
                        <span className="text-gray-400 text-xs sm:text-sm">Direct Host Booking • Zero Middleman Markup</span>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 relative z-20">

                {/* Interactive Photo Showcase Gallery */}
                <PackageGallery photos={displayPhotos} title={title} />

                {/* Quick Stats Bar Component */}
                <QuickStatsBar service={service} />

                {/* Main 2-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

                    {/* Left Column (8 cols): Story, Details, Itinerary, Host */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Tripdhara Direct Host Guarantee Banner */}
                        <div className="bg-gradient-to-r from-emerald-950/90 via-gray-900 to-teal-950/90 text-white rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                            <div className="flex items-start sm:items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-lg backdrop-blur-md">
                                    <ShieldCheck className="w-7 h-7" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block mb-1">
                                        Tripdhara Sovereign Guarantee
                                    </span>
                                    <h3 className="font-black text-white text-lg sm:text-xl font-display leading-tight">
                                        100% Direct Local Host Rate • Zero Middleman
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-300 font-normal mt-1 leading-relaxed">
                                        Your payment directly supports verified Himalayan hosts and mountain guides in Uttarakhand &amp; Himachal. Guaranteed honest local rates with zero platform markups.
                                    </p>
                                </div>
                            </div>
                            <span className="shrink-0 text-[11px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-500/10 px-4 py-2 rounded-2xl border border-emerald-500/30 backdrop-blur-md">
                                Fair Mountain Economy
                            </span>
                        </div>

                        {/* About this Himalayan Experience */}
                        <section className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-100 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.05)] ring-1 ring-gray-900/5 hover:border-gray-200 transition-all duration-300">
                            <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-gray-100">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-500 text-white flex items-center justify-center shadow-md shadow-primary-500/25 shrink-0">
                                    <Info className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-primary-600 block">
                                        Himalayan Overview
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black text-gray-950 font-display tracking-tight">
                                        About this Experience
                                    </h2>
                                </div>
                            </div>

                            <div className="prose text-gray-700 leading-relaxed text-base sm:text-lg max-w-none">
                                {description ? (
                                    <p className="whitespace-pre-line">{description}</p>
                                ) : (
                                    <p>
                                        Immerse yourself in the majesty of {title}. Curated directly with verified local hosts across {address} to deliver authentic Pahadi hospitality, certified mountain safety protocols, and deeply memorable Himalayan trails.
                                    </p>
                                )}
                            </div>

                            {/* Key Highlights Row */}
                            <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
                                    <Sparkles className="w-5 h-5 text-secondary-500 mb-2" />
                                    <h4 className="font-bold text-gray-950 text-xs sm:text-sm">Authentic &amp; Raw</h4>
                                    <p className="text-[11px] text-gray-500 mt-0.5">Handpicked by mountain residents</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
                                    <ShieldCheck className="w-5 h-5 text-emerald-600 mb-2" />
                                    <h4 className="font-bold text-gray-950 text-xs sm:text-sm">Verified Partner</h4>
                                    <p className="text-[11px] text-gray-500 mt-0.5">Physical background vetted</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
                                    <HeartHandshake className="w-5 h-5 text-primary-600 mb-2" />
                                    <h4 className="font-bold text-gray-950 text-xs sm:text-sm">Community Uplift</h4>
                                    <p className="text-[11px] text-gray-500 mt-0.5">Supports local families</p>
                                </div>
                            </div>
                        </section>

                        {/* What's Included & Inclusions */}
                        {(service.amenities || service.activitiesIncluded || service.inclusions) && (
                            <section className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-100 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.05)] ring-1 ring-gray-900/5 hover:border-gray-200 transition-all duration-300">
                                <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-gray-100">
                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/25 shrink-0">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block">
                                            Perks &amp; Amenities
                                        </span>
                                        <h3 className="text-2xl sm:text-3xl font-black text-gray-950 font-display tracking-tight">
                                            What&apos;s Included
                                        </h3>
                                    </div>
                                </div>

                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    {(typeof service.amenities === 'string'
                                        ? service.amenities.split(',').map(s => s.trim())
                                        : (service.amenities || service.activitiesIncluded || service.inclusions || [])
                                    ).map((item, i) => (
                                        <li
                                            key={i}
                                            className="flex items-center text-gray-800 bg-gray-50/80 hover:bg-gray-50 border border-gray-200/60 p-4 rounded-2xl transition-all duration-200 hover:border-emerald-300"
                                        >
                                            <div className="bg-emerald-100 text-emerald-700 rounded-full p-1 mr-3 shrink-0">
                                                <Check className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="font-bold text-xs sm:text-sm">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Day-by-Day Mountain Itinerary */}
                        {service.itinerary && service.itinerary.length > 0 && (
                            <section className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-100 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.05)] ring-1 ring-gray-900/5 hover:border-gray-200 transition-all duration-300">
                                <div className="flex items-center gap-3.5 mb-8 pb-4 border-b border-gray-100">
                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 to-secondary-500 text-white flex items-center justify-center shadow-md shadow-primary-500/25 shrink-0">
                                        <Map className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-wider text-primary-600 block">
                                            Trail Route &amp; Milestones
                                        </span>
                                        <h3 className="text-2xl sm:text-3xl font-black text-gray-950 font-display tracking-tight">
                                            Day-by-Day Itinerary
                                        </h3>
                                    </div>
                                </div>

                                <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary-500 before:via-secondary-400 before:to-emerald-500">
                                    {service.itinerary.map((item, i) => (
                                        <div key={i} className="relative flex items-start space-x-4">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 to-secondary-600 text-white font-black text-sm shadow-lg shadow-primary-500/25 shrink-0 z-10">
                                                {i + 1}
                                            </div>
                                            <div className="flex-1 p-6 rounded-2xl bg-gray-50/80 hover:bg-gray-50 border border-gray-100 transition-all duration-200">
                                                <span className="text-[10px] font-black uppercase tracking-wider text-primary-600 bg-primary-50 px-2.5 py-0.5 rounded-md mb-2 inline-block border border-primary-200/60">
                                                    Day {item.day || (i + 1)}
                                                </span>
                                                <h4 className="text-base sm:text-lg font-bold text-gray-950 mb-1.5">{item.title}</h4>
                                                <p className="text-sm text-gray-600 leading-relaxed font-normal">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Policies & Important Things to Know */}
                        {(service.policies?.cancellationPolicy ||
                            service.policies?.instructions ||
                            service.policies?.medicalCertificate ||
                            service.policies?.isCouplesFriendly ||
                            service.policies?.isPetFriendly ||
                            service.policies?.isSmokingAllowed ||
                            service.policies?.isMusicAllowed ||
                            service.details?.checkInTime) && (
                            <section className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-100 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.05)] ring-1 ring-gray-900/5 hover:border-gray-200 transition-all duration-300">
                                <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-gray-100">
                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/25 shrink-0">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 block">
                                            Guidelines &amp; House Rules
                                        </span>
                                        <h3 className="text-2xl sm:text-3xl font-black text-gray-950 font-display tracking-tight">
                                            Important Things to Know
                                        </h3>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {service.policies?.cancellationPolicy && (
                                        <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200/70">
                                            <h4 className="font-bold text-amber-950 mb-1.5 flex items-center text-xs uppercase tracking-wider">
                                                <ShieldAlert className="w-4 h-4 mr-1.5 text-amber-700" />
                                                Cancellation Policy
                                            </h4>
                                            <p className="text-xs text-amber-900/80 leading-relaxed font-medium">
                                                {service.policies.cancellationPolicy}
                                            </p>
                                        </div>
                                    )}

                                    {service.policies?.instructions && (
                                        <div className="bg-blue-50/70 p-5 rounded-2xl border border-blue-200/70">
                                            <h4 className="font-bold text-blue-950 mb-1.5 flex items-center text-xs uppercase tracking-wider">
                                                <Info className="w-4 h-4 mr-1.5 text-blue-700" />
                                                Instructions &amp; Guidelines
                                            </h4>
                                            <p className="text-xs text-blue-900/80 leading-relaxed font-medium">
                                                {service.policies.instructions}
                                            </p>
                                        </div>
                                    )}

                                    {(service.details?.checkInTime || service.details?.checkOutTime) && (
                                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200/70 col-span-1 md:col-span-2 flex items-center space-x-8">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
                                                    <Clock className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                                                        CHECK-IN
                                                    </span>
                                                    <span className="font-extrabold text-sm text-gray-900">
                                                        {service.details.checkInTime || '12:00 PM'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="h-8 w-px bg-gray-200" />

                                            <div className="flex items-center space-x-3">
                                                <div className="w-9 h-9 rounded-xl bg-secondary-100 text-secondary-700 flex items-center justify-center">
                                                    <Clock className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                                                        CHECK-OUT
                                                    </span>
                                                    <span className="font-extrabold text-sm text-gray-900">
                                                        {service.details.checkOutTime || '11:00 AM'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Feature Pills */}
                                    <div className="col-span-1 md:col-span-2 flex flex-wrap gap-2 pt-2">
                                        {service.policies?.isCouplesFriendly && (
                                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-pink-50 text-pink-700 text-xs font-bold border border-pink-200">
                                                <Check className="w-3.5 h-3.5 mr-1 text-pink-600" /> Couples Friendly
                                            </span>
                                        )}
                                        {service.policies?.isPetFriendly && (
                                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                                                <Check className="w-3.5 h-3.5 mr-1 text-indigo-600" /> Pet Friendly
                                            </span>
                                        )}
                                        {service.policies?.isSmokingAllowed && (
                                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                                                <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Smoking Allowed
                                            </span>
                                        )}
                                        {service.policies?.isMusicAllowed && (
                                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
                                                <Check className="w-3.5 h-3.5 mr-1 text-purple-600" /> Music Allowed
                                            </span>
                                        )}
                                        {service.policies?.medicalCertificate && (
                                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                                                <ShieldAlert className="w-3.5 h-3.5 mr-1 text-rose-600" /> Medical Certificate Required
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Meet Your Mountain Host */}
                        {service.business && (
                            <section className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-100 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.05)] ring-1 ring-gray-900/5 hover:border-gray-200 transition-all duration-300">
                                <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-gray-100">
                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-500 text-white flex items-center justify-center shadow-md shadow-primary-500/25 shrink-0">
                                        <UserCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-wider text-primary-600 block">
                                            Local Stewardship
                                        </span>
                                        <h3 className="text-2xl sm:text-3xl font-black text-gray-950 font-display tracking-tight">
                                            Meet Your Mountain Host
                                        </h3>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-start gap-6">
                                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-primary-100 to-secondary-100 flex items-center justify-center text-3xl font-black text-primary-700 border-2 border-white shadow-lg shrink-0 overflow-hidden">
                                        {service.business.profileImage ? (
                                            <Image
                                                src={service.business.profileImage}
                                                alt={service.business.businessName || 'Host'}
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            service.business.businessName?.[0]?.toUpperCase() || 'H'
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center flex-wrap gap-2.5 mb-2">
                                            <h4 className="text-lg sm:text-xl font-bold text-gray-950">
                                                {service.business.businessName || 'Verified Himalayan Partner'}
                                            </h4>
                                            {service.business.trustBadge && service.business.trustBadge !== 'none' && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider">
                                                    <ShieldCheck className="w-3 h-3 mr-1" />
                                                    {service.business.trustBadge.replace('_', ' ')}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 font-medium mb-3">
                                            {service.business.profileType || 'Local Partner'} • Member since{' '}
                                            {service.business.createdAt ? new Date(service.business.createdAt).getFullYear() : 'Recent'}
                                        </p>
                                        {service.business.businessAbout && (
                                            <p className="text-gray-600 text-sm leading-relaxed bg-gray-50/80 p-5 rounded-2xl border border-gray-100">
                                                &ldquo;{service.business.businessAbout}&rdquo;
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Guest Reviews */}
                        {service.reviews && service.reviews.length > 0 && (
                            <section className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-gray-100 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.05)] ring-1 ring-gray-900/5 hover:border-gray-200 transition-all duration-300">
                                <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-gray-100">
                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-yellow-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-yellow-500/25 shrink-0">
                                        <Star className="w-5 h-5 fill-current" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-wider text-yellow-600 block">
                                            Community Feedback
                                        </span>
                                        <h3 className="text-2xl sm:text-3xl font-black text-gray-950 font-display tracking-tight">
                                            Traveller Reviews ({service.reviews.length})
                                        </h3>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {service.reviews.map((review, idx) => (
                                        <div key={review.id || review._id || idx} className="p-5 rounded-2xl bg-gray-50/70 border border-gray-100">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-2xl bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-xs overflow-hidden shrink-0">
                                                        {review.user?.profileImage ? (
                                                            <Image
                                                                src={review.user.profileImage}
                                                                alt={review.user.name || 'User'}
                                                                width={40}
                                                                height={40}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            review.user?.name?.[0]?.toUpperCase() || 'G'
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h5 className="font-bold text-gray-900 text-sm">{review.user?.name || 'Verified Traveller'}</h5>
                                                        <span className="text-[11px] text-gray-400">
                                                            {new Date(review.createdAt).toLocaleDateString('en-IN', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center text-yellow-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>

                                            {review.reply && review.reply.comment && (
                                                <div className="mt-3.5 ml-4 bg-white p-4 rounded-2xl border border-gray-200 text-xs shadow-sm">
                                                    <span className="font-bold text-primary-800 flex items-center gap-1.5 mb-1">
                                                        <MessageCircle className="w-3.5 h-3.5 text-primary-600" /> Host Response:
                                                    </span>
                                                    <p className="text-gray-700 leading-relaxed">{review.reply.comment}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                    </div>

                    {/* Right Column (4 cols): Sticky Booking Form */}
                    <div className="lg:col-span-4 relative">
                        <PackageBookingForm service={service} price={price} />
                    </div>

                </div>

                {/* Similar Himalayan Experiences Section */}
                {suggestions && suggestions.length > 0 && (
                    <section className="mt-24 pt-12 border-t border-gray-200/80">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                            <div>
                                <span className="text-xs font-black uppercase tracking-wider text-primary-600 mb-1.5 block">
                                    More Across the Himalayas
                                </span>
                                <h2 className="text-2xl sm:text-4xl font-black text-gray-950 font-display tracking-tight">
                                    Similar Verified Experiences
                                </h2>
                            </div>
                            <Link
                                href="/packages"
                                className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700 underline"
                            >
                                <span>Browse complete catalog</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {suggestions.map((pkg, idx) => (
                                <PackageCard key={pkg._id || pkg.id || idx} item={pkg} />
                            ))}
                        </div>
                    </section>
                )}

            </main>

            {/* Mobile Sticky Booking Bar */}
            <PackageMobileBookingBar service={service} price={price} />
        </div>
    );
}
