'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/app/components/ui/ToastContext.js';
import {
    Phone,
    Mail,
    MapPin,
    MessageCircle,
    Clock,
    Globe,
    CheckCircle2,
    Send,
    ArrowRight,
    ShieldCheck,
    Sparkles
} from 'lucide-react';

const subjectOptions = [
    { value: 'General Inquiry', label: 'General Inquiry' },
    { value: 'Custom Trip Planning', label: 'Custom Trip Planning (Bespoke Itinerary)' },
    { value: 'Homestay & Hotel Stays', label: 'Homestay & Hotel Mountain Stays' },
    { value: 'Riverside Camping & Rafting', label: 'Riverside Camping & Rafting (Rishikesh)' },
    { value: 'Trekking & Expeditions', label: 'Trekking & Alpine Expeditions' },
    { value: 'Bungee Jumping & Adventure', label: 'Bungee Jumping & Extreme Adventure' },
    { value: 'Bike & Scooter Rental', label: 'Bike & Scooter Rental' },
    { value: 'Chaardham Tour', label: 'Chaardham Tour (Road & Helicopter)' },
    { value: 'Vendor Partnership', label: 'Vendor Partnership & Local Onboarding' }
];

export default function ContactPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: ''
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

        const name = `${formData.firstName} ${formData.lastName}`.trim();
        const fullMessage = formData.phone
            ? `Phone: ${formData.phone}\n\n${formData.message}`
            : formData.message;

        try {
            const res = await fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email: formData.email,
                    subject: formData.subject,
                    message: fullMessage
                })
            });

            if (res.ok) {
                toast('Your inquiry has been sent to our travel desk. We will reach out shortly!', 'success');
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    subject: 'General Inquiry',
                    message: ''
                });
            } else {
                toast('Failed to send message. Please connect via WhatsApp or direct call.', 'error');
            }
        } catch {
            toast('A network error occurred. Please contact us directly via WhatsApp (+91 7017288052).', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans selection:bg-primary-500 selection:text-white">

            {/* Header Hero */}
            <div className="relative pt-36 pb-20 lg:pt-48 lg:pb-28 overflow-hidden bg-gray-950 text-white">
                <Image
                    src="/img/background.png"
                    alt="Himalayan Travel Assistance"
                    fill
                    sizes="100vw"
                    priority
                    className="object-cover opacity-25"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-6">
                        <Sparkles className="w-3.5 h-3.5 text-secondary-400" /> 24/7 Himalayan Travel Desk
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight font-display mb-4">
                        Connect with Tripdhara
                    </h1>
                    <p className="text-gray-300 text-base md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                        Have questions about high-altitude routes, homestay availability, river rafting stretches, or custom trip planning? Our on-ground coordinators are here for you.
                    </p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10 relative z-20 pb-28">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Direct Official Channels */}
                    <div className="lg:col-span-5 space-y-6">

                        {/* WhatsApp Priority Card */}
                        <a
                            href="https://wa.me/917017288052?text=Hello%20Tripdhara!%20I%20would%20like%20to%20plan%20a%20trip."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block p-6 bg-gradient-to-br from-emerald-950 to-gray-900 rounded-3xl border border-emerald-500/30 shadow-xl hover:border-emerald-400 hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1 text-white relative overflow-hidden"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                    <MessageCircle className="w-7 h-7" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Fastest Response</span>
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                    </div>
                                    <h2 className="text-xl font-bold font-display mt-0.5 group-hover:text-emerald-300 transition-colors">
                                        WhatsApp Travel Desk
                                    </h2>
                                    <p className="text-sm text-gray-300 font-mono mt-1 font-semibold">+91 7017288052</p>
                                    <p className="text-xs text-gray-400 mt-2">Instant messaging for itinerary customization, permits, and fast booking.</p>
                                </div>
                            </div>
                        </a>

                        {/* Direct Phone Helpline */}
                        <a
                            href="tel:+917017288052"
                            className="group block p-6 bg-white rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-xl hover:border-primary-300 transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                    <Phone className="w-7 h-7" />
                                </div>
                                <div>
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">24/7 Direct Call</span>
                                    <h2 className="text-xl font-bold text-gray-900 font-display mt-0.5 group-hover:text-primary-600 transition-colors">
                                        Operations Helpline
                                    </h2>
                                    <p className="text-base text-gray-900 font-mono mt-1 font-bold">+91 7017288052</p>
                                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5 text-primary-600" /> Round-the-clock emergency & on-ground support
                                    </p>
                                </div>
                            </div>
                        </a>

                        {/* Official Emails */}
                        <div className="p-6 bg-white rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-secondary-50 text-secondary-600 flex items-center justify-center shrink-0">
                                    <Mail className="w-7 h-7" />
                                </div>
                                <div>
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Official Inquiries</span>
                                    <h2 className="text-xl font-bold text-gray-900 font-display mt-0.5">
                                        Email Support
                                    </h2>
                                    <div className="mt-2 space-y-1">
                                        <a href="mailto:contact@tripdhara.com" className="text-sm font-semibold text-primary-600 hover:text-primary-700 block transition-colors">
                                            contact@tripdhara.com
                                        </a>
                                        <a href="mailto:info@tripdhara.com" className="text-sm font-semibold text-gray-600 hover:text-gray-900 block transition-colors">
                                            info@tripdhara.com
                                        </a>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">Replies typically within 2-4 business hours.</p>
                                </div>
                            </div>
                        </div>

                        {/* Headquarters & Operations Hub */}
                        <div className="p-6 bg-white rounded-3xl border border-gray-200/90 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
                                    <MapPin className="w-7 h-7" />
                                </div>
                                <div>
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Operational Base</span>
                                    <h2 className="text-xl font-bold text-gray-900 font-display mt-0.5">
                                        Rishikesh & Dehradun
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Uttarakhand, India
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                                        Active Field Hubs: Uttarakhand, Kullu, Manali, Rishikesh, Joshimath, Auli, and Valley of Flowers.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Official Portals Card */}
                        <div className="p-5 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl text-white flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-secondary-400" />
                                <span>Global: <strong className="text-white">tripdhara.com</strong></span>
                            </div>
                            <span className="text-gray-400">|</span>
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-emerald-400" />
                                <span>India: <strong className="text-white">tripdhara.in</strong></span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Inquiry & Booking Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                                <div>
                                    <span className="text-primary-600 font-extrabold text-xs uppercase tracking-widest block mb-1">
                                        Start a Conversation
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                                        Send an Inquiry
                                    </h2>
                                </div>
                                <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="firstName" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">First Name *</label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            required
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:bg-white focus:border-primary-400 transition-all outline-none text-sm disabled:opacity-50"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Last Name *</label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            required
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:bg-white focus:border-primary-400 transition-all outline-none text-sm disabled:opacity-50"
                                            placeholder="Sharma"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="email" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email Address *</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:bg-white focus:border-primary-400 transition-all outline-none text-sm disabled:opacity-50"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">WhatsApp / Phone Number</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:bg-white focus:border-primary-400 transition-all outline-none text-sm disabled:opacity-50"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Service of Interest *</label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-primary-500 focus:bg-white focus:border-primary-400 transition-all outline-none text-sm disabled:opacity-50"
                                    >
                                        {subjectOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Your Message / Travel Requirements *</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows="5"
                                        value={formData.message}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:bg-white focus:border-primary-400 transition-all outline-none text-sm resize-none disabled:opacity-50"
                                        placeholder="Please share your preferred travel dates, destination, number of travelers, or any specific questions..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 group text-base"
                                >
                                    {isSubmitting ? (
                                        <span>Submitting Inquiry...</span>
                                    ) : (
                                        <>
                                            <span>Send Travel Inquiry</span>
                                            <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Bottom Assistance Banner */}
                <div className="mt-16 bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Are you a local mountain vendor or guide?</h3>
                            <p className="text-xs text-gray-500 mt-0.5">List your homestay, rafting stretch, or taxi service directly on Tripdhara.</p>
                        </div>
                    </div>
                    <Link
                        href="/partner"
                        className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2 shrink-0"
                    >
                        <span>Apply as a Partner</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </main>
        </div>
    );
}
