'use client';

import { useState, useEffect, useCallback, useMemo, Fragment } from 'react';
import {
    ChevronRight,
    Search,
    Activity,
    Database,
    ShieldAlert,
    Terminal,
    Filter,
    RefreshCw,
    Copy,
    Check,
    Globe,
    Layers,
    FileText,
    ExternalLink,
    Shield,
    MapPin,
    Cpu,
    Wifi
} from 'lucide-react';
import api from '@/core/Api/index.js';
import { useToast } from '@/components/ui/ToastContext.js';
import PageHeader from '@/components/admin/PageHeader.js';
import Loading from '@/components/admin/Loading.js';

// IP Intelligence Parser (Strict Real IP Preservation)
const getIpInfo = (ip, ipLocation, liveIntel) => {
    const rawIp = (ip || '').trim();
    const isLocalhost = rawIp === '127.0.0.1' || rawIp === '::1' || rawIp === 'localhost';
    const isPrivate = /^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/.test(rawIp);
    const isIpv6 = rawIp.includes(':');

    let type = 'IPv4';
    let badgeClass = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';

    if (isLocalhost) {
        type = 'Localhost';
        badgeClass = 'bg-slate-800 text-slate-400 border-slate-700';
    } else if (isPrivate) {
        type = 'Private Subnet';
        badgeClass = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    } else if (isIpv6) {
        type = 'IPv6';
        badgeClass = 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    }

    const intel = liveIntel || ipLocation || {};
    const city = intel.city || null;
    const region = intel.region || null;
    const country = intel.country || null;
    const countryCode = intel.countryCode || null;
    const asn = intel.asn || null;
    const isp = intel.isp || null;
    const timezone = intel.timezone || null;

    const locationParts = [city, region, country].filter(Boolean);
    const locationLabel = locationParts.length > 0 ? locationParts.join(', ') : null;

    return {
        rawIp,
        isLocalhost,
        isPrivate,
        type,
        badgeClass,
        city,
        region,
        country,
        countryCode,
        isp,
        asn,
        timezone,
        locationLabel,
        whoisUrl: `https://ipinfo.io/${rawIp}`,
        abuseUrl: `https://www.abuseipdb.com/check/${rawIp}`
    };
};

