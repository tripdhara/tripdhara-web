'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
    Activity, Cpu, Database, Server, HardDrive, 
    Zap, RefreshCcw, ShieldCheck, Clock, Users,
    Wifi, CheckCircle2, AlertTriangle, XCircle, 
    Play, Pause, Copy, Check, Terminal, Layers, ArrowUpRight
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import api from '@/core/Api/index.js';
import { useToast } from '@/components/ui/ToastContext.js';

export default function SystemHealthClientWrapper({ initialHealth = null }) {
    const toast = useToast();
    const [health, setHealth] = useState(initialHealth || {});
    const [initialLoading, setInitialLoading] = useState(!initialHealth || Object.keys(initialHealth).length === 0);
    const [isStreaming, setIsStreaming] = useState(true);
    const [intervalSec, setIntervalSec] = useState(3);
    const [isFetching, setIsFetching] = useState(false);
    const [isPinging, setIsPinging] = useState(false);
    const [pingResult, setPingResult] = useState(null);
    const [copied, setCopied] = useState(false);

    // Telemetry trend history buffer (tracks last 25 ticks)
    const [history, setHistory] = useState(() => {
        if (!initialHealth?.memory && !initialHealth?.cpu) return [];
        const mem = initialHealth?.memory?.percentage ?? 0;
        const cpuVal = initialHealth?.cpu?.usagePercent ?? (Math.round((initialHealth?.cpu?.load?.[0] || 0) * 100));
        return [{
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            memory: mem,
            cpu: cpuVal
        }];
    });

    const formatBytes = (bytes) => {
        if (!bytes || bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatUptime = (seconds) => {
        if (!seconds || seconds <= 0) return '0s';
        const d = Math.floor(seconds / 86400);
        const h = Math.floor((seconds % 86400) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);

        const parts = [];
        if (d > 0) parts.push(`${d}d`);
        if (h > 0 || d > 0) parts.push(`${h}h`);
        if (m > 0 || h > 0 || d > 0) parts.push(`${m}m`);
        parts.push(`${s}s`);
        return parts.slice(0, 3).join(' ');
    };

    // Client-side telemetry fetch without page re-render flicker
    const loadTelemetry = useCallback(async () => {
        try {
            const res = await api.admin.stats.getSystemHealth();
            const payload = res?.data?.analytics || res?.analytics || res?.data || res;
            if (payload && payload.status) {
                setHealth(payload);
                setInitialLoading(false);
                const mem = payload.memory?.percentage ?? 0;
                const cpuVal = payload.cpu?.usagePercent ?? (Math.round((payload.cpu?.load?.[0] || 0) * 100));

                const newPoint = {
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                    memory: mem,
                    cpu: cpuVal
                };
                setHistory(prev => [...prev.slice(-24), newPoint]);
            }
        } catch (err) {
            console.error('[SystemHealth] Telemetry poll failed:', err);
        } finally {
            setInitialLoading(false);
        }
    }, []);

    const fetchTelemetry = useCallback(async (isManual = false) => {
        if (isManual) setIsFetching(true);
        try {
            await loadTelemetry();
        } finally {
            if (isManual) setIsFetching(false);
        }
    }, [loadTelemetry]);

    // Initial fetch on mount
    useEffect(() => {
        let isMounted = true;
        Promise.resolve().then(() => {
            if (isMounted) loadTelemetry();
        });
        return () => {
            isMounted = false;
        };
    }, [loadTelemetry]);

    // Live background polling
    useEffect(() => {
        if (!isStreaming) return;
        const timer = setInterval(() => {
            loadTelemetry();
        }, intervalSec * 1000);
        return () => clearInterval(timer);
    }, [isStreaming, intervalSec, loadTelemetry]);

    // On-demand Ping diagnostic
    const handlePingTest = async () => {
        setIsPinging(true);
        const t0 = performance.now();
        try {
            const res = await api.admin.stats.getSystemHealth();
            const t1 = performance.now();
            const roundtripMs = Math.max(1, Math.round(t1 - t0));
            const payload = res?.data?.analytics || res?.analytics || res?.data || res;
            const dbPing = payload?.database?.pingMs ?? 0;
            
            setPingResult({
                roundtripMs,
                dbPingMs: dbPing,
                timestamp: new Date().toLocaleTimeString()
            });
            if (toast?.showSuccess) {
                toast.showSuccess(`Ping Test Passed: API ${roundtripMs}ms | MongoDB ${dbPing}ms`);
            }
        } catch (err) {
            if (toast?.showError) {
                toast.showError('Ping Diagnostic Test Failed');
            }
        } finally {
            setIsPinging(false);
        }
    };

    const handleCopySnapshot = () => {
        navigator.clipboard.writeText(JSON.stringify(health, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        if (toast?.showSuccess) {
            toast.showSuccess('Telemetry JSON copied to clipboard');
        }
    };

    const statusConfig = useMemo(() => {
        const s = health.status || 'healthy';
        if (s === 'critical') {
            return {
                label: 'CRITICAL OUTAGE',
                color: 'text-rose-400',
                bg: 'bg-rose-500/10 border-rose-500/20',
                dot: 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)]'
            };
        }
        if (s === 'degraded') {
            return {
                label: 'DEGRADED PERFORMANCE',
                color: 'text-amber-400',
                bg: 'bg-amber-500/10 border-amber-500/20',
                dot: 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]'
            };
        }
        return {
            label: 'SYSTEM HEALTHY',
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10 border-emerald-500/20',
            dot: 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]'
        };
    }, [health.status]);

    const cpuUsage = health.cpu?.usagePercent ?? 0;
    const memUsage = health.memory?.percentage ?? 0;
    const dbPing = health.database?.pingMs ?? 0;

    if (initialLoading && Object.keys(health).length === 0) {
        return (
            <div className="p-8 max-w-[1600px] mx-auto min-h-[600px] flex flex-col items-center justify-center space-y-4">
                <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_40px_rgba(99,102,241,0.25)]">
                    <Activity className="w-8 h-8 text-indigo-400 animate-pulse" />
                </div>
                <div className="text-center space-y-1">
                    <h3 className="text-base font-bold text-white font-mono">Synchronizing System Telemetry...</h3>
                    <p className="text-xs text-slate-400 font-mono">Connecting to Node Runtime &amp; Subsystem Diagnostics</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8 relative z-10 font-sans"
        >
            {/* Top Operations Header */}
            <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 pb-6 border-b border-white/5">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                            <Activity className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                                    System Health Matrix
                                </h1>
                                <span className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-mono font-bold tracking-wider ${statusConfig.bg} ${statusConfig.color}`}>
                                    <span className={`w-2 h-2 rounded-full ${statusConfig.dot} animate-pulse`}></span>
                                    {statusConfig.label}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1 font-mono">
                                Live Infrastructure Telemetry &bull; Node Host: <span className="text-slate-200">{health.system?.osName || 'Node Host'} ({health.system?.arch || 'x64'})</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Live Controls Toolbar */}
                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Live Stream Mode Toggle */}
                    <button
                        onClick={() => setIsStreaming(!isStreaming)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-mono transition-all ${
                            isStreaming 
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20' 
                                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                        title={isStreaming ? 'Pause live polling' : 'Resume live polling'}
                    >
                        {isStreaming ? (
                            <>
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                                <Pause size={13} />
                                <span>Streaming ({intervalSec}s)</span>
                            </>
                        ) : (
                            <>
                                <Play size={13} />
                                <span>Stream Paused</span>
                            </>
                        )}
                    </button>

                    {/* Interval Switcher */}
                    <div className="flex items-center bg-black/60 border border-white/10 rounded-xl p-0.5 text-xs font-mono">
                        {[2, 3, 5, 10].map((sec) => (
                            <button
                                key={sec}
                                onClick={() => setIntervalSec(sec)}
                                className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                                    intervalSec === sec
                                        ? 'bg-indigo-600 text-white font-bold'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                {sec}s
                            </button>
                        ))}
                    </div>

                    {/* Latency Ping Button */}
                    <button
                        onClick={handlePingTest}
                        disabled={isPinging}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-sky-300 rounded-xl text-xs font-mono transition-all disabled:opacity-50"
                        title="Execute latency ping test across API and Database"
                    >
                        <Wifi size={13} className={isPinging ? 'animate-pulse' : ''} />
                        <span>{isPinging ? 'Pinging...' : 'Test Latency'}</span>
                    </button>

                    {/* Manual Sync Button */}
                    <button 
                        onClick={() => fetchTelemetry(true)} 
                        disabled={isFetching}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 hover:text-white rounded-xl text-xs font-mono font-bold transition-all disabled:opacity-50 group"
                    >
                        <RefreshCcw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                        <span>Synchronize</span>
                    </button>
                </div>
            </header>

            {/* Quick Diagnostic Strip if ping tested */}
            {pingResult && (
                <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-2xl flex flex-wrap items-center justify-between text-xs font-mono text-sky-200">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 size={16} className="text-sky-400 shrink-0" />
                        <span>
                            Network Diagnostic Result ({pingResult.timestamp}): API HTTP Roundtrip: <strong className="text-white">{pingResult.roundtripMs}ms</strong> &bull; Database Ping: <strong className="text-white">{pingResult.dbPingMs}ms</strong>
                        </span>
                    </div>
                    <button 
                        onClick={() => setPingResult(null)} 
                        className="text-slate-400 hover:text-white text-[10px]"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* Primary Vitals Grid (4 KPI Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* 1. CPU Load */}
                <HealthCard 
                    title="CPU Compute Load" 
                    value={`${cpuUsage}%`}
                    subValue={`${health.cpu?.cores || 0} Core(s) &bull; ${health.cpu?.speed || 0} MHz`}
                    footerText={`Load Avg: [${health.cpu?.load?.join(', ') || '0, 0, 0'}]`}
                    Icon={Cpu}
                    color="text-emerald-400"
                    bg="bg-emerald-500/10"
                    progress={cpuUsage}
                    progressColor={cpuUsage > 85 ? 'bg-rose-500' : cpuUsage > 60 ? 'bg-amber-500' : 'bg-emerald-500'}
                />

                {/* 2. System Memory */}
                <HealthCard 
                    title="System Memory (RAM)" 
                    value={`${memUsage}%`}
                    subValue={`${formatBytes(health.memory?.used)} / ${formatBytes(health.memory?.total)}`}
                    footerText={`V8 Heap: ${formatBytes(health.memory?.process?.heapUsed)} (${health.memory?.process?.heapPercentage || 0}%)`}
                    Icon={Server}
                    color="text-indigo-400"
                    bg="bg-indigo-500/10"
                    progress={memUsage}
                    progressColor={memUsage > 85 ? 'bg-rose-500' : memUsage > 70 ? 'bg-amber-500' : 'bg-indigo-500'}
                />

                {/* 3. Database Core */}
                <HealthCard 
                    title="Database Core (MongoDB)" 
                    value={`${dbPing} ms`}
                    subValue={`Status: ${health.database?.status?.toUpperCase() || 'CONNECTED'}`}
                    footerText={`${health.database?.collections || 0} Collections &bull; ${(health.database?.objects || 0).toLocaleString()} Docs`}
                    Icon={Database}
                    color={health.database?.status === 'connected' ? 'text-cyan-400' : 'text-rose-400'}
                    bg="bg-cyan-500/10"
                    statusBadge={health.database?.status === 'connected' ? 'ONLINE' : 'OFFLINE'}
                    statusColor={health.database?.status === 'connected' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border-rose-500/20'}
                />

                {/* 4. Engine Runtime Uptime */}
                <HealthCard 
                    title="Node Process Runtime" 
                    value={formatUptime(health.uptime)}
                    subValue={`Node.js ${health.system?.nodeVersion || 'v20+'} (PID ${health.system?.pid || '—'})`}
                    footerText={`Host Uptime: ${formatUptime(health.system?.systemUptime)}`}
                    Icon={Clock}
                    color="text-amber-400"
                    bg="bg-amber-500/10"
                />
            </div>

            {/* Performance Telemetry Stream Chart & Infrastructure Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Real-time Performance Telemetry Chart */}
                <div className="lg:col-span-2 bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
                    
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-sm font-mono tracking-[0.2em] text-indigo-400 uppercase flex items-center gap-2">
                                <Zap className="w-4 h-4 text-indigo-400" /> Performance Telemetry (Live Stream)
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Dual-axis telemetry tracking Memory Utilization vs CPU Load
                            </p>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-mono">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
                                <span className="text-slate-300">Memory: <strong className="text-indigo-300">{memUsage}%</strong></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                                <span className="text-slate-300">CPU: <strong className="text-emerald-300">{cpuUsage}%</strong></span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={history}>
                                <defs>
                                    <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                                    </linearGradient>
                                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff0a" />
                                <XAxis 
                                    dataKey="time" 
                                    tick={{ fontSize: 9, fill: '#64748b' }} 
                                    axisLine={false} 
                                    tickLine={false}
                                    interval="preserveStartEnd"
                                />
                                <YAxis 
                                    domain={[0, 100]}
                                    tick={{ fontSize: 10, fill: '#64748b' }} 
                                    axisLine={false} 
                                    tickLine={false}
                                    unit="%"
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#0a0a0f', 
                                        border: '1px solid rgba(255,255,255,0.1)', 
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        fontFamily: 'monospace'
                                    }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="memory" 
                                    stroke="#6366f1" 
                                    strokeWidth={2} 
                                    fillOpacity={1} 
                                    fill="url(#colorMem)" 
                                    name="Memory (%)" 
                                    isAnimationActive={false} 
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="cpu" 
                                    stroke="#10b981" 
                                    strokeWidth={2} 
                                    fillOpacity={1} 
                                    fill="url(#colorCpu)" 
                                    name="CPU Load (%)" 
                                    isAnimationActive={false} 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between text-[11px] font-mono text-slate-500">
                        <span>Buffer: {history.length} / 25 samples</span>
                        <span>Stream Heartbeat: {health.timestamp ? new Date(health.timestamp).toLocaleTimeString() : 'Live'}</span>
                    </div>
                </div>

                {/* Subsystem & Infrastructure Services Matrix */}
                <div className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl relative flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-sm font-mono tracking-[0.2em] text-emerald-400 uppercase flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" /> Core Subsystems Matrix
                            </h2>
                            <span className="text-[10px] font-mono text-slate-400">4 Monitored Nodes</span>
                        </div>

                        <div className="space-y-3.5">
                            {(health.services || [
                                { name: 'MongoDB Primary Cluster', type: 'Database Engine', status: 'healthy', latency: `${dbPing}ms`, details: `${health.database?.collections || 0} Collections` },
                                { name: 'Node.js V8 Environment', type: 'Application Core', status: 'healthy', latency: '<1ms', details: `${process.version || 'v20'} (${health.system?.arch || 'x64'})` },
                                { name: 'Cache Subsystem', type: 'Acceleration Layer', status: 'healthy', latency: '<1ms', details: 'Active Cache Layer' },
                                { name: 'Host Compute Node', type: 'Operating System', status: 'healthy', latency: '0ms', details: `${health.system?.osName || 'Host'} ${health.system?.release || ''}` }
                            ]).map((srv, idx) => (
                                <div key={srv.id || idx} className="p-3.5 bg-black/40 border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${
                                                srv.status === 'healthy' 
                                                    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]' 
                                                    : srv.status === 'degraded'
                                                    ? 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                                                    : 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                                            }`} />
                                            <span className="text-xs font-bold text-slate-200">{srv.name}</span>
                                        </div>
                                        <span className="text-[10px] font-mono font-bold text-slate-400">{srv.latency}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-1 pl-4">
                                        <span>{srv.details}</span>
                                        <span className="uppercase text-slate-500">{srv.type}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 mt-6">
                        <button
                            onClick={handleCopySnapshot}
                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer"
                        >
                            {copied ? (
                                <>
                                    <Check size={13} className="text-emerald-400" />
                                    <span>Telemetry Copied to Clipboard</span>
                                </>
                            ) : (
                                <>
                                    <Copy size={13} />
                                    <span>Copy Full Telemetry Snapshot</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

            </div>

            {/* Bottom Section: Database Storage Breakdown & Host Hardware Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Database Storage Core Breakdown */}
                <div className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl relative">
                    <h2 className="text-sm font-mono tracking-[0.2em] text-cyan-400 uppercase mb-6 flex items-center gap-2">
                        <Database className="w-4 h-4" /> Data Core Storage & Schema Metrics
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <MetricBlock 
                            label="Active Collections" 
                            value={health.database?.collections ?? 0}
                            detail="Total Schemas in DB" 
                        />
                        <MetricBlock 
                            label="Total Documents" 
                            value={(health.database?.objects ?? 0).toLocaleString()} 
                            detail="Mongo Collection Records" 
                        />
                        <MetricBlock 
                            label="Physical Data Size" 
                            value={formatBytes(health.database?.dataSize)} 
                            detail="Raw Document Payload" 
                        />
                        <MetricBlock 
                            label="Storage Allocation" 
                            value={formatBytes(health.database?.storageSize)} 
                            detail="Allocated Disk Storage" 
                        />
                        <MetricBlock 
                            label="Index Storage Size" 
                            value={formatBytes(health.database?.indexSize)} 
                            detail={`${health.database?.indexes || 0} Total B-Tree Indexes`} 
                        />
                        <MetricBlock 
                            label="Primary Database Core" 
                            value={health.database?.name || 'tripdhara'} 
                            detail={`Host: ${health.database?.host || 'localhost'}`} 
                        />
                    </div>
                </div>

                {/* Host Compute & Node Hardware Telemetry */}
                <div className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl relative">
                    <h2 className="text-sm font-mono tracking-[0.2em] text-indigo-400 uppercase mb-6 flex items-center gap-2">
                        <HardDrive className="w-4 h-4" /> Host Node Architecture & Runtime
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <MetricBlock 
                            label="Processor Architecture" 
                            value={health.cpu?.model || 'Standard CPU'} 
                            detail={`${health.cpu?.cores || 0} Physical / Logical Cores`} 
                        />
                        <MetricBlock 
                            label="Operating Environment" 
                            value={health.system?.osName || 'Node Host'} 
                            detail={`Kernel: ${health.system?.release || ''} (${health.system?.arch || ''})`} 
                        />
                        <MetricBlock 
                            label="Node.js Engine" 
                            value={health.system?.nodeVersion || process.version} 
                            detail={`Process PID: ${health.system?.pid || '—'}`} 
                        />
                        <MetricBlock 
                            label="Host System Hostname" 
                            value={health.system?.hostname || 'Node'} 
                            detail="Network Machine Name" 
                        />
                        <MetricBlock 
                            label="V8 Process RSS" 
                            value={formatBytes(health.memory?.process?.rss)} 
                            detail="Resident Memory Footprint" 
                        />
                        <MetricBlock 
                            label="Active Platform Accounts" 
                            value={(health.activeUsers ?? 0).toLocaleString()} 
                            detail="Registered Active Travellers" 
                        />
                    </div>
                </div>

            </div>
        </motion.div>
    );
}

function HealthCard({ title, value, subValue, footerText, Icon, color, bg, progress, progressColor, statusBadge, statusColor }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl relative group overflow-hidden flex flex-col justify-between"
        >
            <div className={`absolute -bottom-6 -right-6 w-24 h-24 ${bg} rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity`}></div>
            
            <div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className={`w-11 h-11 ${bg} rounded-2xl flex items-center justify-center border border-white/5 shadow-inner`}>
                        <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    {statusBadge ? (
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${statusColor}`}>
                            {statusBadge}
                        </span>
                    ) : progress !== undefined ? (
                        <span className={`text-xs font-mono font-bold ${progress > 80 ? 'text-rose-400' : 'text-slate-300'}`}>
                            {progress}%
                        </span>
                    ) : null}
                </div>

                <div className="relative z-10">
                    <h3 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight mb-1">{value}</h3>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2">{title}</p>
                    <p className="text-xs text-slate-300 font-medium">{subValue}</p>
                </div>
            </div>

            <div className="relative z-10 pt-4 border-t border-white/5 mt-4">
                {progress !== undefined && (
                    <div className="w-full h-1.5 bg-white/5 rounded-full mb-2 overflow-hidden">
                        <div 
                            className={`h-full ${progressColor || 'bg-indigo-500'} transition-all duration-700 rounded-full`} 
                            style={{ width: `${Math.min(100, Math.max(3, progress))}%` }}
                        ></div>
                    </div>
                )}
                <p className="text-[10px] font-mono text-slate-500 truncate">{footerText}</p>
            </div>
        </motion.div>
    );
}

function MetricBlock({ label, value, detail }) {
    return (
        <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block mb-1">{label}</span>
            <span className="text-base font-bold text-white font-mono block truncate select-all">{value || '—'}</span>
            <span className="text-[10px] text-slate-400 block mt-1">{detail}</span>
        </div>
    );
}