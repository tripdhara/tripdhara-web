'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import api from '@/core/Api/index.js';
import { useToast } from '@/components/ui/ToastContext.js';
import Loading from '@/components/admin/Loading.js';
import { ArrowLeft, Save, Server, Code, Settings, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';

const buildItemFormState = (targetItem) => {
    if (!targetItem) {
        return {
            formData: { title: '', isActive: false },
            rawJson: '{}'
        };
    }

    const extractedTitle = targetItem.title || targetItem.tourDetails?.tourName || targetItem.details?.jumpName || targetItem.vehicleDetails?.model || '';
    const cleanObj = { ...targetItem };
    delete cleanObj.serviceType;
    delete cleanObj.vendorId;
    delete cleanObj.vendor;
    delete cleanObj._id;

    return {
        formData: {
            title: extractedTitle,
            isActive: targetItem.isActive || false,
        },
        rawJson: JSON.stringify(cleanObj, null, 2)
    };
};

export default function PackageItemClientWrapper({ initialItem = null, itemId }) {
    const router = useRouter();
    const toast = useToast();

    const [item, setItem] = useState(initialItem);
    const [loading, setLoading] = useState(Boolean(!initialItem && itemId));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(!initialItem && !itemId ? 'No package item ID specified' : null);

    const [formData, setFormData] = useState(() => buildItemFormState(initialItem).formData);
    const [rawJson, setRawJson] = useState(() => buildItemFormState(initialItem).rawJson);

    // Sync item helper
    const syncItemData = (targetItem) => {
        if (!targetItem) return;
        const nextState = buildItemFormState(targetItem);
        setFormData(nextState.formData);
        setRawJson(nextState.rawJson);
    };

    // Client-side fetch if initialItem was not provided
    useEffect(() => {
        if (initialItem || !itemId) return;

        let isMounted = true;

        api.admin.packages.getItem(itemId)
            .then(res => {
                if (!isMounted) return;
                const fetched = res?.data?.item || res?.data;
                if (fetched) {
                    setItem(fetched);
                    syncItemData(fetched);
                    setError(null);
                } else {
                    setError('Package item not found in catalog');
                }
            })
            .catch(err => {
                if (!isMounted) return;
                setError(err?.message || 'Failed to fetch package item');
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [initialItem, itemId]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = JSON.parse(rawJson);

            if (item?.serviceType === 'tourPackages') {
                if (!payload.tourDetails) payload.tourDetails = {};
                payload.tourDetails.tourName = formData.title;
            } else if (item?.serviceType === 'taxiPackages') {
                if (!payload.vehicleDetails) payload.vehicleDetails = {};
                payload.vehicleDetails.model = formData.title;
            } else {
                payload.title = formData.title;
            }

            payload.isActive = formData.isActive;

            const data = await api.admin.packages.updateItem(itemId, payload);

            if (data.success) {
                toast('Package node payload updated successfully.', 'success');
                const updated = data.data?.item || data.data;
                if (updated) {
                    setItem(prev => ({ ...prev, ...updated, isActive: formData.isActive }));
                }
            } else {
                toast(data.message || 'Update failed', 'error');
            }
        } catch (e) {
            toast('Invalid JSON syntax or payload structure error.', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
                <Loading message="Decrypting package node configuration..." />
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className="min-h-screen bg-[#0a0a0c] flex flex-col items-center justify-center text-slate-400 font-mono gap-4">
                <div className="flex items-center text-rose-400 gap-2">
                    <AlertTriangle className="w-6 h-6 text-rose-500" />
                    <span>{error || 'Item not found in database'}</span>
                </div>
                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-mono text-white transition-colors"
                >
                    Return to Packages Inventory
                </button>
            </div>
        );
    }

    const vendorId = item?.vendor?._id ? String(item.vendor._id) : (item?.vendorId ? String(item.vendorId) : null);
    const vendorName = item?.vendor?.businessName || item?.vendor?.name || vendorId || 'Vendor Profile';

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-slate-300 pb-24">
            <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 px-8 py-5">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => router.back()}
                            className="text-slate-400 hover:text-white transition-colors p-2 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 cursor-pointer"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase flex items-center gap-2 mb-1">
                                <Server className="w-3 h-3 text-pink-400" /> Database Identity
                                <span className="text-slate-700">/</span>
                                <span className="text-pink-400">{item._id}</span>
                            </div>
                            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                                {formData.title || 'Package Node'}
                                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-widest uppercase border ${
                                    formData.isActive
                                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                        : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                                }`}>
                                    {formData.isActive ? 'ONLINE' : 'OFFLINE'}
                                </span>
                            </h1>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-2.5 bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 border border-pink-500/30 hover:border-pink-400/50 rounded-lg text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(236,72,153,0.2)] disabled:opacity-50 cursor-pointer"
                        >
                            {saving ? (
                                <div className="w-4 h-4 border-2 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            {saving ? 'Writing...' : 'Commit Node'}
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto p-8 pt-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Core Basic Configuration */}
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#111116] border border-white/10 rounded-2xl p-8 relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl pointer-events-none"></div>
                            <h2 className="text-sm font-mono tracking-widest text-pink-400 uppercase flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                                <Settings className="w-4 h-4" /> Component Structure
                            </h2>

                            <div className="space-y-6 relative z-10">
                                <div>
                                    <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">Display Designation / Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all font-mono"
                                    />
                                </div>

                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                                    <div className="flex-1">
                                        <label className="block text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest mb-1">Network Transmission (Status)</label>
                                        <p className="text-xs text-slate-500">Toggle whether this package node is active and visible on Tripdhara.</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                        className={`relative w-14 h-7 rounded-full transition-all duration-300 cursor-pointer ${
                                            formData.isActive
                                                ? 'bg-emerald-500/30 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                                                : 'bg-slate-800 border border-slate-700'
                                        }`}
                                    >
                                        <div className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full transition-all duration-300 ${
                                            formData.isActive
                                                ? 'left-[calc(100%-1.5rem)] bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]'
                                                : 'left-1 bg-slate-500'
                                        }`}></div>
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Advanced Raw JSON Editor */}
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-[#111116] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                            <div className="bg-black/80 border-b border-white/10 px-8 py-5 flex items-center justify-between">
                                <h2 className="text-sm font-mono tracking-widest text-indigo-400 uppercase flex items-center gap-3">
                                    <Code className="w-4 h-4" /> Raw Data Mutator
                                </h2>
                                <div className="flex gap-2">
                                    <span className="w-3 h-3 rounded-full border border-rose-500 flex items-center justify-center"><div className="w-1 h-1 bg-rose-500 rounded-full animate-ping"></div></span>
                                    <span className="w-3 h-3 rounded-full border border-amber-500 -ml-1"></span>
                                    <span className="w-3 h-3 rounded-full border border-emerald-500 -ml-1"></span>
                                </div>
                            </div>
                            <div className="p-1">
                                <textarea
                                    value={rawJson}
                                    onChange={e => setRawJson(e.target.value)}
                                    className="w-full h-[500px] bg-black text-[#56b6c2] p-6 font-mono text-sm leading-relaxed focus:outline-none resize-none custom-scrollbar"
                                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '100% 28px', lineHeight: '28px' }}
                                    spellCheck="false"
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-[#111116] border border-white/10 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                            <h3 className="text-[10px] font-mono tracking-widest text-slate-500 uppercase flex items-center gap-2 border-b border-white/10 pb-4 mb-6">
                                <Activity className="w-3 h-3 text-cyan-400" /> Origin Metrics
                            </h3>

                            <div className="space-y-5">
                                <div>
                                    <label className="text-[9px] font-mono tracking-widest text-slate-500 uppercase mb-1 block">Entity Type</label>
                                    <div className="text-sm text-cyan-400 font-mono flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_currentColor]"></span> {item.serviceType || 'Package'}
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-white/5">
                                    <label className="text-[9px] font-mono tracking-widest text-slate-500 uppercase mb-1 block">Provider Link</label>
                                    {vendorId ? (
                                        <Link href={`/admin/vendors/${vendorId}`} className="text-sm text-indigo-400 font-mono hover:text-indigo-300 hover:underline transition-colors flex items-center gap-2">
                                            {vendorName}
                                        </Link>
                                    ) : (
                                        <span className="text-sm text-slate-500 font-mono">Unassigned</span>
                                    )}
                                </div>
                                <div className="pt-4 border-t border-white/5">
                                    <label className="text-[9px] font-mono tracking-widest text-slate-500 uppercase mb-1 block">Creation Timestamp</label>
                                    <div className="text-xs text-slate-300 font-mono">{item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
                            <div className="flex items-start gap-4">
                                <div className="bg-emerald-500/20 p-2 rounded-lg border border-emerald-500/30 text-emerald-400">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold font-mono tracking-widest text-emerald-400 uppercase mb-1">Editor Warning</h3>
                                    <p className="text-[10px] uppercase font-mono tracking-widest text-emerald-200/50 leading-relaxed">
                                        Direct modification of raw JSON payload instantly alters the node properties across the entire neural network. Ensure bracket integrity before committing changes.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #000; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 3px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.6); }
            `}</style>
        </div>
    );
}