export default function AuditLogsClientWrapper({
    initialData = null,
    currentFilter = null,
    currentPage: initialPage = 1
}) {
    const toast = useToast();

    // Data States
    const [logs, setLogs] = useState(initialData?.logs || []);
    const [total, setTotal] = useState(initialData?.total || 0);
    const [totalPages, setTotalPages] = useState(initialData?.totalPages || 1);
    const [currentPage, setCurrentPage] = useState(initialPage || 1);
    const [loading, setLoading] = useState(!initialData);
    const [refreshKey, setRefreshKey] = useState(0);

    // Filter States
    const [selectedAction, setSelectedAction] = useState(currentFilter?.action || '');
    const [selectedTarget, setSelectedTarget] = useState(currentFilter?.target || '');
    const [searchQuery, setSearchQuery] = useState('');

    // Expanded Row & Copied State
    const [expandedLogId, setExpandedLogId] = useState(null);
    const [copiedId, setCopiedId] = useState(null);
    const [copiedIp, setCopiedIp] = useState(null);
    const [ipIntelMap, setIpIntelMap] = useState({});
    const [loadingIps, setLoadingIps] = useState({});

    const limit = 15;

    // Fetch on-demand IP Intelligence (Only queries public routable IPs)
    const fetchIpIntel = useCallback(async (ip, force = false) => {
        if (!ip) return;
        const cleanIp = ip.trim();
        // Skip external lookup for loopback and private RFC1918 subnets
        if (cleanIp === '127.0.0.1' || cleanIp === '::1' || cleanIp === 'localhost' || /^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/.test(cleanIp)) {
            return;
        }
        if (!force && (ipIntelMap[cleanIp] || loadingIps[cleanIp])) return;

        setLoadingIps(prev => ({ ...prev, [cleanIp]: true }));
        try {
            const res = await api.admin.auditLogs.lookupIp(cleanIp);
            if (res && res.data) {
                setIpIntelMap(prev => ({ ...prev, [cleanIp]: res.data }));
            }
        } catch {
            // Silently fallback without disrupting the audit interface
        } finally {
            setLoadingIps(prev => ({ ...prev, [cleanIp]: false }));
        }
    }, [ipIntelMap, loadingIps]);

    // Fetch Audit Logs
    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page: String(currentPage),
                limit: String(limit)
            };
            if (selectedAction) params.action = selectedAction;
            if (selectedTarget) params.target = selectedTarget;

            const res = await api.admin.auditLogs.getAll(params);
            const result = res.data || {};

            setLogs(Array.isArray(result.logs) ? result.logs : []);
            setTotal(result.total || 0);
            setTotalPages(result.totalPages || 1);
        } catch (err) {
            toast(err.message || 'Failed to load system audit telemetry', 'error');
        } finally {
            setLoading(false);
        }
    }, [currentPage, limit, selectedAction, selectedTarget, toast]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs, refreshKey]);

    // Automatically resolve real IP intelligence for all unique IPs in current view
    useEffect(() => {
        if (!logs.length) return;
        const ips = [...new Set(logs.map(l => l.ipAddress).filter(Boolean))];
        ips.forEach(ip => {
            if (!ipIntelMap[ip] && !loadingIps[ip]) {
                fetchIpIntel(ip);
            }
        });
    }, [logs, fetchIpIntel, ipIntelMap, loadingIps]);

    const handleActionChange = (action) => {
        setSelectedAction(action);
        setCurrentPage(1);
    };

    const handleTargetChange = (target) => {
        setSelectedTarget(target);
        setCurrentPage(1);
    };

    const handleCopyPayload = (id, payload) => {
        if (!payload) return;
        navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
        setCopiedId(id);
        toast('Payload copied to clipboard', 'success');
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleCopyIp = (e, ip) => {
        e.stopPropagation();
        navigator.clipboard.writeText(ip);
        setCopiedIp(ip);
        toast(`IP ${ip} copied to clipboard`, 'success');
        setTimeout(() => setCopiedIp(null), 2000);
    };

    const handleFilterByIp = (e, ip) => {
        e.stopPropagation();
        setSearchQuery(ip);
        toast(`Filtered events by IP: ${ip}`, 'info');
    };

    // Filtered Logs (Client Search)
    const filteredLogs = useMemo(() => {
        if (!searchQuery.trim()) return logs;
        const query = searchQuery.toLowerCase().trim();

        return logs.filter(log => {
            const actor = log.userId || {};
            const actorName = (actor.name || '').toLowerCase();
            const actorEmail = (actor.email || '').toLowerCase();
            const action = (log.action || '').toLowerCase();
            const target = (log.target || '').toLowerCase();
            const targetId = (log.targetId || '').toLowerCase();
            const ip = (log.ipAddress || '').toLowerCase();
            const location = ((log.ipLocation?.city || '') + ' ' + (log.ipLocation?.country || '')).toLowerCase();

            return (
                actorName.includes(query) ||
                actorEmail.includes(query) ||
                action.includes(query) ||
                target.includes(query) ||
                targetId.includes(query) ||
                ip.includes(query) ||
                location.includes(query)
            );
        });
    }, [logs, searchQuery]);

    // Operation Badges
    const getCyberBadge = (action) => {
        switch (action) {
            case 'CREATE':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]';
            case 'UPDATE':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_15px_-3px_rgba(245,158,11,0.2)]';
            case 'DELETE':
                return 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_15px_-3px_rgba(244,63,94,0.2)]';
            default:
                return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 shadow-[0_0_15px_-3px_rgba(99,102,241,0.2)]';
        }
    };

    // Syntax Highlighted JSON Renderer
    const SyntaxHighlight = ({ json }) => {
        if (!json) return null;
        const jsonString = JSON.stringify(json, null, 2);
        const escaped = jsonString
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        const highlighted = escaped.replace(
            /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
            function (match) {
                let cls = 'text-sky-300';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'text-indigo-300 font-semibold';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'text-emerald-400';
                } else if (/null/.test(match)) {
                    cls = 'text-amber-300';
                } else {
                    cls = 'text-purple-400';
                }
                return `<span class="${cls}">${match}</span>`;
            }
        );
        return (
            <pre
                className="font-mono text-xs leading-relaxed text-gray-300 select-text"
                dangerouslySetInnerHTML={{ __html: highlighted }}
            />
        );
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <PageHeader
                title="Security Telemetry & IP Intelligence"
                titleBadge={`${total} Events Recorded`}
                subtitle="Real-time administrative operations, network origin intelligence, and mutation audits"
                icon={ShieldAlert}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search actor, target, IP address (e.g. 127.0.0.1), ID..."
                showAction={false}
            />

            {/* KPI Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="bg-[#111116] border border-white/5 rounded-xl p-4 shadow-lg flex items-center justify-between">
                    <div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">Total Audit Events</div>
                        <div className="text-xl font-bold font-mono text-white">{total}</div>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                        <Database size={18} />
                    </div>
                </div>

                <div className="bg-[#111116] border border-white/5 rounded-xl p-4 shadow-lg flex items-center justify-between">
                    <div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">Insertions (CREATE)</div>
                        <div className="text-xl font-bold font-mono text-emerald-400">
                            {logs.filter(l => l.action === 'CREATE').length}
                        </div>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Layers size={18} />
                    </div>
                </div>

                <div className="bg-[#111116] border border-white/5 rounded-xl p-4 shadow-lg flex items-center justify-between">
                    <div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">Mutations (UPDATE)</div>
                        <div className="text-xl font-bold font-mono text-amber-400">
                            {logs.filter(l => l.action === 'UPDATE').length}
                        </div>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                        <Activity size={18} />
                    </div>
                </div>

                <div className="bg-[#111116] border border-white/5 rounded-xl p-4 shadow-lg flex items-center justify-between">
                    <div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">Deletions (DELETE)</div>
                        <div className="text-xl font-bold font-mono text-rose-400">
                            {logs.filter(l => l.action === 'DELETE').length}
                        </div>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                        <FileText size={18} />
                    </div>
                </div>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111116]/80 p-3 rounded-xl border border-white/5">
                {/* Action Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                    <button
                        onClick={() => handleActionChange('')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all cursor-pointer ${
                            selectedAction === ''
                                ? 'bg-indigo-600 text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        All Operations
                    </button>
                    <button
                        onClick={() => handleActionChange('CREATE')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all cursor-pointer ${
                            selectedAction === 'CREATE'
                                ? 'bg-emerald-600 text-white font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        CREATE
                    </button>
                    <button
                        onClick={() => handleActionChange('UPDATE')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all cursor-pointer ${
                            selectedAction === 'UPDATE'
                                ? 'bg-amber-600 text-white font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        UPDATE
                    </button>
                    <button
                        onClick={() => handleActionChange('DELETE')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all cursor-pointer ${
                            selectedAction === 'DELETE'
                                ? 'bg-rose-600 text-white font-bold shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        DELETE
                    </button>
                </div>

                {/* Target Dropdown & Refresh */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <select
                            value={selectedTarget}
                            onChange={(e) => handleTargetChange(e.target.value)}
                            className="bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-300 outline-none focus:border-indigo-500/50 appearance-none pr-8 cursor-pointer"
                        >
                            <option value="">All Target Entities</option>
                            <option value="VENDOR">Vendor</option>
                            <option value="USER">User / Traveller</option>
                            <option value="PACKAGE">Package</option>
                            <option value="BOOKING">Booking</option>
                            <option value="DISPUTE">Dispute</option>
                            <option value="SETTING">Setting</option>
                        </select>
                        <Filter size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    </div>

                    <button
                        onClick={() => setRefreshKey(k => k + 1)}
                        className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg border border-white/5 transition-colors cursor-pointer"
                        title="Reload audit telemetry"
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin text-indigo-400' : ''} />
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <main className="bg-[#111116] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/40 border-b border-white/5 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                                <th className="p-4 w-12 text-center"></th>
                                <th className="p-4">Operation</th>
                                <th className="p-4">Actor Identity</th>
                                <th className="p-4">Target Entity</th>
                                <th className="p-4">Network Origin & IP Intel</th>
                                <th className="p-4 text-right">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-xs font-mono">
                            {loading && logs.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-16 text-center">
                                        <Loading message="Scanning security telemetry and IP intelligence..." />
                                    </td>
                                </tr>
                            ) : filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-16 text-center">
                                        <div className="max-w-xs mx-auto flex flex-col items-center">
                                            <Database size={36} className="text-slate-600 mb-3" />
                                            <div className="font-bold text-slate-300">Null Output</div>
                                            <p className="text-[11px] text-slate-500 mt-1">
                                                No audit telemetry logs match the current query parameters.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map((log) => {
                                    const actor = log.userId || {};
                                    const isExpanded = expandedLogId === log._id;
                                    const liveIntel = ipIntelMap[log.ipAddress];
                                    const isIpLoading = Boolean(loadingIps[log.ipAddress]);
                                    const ipInfo = getIpInfo(log.ipAddress, log.ipLocation, liveIntel);

                                    return (
                                        <Fragment key={log._id}>
                                            <tr
                                                onClick={() => {
                                                    const isNowExpanded = !isExpanded;
                                                    setExpandedLogId(isNowExpanded ? log._id : null);
                                                    if (isNowExpanded && log.ipAddress && !ipIntelMap[log.ipAddress]) {
                                                        fetchIpIntel(log.ipAddress);
                                                    }
                                                }}
                                                className={`hover:bg-white/[0.02] transition-colors cursor-pointer group ${
                                                    isExpanded ? 'bg-indigo-500/[0.04]' : ''
                                                }`}
                                            >
                                                <td className="p-4 text-center">
                                                    <ChevronRight
                                                        size={14}
                                                        className={`text-slate-500 group-hover:text-indigo-400 transition-transform ${
                                                            isExpanded ? 'rotate-90 text-indigo-400' : ''
                                                        }`}
                                                    />
                                                </td>
                                                <td className="p-4">
                                                    <span className={`inline-flex px-2 py-0.5 rounded border text-[10px] font-bold ${getCyberBadge(log.action)}`}>
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-200">
                                                            {actor.name || actor.email || 'SYSTEM_DAEMON'}
                                                        </span>
                                                        <span className="text-[10px] text-indigo-400/80">
                                                            {actor.role || 'System'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <Activity size={13} className="text-slate-500 shrink-0" />
                                                        <div className="flex flex-col">
                                                             <span className="font-bold text-slate-300">
                                                                {log.target}
                                                            </span>
                                                            {log.targetId && (
                                                                <span className="text-[10px] text-slate-500">
                                                                    ID: {log.targetId.slice(-6)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Enriched Network Origin & IP Column */}
                                                <td className="p-4">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono text-xs text-sky-400 font-bold select-all">
                                                                {ipInfo.rawIp || '—'}
                                                            </span>
                                                            <button
                                                                onClick={(e) => handleCopyIp(e, ipInfo.rawIp)}
                                                                className="text-slate-500 hover:text-white p-0.5 rounded transition-colors"
                                                                title="Copy IP"
                                                            >
                                                                {copiedIp === ipInfo.rawIp ? (
                                                                    <Check size={11} className="text-emerald-400" />
                                                                ) : (
                                                                    <Copy size={11} />
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={(e) => handleFilterByIp(e, ipInfo.rawIp)}
                                                                className="text-slate-500 hover:text-indigo-400 p-0.5 rounded transition-colors"
                                                                title="Filter all logs by this IP"
                                                            >
                                                                <Filter size={11} />
                                                            </button>
                                                        </div>

                                                        <div className="flex items-center gap-1.5 text-[10px]">
                                                            <span className={`px-1.5 py-0.2 rounded border text-[9px] font-mono ${ipInfo.badgeClass}`}>
                                                                {ipInfo.type}
                                                            </span>
                                                            {ipInfo.locationLabel && (
                                                                <span className="text-slate-300 truncate max-w-[170px]" title={ipInfo.locationLabel}>
                                                                    {ipInfo.locationLabel}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {ipInfo.isp && (
                                                            <span className="text-[10px] text-amber-400 font-mono truncate max-w-[190px]" title={ipInfo.isp}>
                                                                {ipInfo.isp}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="p-4 text-right text-slate-400">
                                                    {log.createdAt
                                                        ? new Date(log.createdAt).toLocaleString(undefined, {
                                                              month: 'short',
                                                              day: 'numeric',
                                                              hour: '2-digit',
                                                              minute: '2-digit',
                                                              second: '2-digit'
                                                          })
                                                        : 'N/A'}
                                                </td>
                                            </tr>

                                            {/* Expandable Details Console */}
                                            {isExpanded && (
                                                <tr>
                                                    <td colSpan="6" className="p-0 border-b border-indigo-500/20 bg-[#0a0a0d]">
                                                        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 shadow-inner">
                                                            
                                                            {/* IP Intelligence & Network Analysis Card */}
                                                            <div className="space-y-4">
                                                                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                                                    <div className="flex items-center gap-2 text-sky-400">
                                                                        <Globe size={14} />
                                                                        <span className="text-[11px] font-bold uppercase tracking-wider">
                                                                            IP Intelligence & Origin
                                                                        </span>
                                                                    </div>
                                                                    {!ipInfo.isLocalhost && !ipInfo.isPrivate && (
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                fetchIpIntel(ipInfo.rawIp, true);
                                                                            }}
                                                                            disabled={isIpLoading}
                                                                            className="flex items-center gap-1 px-2 py-0.5 bg-white/5 hover:bg-white/10 text-indigo-400 hover:text-indigo-300 border border-white/10 rounded text-[9px] font-mono transition-colors"
                                                                            title="Re-query IP Intelligence API"
                                                                        >
                                                                            <RefreshCw size={9} className={isIpLoading ? 'animate-spin' : ''} />
                                                                            <span>{isIpLoading ? 'Querying...' : 'Live Lookup'}</span>
                                                                        </button>
                                                                    )}
                                                                </div>

                                                                <div className="bg-black/50 border border-white/5 rounded-xl p-3.5 space-y-3">
                                                                    <div>
                                                                        <span className="text-[9px] uppercase text-slate-500 block mb-0.5">Origin IP Address</span>
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-sm text-sky-300 font-mono font-bold select-all">
                                                                                {ipInfo.rawIp || '—'}
                                                                            </span>
                                                                            <span className={`text-[9px] px-1.5 py-0.5 rounded border ${ipInfo.badgeClass}`}>{ipInfo.type}</span>
                                                                        </div>
                                                                    </div>

                                                                    {ipInfo.locationLabel && (
                                                                        <div className="border-t border-white/5 pt-2">
                                                                            <span className="text-[9px] uppercase text-slate-500 block mb-0.5">Physical Geolocation</span>
                                                                            <div className="flex items-center gap-1.5 text-xs text-slate-200">
                                                                                <MapPin size={12} className="text-rose-400 shrink-0" />
                                                                                <span>{ipInfo.locationLabel}</span>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {ipInfo.isp && (
                                                                        <div className="border-t border-white/5 pt-2">
                                                                            <span className="text-[9px] uppercase text-slate-500 block mb-0.5">Internet Service Provider (ISP)</span>
                                                                            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-mono font-semibold">
                                                                                <Wifi size={12} className="text-amber-400 shrink-0" />
                                                                                <span>{ipInfo.isp}</span>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {ipInfo.asn && (
                                                                        <div className="border-t border-white/5 pt-2">
                                                                            <span className="text-[9px] uppercase text-slate-500 block mb-0.5">Routing Autonomous System (ASN)</span>
                                                                            <span className="text-xs text-slate-300 font-mono">{ipInfo.asn}</span>
                                                                        </div>
                                                                    )}

                                                                    {ipInfo.timezone && (
                                                                        <div className="border-t border-white/5 pt-2">
                                                                            <span className="text-[9px] uppercase text-slate-500 block mb-0.5">Network Timezone</span>
                                                                            <span className="text-xs text-slate-300 font-mono">{ipInfo.timezone}</span>
                                                                        </div>
                                                                    )}

                                                                    <div className="border-t border-white/5 pt-2">
                                                                        <span className="text-[9px] uppercase text-slate-500 block mb-0.5">Client User Agent</span>
                                                                        <span className="text-[10px] text-slate-400 font-mono break-all block leading-tight">{log.userAgent || '—'}</span>
                                                                    </div>

                                                                    {/* External Intelligence Lookups */}
                                                                    <div className="border-t border-white/5 pt-3 flex items-center gap-2">
                                                                        <a
                                                                            href={ipInfo.whoisUrl}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="flex items-center gap-1 px-2.5 py-1 bg-white/5 hover:bg-white/10 text-sky-400 hover:text-sky-300 border border-white/10 rounded text-[10px] font-mono transition-colors"
                                                                        >
                                                                            <span>IPInfo WHOIS</span>
                                                                            <ExternalLink size={10} />
                                                                        </a>
                                                                        <a
                                                                            href={ipInfo.abuseUrl}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="flex items-center gap-1 px-2.5 py-1 bg-white/5 hover:bg-white/10 text-rose-400 hover:text-rose-300 border border-white/10 rounded text-[10px] font-mono transition-colors"
                                                                        >
                                                                            <Shield size={10} />
                                                                            <span>Abuse Check</span>
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* System Trace Data */}
                                                            <div className="space-y-4">
                                                                <div className="flex items-center gap-2 text-indigo-400 border-b border-white/5 pb-2">
                                                                    <Terminal size={14} />
                                                                    <span className="text-[11px] font-bold uppercase tracking-wider">
                                                                        Execution Trace
                                                                    </span>
                                                                </div>

                                                                <div className="bg-black/50 border border-white/5 rounded-xl p-3.5 space-y-3">
                                                                    <div>
                                                                        <span className="text-[9px] uppercase text-slate-500 block mb-0.5">Audit Log ID</span>
                                                                        <span className="text-xs text-slate-300 font-mono select-all">{log._id}</span>
                                                                    </div>
                                                                    <div className="border-t border-white/5 pt-2">
                                                                        <span className="text-[9px] uppercase text-slate-500 block mb-0.5">Actor UID</span>
                                                                        <span className="text-xs text-slate-300 font-mono select-all">{actor._id || actor.id || 'N/A'}</span>
                                                                    </div>
                                                                    <div className="border-t border-white/5 pt-2">
                                                                        <span className="text-[9px] uppercase text-slate-500 block mb-0.5">Route Endpoint</span>
                                                                        <span className="text-xs text-emerald-400 font-mono">{log.details?.route || 'INTERNAL_DISPATCH'}</span>
                                                                    </div>
                                                                    <div className="border-t border-white/5 pt-2 flex items-center justify-between">
                                                                        <span className="text-[9px] uppercase text-slate-500">HTTP Status</span>
                                                                        <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded bg-black/60 border ${
                                                                            log.details?.status >= 400
                                                                                ? 'text-rose-400 border-rose-500/30'
                                                                                : 'text-emerald-400 border-emerald-500/30'
                                                                        }`}>
                                                                            HTTP_{log.details?.status || 200}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Decrypted Payload Terminal */}
                                                            <div className="space-y-2">
                                                                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                                                    <div className="flex items-center gap-2 text-emerald-400">
                                                                        <Search size={14} />
                                                                        <span className="text-[11px] font-bold uppercase tracking-wider">
                                                                            Payload Snapshot
                                                                        </span>
                                                                    </div>

                                                                    <button
                                                                        onClick={() => handleCopyPayload(log._id, log.details)}
                                                                        className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] text-slate-300 hover:text-white transition-colors cursor-pointer"
                                                                    >
                                                                        {copiedId === log._id ? (
                                                                            <>
                                                                                <Check size={11} className="text-emerald-400" />
                                                                                Copied
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <Copy size={11} />
                                                                                Copy JSON
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                </div>

                                                                <div className="bg-[#050508] border border-white/10 rounded-xl p-4 overflow-x-auto max-h-[280px] scrollbar-thin">
                                                                    <SyntaxHighlight json={log.details || { status: 'No active payload recorded' }} />
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {total > 0 && (
                    <div className="p-4 border-t border-white/5 bg-black/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-400">
                        <div>
                            Block <span className="text-indigo-400 font-bold">{currentPage}</span> of{' '}
                            <span className="text-slate-200">{totalPages}</span> | Total:{' '}
                            <span className="text-white font-bold">{total}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                disabled={currentPage <= 1 || loading}
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                            >
                                &lt; Previous
                            </button>
                            <button
                                disabled={currentPage >= totalPages || loading}
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                            >
                                Next &gt;
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
