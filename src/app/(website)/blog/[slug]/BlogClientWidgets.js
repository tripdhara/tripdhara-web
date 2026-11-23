'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
    Share2, Copy, Check, MessageCircle, 
    ThumbsUp, ThumbsDown, List, Compass
} from 'lucide-react';
import { useToast } from '@/components/ui/ToastContext.js';

/**
 * Modern SVG Icons for Brand Socials (not exported by lucide-react)
 */
function TwitterXIcon({ className = 'w-3.5 h-3.5' }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

function FacebookIcon({ className = 'w-3.5 h-3.5' }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
        </svg>
    );
}

/**
 * Reading Progress Bar positioned at the very top of the window
 */
export function ReadingProgressBar() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (totalHeight <= 0) return;
            const currentScroll = window.scrollY;
            const scrollPercentage = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
            setProgress(scrollPercentage);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-1 z-50 bg-transparent pointer-events-none">
            <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-primary-500 to-teal-400 transition-all duration-150 ease-out shadow-[0_0_10px_rgba(16,185,129,0.7)]"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}

/**
 * Interactive Share Buttons (WhatsApp, Twitter, Facebook, Copy Link)
 */
export function ShareToolbar({ title, url, excerpt = '' }) {
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    const fullUrl = typeof window !== 'undefined' ? window.location.href : (url || '');

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(fullUrl);
            setCopied(true);
            toast('Article link copied to clipboard!', 'success');
            setTimeout(() => setCopied(false), 2500);
        } catch {
            toast('Failed to copy link', 'error');
        }
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text: excerpt || title,
                    url: fullUrl
                });
            } catch {
                // User dismissed or aborted share
            }
        } else {
            handleCopy();
        }
    };

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title}\n\nRead more on Tripdhara:\n${fullUrl}`)}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}&via=Tripdhara`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all duration-200"
                title="Copy Article Link"
            >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>

            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white transition-all shadow-sm hover:scale-105"
                title="Share on WhatsApp"
            >
                <MessageCircle className="w-3.5 h-3.5" />
            </a>

            <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all shadow-sm hover:scale-105"
                title="Share on X (Twitter)"
            >
                <TwitterXIcon className="w-3.5 h-3.5" />
            </a>

            <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-blue-600/90 hover:bg-blue-500 text-white transition-all shadow-sm hover:scale-105"
                title="Share on Facebook"
            >
                <FacebookIcon className="w-3.5 h-3.5" />
            </a>
        </div>
    );
}

/**
 * Interactive Table of Contents with Scrollspy
 */
export function TableOfContents({ items = [] }) {
    const [activeId, setActiveId] = useState('');

    useEffect(() => {
        if (!items || items.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-100px 0% -60% 0%', threshold: 0 }
        );

        items.forEach((item) => {
            const el = document.getElementById(item.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [items]);

    if (!items || items.length === 0) return null;

    const scrollToSection = (e, id) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (el) {
            const yOffset = -90; // offset for sticky navbar
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
            setActiveId(id);
        }
    };

    return (
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-gray-100">
                <List className="w-4 h-4 text-primary-600" />
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-display">
                    On This Page
                </h3>
            </div>
            <nav className="space-y-1.5 text-xs max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
                {items.map((item, idx) => {
                    const isActive = activeId === item.id;
                    return (
                        <a
                            key={idx}
                            href={`#${item.id}`}
                            onClick={(e) => scrollToSection(e, item.id)}
                            className={`block py-1.5 px-3 rounded-xl transition-all font-medium leading-relaxed ${
                                item.level === 3 ? 'ml-3 text-[11px]' : ''
                            } ${
                                isActive
                                    ? 'bg-primary-50 text-primary-700 font-bold border-l-2 border-primary-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            {item.title}
                        </a>
                    );
                })}
            </nav>
        </div>
    );
}

/**
 * Article Helpful Feedback Widget
 */
export function ArticleFeedback() {
    const [status, setStatus] = useState(null); // 'helpful' | 'not-helpful'
    const { toast } = useToast();

    const handleFeedback = (type) => {
        setStatus(type);
        toast('Thank you for helping us refine our Himalayan field guides!', 'success');
    };

    return (
        <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 mt-12">
            <div>
                <h4 className="text-sm font-bold text-gray-900 font-display">Was this Himalayan guide helpful?</h4>
                <p className="text-xs text-gray-500 mt-0.5">Your feedback directly shapes our on-ground route dispatches.</p>
            </div>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => handleFeedback('helpful')}
                    disabled={Boolean(status)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        status === 'helpful'
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Yes, very helpful</span>
                </button>
                <button
                    type="button"
                    onClick={() => handleFeedback('not-helpful')}
                    disabled={Boolean(status)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        status === 'not-helpful'
                            ? 'bg-gray-800 text-white shadow-md'
                            : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>Needs update</span>
                </button>
            </div>
        </div>
    );
}
