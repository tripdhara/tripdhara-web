'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useToast } from '@/app/components/ui/ToastContext.js';
import {
    TrendingUp,
    ShieldCheck,
    Banknote,
    MapPin,
    CheckCircle2,
    ArrowRight,
    Users,
    Home,
    Building,
    Tent,
    Waves,
    Mountain,
    Bike,
    Sparkles,
    Compass,
    HeartHandshake,
    Phone,
    Mail,
    MessageCircle,
    Send
} from 'lucide-react';

const partnerCategories = [
    { title: 'Homestay Hosts', icon: Home, desc: 'Traditional Kath-Kuni & stone homes' },
    { title: 'Hotels & Resorts', icon: Building, desc: 'Boutique & valley-view mountain stays' },
    { title: 'Riverside & Alpine Camps', icon: Tent, desc: 'Swiss tents in Rishikesh & alpine bugyals' },
    { title: 'River Rafting Marshals', icon: Waves, desc: 'Licensed Ganga white-water operators' },
    { title: 'Trek Leaders & Guides', icon: Mountain, desc: 'Certified mountaineering guides' },
    { title: 'Extreme Sports Operators', icon: Sparkles, desc: 'Bungee, paragliding & skiing masters' },
    { title: 'Bike & Scooter Rental', icon: Bike, desc: 'Royal Enfield & scooter fleet owners' },
    { title: 'Chardham & Mountain Taxis', icon: Compass, desc: 'Licensed mountain commercial drivers' },
    { title: 'Custom Itinerary Planners', icon: HeartHandshake, desc: 'Bespoke regional trip coordinators' }
];

