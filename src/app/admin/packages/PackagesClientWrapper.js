'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
    Power,
    ExternalLink,
    MapPin,
    Package as PackageIcon,
    Plus,
    RefreshCw,
    CheckCircle2,
    XCircle,
    Layers,
    Users,
    AlertCircle,
    Search,
    Building2
} from 'lucide-react';
import api from '@/core/Api/index.js';
import { useToast } from '@/components/ui/ToastContext.js';
import { getServiceName, getPrice } from '@/components/admin/PackageCard.js';
import CyberTable from '@/components/admin/CyberTable.js';
import PageHeader from '@/components/admin/PageHeader.js';
import DynamicModal from '@/components/admin/DynamicModal.js';
import Loading from '@/components/admin/Loading.js';

const unflatten = (data) => {
    let result = {};
    for (let key in data) {
        if (!Object.prototype.hasOwnProperty.call(data, key)) continue;
        let keys = key.split('.');
        keys.reduce((acc, k, i) => {
            if (i === keys.length - 1) acc[k] = data[key];
            else acc[k] = acc[k] || {};
            return acc[k];
        }, result);
    }
    return result;
};

export default function PackagesClientWrapper({
    initialPackages = null,
    initialCategories = null,
    initialVendors = null
}) {
    const toast = useToast();

    // Data States
    const [packages, setPackages] = useState(initialPackages || []);
    const [categories, setCategories] = useState(initialCategories || []);
    const [vendors, setVendors] = useState(initialVendors || []);
    const [loading, setLoading] = useState(!initialPackages);
    const [refreshKey, setRefreshKey] = useState(0);

    // Action States
    const [togglingId, setTogglingId] = useState(null);

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    // Add Item Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItemData, setNewItemData] = useState({ vendorId: '', category: '' });
    const [addLoading, setAddLoading] = useState(false);

    // Fetch platform inventory, categories, and vendors via API client
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [pkgRes, catRes, venRes] = await Promise.all([
                api.admin.packages.getAll(),
                api.admin.categories.getAll(),
                api.admin.vendors.getAll()
            ]);

            const pkgList = pkgRes?.data?.packages || pkgRes?.data || [];
            const catList = catRes?.data?.categories || catRes?.data || [];
            const venList = venRes?.data?.vendors || venRes?.data || [];

            setPackages(Array.isArray(pkgList) ? pkgList : []);
            setCategories(Array.isArray(catList) ? catList : []);
            setVendors(Array.isArray(venList) ? venList : []);
        } catch (err) {
            toast(err?.message || 'Failed to fetch platform package inventory', 'error');
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchData();
    }, [fetchData, refreshKey]);

    // Status Toggle Handler
    const toggleStatus = async (pkg, statusToSet) => {
        setTogglingId(pkg._id);
        try {
            const payload = {
                vendorId: pkg.vendorId || pkg.vendor?._id || '',
                serviceType: pkg.serviceType,
                status: statusToSet,
                isActive: statusToSet
            };

            const data = await api.admin.packages.updateStatus(pkg._id, payload);
            if (data.success) {
                setPackages(prev =>
                    prev.map(p =>
                        (p._id === pkg._id && p.serviceType === pkg.serviceType)
                            ? { ...p, isActive: statusToSet }
                            : p
                    )
                );
                toast(`Package "${getServiceName(pkg)}" status updated to ${statusToSet ? 'Active' : 'Offline'}`, 'success');
            } else {
                toast(data.message || 'Failed to update package status', 'error');
            }
        } catch (error) {
            toast(error.message || 'Failed to update status', 'error');
        } finally {
            setTogglingId(null);
        }
    };

    // Add Package Item On Behalf of Vendor
    const handleAddPackageItem = async (e) => {
        e.preventDefault();
        setAddLoading(true);
        try {
            const payload = unflatten(newItemData);
            if (payload.pricing?.basePrice) payload.pricing.basePrice = Number(payload.pricing.basePrice);
            if (payload.availability?.total) payload.availability.total = Number(payload.availability.total);

            const res = await api.admin.packages.addItemOnBehalf(payload);
            if (res.success) {
                toast('Package item deployed successfully', 'success');
                setIsModalOpen(false);
                setNewItemData({ vendorId: '', category: '' });
                setRefreshKey(k => k + 1);
            } else {
                toast(res.message || res.error || 'Failed to add item', 'error');
            }
        } catch (error) {
            toast(error.message || 'Something went wrong while deploying item', 'error');
        } finally {
            setAddLoading(false);
        }
    };

    // Modal Field Generation
    const packageFields = useMemo(() => {
        const base = [
            {
                name: 'vendorId',
                label: 'Assign Vendor',
                type: 'select',
                required: true,
                options: vendors.map(v => ({
                    label: `${v.businessName || v.ownerName || v.name || 'Vendor'} (${v.email || v._id})`,
                    value: v._id
                }))
            },
            {
                name: 'category',
                label: 'Service Category',
                type: 'select',
                required: true,
                options: categories.map(c => ({
                    label: c.name,
                    value: c.slug
                }))
            }
        ];

        let specific = [];
        if (newItemData.category) {
            specific = [
                { name: 'title', label: 'Item Title', type: 'text', required: true, placeholder: 'e.g. Deluxe Mountain View Room, Ganga River Rafting 16km' },
                { name: 'slug', label: 'Item Slug', type: 'text', required: false, placeholder: 'e.g. deluxe-mountain-room (optional)' },
                { name: 'pricing.basePrice', label: 'Base Price (₹)', type: 'number', required: true, placeholder: '1500' },
                { name: 'location.address', label: 'Address / Location', type: 'text', required: false, placeholder: 'Tapovan, Rishikesh, Uttarakhand' },
                { name: 'location.city', label: 'City', type: 'text', required: false, placeholder: 'Rishikesh' }
            ];

            const cat = newItemData.category.toLowerCase();
            if (['homestay', 'hotel'].includes(cat)) {
                specific.push({ name: 'roomType', label: 'Room Type', type: 'text', required: true, placeholder: 'e.g. Deluxe, Suite, Standard' });
                specific.push({ name: 'availability.total', label: 'Total Available Units/Rooms', type: 'number', required: true, placeholder: '5' });
            } else if (cat === 'trekking') {
                specific.push({
                    name: 'details.difficulty',
                    label: 'Trek Difficulty',
                    type: 'select',
                    options: [
                        { label: 'Easy', value: 'Easy' },
                        { label: 'Moderate', value: 'Moderate' },
                        { label: 'Challenging', value: 'Challenging' },
                        { label: 'Difficult', value: 'Difficult' }
                    ]
                });
                specific.push({ name: 'details.durationDays', label: 'Duration (Days)', type: 'number', placeholder: '3' });
            } else if (cat.includes('vehicle') || cat.includes('rental') || cat.includes('taxi')) {
                specific.push({ name: 'vehicleType', label: 'Vehicle Model / Type', type: 'text', placeholder: 'e.g. Toyota Innova Crysta, Maruti Swift' });
                specific.push({ name: 'seatingCapacity', label: 'Seating Capacity', type: 'number', placeholder: '6' });
            } else if (cat.includes('rafting')) {
                specific.push({ name: 'details.distanceKm', label: 'Rafting Stretch (km)', type: 'text', placeholder: 'e.g. 16 km Marine Drive to Shivpuri' });
            }
        }

        return [...base, ...specific];
    }, [vendors, categories, newItemData.category]);

    // KPI Metrics
    const metrics = useMemo(() => {
        const total = packages.length;
        const active = packages.filter(p => p.isActive).length;
        const offline = total - active;
        const uniqueCategories = new Set(packages.map(p => p.serviceType).filter(Boolean)).size;
        const uniqueVendors = new Set(packages.map(p => p.vendorId || p.vendor?._id).filter(Boolean)).size;

        return { total, active, offline, uniqueCategories, uniqueVendors };
    }, [packages]);

    // Category Counts for Pills
    const categoryCounts = useMemo(() => {
        const counts = {};
        packages.forEach(p => {
            const key = p.serviceType || 'uncategorized';
            counts[key] = (counts[key] || 0) + 1;
        });
        return counts;
    }, [packages]);

    // Filtered Packages List
    const filteredPackages = useMemo(() => {
        return packages.filter(pkg => {
            const name = getServiceName(pkg).toLowerCase();
            const vendorBusiness = (pkg.vendor?.businessName || '').toLowerCase();
            const vendorOwner = (pkg.vendor?.ownerName || pkg.vendor?.name || '').toLowerCase();
            const serviceType = (pkg.serviceType || '').toLowerCase();
            const locationStr = (typeof pkg.location === 'object' ? pkg.location?.address || pkg.location?.city : pkg.location || '').toLowerCase();
            const query = searchTerm.toLowerCase();

            const matchesSearch = !query ||
                name.includes(query) ||
                vendorBusiness.includes(query) ||
                vendorOwner.includes(query) ||
                serviceType.includes(query) ||
                locationStr.includes(query);

            const matchesCategory = filterCategory === 'all' || pkg.serviceType === filterCategory;

            const matchesStatus = filterStatus === 'all' ||
                (filterStatus === 'active' && pkg.isActive) ||
                (filterStatus === 'offline' && !pkg.isActive);

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [packages, searchTerm, filterCategory, filterStatus]);

    // CyberTable Columns Definition
    const columns = useMemo(() => [
        {
            header: 'Media',
            accessor: 'image',
            getValue: (pkg) => pkg.photos?.[0]?.url || 'No Image',
            render: (pkg) => {
                const photoUrl = pkg.photos?.[0]?.url || (typeof pkg.photos?.[0] === 'string' ? pkg.photos[0] : null);
                return (
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#111116] border border-white/10 flex items-center justify-center shrink-0 shadow-inner group">
                        {photoUrl ? (
                            <img
                                src={photoUrl}
                                alt={getServiceName(pkg)}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-slate-600">
                                <PackageIcon size={18} strokeWidth={1.5} />
                                <span className="text-[7px] font-mono uppercase tracking-widest mt-0.5">No Img</span>
                            </div>
                        )}
                    </div>
                );
            }
        },
        {
            header: 'Package Item',
            accessor: 'name',
            getValue: (pkg) => getServiceName(pkg),
            render: (pkg) => {
                const name = getServiceName(pkg);
                return (
                    <div className="flex flex-col max-w-xs">
                        <Link
                            href={`/admin/packages/item/${pkg._id}`}
                            className="font-bold text-white hover:text-indigo-400 transition-colors line-clamp-1"
                            title={name}
                        >
                            {name}
                        </Link>
                        <span className="text-[10px] font-mono text-slate-500 tracking-wider truncate">
                            ID: {pkg._id}
                        </span>
                    </div>
                );
            }
        },
        {
            header: 'Category',
            accessor: 'serviceType',
            getValue: (pkg) => pkg.serviceType || 'Unknown',
            render: (pkg) => {
                const rawType = pkg.serviceType || 'General';
                const formatted = rawType.replace(/([A-Z])/g, ' $1').replace(/[-_]/g, ' ');
                return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {formatted}
                    </span>
                );
            }
        },
        {
            header: 'Vendor Provider',
            accessor: 'vendor',
            getValue: (pkg) => pkg.vendor?.businessName || pkg.vendor?.name || 'Unknown Vendor',
            render: (pkg) => {
                const vendorId = pkg.vendorId || pkg.vendor?._id;
                const business = pkg.vendor?.businessName || 'Unnamed Business';
                const owner = pkg.vendor?.ownerName || pkg.vendor?.name;
                return (
                    <div className="flex flex-col">
                        {vendorId ? (
                            <Link
                                href={`/admin/vendors/${vendorId}`}
                                className="text-sm font-medium text-slate-200 hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                            >
                                <Building2 size={13} className="text-cyan-400 shrink-0" />
                                <span className="truncate max-w-[160px]">{business}</span>
                            </Link>
                        ) : (
                            <span className="text-sm text-slate-400">{business}</span>
                        )}
                        {owner && (
                            <span className="text-[10px] font-mono text-slate-500">
                                Owner: {owner}
                            </span>
                        )}
                    </div>
                );
            }
        },
        {
            header: 'Location',
            accessor: 'location',
            getValue: (pkg) => typeof pkg.location === 'object' ? (pkg.location?.city || pkg.location?.address || 'N/A') : (pkg.location || 'N/A'),
            render: (pkg) => {
                const locStr = typeof pkg.location === 'object' ? (pkg.location?.city || pkg.location?.address || 'Not Specified') : (pkg.location || 'Not Specified');
                return (
                    <div className="flex items-center gap-1.5 text-xs text-slate-300 max-w-[150px]" title={locStr}>
                        <MapPin size={12} className="text-slate-500 shrink-0" />
                        <span className="truncate">{locStr}</span>
                    </div>
                );
            }
        },
        {
            header: 'Base Price',
            accessor: 'price',
            getValue: (pkg) => Number(getPrice(pkg)),
            render: (pkg) => {
                const price = Number(getPrice(pkg));
                return (
                    <span className="font-mono text-xs font-semibold text-emerald-400">
                        {price > 0 ? `₹${price.toLocaleString()}` : <span className="text-slate-500">₹0</span>}
                    </span>
                );
            }
        },
        {
            header: 'Status',
            accessor: 'isActive',
            getValue: (pkg) => pkg.isActive ? 'Active' : 'Offline',
            render: (pkg) => (
                <div className="flex items-center gap-2">
                    <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-semibold border ${
                            pkg.isActive
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}
                    >
                        <span
                            className={`w-1.5 h-1.5 rounded-full ${
                                pkg.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                            }`}
                        />
                        {pkg.isActive ? 'Online' : 'Offline'}
                    </span>
                </div>
            )
        },
        {
            header: 'Actions',
            accessor: 'actions',
            getValue: () => '',
            render: (pkg) => {
                const isToggling = togglingId === pkg._id;
                return (
                    <div className="flex items-center gap-2">
                        {/* Toggle Power */}
                        <button
                            onClick={() => toggleStatus(pkg, !pkg.isActive)}
                            disabled={isToggling}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                                pkg.isActive
                                    ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20'
                                    : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                            } disabled:opacity-50 cursor-pointer`}
                            title={pkg.isActive ? 'Deactivate Package' : 'Activate Package'}
                        >
                            {isToggling ? (
                                <RefreshCw size={13} className="animate-spin" />
                            ) : (
                                <Power size={13} strokeWidth={2.5} />
                            )}
                        </button>

                        {/* Inspect Node Details */}
                        <Link
                            href={`/admin/packages/item/${pkg._id}`}
                            className="w-8 h-8 flex items-center justify-center bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-lg transition-all"
                            title="Inspect & Configure Node"
                        >
                            <ExternalLink size={13} strokeWidth={2.5} />
                        </Link>
                    </div>
                );
            }
        }
    ], [togglingId]);

    if (loading && packages.length === 0) {
        return (
            <div className="min-h-[500px] flex items-center justify-center">
                <Loading message="Syncing Platform Packages Inventory..." />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <PageHeader
                title="Packages Inventory"
                titleBadge={`${metrics.total} Items Total`}
                subtitle="Centralized catalog inspection, overrides, and live node status"
                icon={PackageIcon}
                searchQuery={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Search packages, vendors, locations..."
                showAction={true}
                actionLabel="Deploy New Item"
                actionIcon={Plus}
                onAction={() => setIsModalOpen(true)}
            />

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                <div className="bg-[#111116] border border-white/5 rounded-xl p-4 shadow-lg flex items-center justify-between">
                    <div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">Total Packages</div>
                        <div className="text-xl font-bold font-mono text-white">{metrics.total}</div>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                        <PackageIcon size={18} />
                    </div>
                </div>

                <div className="bg-[#111116] border border-white/5 rounded-xl p-4 shadow-lg flex items-center justify-between">
                    <div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">Active / Online</div>
                        <div className="text-xl font-bold font-mono text-emerald-400">{metrics.active}</div>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <CheckCircle2 size={18} />
                    </div>
                </div>

                <div className="bg-[#111116] border border-white/5 rounded-xl p-4 shadow-lg flex items-center justify-between">
                    <div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">Offline / Inactive</div>
                        <div className="text-xl font-bold font-mono text-rose-400">{metrics.offline}</div>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                        <XCircle size={18} />
                    </div>
                </div>

                <div className="bg-[#111116] border border-white/5 rounded-xl p-4 shadow-lg flex items-center justify-between">
                    <div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">Categories</div>
                        <div className="text-xl font-bold font-mono text-cyan-400">{metrics.uniqueCategories}</div>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                        <Layers size={18} />
                    </div>
                </div>

                <div className="col-span-2 md:col-span-1 bg-[#111116] border border-white/5 rounded-xl p-4 shadow-lg flex items-center justify-between">
                    <div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">Offering Vendors</div>
                        <div className="text-xl font-bold font-mono text-amber-400">{metrics.uniqueVendors}</div>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                        <Users size={18} />
                    </div>
                </div>
            </div>

            {/* Filter Toolbar: Category Pills & Status Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111116]/80 p-3 rounded-xl border border-white/5">
                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                    <button
                        onClick={() => setFilterCategory('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all cursor-pointer shrink-0 ${
                            filterCategory === 'all'
                                ? 'bg-indigo-600 text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        All Categories ({metrics.total})
                    </button>

                    {Object.entries(categoryCounts).map(([catKey, count]) => {
                        const isSelected = filterCategory === catKey;
                        const label = catKey.replace(/([A-Z])/g, ' $1').replace(/[-_]/g, ' ');
                        return (
                            <button
                                key={catKey}
                                onClick={() => setFilterCategory(catKey)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all cursor-pointer shrink-0 uppercase ${
                                    isSelected
                                        ? 'bg-indigo-600 text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                {label} ({count})
                            </button>
                        );
                    })}
                </div>

                {/* Status Toggle Buttons & Refresh */}
                <div className="flex items-center gap-2 shrink-0">
                    <div className="inline-flex bg-black/40 border border-white/10 rounded-lg p-0.5">
                        <button
                            onClick={() => setFilterStatus('all')}
                            className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                                filterStatus === 'all'
                                    ? 'bg-indigo-500/20 text-indigo-300 font-bold'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilterStatus('active')}
                            className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                                filterStatus === 'active'
                                    ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            Online
                        </button>
                        <button
                            onClick={() => setFilterStatus('offline')}
                            className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                                filterStatus === 'offline'
                                    ? 'bg-rose-500/20 text-rose-300 font-bold'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            Offline
                        </button>
                    </div>

                    <button
                        onClick={() => setRefreshKey(k => k + 1)}
                        className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg border border-white/5 transition-colors cursor-pointer"
                        title="Reload inventory"
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin text-indigo-400' : ''} />
                    </button>
                </div>
            </div>

            {/* Table */}
            <main className="relative z-10">
                <CyberTable
                    data={filteredPackages}
                    columns={columns}
                    emptyText="No Package items match your search criteria."
                    searchable={false}
                    itemsPerPage={15}
                    exportFilename="tripdhara_packages_inventory"
                />
            </main>

            {/* Dynamic Modal for Adding Package Item On Behalf */}
            <DynamicModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Deploy Package Item On Behalf of Vendor"
                fields={packageFields}
                formData={newItemData}
                onChange={setNewItemData}
                onSubmit={handleAddPackageItem}
                loading={addLoading}
                submitText="Deploy Item to Catalog"
                maxWidth="max-w-xl"
            />
        </div>
    );
}
