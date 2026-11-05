import { cache } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import PackageBookingForm from '@/app/components/packages/PackageBookingForm.js';
import PackageCard from '@/app/components/packages/PackageCard.js';
import QuickStatsBar from '@/app/components/packages/QuickStatsBar.js';

import createMetadata from '@/app/helper/metadata.js';
import api from '@/core/Api/public/index.js'

import { MapPin, Clock, Mountain, CheckCircle, Info, ShieldCheck, Map, FileText, ShieldAlert, Check, UserCheck, Users, Home as HomeIcon, Key, Car, Fuel, Star } from 'lucide-react';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop';
const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tripdhara.in';

const getPackageDetails = cache(async (id) => {
    try {
        const result = await api.package.getById(id);
        return result?.data || {};
    } catch (error) {
    }
});

const getSuggestedPackage = cache(async (currentId) => {
    try {
        const results = await api.package.getBrowse({ limit: 5, format: 'flat' });
        const allPackages = results?.data || [];
        return allPackages.filter(p => (p._id !== currentId && p.id !== currentId)).slice(0, 4);
    } catch (error) { }
});

// 3. Dynamic Metadata
export async function generateMetadata({ params }) {
    try {
        const { id } = await params;
        const service = await getPackageDetails(id);
        if (!service) {
            return createMetadata({ title: 'Package Not Found', noIndex: true });
        }

        const title = service.title || 'Package Details';
        const address = service.address || 'Himachal Pradesh';
        const category = service.category_name || 'Package';
        const metaTitle = `${title} - ${category} in ${address}`;

        const description = service.description || `Book ${title} in ${address} at best rates on Tripdhara.`;
        const image = service.photos?.[0]?.url || service.photos?.[0] || DEFAULT_IMAGE;
        return createMetadata({
            title: metaTitle,
            description,
            image,
            path: `packages/${id}`
        });
    } catch (error) { }

}

