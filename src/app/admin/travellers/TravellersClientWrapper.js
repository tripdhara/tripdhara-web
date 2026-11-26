'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Users,
    Mail,
    Phone,
    Plus,
    RefreshCw,
    ShieldCheck,
    ShieldAlert,
    Edit2,
    Trash2,
    ExternalLink,
    CheckCircle2,
    XCircle,
    UserCheck,
    AlertTriangle,
    Clock
} from 'lucide-react';
import api from '@/core/Api/index.js';
import CyberTable from '@/components/admin/CyberTable.js';
import PageHeader from '@/components/admin/PageHeader.js';
import DynamicModal from '@/components/admin/DynamicModal.js';
import Loading from '@/components/admin/Loading.js';
import { useToast } from '@/components/ui/ToastContext.js';

export default function TravellersClientWrapper() {
    const router = useRouter();
    const toast = useToast();

    // Data States
    const [travellers, setTravellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    // Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Action In-Progress States
    const [actionInProgressId, setActionInProgressId] = useState(null);

    // Edit Modal State
    const [editingTraveller, setEditingTraveller] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', phone: '' });
    const [isSaving, setIsSaving] = useState(false);

    // Confirmation Modal State (replaces native window.confirm)
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        type: null, // 'block' | 'delete'
        traveller: null,
        targetStatus: null
    });

    const editFields = [
        { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'e.g. John Doe' },
        { name: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'e.g. john@example.com' },
        { name: 'phone', label: 'Phone Number', type: 'tel', required: false, placeholder: 'e.g. +91 9876543210' }
    ];

    // Fetch travellers from API
    useEffect(() => {
        let isMounted = true;
        const loadTravellers = async () => {
            try {
                const res = await api.admin.travellers.getAll();
                if (!isMounted) return;
                const list = res.data?.travellers || res.data || [];
                setTravellers(Array.isArray(list) ? list : []);
            } catch (err) {
                if (isMounted) toast(err.message || 'Failed to fetch travellers', 'error');
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadTravellers();
        return () => {
            isMounted = false;
        };
    }, [refreshKey, toast]);

    // KPI Metrics
    const metrics = useMemo(() => {
        const total = travellers.length;
        const active = travellers.filter(t => t.status === 'active').length;
        const blocked = travellers.filter(t => t.status === 'blocked').length;
        const verified = travellers.filter(t => t.isVerified).length;
        return { total, active, blocked, verified };
    }, [travellers]);

    // Filtered Travellers List
    const filteredTravellers = useMemo(() => {
        return travellers.filter(t => {
            const query = searchQuery.toLowerCase().trim();
            const matchesSearch = !query ||
                (t.name && t.name.toLowerCase().includes(query)) ||
                (t.email && t.email.toLowerCase().includes(query)) ||
                (t.phone && t.phone.toLowerCase().includes(query)) ||
                (t._id && t._id.toLowerCase().includes(query));

            const matchesStatus = statusFilter === 'all' || t.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [travellers, searchQuery, statusFilter]);

    // Edit Handler
    const openEditModal = (t) => {
        setEditingTraveller(t);
        setEditForm({
            name: t.name || '',
            email: t.email || '',
            phone: t.phone || ''
        });
    };

    const handleEditSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!editingTraveller) return;

        setIsSaving(true);
        try {
            const res = await api.admin.travellers.update(editingTraveller._id, editForm);
            if (res.success) {
                const updated = res.data?.traveller || res.data;
                setTravellers(prev =>
                    prev.map(item => item._id === editingTraveller._id ? { ...item, ...editForm, ...updated } : item)
                );
                toast('Traveller profile updated successfully', 'success');
                setEditingTraveller(null);
            } else {
                toast(res.error || res.message || 'Failed to update traveller', 'error');
            }
        } catch (err) {
            toast(err.message || 'Error updating traveller', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // Open Confirmation Dialog
    const promptToggleBlock = (traveller) => {
        const targetStatus = traveller.status === 'blocked' ? 'active' : 'blocked';
        setConfirmModal({
            isOpen: true,
            type: 'block',
            traveller,
            targetStatus
        });
    };

    const promptDelete = (traveller) => {
        setConfirmModal({
            isOpen: true,
            type: 'delete',
            traveller,
            targetStatus: null
        });
    };

    // Execute Confirmed Action
    const handleConfirmAction = async () => {
        const { type, traveller, targetStatus } = confirmModal;
        if (!traveller) return;

        const travellerId = traveller._id;
        setActionInProgressId(travellerId);
        setConfirmModal({ isOpen: false, type: null, traveller: null, targetStatus: null });

        try {
            if (type === 'block') {
                const res = await api.admin.travellers.update(travellerId, { status: targetStatus });
                if (res.success) {
                    setTravellers(prev =>
                        prev.map(t => t._id === travellerId ? { ...t, status: targetStatus } : t)
                    );
                    toast(`Traveller ${targetStatus === 'blocked' ? 'blocked' : 'unblocked'} successfully`, 'success');
                } else {
                    toast(res.error || res.message || 'Failed to update status', 'error');
                }
            } else if (type === 'delete') {
                const res = await api.admin.travellers.delete(travellerId);
                if (res.success) {
                    setTravellers(prev => prev.filter(t => t._id !== travellerId));
                    toast('Traveller permanently deleted', 'success');
                } else {
                    toast(res.error || res.message || 'Failed to delete traveller', 'error');
                }
            }
        } catch (err) {
            toast(err.message || 'Action failed', 'error');
        } finally {
            setActionInProgressId(null);
        }
    };

    // Table Columns
    const columns = useMemo(() => [
        {
            header: 'Traveller',
            accessor: 'name',
            render: (t) => {
                const initials = (t.name || 'U').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
                return (
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-mono font-bold text-indigo-300 shrink-0">
                            {initials}
                        </div>
                        <div className="flex flex-col">
                            <Link
                                href={`/admin/travellers/${t._id}`}
                                className="font-bold text-slate-100 hover:text-indigo-400 transition-colors"
                            >
                                {t.name || 'Anonymous User'}
                            </Link>
                            <span className="text-[10px] font-mono text-slate-500">
                                ID: {t._id}
                            </span>
                        </div>
                    </div>
                );
            }
        },
        {
            header: 'Contact Information',
            accessor: 'email',
            render: (t) => (
                <div className="flex flex-col gap-1 text-xs font-mono">
                    <div className="flex items-center gap-2 text-slate-300">
                        <Mail size={12} className="text-slate-500 shrink-0" />
                        <span className="truncate max-w-[200px]">{t.email || 'N/A'}</span>
                    </div>
                    {t.phone ? (
                        <div className="flex items-center gap-2 text-slate-400">
                            <Phone size={12} className="text-slate-500 shrink-0" />
                            <span>{t.phone}</span>
                        </div>
                    ) : (
                        <span className="text-[10px] text-slate-600">No phone registered</span>
                    )}
                </div>
            )
        },
        {
            header: 'Verification',
            accessor: 'isVerified',
            render: (t) => (
                <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-semibold border ${
                        t.isVerified
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                >
                    {t.isVerified ? (
                        <>
                            <ShieldCheck size={11} className="text-emerald-400" />
                            Verified
                        </>
                    ) : (
                        <>
                            <Clock size={11} className="text-slate-500" />
                            Unverified
                        </>
                    )}
                </span>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (t) => {
                const status = t.status || 'pending';
                const isBlocked = status === 'blocked';
                const isActive = status === 'active';

                return (
                    <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-semibold border ${
                            isActive
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : isBlocked
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                    >
                        <span
                            className={`w-1.5 h-1.5 rounded-full ${
                                isActive ? 'bg-emerald-400 animate-pulse' : isBlocked ? 'bg-rose-400' : 'bg-amber-400'
                            }`}
                        />
                        {status}
                    </span>
                );
            }
        },
        {
            header: 'Registered',
            accessor: 'createdAt',
            render: (t) => (
                <span className="text-xs font-mono text-slate-400">
                    {t.createdAt
                        ? new Date(t.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                          })
                        : 'N/A'}
                </span>
            )
        },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (t) => {
                const isBusy = actionInProgressId === t._id;
                const isBlocked = t.status === 'blocked';

                return (
                    <div className="flex items-center gap-1.5">
                        {/* View Profile */}
                        <Link
                            href={`/admin/travellers/${t._id}`}
                            className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg transition-all"
                            title="View Full Profile"
                        >
                            <ExternalLink size={13} />
                        </Link>

                        {/* Edit */}
                        <button
                            onClick={() => openEditModal(t)}
                            className="p-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-lg transition-all cursor-pointer"
                            title="Quick Edit Profile"
                        >
                            <Edit2 size={13} />
                        </button>

                        {/* Block / Unblock Toggle */}
                        <button
                            onClick={() => promptToggleBlock(t)}
                            disabled={isBusy}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer disabled:opacity-50 ${
                                isBlocked
                                    ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
                                    : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/20'
                            }`}
                            title={isBlocked ? 'Unblock Traveller' : 'Block Traveller'}
                        >
                            {isBusy ? (
                                <RefreshCw size={13} className="animate-spin" />
                            ) : isBlocked ? (
                                <ShieldCheck size={13} />
                            ) : (
                                <ShieldAlert size={13} />
                            )}
                        </button>

                        {/* Delete */}
                        <button
                            onClick={() => promptDelete(t)}
                            disabled={isBusy}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                            title="Delete Traveller"
                        >
                            <Trash2 size={13} />
                        </button>
                    </div>
                );
            }
        }
    ], [actionInProgressId]);

    if (loading && travellers.length === 0) {
        return (
            <div className="min-h-[500px] flex items-center justify-center">
                <Loading message="Synchronizing Traveller Nodes..." />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <PageHeader
                title="Traveller Directory"
                titleBadge={`${metrics.total} Registered`}
                subtitle="Platform consumer accounts, authentication protocols, and access management"
                icon={Users}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search travellers by name, email, phone..."
                showAction={true}
                actionLabel="Register Traveller"
                actionIcon={Plus}
                onAction={() => router.push('/admin/travellers/add')}
            />

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="bg-[#111116] border border-white/5 rounded-xl p-4 shadow-lg flex items-center justify-between">
                    <div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">Total Travellers</div>
                        <div className="text-xl font-bold font-mono text-white">{metrics.total}</div>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                        <Users size={18} />
                    </div>
                </div>

                <div className="bg-[#111116] border border-white/5 rounded-xl p-4 shadow-lg flex items-center justify-between">
                    <div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">Active Accounts</div>
                        <div className="text-xl font-bold font-mono text-emerald-400">{metrics.active}</div>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <CheckCircle2 size={18} />
                    </div>
                </div>

                <div className="bg-[#111116] border border-white/5 rounded-xl p-4 shadow-lg flex items-center justify-between">
                    <div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">Blocked Accounts</div>
                        <div className="text-xl font-bold font-mono text-rose-400">{metrics.blocked}</div>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                        <XCircle size={18} />
                    </div>
                </div>

                <div className="bg-[#111116] border border-white/5 rounded-xl p-4 shadow-lg flex items-center justify-between">
                    <div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">Verified Users</div>
                        <div className="text-xl font-bold font-mono text-cyan-400">{metrics.verified}</div>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                        <UserCheck size={18} />
                    </div>
                </div>
            </div>

            {/* Status Tabs and Quick Controls */}
            <div className="flex items-center justify-between gap-4 bg-[#111116]/80 p-3 rounded-xl border border-white/5">
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all cursor-pointer ${
                            statusFilter === 'all'
                                ? 'bg-indigo-600 text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        All ({metrics.total})
                    </button>
                    <button
                        onClick={() => setStatusFilter('active')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all cursor-pointer ${
                            statusFilter === 'active'
                                ? 'bg-emerald-600 text-white font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        Active ({metrics.active})
                    </button>
                    <button
                        onClick={() => setStatusFilter('blocked')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all cursor-pointer ${
                            statusFilter === 'blocked'
                                ? 'bg-rose-600 text-white font-bold shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        Blocked ({metrics.blocked})
                    </button>
                </div>

                <button
                    onClick={() => setRefreshKey(k => k + 1)}
                    className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg border border-white/5 transition-colors cursor-pointer"
                    title="Reload travellers directory"
                >
                    <RefreshCw size={14} className={loading ? 'animate-spin text-indigo-400' : ''} />
                </button>
            </div>

            {/* Table */}
            <main className="relative z-10">
                <CyberTable
                    data={filteredTravellers}
                    columns={columns}
                    emptyText="No travellers found matching your search criteria."
                    searchable={false}
                    itemsPerPage={12}
                    exportFilename="tripdhara_travellers_directory"
                />
            </main>

            {/* Edit Modal */}
            <DynamicModal
                isOpen={Boolean(editingTraveller)}
                onClose={() => setEditingTraveller(null)}
                title="Edit Traveller Profile"
                fields={editFields}
                formData={editForm}
                onChange={setEditForm}
                onSubmit={handleEditSubmit}
                loading={isSaving}
                submitText="Save Changes"
            />

            {/* Confirmation Dialog Modal */}
            {confirmModal.isOpen && (
                <div
                    className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
                    onClick={() => setConfirmModal({ isOpen: false, type: null, traveller: null, targetStatus: null })}
                >
                    <div
                        className="bg-[#111116] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                confirmModal.type === 'delete' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                            }`}>
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white">
                                    {confirmModal.type === 'delete' ? 'Delete Traveller' : `${confirmModal.targetStatus === 'blocked' ? 'Block' : 'Unblock'} Traveller`}
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Confirm account status modification
                                </p>
                            </div>
                        </div>

                        <p className="text-sm text-slate-300 leading-relaxed">
                            {confirmModal.type === 'delete' ? (
                                <>Are you sure you want to permanently delete traveller <span className="font-bold text-white">{confirmModal.traveller?.name || 'this user'}</span>? This action cannot be reversed.</>
                            ) : (
                                <>Are you sure you want to change the status of <span className="font-bold text-white">{confirmModal.traveller?.name || 'this user'}</span> to <span className={`font-bold uppercase ${confirmModal.targetStatus === 'blocked' ? 'text-rose-400' : 'text-emerald-400'}`}>{confirmModal.targetStatus}</span>?</>
                            )}
                        </p>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                onClick={() => setConfirmModal({ isOpen: false, type: null, traveller: null, targetStatus: null })}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-xs font-mono transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmAction}
                                className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                                    confirmModal.type === 'delete' || confirmModal.targetStatus === 'blocked'
                                        ? 'bg-rose-600 hover:bg-rose-500 text-white'
                                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                }`}
                            >
                                {confirmModal.type === 'delete' ? 'Delete Permanently' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
