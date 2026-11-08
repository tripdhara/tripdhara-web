'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/ToastContext.js';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (res.ok) {
                toast(data.message || 'Subscribed successfully to Tripdhara newsletter!', 'success');
                setEmail('');
            } else {
                toast('Failed to subscribe. Please try again.', 'error');
            }
        } catch {
            toast('An error occurred. Please try again later.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <footer className="bg-gray-900 text-white pt-10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-10 mb-8">
                    {/* 1st Column: 100% on mobile */}
                    <div className="col-span-2 md:col-span-1 space-y-6">
                        <span className="text-3xl font-bold font-display text-white block">Trip<span className="text-primary-500">dhara</span></span>
                        <p className="text-gray-400 leading-relaxed text-sm">We are on a mission to make Himalayan travel accessible, authentic, and sustainable. Join our community of explorers.</p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition-colors">
                                <span className="sr-only">Facebook</span>
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition-colors">
                                <span className="sr-only">Instagram</span>
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08v.001zm0 2.163c-2.614 0-2.922.01-3.953.058-.962.045-1.484.234-1.832.37a2.915 2.915 0 00-1.065.693 2.915 2.915 0 00-.693 1.065c-.136.347-.325.869-.37 1.833-.047 1.03-.058 1.338-.058 3.953v.098c0 2.614.01 2.922.058 3.953.045.962.234 1.484.37 1.832.222.571.492.999.932 1.439.44.44.868.71 1.439.932.347.136.869.325 1.833.37 1.03.047 1.338.058 3.953.058h.098c2.614 0 2.922-.01 3.953-.058.962-.045 1.484-.234 1.832-.37a2.915 2.915 0 001.065-.693 2.915 2.915 0 00.693-1.065c.136-.347.325-.869.37-1.833.047-1.03.058-1.338.058-3.953v-.098c0-2.614-.01-2.922-.058-3.953-.045-.962-.234-1.484-.37-1.832a2.915 2.915 0 00-.693-1.065 2.915 2.915 0 00-1.065-.693c-.347-.136-.869-.325-1.833-.37-1.03-.047-1.338-.058-3.953-.058h-.098zm0 5.289a3.297 3.297 0 100 6.594 3.297 3.297 0 000-6.594zm0 2.163a1.134 1.134 0 110 2.268 1.134 1.134 0 010-2.268zm5.79-4.83a1.44 1.44 0 110 2.88 1.44 1.44 0 010-2.88z" clipRule="evenodd" /></svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition-colors">
                                <span className="sr-only">Twitter</span>
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* 2nd Column: 50% on mobile */}
                    <div className="col-span-1 md:col-span-1">
                        <h4 className="text-lg font-bold mb-4 sm:mb-6 text-white">Policies</h4>
                        <ul className="space-y-3 sm:space-y-4 text-gray-400 text-sm">
                            <li><Link href="/faq" className="hover:text-white transition-colors">FAQ &amp; Help Desk</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link href="/cancellation" className="hover:text-white transition-colors">Cancellation &amp; Weather</Link></li>
                            <li><Link href="/grievance" className="hover:text-white transition-colors">Grievance Redressal</Link></li>
                            <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping &amp; Delivery</Link></li>
                        </ul>
                    </div>

                    {/* 3rd Column: 50% on mobile */}
                    <div className="col-span-1 md:col-span-1">
                        <h4 className="text-lg font-bold mb-4 sm:mb-6 text-white">Discover</h4>
                        <ul className="space-y-3 sm:space-y-4 text-gray-400 text-sm">
                            <li><Link href="/careers" className="hover:text-white transition-colors">Careers with Us</Link></li>
                            <li><Link href="/partner" className="hover:text-white transition-colors">Partner with Us</Link></li>
                            <li><Link href="/rental-policy" className="hover:text-white transition-colors">Rental &amp; Deposit Policy</Link></li>
                            <li><Link href="/safety-policy" className="hover:text-white transition-colors">Adventure &amp; Safety</Link></li>
                            <li><Link href="/permit-policy" className="hover:text-white transition-colors">Border &amp; ILP Permits</Link></li>
                            <li><Link href="/eco-policy" className="hover:text-white transition-colors">Eco-Tourism Policy</Link></li>
                        </ul>
                    </div>

                    {/* 4th Column: 100% on mobile */}
                    <div className="col-span-2 md:col-span-1">
                        <h4 className="text-lg font-bold mb-4 text-white">Newsletter</h4>
                        <p className="text-gray-400 text-sm mb-4 leading-relaxed">Subscribe to get the latest offers, seasonal deals, and trekking guides.</p>
                        <form onSubmit={handleSubscribe} className="space-y-2.5">
                            <div className="relative flex items-center">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500"><Mail className="w-4 h-4" /></div>
                                <input type="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting} aria-label="Email address for newsletter" className="w-full bg-gray-800 text-white pl-10 pr-12 py-2.5 sm:py-3 rounded-xl border border-gray-700 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all placeholder:text-gray-500 disabled:opacity-50" />
                                <button type="submit" disabled={isSubmitting || !email} aria-label="Subscribe to newsletter" className="absolute right-1.5 p-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white transition-all disabled:opacity-40 disabled:hover:bg-primary-600 shadow-sm flex items-center justify-center cursor-pointer disabled:cursor-not-allowed">
                                    {isSubmitting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <ArrowRight className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 flex items-center gap-1.5">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0"></span>
                                <span>No spam ever. Unsubscribe at any time.</span>
                            </p>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800 py-6 text-gray-400 text-xs sm:text-sm flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-gray-400 text-xs">
                        <Link href="/grievance" className="hover:text-primary-400 transition-colors">Grievance Redressal</Link>|
                        <Link href="/shipping" className="hover:text-primary-400 transition-colors">Shipping &amp; Delivery</Link>|
                        <Link href="/rental-policy" className="hover:text-primary-400 transition-colors">Rental Terms</Link>|
                        <Link href="/safety-policy" className="hover:text-primary-400 transition-colors">Trekking Safety</Link>|
                        <Link href="/vendor-terms" className="hover:text-primary-400 transition-colors">Vendor Terms</Link>|
                        <Link href="/permit-policy" className="hover:text-primary-400 transition-colors">Border Permits</Link>|
                        <Link href="/eco-policy" className="hover:text-primary-400 transition-colors">Eco Policy</Link>
                    </div>
                    <p className="shrink-0 text-center md:text-end">&copy; {new Date().getFullYear()} <Link href="/" className="font-semibold text-gray-200 hover:text-primary-400 transition-colors">Trip<span className="text-primary-500">dhara</span></Link>. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
