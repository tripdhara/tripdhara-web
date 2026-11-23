'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { VendorHeader } from '@/components/admin/VendorUIFragments.js';
import api from '@/core/Api/index.js';
import { useToast } from '@/components/ui/ToastContext.js';
import {
    Calendar,
    User,
    Clock,
    CreditCard,
    Search,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Eye,
    RefreshCw,
    X,
    TrendingUp,
    MapPin,
    Tag,
    Phone,
    Mail,
    Users
} from 'lucide-react';

export default function BookingsTab({ vendor, id, activeTab, setActiveTab, onRefresh }) {
    const router = useRouter();
    const toast = useToast();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const vendorProfileId = vendor?.vendorProfile?._id || vendor?._id || id;

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const params = { vendor: vendorProfileId };
            if (statusFilter !== 'all') {
                params.status = statusFilter;
            }
            const res = await api.admin.bookings.getAll(params);
            const data = res?.data?.bookings || res?.data || res?.bookings || [];
            setBookings(Array.isArray(data) ? data : []);
        } catch (err) {
            toast(err?.message || 'Failed to load vendor bookings', 'error');
            setBookings([]);
        } finally {
            setLoading(false);
        }
    }, [vendorProfileId, statusFilter, toast]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings, refreshKey]);

    // Summary calculations
    const stats = useMemo(() => {
        const total = bookings.length;
        const confirmed = bookings.filter(b => b.status === 'confirmed').length;
        const completed = bookings.filter(b => b.status === 'completed').length;
        const cancelled = bookings.filter(b => ['cancelled', 'rejected'].includes(b.status)).length;
        const pending = bookings.filter(b => ['pending', 'unpaid'].includes(b.status)).length;
        const grossRevenue = bookings
            .filter(b => b.status !== 'cancelled')
            .reduce((sum, b) => sum + (Number(b?.pricing?.total) || 0), 0);

        return { total, confirmed, completed, cancelled, pending, grossRevenue };
    }, [bookings]);

    // Filtered bookings based on search
    const filteredBookings = useMemo(() => {
        if (!searchQuery.trim()) return bookings;
        const q = searchQuery.toLowerCase().trim();
        return bookings.filter(b => {
            const code = (b.bookingCode || b._id || '').toLowerCase();
            const travellerName = (b.traveller?.name || b.user?.name || '').toLowerCase();
            const travellerPhone = (b.traveller?.phone || b.user?.phone || '').toLowerCase();
            const itemTitle = (b.item?.title || b.package?.title || '').toLowerCase();
            return code.includes(q) || travellerName.includes(q) || travellerPhone.includes(q) || itemTitle.includes(q);
        });
    }, [bookings, searchQuery]);

    const getStatusBadge = (status) => {
        const s = (status || '').toLowerCase();
        if (s === 'confirmed') {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono uppercase tracking-wider font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Confirmed
                </span>
            );
        }
        if (s === 'completed') {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-mono uppercase tracking-wider font-semibold">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" /> Completed
                </span>
            );
        }
        if (['cancelled', 'rejected'].includes(s)) {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-mono uppercase tracking-wider font-semibold">
                    <XCircle className="w-3.5 h-3.5 text-rose-400" /> Cancelled
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-mono uppercase tracking-wider font-semibold">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> {status || 'Pending'}
            </span>
        );
    };

    const getPaymentBadge = (status) => {
        const s = (status || '').toLowerCase();
        if (['paid', 'completed'].includes(s)) {
            return <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold uppercase">PAID</span>;
        }
        if (['unpaid', 'pending'].includes(s)) {
            return <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-mono font-bold uppercase">PENDING</span>;
        }
        return <span className="px-2 py-0.5 rounded bg-slate-500/10 text-slate-400 text-[10px] font-mono font-bold uppercase">{status || 'N/A'}</span>;
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
                {/* 1. TOP KPI METRICS */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div className="bg-[#111116] p-5 rounded-xl border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.4)] relative overflow-hidden group hover:border-cyan-500/40 transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Total Bookings</span>
                            <Calendar className="w-4 h-4 text-cyan-400" />
                        </div>
                        <p className="text-2xl font-bold font-mono text-white group-hover:text-cyan-300 transition-colors">{stats.total}</p>
                        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"></div>
                    </div>

                    <div className="bg-[#111116] p-5 rounded-xl border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.4)] relative overflow-hidden group hover:border-emerald-500/40 transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Confirmed / Active</span>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </div>
                        <p className="text-2xl font-bold font-mono text-emerald-400">{stats.confirmed}</p>
                        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"></div>
                    </div>

                    <div className="bg-[#111116] p-5 rounded-xl border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.4)] relative overflow-hidden group hover:border-indigo-500/40 transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Completed Trips</span>
                            <Clock className="w-4 h-4 text-indigo-400" />
                        </div>
                        <p className="text-2xl font-bold font-mono text-indigo-300">{stats.completed}</p>
                        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent"></div>
                    </div>

                    <div className="bg-[#111116] p-5 rounded-xl border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.4)] relative overflow-hidden group hover:border-rose-500/40 transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Cancelled / Void</span>
                            <XCircle className="w-4 h-4 text-rose-400" />
                        </div>
                        <p className="text-2xl font-bold font-mono text-rose-400">{stats.cancelled}</p>
                        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-rose-500/40 to-transparent"></div>
                    </div>

                    <div className="bg-[#111116] p-5 rounded-xl border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.4)] relative overflow-hidden group hover:border-amber-500/40 transition-all col-span-2 md:col-span-1">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Gross Volume</span>
                            <TrendingUp className="w-4 h-4 text-amber-400" />
                        </div>
                        <p className="text-2xl font-bold font-mono text-amber-400">₹{stats.grossRevenue.toLocaleString('en-IN')}</p>
                        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"></div>
                    </div>
                </div>

                {/* 2. FILTER & SEARCH BAR */}
                <div className="bg-[#111116] p-4 rounded-xl border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    {/* Search Input */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by Booking ID, Traveller Name, Phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 transition-colors"
                        />
                    </div>

                    {/* Status Filter Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                        {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map((st) => (
                            <button
                                key={st}
                                onClick={() => setStatusFilter(st)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                                    statusFilter === st
                                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                                        : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:text-slate-200'
                                }`}
                            >
                                {st}
                            </button>
                        ))}

                        <button
                            onClick={() => setRefreshKey(k => k + 1)}
                            className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                            title="Refresh Bookings"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* 3. BOOKINGS TABLE */}
                <div className="bg-[#111116] rounded-xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden">
                    <div className="overflow-x-auto cyber-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-black/40 text-[10px] font-mono uppercase tracking-widest text-slate-400">
                                    <th className="py-4 px-6">Booking ID</th>
                                    <th className="py-4 px-6">Traveller</th>
                                    <th className="py-4 px-6">Package / Service</th>
                                    <th className="py-4 px-6">Trip Schedule</th>
                                    <th className="py-4 px-6">Guests</th>
                                    <th className="py-4 px-6">Amount</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-xs font-mono">
                                {loading ? (
                                    <tr>
                                        <td colSpan={8} className="py-16 text-center text-slate-500 font-mono">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
                                                <span>Syncing vendor booking stream...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-16 text-center text-slate-500 font-mono">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Calendar className="w-8 h-8 text-slate-700" />
                                                <span className="text-slate-400 font-semibold uppercase tracking-wider">No Bookings Found</span>
                                                <span className="text-[11px] text-slate-600">No reservations matching current filters for this vendor.</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBookings.map((b) => {
                                        const code = b.bookingCode || b._id?.slice(-8).toUpperCase() || 'TRP-N/A';
                                        const travellerName = b.traveller?.name || b.user?.name || 'Guest User';
                                        const travellerPhone = b.traveller?.phone || b.user?.phone || 'N/A';
                                        const packageTitle = b.item?.title || b.package?.title || 'Custom Tour';
                                        const itemType = b.item?.itemType || 'Package';
                                        const start = b.startDate ? new Date(b.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
                                        const end = b.endDate ? new Date(b.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
                                        const total = Number(b.pricing?.total || 0).toLocaleString('en-IN');
                                        const adults = b.occupancy?.adults || 1;
                                        const children = b.occupancy?.children || 0;

                                        return (
                                            <tr key={b._id} className="hover:bg-white/[0.02] transition-colors group">
                                                {/* Booking ID */}
                                                <td className="py-4 px-6 font-bold text-cyan-400">
                                                    #{code}
                                                </td>

                                                {/* Traveller */}
                                                <td className="py-4 px-6">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-slate-200 group-hover:text-white transition-colors">{travellerName}</span>
                                                        <span className="text-[10px] text-slate-500">{travellerPhone}</span>
                                                    </div>
                                                </td>

                                                {/* Package / Service */}
                                                <td className="py-4 px-6 max-w-[260px]">
                                                    <div className="flex flex-col truncate">
                                                        <span className="font-semibold text-slate-200 truncate">{packageTitle}</span>
                                                        <span className="text-[10px] text-indigo-400 uppercase tracking-widest">{itemType}</span>
                                                    </div>
                                                </td>

                                                {/* Schedule */}
                                                <td className="py-4 px-6 text-slate-300">
                                                    <div className="flex flex-col text-[11px]">
                                                        <span>{start}</span>
                                                        <span className="text-[10px] text-slate-500">to {end}</span>
                                                    </div>
                                                </td>

                                                {/* Guests */}
                                                <td className="py-4 px-6 text-slate-300">
                                                    <div className="flex items-center gap-1.5 text-[11px]">
                                                        <Users className="w-3.5 h-3.5 text-slate-500" />
                                                        <span>{adults}A{children > 0 ? `, ${children}C` : ''}</span>
                                                    </div>
                                                </td>

                                                {/* Amount & Payment */}
                                                <td className="py-4 px-6">
                                                    <div className="flex flex-col items-start gap-1">
                                                        <span className="font-bold text-slate-100">₹{total}</span>
                                                        {getPaymentBadge(b.paymentStatus)}
                                                    </div>
                                                </td>

                                                {/* Booking Status */}
                                                <td className="py-4 px-6">
                                                    {getStatusBadge(b.status)}
                                                </td>

                                                {/* Actions */}
                                                <td className="py-4 px-6 text-right">
                                                    <button
                                                        onClick={() => setSelectedBooking(b)}
                                                        className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 hover:text-white transition-all text-[11px] font-mono uppercase tracking-wider cursor-pointer inline-flex items-center gap-1.5"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" /> Details
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 4. BOOKING DETAIL MODAL */}
                {selectedBooking && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-[#111116] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto cyber-scrollbar shadow-[0_0_50px_rgba(0,0,0,0.8)] relative text-left">
                            {/* Modal Header */}
                            <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#111116] z-10">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-bold font-mono text-white">Booking #{selectedBooking.bookingCode || selectedBooking._id?.slice(-8).toUpperCase()}</h3>
                                        {getStatusBadge(selectedBooking.status)}
                                    </div>
                                    <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                                        Recorded on {new Date(selectedBooking.createdAt || Date.now()).toLocaleString('en-IN')}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-6 text-xs font-mono">
                                {/* Service Info */}
                                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl space-y-2">
                                    <span className="text-[10px] uppercase tracking-widest text-slate-500 block">Service & Schedule</span>
                                    <p className="text-sm font-bold text-white">{selectedBooking.item?.title || selectedBooking.package?.title || 'Trip Package'}</p>
                                    <div className="grid grid-cols-2 gap-3 text-slate-400 pt-2 border-t border-white/5">
                                        <div><span className="text-slate-600 block text-[10px]">SERVICE TYPE:</span> <span className="text-indigo-400 uppercase">{selectedBooking.item?.itemType || 'N/A'}</span></div>
                                        <div><span className="text-slate-600 block text-[10px]">UNITS / VEHICLES:</span> <span className="text-slate-200">{selectedBooking.occupancy?.units || 1}</span></div>
                                        <div><span className="text-slate-600 block text-[10px]">CHECK-IN / START:</span> <span className="text-slate-200">{new Date(selectedBooking.startDate).toLocaleDateString('en-IN')}</span></div>
                                        <div><span className="text-slate-600 block text-[10px]">CHECK-OUT / END:</span> <span className="text-slate-200">{new Date(selectedBooking.endDate).toLocaleDateString('en-IN')}</span></div>
                                    </div>
                                </div>

                                {/* Traveller Info */}
                                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl space-y-3">
                                    <span className="text-[10px] uppercase tracking-widest text-slate-500 block">Primary Traveller</span>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <span className="text-slate-600 block text-[10px]">NAME</span>
                                            <span className="text-slate-200 font-semibold">{selectedBooking.traveller?.name || selectedBooking.user?.name || 'N/A'}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-600 block text-[10px]">PHONE</span>
                                            <span className="text-slate-200">{selectedBooking.traveller?.phone || selectedBooking.user?.phone || 'N/A'}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-600 block text-[10px]">EMAIL</span>
                                            <span className="text-slate-200 truncate">{selectedBooking.traveller?.email || selectedBooking.user?.email || 'N/A'}</span>
                                        </div>
                                    </div>
                                    {selectedBooking.occupancy?.guestDetails?.length > 0 && (
                                        <div className="pt-2 border-t border-white/5">
                                            <span className="text-[10px] uppercase tracking-widest text-slate-500 block mb-1">Additional Guests:</span>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedBooking.occupancy.guestDetails.map((g, idx) => (
                                                    <span key={idx} className="px-2 py-1 rounded bg-black/40 border border-white/5 text-[10px] text-slate-300">
                                                        {g.name} ({g.phone || 'No phone'})
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Financial Breakdown */}
                                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl space-y-2">
                                    <span className="text-[10px] uppercase tracking-widest text-slate-500 block">Financial Matrix</span>
                                    <div className="space-y-1.5 text-slate-400">
                                        <div className="flex justify-between"><span>Base Rate:</span> <span className="text-slate-200">₹{(selectedBooking.pricing?.basePrice || 0).toLocaleString('en-IN')}</span></div>
                                        {selectedBooking.pricing?.serviceFee > 0 && (
                                            <div className="flex justify-between"><span>Platform Service Fee:</span> <span className="text-slate-200">₹{selectedBooking.pricing.serviceFee.toLocaleString('en-IN')}</span></div>
                                        )}
                                        {selectedBooking.pricing?.tax > 0 && (
                                            <div className="flex justify-between"><span>Tax / GST:</span> <span className="text-slate-200">₹{selectedBooking.pricing.tax.toLocaleString('en-IN')}</span></div>
                                        )}
                                        {selectedBooking.pricing?.discount > 0 && (
                                            <div className="flex justify-between text-emerald-400"><span>Coupon Discount:</span> <span>-₹{selectedBooking.pricing.discount.toLocaleString('en-IN')}</span></div>
                                        )}
                                        <div className="flex justify-between pt-2 border-t border-white/10 text-sm font-bold text-white">
                                            <span>Total Paid:</span>
                                            <span className="text-amber-400 font-mono">₹{(selectedBooking.pricing?.total || 0).toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Info */}
                                {selectedBooking.payment && (
                                    <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl space-y-2 text-[11px] text-slate-400">
                                        <span className="text-[10px] uppercase tracking-widest text-slate-500 block">Gateway Ledger</span>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div><span className="text-slate-600 block text-[10px]">GATEWAY:</span> <span className="uppercase text-slate-200">{selectedBooking.payment.gateway || 'Razorpay'}</span></div>
                                            <div><span className="text-slate-600 block text-[10px]">PAYMENT ID:</span> <span className="text-cyan-400 truncate block">{selectedBooking.payment.paymentId || 'N/A'}</span></div>
                                            <div><span className="text-slate-600 block text-[10px]">ORDER ID:</span> <span className="text-slate-300 truncate block">{selectedBooking.payment.orderId || 'N/A'}</span></div>
                                            <div><span className="text-slate-600 block text-[10px]">PAID AT:</span> <span className="text-slate-300">{selectedBooking.payment.paidAt ? new Date(selectedBooking.payment.paidAt).toLocaleString('en-IN') : 'N/A'}</span></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 border-t border-white/10 flex justify-end">
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="px-5 py-2 rounded-lg bg-white/10 text-slate-200 hover:bg-white/20 transition-all font-mono text-xs uppercase cursor-pointer"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
