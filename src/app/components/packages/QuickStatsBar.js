import {
    Clock,
    Mountain,
    ShieldCheck,
    Users,
    Home as HomeIcon,
    Building,
    Tent,
    Waves,
    Bike,
    Sparkles,
    Compass,
    HeartHandshake,
    CheckCircle2,
    Utensils,
    Flame,
    Award
} from 'lucide-react';

export default function QuickStatsBar({ service }) {
    if (!service) return null;

    const category = (service.category_slug || service.category || '').toLowerCase();
    const pricing = service.pricing || {};
    const details = service.details || {};

    return (
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/40 mb-12 flex flex-wrap items-center justify-around gap-6">

            {/* 1. Homestay (Kath-Kuni Heritage) */}
            {category.includes('homestay') && (
                <>
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                            <HomeIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Architecture</p>
                            <p className="text-lg font-black text-gray-900">{details.roomType || 'Kath-Kuni Heritage'}</p>
                        </div>
                    </div>

                    <div className="hidden md:block w-px h-12 bg-gray-200" />

                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                            <Utensils className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Dining</p>
                            <p className="text-lg font-black text-gray-900">{service.mealType || 'Organic Pahadi Meals'}</p>
                        </div>
                    </div>

                    <div className="hidden md:block w-px h-12 bg-gray-200" />

                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Capacity</p>
                            <p className="text-lg font-black text-gray-900">Up to {pricing.maxAdults || pricing.maxGuests || 4} Guests</p>
                        </div>
                    </div>
                </>
            )}

            {/* 2. Hotel & Resorts */}
            {category === 'hotel' && (
                <>
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <Building className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Stay Type</p>
                            <p className="text-lg font-black text-gray-900">{details.roomType || 'Valley View Deluxe'}</p>
                        </div>
                    </div>

                    <div className="hidden md:block w-px h-12 bg-gray-200" />

                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Occupancy</p>
                            <p className="text-lg font-black text-gray-900">Up to {pricing.maxAdults || pricing.maxGuests || 2} Guests</p>
                        </div>
                    </div>
                </>
            )}

            {/* 3. Riverside & Alpine Camping */}
            {category.includes('camp') && (
                <>
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <Tent className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Camp Style</p>
                            <p className="text-lg font-black text-gray-900">{details.tentType || 'Swiss Tent / Alpine Dome'}</p>
                        </div>
                    </div>

                    <div className="hidden md:block w-px h-12 bg-gray-200" />

                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
                            <Flame className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Evening</p>
                            <p className="text-lg font-black text-gray-900">Bonfire & Stargazing</p>
                        </div>
                    </div>

                    <div className="hidden md:block w-px h-12 bg-gray-200" />

                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Washroom</p>
                            <p className="text-lg font-black text-gray-900">{details.washroomType || 'Attached Washrooms'}</p>
                        </div>
                    </div>
                </>
            )}

            {/* 4. White Water Rafting (Ganga Rapids) */}
            {category.includes('raft') && (
                <>
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                            <Waves className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Rapid Stretch</p>
                            <p className="text-lg font-black text-gray-900">{service.duration || details.stretch || '16 km Ganga Stretch'}</p>
                        </div>
                    </div>

                    <div className="hidden md:block w-px h-12 bg-gray-200" />

                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <Award className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">River Marshals</p>
                            <p className="text-lg font-black text-gray-900">Certified River Guides</p>
                        </div>
                    </div>

                    <div className="hidden md:block w-px h-12 bg-gray-200" />

                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Equipment</p>
                            <p className="text-lg font-black text-gray-900">CE Safety Helmets & Vests</p>
                        </div>
                    </div>
                </>
            )}

            {/* 5. Trekking & Expeditions */}
            {category.includes('trek') && (
                <>
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                            <Mountain className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Summit Elevation</p>
                            <p className="text-lg font-black text-gray-900">{details.altitude || service.altitude ? `${details.altitude || service.altitude} ft` : 'High-Altitude Pass'}</p>
                        </div>
                    </div>

                    <div className="hidden md:block w-px h-12 bg-gray-200" />

                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Duration</p>
                            <p className="text-lg font-black text-gray-900">{service.duration || details.duration || 'Multi-Day Expedition'}</p>
                        </div>
                    </div>

                    <div className="hidden md:block w-px h-12 bg-gray-200" />

                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                            <Compass className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Difficulty</p>
                            <p className="text-lg font-black text-gray-900">{service.difficultyLevel || details.difficulty || 'Moderate Trail'}</p>
                        </div>
                    </div>
                </>
            )}

            {/* 6. Bungee Jumping & Extreme Sports */}
            {(category.includes('bungee') || category.includes('extreme') || category.includes('paragliding') || category.includes('skiing')) && (
                <>
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Jump Platform</p>
                            <p className="text-lg font-black text-gray-900">{details.jumpHeight || '83m Fixed Cantilever'}</p>
                        </div>
                    </div>

                    <div className="hidden md:block w-px h-12 bg-gray-200" />

                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Jump Safety</p>
                            <p className="text-lg font-black text-gray-900">Certified Jump Masters</p>
                        </div>
                    </div>
                </>
            )}

            {/* 7. Bike & Scooter Rental */}
            {(category.includes('bike') || category.includes('scooter') || category.includes('vehicle')) && (
                <>
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600">
                            <Bike className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Mountain Fleet</p>
                            <p className="text-lg font-black text-gray-900">{service.vehicleType || 'Himalayan / Classic / Activa'}</p>
                        </div>
                    </div>

                    <div className="hidden md:block w-px h-12 bg-gray-200" />

                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Gear Included</p>
                            <p className="text-lg font-black text-gray-900">Dual ISI Helmets</p>
                        </div>
                    </div>
                </>
            )}

            {/* 8. Chaardham Tour */}
            {(category.includes('chardham') || category.includes('chaardham')) && (
                <>
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700">
                            <Compass className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Pilgrimage</p>
                            <p className="text-lg font-black text-gray-900">{details.circuit || 'Sacred Himalayan Circuit'}</p>
                        </div>
                    </div>

                    <div className="hidden md:block w-px h-12 bg-gray-200" />

                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center text-yellow-700">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Assistance</p>
                            <p className="text-lg font-black text-gray-900">Biometric & VIP Darshan</p>
                        </div>
                    </div>
                </>
            )}

            {/* 9. Custom Trip */}
            {category.includes('custom') && (
                <>
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <HeartHandshake className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Bespoke Curation</p>
                            <p className="text-lg font-black text-gray-900">1-on-1 Mountain Coordinator</p>
                        </div>
                    </div>

                    <div className="hidden md:block w-px h-12 bg-gray-200" />

                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Schedule</p>
                            <p className="text-lg font-black text-gray-900">100% Flexible Dates</p>
                        </div>
                    </div>
                </>
            )}

            {/* Universal Assurance Pillar */}
            <div className="hidden md:block w-px h-12 bg-gray-200" />
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Direct Network</p>
                    <p className="text-lg font-black text-gray-900">Tripdhara Verified Host</p>
                </div>
            </div>

        </div>
    );
}
