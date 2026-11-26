'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { VendorHeader } from '@/components/admin/VendorUIFragments.js';
import api from '@/core/Api/index.js';
import { useToast } from '@/components/ui/ToastContext.js';
import {
    Star,
    MessageSquare,
    CheckCircle2,
    XCircle,
    Eye,
    EyeOff,
    Trash2,
    Search,
    RefreshCw,
    User,
    Calendar,
    ThumbsUp,
    ShieldAlert,
    CornerDownRight
} from 'lucide-react';

export default function ReviewsTab({ vendor, id, activeTab, setActiveTab, onRefresh }) {
    const router = useRouter();
    const toast = useToast();

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [modulatingId, setModulatingId] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const vendorProfileId = vendor?.vendorProfile?._id || vendor?._id || id;

    // Fetch reviews for this vendor
    useEffect(() => {
        let isMounted = true;
        const loadReviews = async () => {
            try {
                const res = await api.admin.reviews.getPending({ vendor: vendorProfileId });
                if (!isMounted) return;
                const list = res?.data?.reviews || res?.reviews || [];
                setReviews(Array.isArray(list) ? list : []);
            } catch (err) {
                if (isMounted) {
                    toast(err?.message || 'Failed to load vendor reviews', 'error');
                    setReviews([]);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadReviews();
        return () => {
            isMounted = false;
        };
    }, [vendorProfileId, refreshKey, toast]);

    // Rating Statistics
    const stats = useMemo(() => {
        const total = reviews.length;
        if (total === 0) {
            return {
                average: 0,
                total: 0,
                breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
                percentage: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
                satisfactionRate: 0
            };
        }

        const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        let sum = 0;
        let positiveCount = 0;

        reviews.forEach(r => {
            const rating = Math.min(Math.max(Math.round(r.rating || 5), 1), 5);
            breakdown[rating] = (breakdown[rating] || 0) + 1;
            sum += r.rating || 5;
            if (r.rating >= 4) positiveCount++;
        });

        const average = (sum / total).toFixed(1);
        const percentage = {
            5: Math.round((breakdown[5] / total) * 100),
            4: Math.round((breakdown[4] / total) * 100),
            3: Math.round((breakdown[3] / total) * 100),
            2: Math.round((breakdown[2] / total) * 100),
            1: Math.round((breakdown[1] / total) * 100),
        };
        const satisfactionRate = Math.round((positiveCount / total) * 100);

        return { average, total, breakdown, percentage, satisfactionRate };
    }, [reviews]);

    // Filter reviews
    const filteredReviews = useMemo(() => {
        return reviews.filter(r => {
            // Rating status filter
            if (statusFilter === '5') {
                if (Math.round(r.rating) !== 5) return false;
            } else if (statusFilter === '4') {
                if (Math.round(r.rating) !== 4) return false;
            } else if (statusFilter === 'low') {
                if (r.rating > 3) return false;
            } else if (statusFilter === 'hidden') {
                if (r.isVisible !== false) return false;
            }

            // Search query
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim();
                const userName = (r.user?.name || '').toLowerCase();
                const comment = (r.comment || '').toLowerCase();
                const title = (r.item?.title || '').toLowerCase();
                return userName.includes(q) || comment.includes(q) || title.includes(q);
            }

            return true;
        });
    }, [reviews, statusFilter, searchQuery]);

    // Toggle Review Visibility (Public / Hidden)
    const handleToggleVisibility = async (r) => {
        const nextState = !r.isVisible;
        setModulatingId(r._id);
        try {
            await api.admin.reviews.updateStatus(r._id, { isVisible: nextState });
            toast(`Review is now ${nextState ? 'visible publicly' : 'hidden from public view'}`, 'success');
            setReviews(prev => prev.map(item => item._id === r._id ? { ...item, isVisible: nextState } : item));
        } catch (err) {
            toast(err?.message || 'Failed to update visibility', 'error');
        } finally {
            setModulatingId(null);
        }
    };

    // Delete review
    const handleDeleteReview = async (reviewId) => {
        if (!confirm('Are you sure you want to permanently delete this review? This action cannot be reversed.')) return;
        setModulatingId(reviewId);
        try {
            await api.admin.reviews.reject(reviewId);
            toast('Review deleted permanently', 'success');
            setReviews(prev => prev.filter(r => r._id !== reviewId));
        } catch (err) {
            toast(err?.message || 'Failed to delete review', 'error');
        } finally {
            setModulatingId(null);
        }
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating || 0);
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                            s <= fullStars
                                ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]'
                                : 'text-slate-700'
                        }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-transparent pb-20 relative text-left">
            <VendorHeader
                vendor={vendor}
                onBack={() => router.back()}
                id={id}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            <main className="max-w-[1600px] mx-auto px-8 py-8 relative z-10 space-y-8">
                {/* 1. RATING OVERVIEW & PROGRESS BARS */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#111116] p-8 rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    {/* Big Rating Tile */}
                    <div className="lg:col-span-4 flex flex-col justify-center items-center lg:items-start lg:border-r border-white/10 lg:pr-8 py-2 text-center lg:text-left">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2">Overall Vendor Reputation</span>
                        <div className="flex items-baseline gap-3 mb-2">
                            <span className="text-5xl font-black font-mono text-white tracking-tight">{stats.average}</span>
                            <span className="text-slate-600 font-mono text-lg">/ 5.0</span>
                        </div>
                        <div className="mb-3">
                            {renderStars(Number(stats.average))}
                        </div>
                        <p className="text-xs font-mono text-slate-400">
                            Based on <span className="text-cyan-400 font-bold">{stats.total} verified</span> customer ratings
                        </p>
                        <div className="mt-4 pt-4 border-t border-white/5 w-full">
                            <span className="text-[11px] font-mono text-emerald-400 flex items-center justify-center lg:justify-start gap-1.5 font-semibold">
                                <ThumbsUp className="w-3.5 h-3.5" /> {stats.satisfactionRate}% Positive Sentiment
                            </span>
                        </div>
                    </div>

                    {/* Star Rating Distribution Bars */}
                    <div className="lg:col-span-8 flex flex-col justify-center space-y-2.5 lg:pl-4 py-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">Rating Frequency Matrix</span>
                        {[5, 4, 3, 2, 1].map((star) => (
                            <div key={star} className="flex items-center gap-3 text-xs font-mono">
                                <span className="w-12 text-slate-400 font-semibold flex items-center gap-1">
                                    {star} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                </span>
                                <div className="flex-1 h-2 rounded-full bg-black/60 border border-white/5 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${
                                            star >= 4 ? 'bg-gradient-to-r from-emerald-500 to-cyan-400' : star === 3 ? 'bg-amber-400' : 'bg-rose-500'
                                        }`}
                                        style={{ width: `${stats.percentage[star]}%` }}
                                    ></div>
                                </div>
                                <span className="w-16 text-right text-slate-400 font-bold">
                                    {stats.breakdown[star]} ({stats.percentage[star]}%)
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"></div>
                </div>

                {/* 2. FILTER & SEARCH BAR */}
                <div className="bg-[#111116] p-4 rounded-xl border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    {/* Search Input */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search feedback comments, traveller name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 transition-colors"
                        />
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap items-center gap-2">
                        {[
                            { id: 'all', label: 'All Reviews' },
                            { id: '5', label: '5 Stars' },
                            { id: '4', label: '4 Stars' },
                            { id: 'low', label: '≤ 3 Stars' },
                            { id: 'hidden', label: 'Hidden / Moderated' }
                        ].map((st) => (
                            <button
                                key={st.id}
                                onClick={() => setStatusFilter(st.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                                    statusFilter === st.id
                                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                                        : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:text-slate-200'
                                }`}
                            >
                                {st.label}
                            </button>
                        ))}

                        <button
                            onClick={() => setRefreshKey(k => k + 1)}
                            className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                            title="Refresh Reviews"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* 3. REVIEWS LIST */}
                {loading ? (
                    <div className="py-20 text-center bg-[#111116] border border-white/10 rounded-2xl">
                        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-3" />
                        <span className="text-slate-400 font-mono text-xs uppercase tracking-widest">
                            Syncing Traveller Testimonials...
                        </span>
                    </div>
                ) : filteredReviews.length === 0 ? (
                    <div className="py-20 text-center bg-[#111116] border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3">
                        <MessageSquare className="w-10 h-10 text-slate-700" />
                        <span className="text-slate-300 font-mono font-bold uppercase tracking-wider">No Reviews Found</span>
                        <span className="text-slate-600 font-mono text-xs">No feedback matching the selected filter criteria for this vendor.</span>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredReviews.map((r) => {
                            const isPublic = r.isVisible !== false;
                            const createdDate = r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent';
                            const userName = r.user?.name || 'Anonymous Traveller';
                            const itemTitle = r.item?.title || 'Trip Experience';

                            return (
                                <div
                                    key={r._id}
                                    className={`bg-[#111116] border rounded-2xl p-6 transition-all shadow-[0_0_20px_rgba(0,0,0,0.3)] relative overflow-hidden group ${
                                        isPublic ? 'border-white/10 hover:border-cyan-500/40' : 'border-rose-500/30 bg-rose-950/5'
                                    }`}
                                >
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                        {/* User Info & Rating */}
                                        <div className="flex items-start gap-3.5">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center text-cyan-400 font-bold font-mono text-sm shrink-0">
                                                {userName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2.5">
                                                    <h4 className="font-bold font-mono text-white text-sm">{userName}</h4>
                                                    {r.booking?.bookingCode && (
                                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 border border-white/5 text-slate-400">
                                                            #{r.booking.bookingCode}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {renderStars(r.rating)}
                                                    <span className="text-xs font-mono font-bold text-amber-400">{r.rating}.0</span>
                                                    <span className="text-slate-600 text-xs">•</span>
                                                    <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" /> {createdDate}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status & Moderation Buttons */}
                                        <div className="flex items-center gap-2">
                                            {isPublic ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono uppercase font-semibold">
                                                    <CheckCircle2 className="w-3 h-3" /> Visible
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-mono uppercase font-semibold">
                                                    <EyeOff className="w-3 h-3" /> Hidden from Public
                                                </span>
                                            )}

                                            {/* Toggle Visibility Action */}
                                            <button
                                                onClick={() => handleToggleVisibility(r)}
                                                disabled={modulatingId === r._id}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                                                    isPublic
                                                        ? 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                                                        : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                                                }`}
                                                title={isPublic ? 'Hide this review from customer view' : 'Make this review public'}
                                            >
                                                {isPublic ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                {isPublic ? 'Hide' : 'Publish'}
                                            </button>

                                            {/* Delete Action */}
                                            <button
                                                onClick={() => handleDeleteReview(r._id)}
                                                disabled={modulatingId === r._id}
                                                className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
                                                title="Permanently Delete Review"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Service item badge */}
                                    <div className="mb-3">
                                        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mr-2">Booked Service:</span>
                                        <span className="text-xs font-mono font-semibold text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                                            {itemTitle}
                                        </span>
                                    </div>

                                    {/* Review Comment */}
                                    <p className="text-xs font-mono text-slate-300 leading-relaxed bg-black/30 p-3.5 rounded-xl border border-white/5">
                                        "{r.comment || 'No comment provided by reviewer.'}"
                                    </p>

                                    {/* Vendor Reply (if any) */}
                                    {r.reply?.comment && (
                                        <div className="mt-3.5 ml-4 pl-3.5 border-l-2 border-indigo-500/40 space-y-1">
                                            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                                                <CornerDownRight className="w-3 h-3" /> Vendor Response:
                                            </span>
                                            <p className="text-[11px] font-mono text-slate-400 bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                                                {r.reply.comment}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
