'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Phone,
    Calendar,
    Users,
    Send,
    ShieldCheck,
    CheckCircle2,
    Sparkles,
    Headphones
} from 'lucide-react';

export default function PackageBookingForm({ service = {}, price = 0 }) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: '',
        adults: 1,
        children: 0
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const basePrice = service?.pricing?.basePrice;
    const hasDiscount = basePrice && Number(basePrice) > Number(price);
    const savings = hasDiscount ? Number(basePrice) - Number(price) : 0;

    const adultCount = parseInt(formData.adults, 10) || 1;
    const totalPrice = adultCount * (Number(price) || 0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleWhatsAppBooking = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!formData.name || !formData.phone || !formData.date) {
            setIsSubmitting(false);
            return;
        }

        const title = service?.title || 'Himalayan Experience';
        const category = service?.category_name || 'Experience';
        const address = service?.address || 'Uttarakhand, Himalayas';

        const message = `*Tripdhara Direct Host Booking Inquiry*\n` +
            `━━━━━━━━━━━━━━━━━━━━━━\n` +
            `🏔️ *Package:* ${title}\n` +
            `🏷️ *Category:* ${category}\n` +
            `📍 *Location:* ${address}\n` +
            `💰 *Rate:* ₹${Number(price).toLocaleString('en-IN')} / person\n` +
            `💵 *Total Estimate:* ₹${Number(totalPrice).toLocaleString('en-IN')}\n` +
            `━━━━━━━━━━━━━━━━━━━━━━\n` +
            `*Traveller Details:*\n` +
            `👤 *Name:* ${formData.name}\n` +
            `📱 *WhatsApp:* ${formData.phone}\n` +
            `📅 *Travel Date:* ${formData.date}\n` +
            `👥 *Party:* ${formData.adults} Adults${formData.children > 0 ? `, ${formData.children} Children` : ''}\n` +
            `━━━━━━━━━━━━━━━━━━━━━━\n` +
            `_Direct inquiry via Tripdhara Sovereign Portal (tripdhara.com)_`;

        const encodedText = encodeURIComponent(message);
        const waUrl = `https://wa.me/917017288052?text=${encodedText}`;

        setTimeout(() => {
            window.open(waUrl, '_blank', 'noopener,noreferrer');
            setIsSubmitting(false);
        }, 500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="sticky top-28 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-gray-100 ring-1 ring-gray-900/5 overflow-hidden"
        >
            {/* Header: Dark Cinematic Gradient */}
            <div className="p-6 sm:p-7 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white relative overflow-hidden text-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.15),transparent_60%)]" />

                <div className="relative z-10 flex flex-col items-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-widest mb-3 backdrop-blur-md">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        Direct Host Rate • Zero Markup
                    </span>

                    <div className="flex items-baseline justify-center gap-1.5">
                        <span className="text-4xl sm:text-5xl font-black text-white font-display tracking-tight">
                            ₹{Number(price || 0).toLocaleString('en-IN')}
                        </span>
                        <span className="text-gray-400 font-medium text-xs">/ person</span>
                    </div>

                    {hasDiscount && (
                        <div className="flex items-center gap-2 mt-1.5">
                            <span className="line-through text-gray-500 text-xs font-semibold">
                                ₹{Number(basePrice).toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/25 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/40">
                                Save ₹{savings.toLocaleString('en-IN')}
                            </span>
                        </div>
                    )}

                    {totalPrice > price && (
                        <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-secondary-300 bg-white/10 px-3.5 py-1 rounded-full border border-white/15 backdrop-blur-md">
                            <Sparkles className="w-3 h-3 text-secondary-400" />
                            <span>Estimated Total: ₹{Number(totalPrice).toLocaleString('en-IN')}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Form & Host Section */}
            <div className="p-6 sm:p-7">
                {service?.business && (
                    <div className="flex items-center gap-3.5 pb-5 mb-5 border-b border-gray-100">
                        <div className="w-12 h-12 bg-gradient-to-tr from-primary-100 to-secondary-100 text-primary-700 rounded-2xl flex items-center justify-center text-lg font-black shadow-sm shrink-0 border border-white">
                            {(service.business.businessName?.[0] || 'H').toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Verified Himalayan Host
                            </p>
                            <p className="font-bold text-gray-900 text-sm truncate">
                                {service.business.businessName}
                            </p>
                            <p className="text-[11px] text-gray-400 font-medium">Direct confirmation • No middlemen</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleWhatsAppBooking} className="space-y-4">
                    {/* Full Name */}
                    <div className="space-y-1">
                        <label className="block text-[11px] font-black uppercase tracking-wider text-gray-500">
                            Your Full Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <User className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Rahul Sharma"
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white outline-none transition-all text-gray-900 placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* WhatsApp Number */}
                    <div className="space-y-1">
                        <label className="block text-[11px] font-black uppercase tracking-wider text-gray-500">
                            WhatsApp Phone Number
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <Phone className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                placeholder="+91 98765 43210"
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white outline-none transition-all text-gray-900 placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Travel Date */}
                    <div className="space-y-1">
                        <label className="block text-[11px] font-black uppercase tracking-wider text-gray-500">
                            Preferred Travel Date
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <Calendar className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                                required
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white outline-none transition-all text-gray-900 cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Guests: Adults & Children */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="block text-[11px] font-black uppercase tracking-wider text-gray-500">
                                Adults
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Users className="h-3.5 w-3.5 text-gray-400" />
                                </div>
                                <input
                                    type="number"
                                    name="adults"
                                    value={formData.adults}
                                    onChange={handleChange}
                                    min="1"
                                    max="50"
                                    required
                                    className="w-full pl-8 pr-3 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white outline-none transition-all text-gray-900"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-[11px] font-black uppercase tracking-wider text-gray-500">
                                Children
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Users className="h-3.5 w-3.5 text-gray-400" />
                                </div>
                                <input
                                    type="number"
                                    name="children"
                                    value={formData.children}
                                    onChange={handleChange}
                                    min="0"
                                    max="20"
                                    required
                                    className="w-full pl-8 pr-3 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white outline-none transition-all text-gray-900"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_8px_25px_rgba(37,211,102,0.35)] hover:shadow-[0_12px_30px_rgba(37,211,102,0.45)] hover:-translate-y-0.5 focus:ring-4 focus:ring-green-500/30 focus:outline-none flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Connecting with Host...
                            </span>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                <span>Book on WhatsApp</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Direct Host Guarantees Footer */}
                <div className="mt-5 space-y-2.5 pt-5 border-t border-gray-100 text-xs">
                    <div className="flex items-start gap-2 text-gray-600">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-medium">100% Direct Host Connection • No Hidden Middleman Fees</span>
                    </div>
                    <div className="flex items-start gap-2 text-gray-600">
                        <Headphones className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                        <span className="font-medium">
                            Rishikesh Support Desk:{' '}
                            <a href="tel:+917017288052" className="font-bold text-gray-900 hover:text-primary-600 underline">
                                +91 7017288052
                            </a>
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
