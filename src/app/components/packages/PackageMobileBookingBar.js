'use client';

import { ShieldCheck, Send } from 'lucide-react';

export default function PackageMobileBookingBar({ service, price }) {
    const formattedPrice = Number(price || 0).toLocaleString('en-IN');
    const title = service?.title || 'Himalayan Experience';
    const category = service?.category_name || 'Experience';

    const handleWhatsAppClick = () => {
        const message = `*Tripdhara Mobile Inquiry*\n` +
            `━━━━━━━━━━━━━━━━━━━━━━\n` +
            `*Package:* ${title}\n` +
            `*Category:* ${category}\n` +
            `*Rate:* ₹${formattedPrice} / person\n` +
            `━━━━━━━━━━━━━━━━━━━━━━\n` +
            `_Hi Tripdhara Desk, I would like to check availability and book this package directly with the local host._`;

        const waUrl = `https://wa.me/917017288052?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <aside
            aria-label="Mobile booking action bar"
            className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-200/80 p-3.5 px-4 flex items-center justify-between shadow-[0_-8px_30px_rgba(0,0,0,0.12)] md:hidden"
        >
            <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-gray-950 font-display">₹{formattedPrice}</span>
                    <span className="text-[11px] text-gray-500 font-medium">/ person</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Direct Host Rate
                </span>
            </div>

            <button
                type="button"
                onClick={handleWhatsAppClick}
                className="bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white px-5 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
            >
                <Send className="w-3.5 h-3.5" />
                <span>Book on WhatsApp</span>
            </button>
        </aside>
    );
}

