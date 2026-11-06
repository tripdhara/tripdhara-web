'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

export default function PackageShareButton({ title }) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const url = typeof window !== 'undefined' ? window.location.href : '';
        const shareData = {
            title: title || 'Tripdhara Himalayan Experience',
            text: `Check out this verified Himalayan experience on Tripdhara: ${title}`,
            url
        };

        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share(shareData);
                return;
            } catch (err) {
                // User cancelled or share failed, fallback to copy
                if (err.name === 'AbortError') return;
            }
        }

        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2200);
            } catch (err) {
                // Ignore clipboard failure
            }
        }
    };

    return (
        <button
            type="button"
            onClick={handleShare}
            aria-label="Share this experience"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md text-xs font-bold transition-all duration-200 shadow-sm hover:scale-[1.02] active:scale-95"
        >
            {copied ? (
                <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Link Copied!</span>
                </>
            ) : (
                <>
                    <Share2 className="w-3.5 h-3.5 text-gray-200" />
                    <span>Share</span>
                </>
            )}
        </button>
    );
}

