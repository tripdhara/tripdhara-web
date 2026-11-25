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
        <footer className="bg-gray-900 text-white pt-8 pb-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 mb-6">
                    {/* 1st Column: Brand */}
                    <div className="col-span-2 md:col-span-1 space-y-3">
                        <Link href="/" className="inline-block">
                            <span className="text-2xl font-bold font-display text-white">
                                Trip<span className="text-primary-500">dhara</span>
                            </span>
                        </Link>
                        <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
                            India&apos;s trusted Himalayan travel platform. Facilitating verified mountain stays, pilgrimage circuits, and guided expeditions with certified local operators.
                        </p>
                        <div className="flex space-x-3 pt-1">
                            <a
                                href="https://wa.me/917017288052"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="WhatsApp"
                                className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-emerald-600 text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                            </a>
                            <a
                                href="https://instagram.com/tripdhara"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-rose-600 text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08v.001zm0 2.163c-2.614 0-2.922.01-3.953.058-.962.045-1.484.234-1.832.37a2.915 2.915 0 00-1.065.693 2.915 2.915 0 00-.693 1.065c-.136.347-.325.869-.37 1.833-.047 1.03-.058 1.338-.058 3.953v.098c0 2.614.01 2.922.058 3.953.045.962.234 1.484.37 1.832.222.571.492.999.932 1.439.44.44.868.71 1.439.932.347.136.869.325 1.833.37 1.03.047 1.338.058 3.953.058h.098c2.614 0 2.922-.01 3.953-.058.962-.045 1.484-.234 1.832-.37a2.915 2.915 0 001.065-.693 2.915 2.915 0 00.693-1.065c.136-.347.325-.869.37-1.833.047-1.03.058-1.338.058-3.953v-.098c0-2.614-.01-2.922-.058-3.953-.045-.962-.234-1.484-.37-1.832a2.915 2.915 0 00-.693-1.065 2.915 2.915 0 00-1.065-.693c-.347-.136-.869-.325-1.833-.37-1.03-.047-1.338-.058-3.953-.058h-.098zm0 5.289a3.297 3.297 0 100 6.594 3.297 3.297 0 000-6.594zm0 2.163a1.134 1.134 0 110 2.268 1.134 1.134 0 010-2.268zm5.79-4.83a1.44 1.44 0 110 2.88 1.44 1.44 0 010-2.88z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a
                                href="https://youtube.com/@tripdhara"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="YouTube"
                                className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-red-600 text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>
                            <a
                                href="https://facebook.com/tripdhara"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-blue-600 text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* 2nd Column: Discover */}
                    <div className="col-span-1">
                        <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-3">Explore</h4>
                        <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                            <li><Link href="/explore" className="hover:text-white transition-colors">Explore Circuits</Link></li>
                            <li><Link href="/packages" className="hover:text-white transition-colors">Tour Packages</Link></li>
                            <li><Link href="/yatra" className="hover:text-white transition-colors">Char Dham Yatras</Link></li>
                            <li><Link href="/accommodation" className="hover:text-white transition-colors">Mountain Stays</Link></li>
                            <li><Link href="/rental" className="hover:text-white transition-colors">Cab &amp; Bike Rentals</Link></li>
                        </ul>
                    </div>

                    {/* 3rd Column: Policies */}
                    <div className="col-span-1">
                        <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-3">Trust &amp; Legal</h4>
                        <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link href="/refund" className="hover:text-white transition-colors">Refund &amp; Cancellation</Link></li>
                            <li><Link href="/security" className="hover:text-white transition-colors">Security Center</Link></li>
                            <li><Link href="/safety-policy" className="hover:text-white transition-colors">Trekking Safety</Link></li>
                        </ul>
                    </div>

                    {/* 4th Column: Newsletter & Help */}
                    <div className="col-span-2 md:col-span-1 space-y-2.5">
                        <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-2">Stay Connected</h4>
                        <p className="text-gray-400 text-xs">Get seasonal mountain guides and exclusive trek deals.</p>
                        <form onSubmit={handleSubscribe} className="space-y-2">
                            <div className="relative flex items-center">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                    <Mail className="w-3.5 h-3.5" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isSubmitting}
                                    aria-label="Email for newsletter"
                                    className="w-full bg-gray-800 text-white pl-9 pr-10 py-2 rounded-lg border border-gray-700 text-xs focus:outline-none focus:border-primary-500 transition-all placeholder:text-gray-500 disabled:opacity-50"
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !email}
                                    aria-label="Subscribe"
                                    className="absolute right-1 p-1.5 rounded-md bg-primary-600 hover:bg-primary-500 text-white transition-all disabled:opacity-40"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    )}
                                </button>
                            </div>
                        </form>
                        <div className="flex items-center gap-3 text-xs text-gray-400 pt-1">
                            <Link href="/faq" className="hover:text-white transition-colors">FAQ &amp; Help Desk</Link>
                            <span>&bull;</span>
                            <Link href="/partner" className="hover:text-white transition-colors">Partner with Us</Link>
                        </div>
                    </div>
                </div>

                {/* Sub-Footer Bottom Bar */}
                <div className="border-t border-gray-800 pt-2 pb-2 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-400">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1 text-[11px] text-gray-400">
                        <Link href="/permit-policy" className="hover:text-white transition-colors">Border Permits</Link>
                        <span>&bull;</span>
                        <Link href="/eco-policy" className="hover:text-white transition-colors">Eco Policy</Link>
                        <span>&bull;</span>
                        <Link href="/rental-policy" className="hover:text-white transition-colors">Rental Terms</Link>
                        <span>&bull;</span>
                        <Link href="/vendor-terms" className="hover:text-white transition-colors">Vendor Terms</Link>
                        <span>&bull;</span>
                        <Link href="/grievance" className="hover:text-white transition-colors">Grievance</Link>
                        <span>&bull;</span>
                        <Link href="/shipping" className="hover:text-white transition-colors">Shipping</Link>
                    </div>
                    <p className="shrink-0 text-center md:text-end text-[11px] text-gray-400">
                        &copy; {new Date().getFullYear()} <Link href="/" className="font-semibold text-gray-200 hover:text-primary-400 transition-colors">Trip<span className="text-primary-500">dhara</span></Link>. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