export default function PartnerClient() {
    const [formData, setFormData] = useState({
        businessName: '',
        ownerName: '',
        email: '',
        phone: '',
        hub: '',
        category: 'Homestay',
        description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const structuredMessage = `
--- VENDOR PARTNERSHIP APPLICATION ---
Business / Property: ${formData.businessName}
Owner / Representative: ${formData.ownerName}
Category: ${formData.category}
Operational Hub: ${formData.hub}
Phone / WhatsApp: ${formData.phone}
Email: ${formData.email}

Service Description & Fleet Capacity:
${formData.description}
`.trim();

        try {
            const res = await fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: `${formData.businessName} (${formData.ownerName})`,
                    email: formData.email,
                    subject: 'Vendor Partnership Application',
                    message: structuredMessage
                })
            });

            if (res.ok) {
                toast('Partner application submitted! Our team will contact you for verification within 24 hours.', 'success');
                setFormData({
                    businessName: '',
                    ownerName: '',
                    email: '',
                    phone: '',
                    hub: '',
                    category: 'Homestay',
                    description: ''
                });
            } else {
                toast('Failed to submit application. Please reach our partner desk via WhatsApp (+91 7017288052).', 'error');
            }
        } catch {
            toast('Network error. Please connect directly via WhatsApp (+91 7017288052).', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans selection:bg-primary-500 selection:text-white">

            {/* Hero Section */}
            <section className="relative pt-36 pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-gray-950 text-white">
                <Image
                    src="/img/background.png"
                    alt="Partner with Tripdhara"
                    fill
                    sizes="100vw"
                    priority
                    className="object-cover opacity-25"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-7">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider mb-6 text-primary-300">
                                <TrendingUp className="w-3.5 h-3.5" /> Direct Mountain Empowerment
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight font-display mb-6 leading-tight">
                                Turn Your Mountain Hospitality into a{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-secondary-300 to-emerald-400">
                                    Thriving Business
                                </span>
                            </h1>
                            <p className="text-lg text-gray-200 max-w-2xl font-medium leading-relaxed mb-8">
                                Bypass exploitative middlemen who take 30-40% cuts. Connect directly with verified travelers, retain your rightful earnings, and grow your local Himalayan brand.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a
                                    href="#apply"
                                    className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold shadow-xl transition-all flex items-center gap-2 transform hover:scale-105"
                                >
                                    <span>Apply for Verification</span>
                                    <ArrowRight className="w-5 h-5" />
                                </a>
                                <a
                                    href="https://wa.me/917017288052?text=Hello%20Tripdhara!%20I%20want%20to%20partner%20as%20a%20vendor."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-bold backdrop-blur-md transition-all flex items-center gap-2"
                                >
                                    <MessageCircle className="w-5 h-5 text-emerald-400" />
                                    <span>WhatsApp Partner Desk</span>
                                </a>
                            </div>
                        </div>

                        {/* Quick Partner Trust Card */}
                        <div className="lg:col-span-5 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 sm:p-10 shadow-2xl">
                            <h2 className="text-2xl font-bold text-white mb-6 font-display">The Tripdhara Vendor Guarantee</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary-500/20 text-primary-400 border border-primary-500/30 flex items-center justify-center shrink-0">
                                        <Banknote className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-base">0% Setup & Listing Fee</h3>
                                        <p className="text-xs text-gray-300 mt-1">Free to list your homestay, fleet, or rafting stretch. No upfront charges.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-base">Verified Partner Badge</h3>
                                        <p className="text-xs text-gray-300 mt-1">Stand out with verified commercial licensing and safety audit badges.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-secondary-500/20 text-secondary-400 border border-secondary-500/30 flex items-center justify-center shrink-0">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-base">Direct Guest Relationship</h3>
                                        <p className="text-xs text-gray-300 mt-1">Communicate directly with travelers, set your own availability, and build loyal repeat guests.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

                {/* 9 Partner Categories */}
                <section className="mb-24">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-primary-600 font-extrabold text-xs uppercase tracking-widest block mb-2">
                            Who We Onboard
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight font-display mb-4">
                            9 Mountain Partner Categories
                        </h2>
                        <p className="text-gray-600 text-base sm:text-lg">
                            We partner with local entrepreneurs and licensed operators across Uttarakhand, Himachal Pradesh, Ladakh, and the Himalayas.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {partnerCategories.map((cat, idx) => {
                            const IconC = cat.icon;
                            return (
                                <div
                                    key={idx}
                                    className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex items-start gap-4 group hover:-translate-y-1"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                        <IconC className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-gray-900 font-display">
                                            {cat.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {cat.desc}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Working Application Form Section */}
                <div id="apply" className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-200 overflow-hidden max-w-5xl mx-auto flex flex-col md:flex-row scroll-mt-28">

                    {/* Left Form Sidebar */}
                    <div className="bg-gradient-to-br from-gray-950 to-gray-900 p-8 sm:p-12 md:w-2/5 text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="relative z-10 space-y-6">
                            <span className="text-secondary-400 font-bold text-xs uppercase tracking-wider block">
                                Quick Onboarding
                            </span>
                            <h2 className="text-3xl font-black font-display leading-tight">
                                Partner Application
                            </h2>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Complete this simple 3-minute form. Our local partnership desk in Rishikesh will reach out within 24 hours to schedule verification.
                            </p>

                            <div className="space-y-4 pt-4 border-t border-white/10 text-xs text-gray-300">
                                <div className="flex items-center gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>Zero listing or registration fee</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>Personalized digital setup support</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span>Prompt automated weekly payouts</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 mt-8 pt-6 border-t border-white/10 space-y-2 text-xs">
                            <p className="text-gray-400">Prefer direct human support?</p>
                            <a
                                href="tel:+917017288052"
                                className="font-bold text-white flex items-center gap-1.5 hover:text-primary-300 transition-colors"
                            >
                                <Phone className="w-3.5 h-3.5 text-secondary-400" /> +91 7017288052
                            </a>
                            <a
                                href="mailto:contact@tripdhara.com"
                                className="font-bold text-gray-300 flex items-center gap-1.5 hover:text-white transition-colors"
                            >
                                <Mail className="w-3.5 h-3.5 text-primary-400" /> contact@tripdhara.com
                            </a>
                        </div>
                    </div>

                    {/* Right Form Body */}
                    <div className="p-8 sm:p-12 md:w-3/5 bg-white">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="businessName" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Business / Homestay Name *</label>
                                    <input
                                        type="text"
                                        id="businessName"
                                        name="businessName"
                                        required
                                        value={formData.businessName}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-xs font-medium"
                                        placeholder="e.g. Pine Ridge Homestay"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="ownerName" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Your Full Name *</label>
                                    <input
                                        type="text"
                                        id="ownerName"
                                        name="ownerName"
                                        required
                                        value={formData.ownerName}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-xs font-medium"
                                        placeholder="e.g. Ramesh Rawat"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="email" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Email Address *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-xs font-medium"
                                        placeholder="ramesh@gmail.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Phone / WhatsApp Number *</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-xs font-medium"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="category" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Partner Category *</label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-xs font-medium"
                                    >
                                        <option value="Homestay">Homestay (Kath-Kuni / Village Home)</option>
                                        <option value="Hotel & Resort">Hotel & Resort</option>
                                        <option value="Camping">Camping (Riverside / Alpine)</option>
                                        <option value="White Water Rafting">White Water Rafting</option>
                                        <option value="Trekking & Expeditions">Trekking & Expeditions</option>
                                        <option value="Bungee & Extreme Sports">Bungee & Extreme Sports</option>
                                        <option value="Bike & Scooter Rental">Bike & Scooter Rental Fleet</option>
                                        <option value="Chardham & Mountain Taxis">Chardham & Mountain Taxis</option>
                                        <option value="Custom Trip Coordinator">Custom Trip Coordinator</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="hub" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Operational Hub / Location *</label>
                                    <input
                                        type="text"
                                        id="hub"
                                        name="hub"
                                        required
                                        value={formData.hub}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-xs font-medium"
                                        placeholder="e.g. Tapovan, Rishikesh"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Brief Description of Services & Fleet/Capacity *</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    required
                                    rows="4"
                                    value={formData.description}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-xs font-medium resize-none"
                                    placeholder="Tell us about your rooms, number of rafts, vehicles, guide licenses, or experience..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <span>Submitting Application...</span>
                                ) : (
                                    <>
                                        <span>Submit Partner Application</span>
                                        <Send className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

            </main>
        </div>
    );
}