export default async function ServiceDetailPage({ params }) {
    const { id } = await params;
    const [service, suggestions] = await Promise.all([
        getPackageDetails(id),
        getSuggestedPackage(id)
    ]);

    console.log('service', service);
    if (!service) {
        return (
            <div className="min-h-[60vh] bg-gray-50 flex items-center justify-center py-20">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Package Not Found</h2>
                    <p className="text-gray-500 mb-6">The package you are looking for is no longer available.</p>
                    <Link href="/packages" className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition">Back to Packages</Link>
                </div>
            </div>
        );
    }

    const title = service.title;
    const description = service.description;
    const address = service.address;
    const price = service.pricing?.sellingPrice;
    const category = service.category_name;
    const imageUrl = service.photos[0].url || service.photos[0] || DEFAULT_IMAGE;

    return (
        <div className="bg-gray-50 min-h-screen pb-25 font-sans">
            {/* Hero Section */}
            <div className="relative h-[55vh] sm:h-[65vh] lg:h-[72vh] min-h-[420px] sm:min-h-[500px] lg:min-h-[580px] w-full">
                <Image
                    src={imageUrl}
                    alt={title || 'Package Image'}
                    fill
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
                    className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gray-900/40 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-90"></div>

                <div className="absolute inset-0 flex items-center w-full px-4 sm:px-6 lg:px-8 text-white z-10">
                    <div className="max-w-7xl mx-auto w-full">
                        <div className="flex flex-wrap items-center justify-between">
                            <div className="mb-0 sm:mb-0 flex flex-wrap items-center gap-1 sm:gap-1">
                                <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-primary-600/90 backdrop-blur-md rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest text-white shadow-[0_0_15px_rgba(var(--color-primary-600),0.5)]">{category}</span>
                                <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest border border-white/30 shadow-sm">Verified Experiences</span>
                            </div>
                            <nav className="flex items-center text-xs font-semibold text-white/80 gap-1 sm:gap-1 overflow-hidden">
                                <Link href="/" className="hover:text-white transition-colors shrink-0">Home</Link>
                                <span>/</span>
                                <Link href="/packages" className="hover:text-white transition-colors shrink-0">Packages</Link>
                                <span>/</span>
                                <span className="text-white truncate max-w-[140px] sm:max-w-[240px] md:max-w-md">{title}</span>
                            </nav>
                        </div>
                        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black my-3 sm:my-4 leading-tight max-w-4xl tracking-tight font-display drop-shadow-lg">{title}</h1>
                        <p className="text-sm sm:text-base md:text-xl text-gray-200 flex items-center font-medium drop-shadow-md">
                            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 sm:mr-3 text-primary-400 shrink-0" />
                            <span className="line-clamp-1">{address || 'Location details unavailable'}</span>
                        </p>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-10 sm:-mt-16 md:-mt-12">

                {/* Floating Quick Stats Bar Component */}
                <QuickStatsBar service={service} />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-10">

                        {/* About Section */}
                        <section className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center font-display tracking-tight">
                                <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center mr-4">
                                    <Info className="w-5 h-5" />
                                </div>
                                About this Experience
                            </h2>
                            <div className="prose text-gray-600 leading-relaxed text-lg max-w-none">{description ? (<p>{description}</p>) : (<p>Experience the thrill of {title}. This package is specially curated to offer you an unforgettable journey combining comfort, safety, and breathtaking moments.</p>)}</div>
                        </section>

                        {/* Features/Amenities Grid */}
                        {(service.amenities || service.activitiesIncluded || service.inclusions) && (
                            <section className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100">
                                <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center font-display tracking-tight">
                                    <div className="w-10 h-10 rounded-xl bg-green-500 text-white flex items-center justify-center mr-4 shadow-sm">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    What's Included
                                </h3>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {(typeof service.amenities === 'string' ? service.amenities.split(',').map(s => s.trim()) : (service.amenities || service.activitiesIncluded || service.inclusions || [])).map((item, i) => (
                                        <li key={i} className="flex items-center text-gray-700 group bg-gray-50/50 hover:bg-gray-50 border border-gray-100 p-4 rounded-2xl transition-all duration-300 hover:shadow-sm hover:-translate-y-0.5">
                                            <div className="bg-white text-green-500 rounded-full p-1.5 mr-4 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                                                <CheckCircle className="w-4 h-4" />
                                            </div>
                                            <span className="font-semibold text-sm">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Itinerary Section */}
                        {service.itinerary && service.itinerary.length > 0 && (
                            <section className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100">
                                <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center font-display tracking-tight">
                                    <div className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center mr-4 shadow-sm">
                                        <Map className="w-5 h-5" />
                                    </div>
                                    Itinerary
                                </h3>
                                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                                    {service.itinerary.map((item, i) => (
                                        <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            {/* Timeline marker */}
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-primary-100 text-primary-600 font-black shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                                {i + 1}
                                            </div>

                                            {/* Card */}
                                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-bold uppercase tracking-widest text-primary-600">Day {item.day || (i + 1)}</span>
                                                </div>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
                                                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Policies Section */}
                        {(service.policies?.cancellationPolicy || service.policies?.instructions || service.policies?.medicalCertificate || service.policies?.isCouplesFriendly || service.policies?.isPetFriendly) && (
                            <section className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100">
                                <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center font-display tracking-tight">
                                    <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center mr-4 shadow-sm">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    Things to Know
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {service.policies?.cancellationPolicy && (
                                        <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100/50">
                                            <h4 className="font-bold text-orange-800 mb-2 flex items-center text-sm uppercase tracking-wide">
                                                <ShieldAlert className="w-4 h-4 mr-2" /> Cancellation Policy
                                            </h4>
                                            <p className="text-sm text-orange-900/80 leading-relaxed">{service.policies.cancellationPolicy}</p>
                                        </div>
                                    )}
                                    {service.policies?.instructions && (
                                        <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100/50">
                                            <h4 className="font-bold text-blue-800 mb-2 flex items-center text-sm uppercase tracking-wide">
                                                <Info className="w-4 h-4 mr-2" /> Instructions
                                            </h4>
                                            <p className="text-sm text-blue-900/80 leading-relaxed">{service.policies.instructions}</p>
                                        </div>
                                    )}
                                    {/* Tags */}
                                    <div className="col-span-1 md:col-span-2 flex flex-wrap gap-3 mt-2">
                                        {service.policies?.isCouplesFriendly && <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-pink-50 text-pink-700 text-xs font-bold border border-pink-100"><Check className="w-3.5 h-3.5 mr-1.5" /> Couples Friendly</span>}
                                        {service.policies?.isPetFriendly && <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100"><Check className="w-3.5 h-3.5 mr-1.5" /> Pet Friendly</span>}
                                        {service.policies?.medicalCertificate && <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-bold border border-red-100"><ShieldAlert className="w-3.5 h-3.5 mr-1.5" /> Medical Certificate Req.</span>}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Vendor Profile */}
                        {service.business && (
                            <section className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100 overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-100/50 to-transparent rounded-bl-full -z-0"></div>
                                <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center font-display tracking-tight relative z-10">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center mr-4 shadow-sm">
                                        <UserCheck className="w-5 h-5" />
                                    </div>
                                    Meet your Host
                                </h3>
                                <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-primary-100 to-primary-200 flex items-center justify-center text-3xl font-black text-primary-700 border-4 border-white shadow-md flex-shrink-0 overflow-hidden">
                                        {service.business.profileImage ? (
                                            <Image src={service.business.profileImage} alt={service.business.businessName || 'Host Profile'} width={60} height={60} className="w-full h-full object-cover" />
                                        ) : (
                                            service.business.businessName?.[0]?.toUpperCase() || 'V'
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center flex-wrap gap-2 mb-2">
                                            <h4 className="text-xl font-bold text-gray-900">{service.business.businessName || 'Verified Partner'}</h4>
                                            {service.business.trustBadge && service.business.trustBadge !== 'none' && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-green-100 text-green-800 text-[10px] font-bold uppercase tracking-wider">
                                                    <ShieldCheck className="w-3 h-3 mr-1" /> {service.business.trustBadge.replace('_', ' ')}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 font-medium mb-4">{service.business.profileType || 'Local Business'} • Member since {service.business.createdAt ? new Date(service.business.createdAt).getFullYear() : 'Recent'}</p>
                                        {service.business.businessAbout && (
                                            <p className="text-gray-600 leading-relaxed text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">{service.business.businessAbout}</p>
                                        )}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Reviews Section */}
                        {service.reviews && service.reviews.length > 0 && (
                            <section className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100">
                                <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center font-display tracking-tight">
                                    <div className="w-10 h-10 rounded-xl bg-yellow-500 text-white flex items-center justify-center mr-4 shadow-sm">
                                        <Star className="w-5 h-5 fill-current" />
                                    </div>
                                    Guest Reviews
                                </h3>

                                <div className="space-y-6">
                                    {service.reviews.map((review, idx) => (
                                        <div key={review.id || review._id || idx} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                                            <div className="flex items-center mb-3">
                                                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center overflow-hidden mr-3">
                                                    {review.user?.profileImage ? (
                                                        <Image src={review.user.profileImage} alt={review.user.name || 'User Avatar'} width={40} height={40} className="w-full h-full object-cover" />
                                                    ) : (
                                                        review.user?.name?.[0]?.toUpperCase() || 'G'
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900">{review.user?.name || 'Guest User'}</h4>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <div className="flex text-yellow-400 mr-2">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                                                            ))}
                                                        </div>
                                                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-gray-700 leading-relaxed text-sm bg-gray-50/50 p-4 rounded-xl border border-gray-100">{review.comment}</p>

                                            {review.reply && review.reply.comment && (
                                                <div className="mt-4 ml-8 bg-primary-50/50 p-4 rounded-xl border border-primary-100/50">
                                                    <div className="flex items-center mb-1 text-sm font-bold text-primary-800">
                                                        <ShieldCheck className="w-4 h-4 mr-1" /> Host Reply
                                                    </div>
                                                    <p className="text-sm text-primary-900/80">{review.reply.comment}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                    </div>

                    {/* Sidebar Booking Card */}
                    <div className="lg:col-span-4 relative">
                        <PackageBookingForm service={service} price={price} />
                    </div>
                </div>

                {/* Suggested Packages */}
                {suggestions && suggestions.length > 0 && (
                    <section className="max-w-7xl mx-auto">
                        <h2 className="text-2xl font-black text-gray-900 py-4 font-display">Similar Experiences</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-3">
                            {suggestions.map((pkg, idx) => (
                                <PackageCard key={pkg._id || pkg.id || idx} item={pkg} />
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
