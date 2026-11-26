'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { VendorHeader } from '@/components/admin/VendorUIFragments.js';
import api from '@/core/Api/index.js';
import { useToast } from '@/components/ui/ToastContext.js';
import {
    Landmark,
    CreditCard,
    DollarSign,
    TrendingUp,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Search,
    RefreshCw,
    X,
    Eye,
    ArrowUpRight,
    Send,
    ShieldCheck,
    FileText,
    Copy,
    Check
} from 'lucide-react';

export default function PayoutsTab({ vendor, id, activeTab, setActiveTab, onRefresh }) {
    const router = useRouter();
    const toast = useToast();

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBookingForPayout, setSelectedBookingForPayout] = useState(null);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [settleLoading, setSettleLoading] = useState(false);
    const [payoutForm, setPayoutForm] = useState({ transactionId: '', note: '', amount: '' });
    const [copiedAccount, setCopiedAccount] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const vendorProfile = vendor?.vendorProfile || vendor || {};
    const bank = vendorProfile.bankDetails || vendor.bankDetails || {};
    const vendorProfileId = vendorProfile._id || vendor?._id || id;

    // Fetch payment history for this vendor
    useEffect(() => {
        let isMounted = true;
        const loadPaymentHistory = async () => {
            try {
                const params = { vendor: vendorProfileId };
                if (searchQuery.trim()) params.search = searchQuery.trim();
                const res = await api.admin.payments.getHistory(params);
                if (!isMounted) return;
                const list = res?.data?.history?.payments || res?.data?.payments || res?.history?.payments || res?.payments || [];
                setPayments(Array.isArray(list) ? list : []);
            } catch (err) {
                if (isMounted) {
                    toast(err?.message || 'Failed to load payout history', 'error');
                    setPayments([]);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadPaymentHistory();
        return () => {
            isMounted = false;
        };
    }, [vendorProfileId, searchQuery, refreshKey, toast]);

    // Financial KPIs
    const stats = useMemo(() => {
        let grossVolume = 0;
        let settledAmount = 0;
        let pendingAmount = 0;
        let platformFees = 0;

        payments.forEach(b => {
            const total = Number(b.pricing?.total) || 0;
            const fee = Number(b.pricing?.serviceFee) || Math.round(total * 0.1); // 10% standard platform commission if not explicit
            const netShare = Number(b.payout?.amount) || (b.pricing?.basePrice ? Number(b.pricing.basePrice) : total - fee);

            grossVolume += total;
            platformFees += fee;

            if (b.payout?.status === 'paid') {
                settledAmount += (Number(b.payout?.amount) || netShare);
            } else if (b.status !== 'cancelled') {
                pendingAmount += netShare;
            }
        });

        return { grossVolume, settledAmount, pendingAmount, platformFees };
    }, [payments]);

    // Filter payments
    const filteredPayments = useMemo(() => {
        return payments.filter(b => {
            if (statusFilter === 'paid') {
                return b.payout?.status === 'paid';
            }
            if (statusFilter === 'pending') {
                return b.payout?.status !== 'paid' && b.status !== 'cancelled';
            }
            if (statusFilter === 'refunded') {
                return ['refunded', 'partially_refunded'].includes(b.paymentStatus);
            }
            return true;
        });
    }, [payments, statusFilter]);

    const handleCopyAccount = (acc) => {
        if (!acc) return;
        navigator.clipboard.writeText(acc);
        setCopiedAccount(true);
        toast('Bank account number copied to clipboard', 'info');
        setTimeout(() => setCopiedAccount(false), 2000);
    };

    // Open Payout Settlement Modal
    const handleOpenSettleModal = useCallback((b) => {
        const total = Number(b.pricing?.total) || 0;
        const fee = Number(b.pricing?.serviceFee) || Math.round(total * 0.1);
        const defaultNet = b.pricing?.basePrice ? Number(b.pricing.basePrice) : total - fee;
        const suffix = (typeof crypto !== 'undefined' && crypto.randomUUID)
            ? crypto.randomUUID().slice(0, 8).toUpperCase()
            : String(b._id || '').slice(-8).toUpperCase();

        setSelectedBookingForPayout(b);
        setPayoutForm({
            amount: defaultNet,
            transactionId: `TXN_${suffix}`,
            note: `Vendor Payout Settlement for #${b.bookingCode || b._id?.slice(-8).toUpperCase()}`
        });
    }, []);

    // Submit Payout
    const handleAuthorizePayout = async (e) => {
        e.preventDefault();
        if (!selectedBookingForPayout) return;

        setSettleLoading(true);
        try {
            await api.admin.payments.payout({
                bookingId: selectedBookingForPayout._id,
                amount: Number(payoutForm.amount),
                transactionId: payoutForm.transactionId,
                note: payoutForm.note
            });

            toast(`Payout of ₹${Number(payoutForm.amount).toLocaleString('en-IN')} settled successfully!`, 'success');
            setSelectedBookingForPayout(null);
            setRefreshKey(k => k + 1);
            if (onRefresh) onRefresh();
        } catch (err) {
            toast(err?.message || 'Payout settlement failed', 'error');
        } finally {
            setSettleLoading(false);
        }
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
                {/* 1. BANK & DISBURSEMENT TARGET SNAPSHOT */}
                <div className="bg-[#111116] p-6 rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                                <Landmark className="w-7 h-7" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-bold font-mono text-white tracking-wide">
                                        {bank.bankName || 'No Registered Bank Account'}
                                    </h3>
                                    {bank.razorpayFundAccountId ? (
                                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
                                            <ShieldCheck className="w-3 h-3" /> RazorpayX Linked
                                        </span>
                                    ) : (
                                        <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono font-bold">
                                            Direct Payout Mode
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs font-mono text-slate-400">
                                    Beneficiary: <span className="text-slate-200 font-semibold">{bank.accountHolderName || vendor.name || 'N/A'}</span>
                                </p>
                                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-slate-600">A/C:</span>
                                        <span className="text-slate-200 font-bold tracking-wider">{bank.accountNumber || 'NOT SET'}</span>
                                        {bank.accountNumber && (
                                            <button
                                                onClick={() => handleCopyAccount(bank.accountNumber)}
                                                className="text-slate-500 hover:text-cyan-400 transition-colors p-1"
                                                title="Copy Account Number"
                                            >
                                                {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-slate-600">IFSC:</span>
                                        <span className="text-cyan-400 font-bold">{bank.ifscCode || 'NOT SET'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setActiveTab('business')}
                                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all text-xs font-mono uppercase tracking-wider cursor-pointer"
                            >
                                Edit Bank Coordinates
                            </button>
                        </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"></div>
                </div>

                {/* 2. FINANCIAL OVERVIEW KPI TILES */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#111116] p-5 rounded-xl border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.4)] relative overflow-hidden group hover:border-cyan-500/40 transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Gross Processed</span>
                            <TrendingUp className="w-4 h-4 text-cyan-400" />
                        </div>
                        <p className="text-2xl font-bold font-mono text-white group-hover:text-cyan-300 transition-colors">
                            ₹{stats.grossVolume.toLocaleString('en-IN')}
                        </p>
                        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"></div>
                    </div>

                    <div className="bg-[#111116] p-5 rounded-xl border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.4)] relative overflow-hidden group hover:border-emerald-500/40 transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Disbursed / Paid</span>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </div>
                        <p className="text-2xl font-bold font-mono text-emerald-400">
                            ₹{stats.settledAmount.toLocaleString('en-IN')}
                        </p>
                        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"></div>
                    </div>

                    <div className="bg-[#111116] p-5 rounded-xl border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.4)] relative overflow-hidden group hover:border-amber-500/40 transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Pending Settlement</span>
                            <Clock className="w-4 h-4 text-amber-400" />
                        </div>
                        <p className="text-2xl font-bold font-mono text-amber-400">
                            ₹{stats.pendingAmount.toLocaleString('en-IN')}
                        </p>
                        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"></div>
                    </div>

                    <div className="bg-[#111116] p-5 rounded-xl border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.4)] relative overflow-hidden group hover:border-indigo-500/40 transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Platform Commission</span>
                            <CreditCard className="w-4 h-4 text-indigo-400" />
                        </div>
                        <p className="text-2xl font-bold font-mono text-indigo-300">
                            ₹{stats.platformFees.toLocaleString('en-IN')}
                        </p>
                        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent"></div>
                    </div>
                </div>

                {/* 3. FILTER & SEARCH BAR */}
                <div className="bg-[#111116] p-4 rounded-xl border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Filter by Booking Code..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 transition-colors"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {[
                            { id: 'all', label: 'All Transactions' },
                            { id: 'pending', label: 'Ready for Payout' },
                            { id: 'paid', label: 'Settled Payouts' },
                            { id: 'refunded', label: 'Refunds' }
                        ].map((st) => (
                            <button
                                key={st.id}
                                onClick={() => setStatusFilter(st.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                                    statusFilter === st.id
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                                        : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:text-slate-200'
                                }`}
                            >
                                {st.label}
                            </button>
                        ))}

                        <button
                            onClick={() => setRefreshKey(k => k + 1)}
                            className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                            title="Refresh Ledger"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* 4. SETTLEMENT LEDGER TABLE */}
                <div className="bg-[#111116] rounded-xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden">
                    <div className="overflow-x-auto cyber-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-black/40 text-[10px] font-mono uppercase tracking-widest text-slate-400">
                                    <th className="py-4 px-6">Booking Reference</th>
                                    <th className="py-4 px-6">Date</th>
                                    <th className="py-4 px-6">Gross Booking</th>
                                    <th className="py-4 px-6">Commission (10%)</th>
                                    <th className="py-4 px-6">Vendor Net Share</th>
                                    <th className="py-4 px-6">Settlement Status</th>
                                    <th className="py-4 px-6 text-right">Disbursement Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-xs font-mono">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="py-16 text-center text-slate-500 font-mono">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
                                                <span>Auditing financial ledger nodes...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredPayments.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-16 text-center text-slate-500 font-mono">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <DollarSign className="w-8 h-8 text-slate-700" />
                                                <span className="text-slate-400 font-semibold uppercase tracking-wider">No Settlements Found</span>
                                                <span className="text-[11px] text-slate-600">No payment records matching the selected ledger filter.</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPayments.map((b) => {
                                        const code = b.bookingCode || b._id?.slice(-8).toUpperCase() || 'TRP-N/A';
                                        const gross = Number(b.pricing?.total) || 0;
                                        const fee = Number(b.pricing?.serviceFee) || Math.round(gross * 0.1);
                                        const netShare = Number(b.payout?.amount) || (b.pricing?.basePrice ? Number(b.pricing.basePrice) : gross - fee);
                                        const isPaid = b.payout?.status === 'paid';
                                        const createdDate = b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

                                        return (
                                            <tr key={b._id} className="hover:bg-white/[0.02] transition-colors group">
                                                {/* Booking Reference */}
                                                <td className="py-4 px-6">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-cyan-400">#{code}</span>
                                                        <span className="text-[10px] text-slate-500 truncate max-w-[180px]">{b.item?.title || 'Trip Package'}</span>
                                                    </div>
                                                </td>

                                                {/* Date */}
                                                <td className="py-4 px-6 text-slate-300">
                                                    {createdDate}
                                                </td>

                                                {/* Gross Booking */}
                                                <td className="py-4 px-6 text-slate-200 font-semibold">
                                                    ₹{gross.toLocaleString('en-IN')}
                                                </td>

                                                {/* Platform Fee */}
                                                <td className="py-4 px-6 text-indigo-400">
                                                    ₹{fee.toLocaleString('en-IN')}
                                                </td>

                                                {/* Net Share */}
                                                <td className="py-4 px-6 font-bold text-emerald-400">
                                                    ₹{netShare.toLocaleString('en-IN')}
                                                </td>

                                                {/* Settlement Status */}
                                                <td className="py-4 px-6">
                                                    {isPaid ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono uppercase tracking-wider font-semibold">
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Settled
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-mono uppercase tracking-wider font-semibold">
                                                            <Clock className="w-3.5 h-3.5 text-amber-400" /> Pending
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Action */}
                                                <td className="py-4 px-6 text-right">
                                                    {isPaid ? (
                                                        <button
                                                            onClick={() => setSelectedReceipt(b)}
                                                            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all text-[11px] font-mono uppercase tracking-wider cursor-pointer inline-flex items-center gap-1.5"
                                                        >
                                                            <FileText className="w-3.5 h-3.5" /> Receipt
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleOpenSettleModal(b)}
                                                            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:text-white transition-all text-[11px] font-mono uppercase tracking-wider cursor-pointer inline-flex items-center gap-1.5 font-bold"
                                                        >
                                                            <Send className="w-3.5 h-3.5" /> Settle Payout
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 5. SETTLEMENT MODAL */}
                {selectedBookingForPayout && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-[#111116] border border-white/10 rounded-2xl max-w-lg w-full overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] relative text-left">
                            <form onSubmit={handleAuthorizePayout}>
                                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                                            <Landmark className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold font-mono text-white">Disburse Vendor Settlement</h3>
                                            <p className="text-[11px] font-mono text-slate-500">Booking #{selectedBookingForPayout.bookingCode || selectedBookingForPayout._id?.slice(-8).toUpperCase()}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedBookingForPayout(null)}
                                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="p-6 space-y-4 text-xs font-mono">
                                    {/* Bank Snapshot */}
                                    <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-xl space-y-1.5 text-slate-400">
                                        <span className="text-[10px] uppercase tracking-widest text-slate-500 block">Beneficiary Target</span>
                                        <div className="flex justify-between"><span className="text-slate-600">Holder:</span> <span className="text-slate-200 font-semibold">{bank.accountHolderName || vendor.name || 'N/A'}</span></div>
                                        <div className="flex justify-between"><span className="text-slate-600">Bank:</span> <span className="text-slate-200">{bank.bankName || 'N/A'}</span></div>
                                        <div className="flex justify-between"><span className="text-slate-600">A/C:</span> <span className="text-cyan-400 font-bold">{bank.accountNumber || 'NOT CONFIGURED'}</span></div>
                                        <div className="flex justify-between"><span className="text-slate-600">IFSC:</span> <span className="text-slate-300">{bank.ifscCode || 'NOT CONFIGURED'}</span></div>
                                    </div>

                                    {/* Settlement Amount */}
                                    <div>
                                        <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                                            Settlement Amount (₹)
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            value={payoutForm.amount}
                                            onChange={(e) => setPayoutForm({ ...payoutForm, amount: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm font-mono text-emerald-400 font-bold focus:outline-none focus:border-emerald-500/60"
                                        />
                                    </div>

                                    {/* UTR / Transaction ID */}
                                    <div>
                                        <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                                            Bank UTR / Transaction Reference ID
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. UTR_202611239821"
                                            value={payoutForm.transactionId}
                                            onChange={(e) => setPayoutForm({ ...payoutForm, transactionId: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3.5 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500/60"
                                        />
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                                            Internal Settlement Memo (Optional)
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={payoutForm.note}
                                            onChange={(e) => setPayoutForm({ ...payoutForm, note: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3.5 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500/60"
                                        />
                                    </div>
                                </div>

                                <div className="p-4 border-t border-white/10 bg-black/40 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedBookingForPayout(null)}
                                        className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-mono uppercase cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={settleLoading}
                                        className="px-5 py-2 rounded-lg bg-emerald-500 text-black font-bold text-xs font-mono uppercase tracking-wider hover:bg-emerald-400 transition-all cursor-pointer flex items-center gap-2"
                                    >
                                        {settleLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                                        Authorize & Disburse
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* 6. SETTLED RECEIPT MODAL */}
                {selectedReceipt && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-[#111116] border border-white/10 rounded-2xl max-w-md w-full overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] text-left">
                            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
                                <div className="flex items-center gap-2.5">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                    <h3 className="text-sm font-bold font-mono text-white">Settlement Audit Record</h3>
                                </div>
                                <button
                                    onClick={() => setSelectedReceipt(null)}
                                    className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="p-6 space-y-3 text-xs font-mono text-slate-300">
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-slate-500">Booking Code:</span>
                                    <span className="text-cyan-400 font-bold">#{selectedReceipt.bookingCode || selectedReceipt._id?.slice(-8).toUpperCase()}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-slate-500">Gross Collected:</span>
                                    <span>₹{(selectedReceipt.pricing?.total || 0).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-slate-500">Settled Amount:</span>
                                    <span className="text-emerald-400 font-bold text-sm">₹{(selectedReceipt.payout?.amount || selectedReceipt.pricing?.basePrice || 0).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-slate-500">Transaction ID / UTR:</span>
                                    <span className="text-slate-200 font-bold">{selectedReceipt.payout?.transactionId || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-slate-500">Settled At:</span>
                                    <span className="text-slate-400">{selectedReceipt.payout?.paidAt ? new Date(selectedReceipt.payout.paidAt).toLocaleString('en-IN') : 'N/A'}</span>
                                </div>
                                {selectedReceipt.adminNotes && (
                                    <div className="pt-1">
                                        <span className="text-slate-500 block text-[10px] uppercase tracking-wider mb-1">Audit Notes:</span>
                                        <p className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-[11px] text-slate-300">{selectedReceipt.adminNotes}</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-white/10 bg-black/40 flex justify-end">
                                <button
                                    onClick={() => setSelectedReceipt(null)}
                                    className="px-4 py-1.5 rounded-lg bg-white/10 text-slate-300 hover:text-white text-xs font-mono uppercase cursor-pointer"
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
