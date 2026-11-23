import mongoose from 'mongoose';
import User from '@/core/Models/User.js';
import Vendor from '@/core/Models/Vendor.js';
import Booking from '@/core/Models/Booking.js';
import Package from '@/core/Models/Package.js';
import Category from '@/core/Models/Category.js';
import Dispute from '@/core/Models/Dispute.js';
import SearchLog from '@/core/Models/SearchLog.js';
import AuditLog from '@/core/Models/AuditLog.js';
import os from 'os';
import { getStartDateByPeriod } from '@/core/Helpers/dateUtils.js';
import { STATUS, USER_ROLES } from '@/core/Constants/index.js';
import { SCHEMA_KEYS } from '@/core/Constants/categories.js';
import CacheService from '@/core/Services/CacheService.js';
import AppError from '@/core/Helpers/AppError.js';
import { getBookingsBy, getVendorsBy, getDisputesBy, getAuditLogsBy, getSearchLogsBy } from '@/core/Helpers/queryHelpers.js';

/**
 * DashboardService (Admin Role)
 * Centralized logic for system stats, health, and trend analytics.
 */
class DashboardService {
    async getSystemHealth() {
        const freeMem = os.freemem();
        const totalMem = os.totalmem();
        const usedMem = totalMem - freeMem;
        const memoryPercentage = totalMem > 0 ? Math.round((usedMem / totalMem) * 100) : 0;

        // Accurate CPU calculation
        const cpus = os.cpus() || [];
        let cpuUsagePercent = 0;
        if (cpus.length > 0) {
            let totalIdle = 0;
            let totalTick = 0;
            for (const core of cpus) {
                for (const type in core.times) {
                    totalTick += core.times[type];
                }
                totalIdle += core.times.idle;
            }
            if (totalTick > 0) {
                cpuUsagePercent = Math.min(100, Math.max(0, Math.round(((totalTick - totalIdle) / totalTick) * 100)));
            }
        }

        let loadAvg = os.loadavg();
        // Windows fallback for CPU load since loadavg is always 0 on win32
        if ((!loadAvg || loadAvg[0] === 0) && os.platform() === 'win32') {
            const cpuFraction = Number((cpuUsagePercent / 100).toFixed(2));
            loadAvg = [cpuFraction, cpuFraction, cpuFraction];
        } else if (loadAvg) {
            loadAvg = [
                Number(loadAvg[0]?.toFixed(2) || 0),
                Number(loadAvg[1]?.toFixed(2) || 0),
                Number(loadAvg[2]?.toFixed(2) || 0)
            ];
        } else {
            loadAvg = [0, 0, 0];
        }

        // Database stats & real-time ping latency
        let dbStats = { collections: 0, dataSize: 0, storageSize: 0, objects: 0, indexes: 0, indexSize: 0 };
        let dbPingMs = 0;
        const readyState = mongoose.connection?.readyState ?? 1;
        const isDbConnected = readyState === 1;

        if (mongoose.connection?.db) {
            try {
                if (typeof mongoose.connection.db.admin === 'function') {
                    const pingStart = Date.now();
                    await mongoose.connection.db.admin().ping();
                    dbPingMs = Math.max(1, Date.now() - pingStart);
                }
                if (typeof mongoose.connection.db.stats === 'function') {
                    dbStats = await mongoose.connection.db.stats();
                }
            } catch (e) {
                // Graceful fallback if stats query fails
            }
        }

        // V8 / Node.js process memory telemetry
        const memUsage = typeof process.memoryUsage === 'function'
            ? process.memoryUsage()
            : { heapUsed: 0, heapTotal: 0, rss: 0, external: 0 };
        const v8HeapPercentage = memUsage.heapTotal > 0
            ? Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100)
            : 0;

        // OS identification
        const osPlatform = os.platform();
        let osDisplayName = 'Unix-like Node Environment';
        if (osPlatform === 'win32') osDisplayName = 'Microsoft Windows';
        else if (osPlatform === 'darwin') osDisplayName = 'macOS Darwin';
        else if (osPlatform === 'linux') osDisplayName = 'Linux Kernel';

        // Overall health status evaluation
        let overallStatus = 'healthy';
        if (!isDbConnected) {
            overallStatus = 'critical';
        } else if (memoryPercentage > 92 || cpuUsagePercent > 90) {
            overallStatus = 'degraded';
        }

        let activeUserCount = 0;
        try {
            activeUserCount = await User.countDocuments({ status: STATUS.ACTIVE });
        } catch (e) {
            // Graceful fallback
        }

        return {
            status: overallStatus,
            uptime: process.uptime(),
            timestamp: Date.now(),
            activeUsers: activeUserCount,
            memory: {
                total: totalMem,
                free: freeMem,
                used: usedMem,
                percentage: memoryPercentage,
                process: {
                    heapUsed: memUsage.heapUsed,
                    heapTotal: memUsage.heapTotal,
                    heapPercentage: v8HeapPercentage,
                    rss: memUsage.rss,
                    external: memUsage.external
                }
            },
            cpu: {
                load: loadAvg,
                usagePercent: cpuUsagePercent,
                cores: cpus.length,
                model: cpus[0]?.model || 'Standard Processor',
                speed: cpus[0]?.speed || 0
            },
            database: {
                status: isDbConnected ? 'connected' : 'disconnected',
                readyState,
                pingMs: dbPingMs,
                name: mongoose.connection?.name || 'tripdhara',
                host: mongoose.connection?.host || 'localhost',
                collections: dbStats.collections || 0,
                dataSize: dbStats.dataSize || 0,
                storageSize: dbStats.storageSize || 0,
                objects: dbStats.objects || 0,
                indexes: dbStats.indexes || 0,
                indexSize: dbStats.indexSize || 0
            },
            system: {
                platform: osPlatform,
                osName: osDisplayName,
                release: os.release(),
                arch: os.arch(),
                hostname: os.hostname(),
                systemUptime: os.uptime(),
                nodeVersion: process.version,
                pid: process.pid
            },
            services: [
                {
                    id: 'database',
                    name: 'MongoDB Primary Cluster',
                    type: 'Database Engine',
                    status: isDbConnected ? 'healthy' : 'critical',
                    latency: isDbConnected ? `${dbPingMs}ms` : 'Offline',
                    details: `${dbStats.collections || 0} Collections, ${(dbStats.objects || 0).toLocaleString()} Objects`
                },
                {
                    id: 'runtime',
                    name: 'Node.js V8 Runtime',
                    type: 'Application Core',
                    status: 'healthy',
                    latency: '<1ms',
                    details: `${process.version} (${process.arch}) - PID ${process.pid}`
                },
                {
                    id: 'cache',
                    name: 'Cache Subsystem',
                    type: 'Acceleration Layer',
                    status: 'healthy',
                    latency: (CacheService.isStandardConnected || CacheService.upstashClient) ? '1ms' : '<1ms',
                    details: CacheService.upstashClient ? 'Upstash Redis Connected' : CacheService.isStandardConnected ? 'Redis Connected' : 'In-Memory Cache Active'
                },
                {
                    id: 'host',
                    name: 'Host Compute Node',
                    type: 'Operating System',
                    status: (cpuUsagePercent > 90 || memoryPercentage > 92) ? 'degraded' : 'healthy',
                    latency: '0ms',
                    details: `${osDisplayName} ${os.release()} (${os.arch()})`
                }
            ]
        };
    }

    async getDashboardStats() {
        const cacheKey = 'admin:dashboard:stats';
        const cachedData = await CacheService.get(cacheKey);
        if (cachedData) return cachedData;

        const startTime = Date.now();
        const [users, totalVendors, pendingVendors, categories, bookings, confirmedBookings, packageStats, dbStats] = await Promise.all([
            User.countDocuments({ role: USER_ROLES.TRAVELLER }),
            Vendor.countDocuments(),
            Vendor.countDocuments({ isApproved: false }),
            Category.countDocuments(),
            Booking.countDocuments(),
            Booking.aggregate([
                { $match: { paymentStatus: { $in: ['paid', 'PAID', 'Paid'] } } },
                { $group: { _id: null, total: { $sum: { $convert: { input: "$pricing.total", to: "double", onError: 0, onNull: 0 } } } } }
            ]),
            Package.aggregate([
                {
                    $project: {
                        items: {
                            $concatArrays: Object.values(SCHEMA_KEYS).map(key => ({ $ifNull: [`$${key}`, []] }))
                        }
                    }
                },
                { $unwind: "$items" },
                { $match: { "items.isActive": true } },
                { $count: "count" }
            ]),
            mongoose.connection.db.stats()
        ]);

        const revenue = confirmedBookings[0]?.total || 0;
        const activeItemsCount = packageStats[0]?.count || 0;

        // Top Territories (Aggregation by vendor's city)
        const territories = await Vendor.aggregate([
            { $match: { isApproved: true } },
            { $group: { _id: "$address.city" } },
            {
                $lookup: {
                    from: 'bookings',
                    let: { city: "$_id" },
                    pipeline: [
                        {
                            $lookup: {
                                from: 'vendors',
                                localField: 'vendor',
                                foreignField: '_id',
                                as: 'v'
                            }
                        },
                        { $unwind: '$v' },
                        {
                            $match: {
                                $expr: { $eq: ["$v.address.city", "$$city"] },
                                paymentStatus: { $in: ['paid', 'PAID', 'Paid'] }
                            }
                        }
                    ],
                    as: 'cityBookings'
                }
            },
            {
                $project: {
                    _id: 1,
                    count: { $size: "$cityBookings" }
                }
            },
            { $sort: { count: -1 } }
        ]);

        const totalBookingsCount = await Booking.countDocuments();
        const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500', 'bg-pink-500'];
        const topTerritories = territories.map((t, i) => ({
            name: t._id || 'Remote',
            load: Math.min(Math.round((t.count / (totalBookingsCount || 1)) * 100), 100),
            color: colors[i % colors.length]
        }));

        // Upcoming Departures (Next 7 days)
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        const departuresRaw = await getBookingsBy({
            startDate: { $gte: today, $lte: nextWeek },
            status: 'confirmed'
        }, '', { path: 'user', select: 'name' }, { startDate: 1 }, { limit: 5 });

        const departures = departuresRaw.map(d => ({
            user: d.user?.name || 'Traveller',
            destination: d.item?.title || 'Mission',
            time: new Date(d.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
            status: 'Active'
        }));

        // Recent System Activity (Audit Logs)
        const recentLogs = await getAuditLogsBy({}, '', { path: 'userId', select: 'name' }, { createdAt: -1 }, { limit: 6 });





        const systemActivity = recentLogs.map(log => ({
            time: new Date(log.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            type: log.target.toLowerCase(),
            message: `${log.userId?.name || 'System'} performed ${log.action.toLowerCase()} on ${log.target.toLowerCase()}`,
            status: log.action === 'DELETE' ? 'error' : log.action === 'UPDATE' ? 'warning' : 'success'
        }));

        const latency = Date.now() - startTime;

        const result = {
            users,
            totalVendors,
            pendingVendors,
            packages: activeItemsCount,
            categories,
            revenue,
            recentBookings: await getBookingsBy({}, '', [{ path: 'user', select: 'name' }, { path: 'package', select: 'title' }], { createdAt: -1 }, { limit: 50 }),
            recentVendors: await getVendorsBy({}, '', { path: 'user', select: 'name email' }, { createdAt: -1 }, { limit: 5 }),
            activeDisputes: (await getDisputesBy({ status: 'open' }, '', [{ path: 'bookingId', select: 'bookingCode traveller' }, { path: 'traveller', select: 'name' }], null, { limit: 3 })).map(d => ({
                id: d.bookingId?.bookingCode || `DSP-${d._id.toString().slice(-4).toUpperCase()}`,
                priority: d.reason === 'safety_concern' ? 'Critical' : 'High',
                issue: d.reason?.replace(/_/g, ' ').toUpperCase() || 'Service Disruption',
                user: d.bookingId?.traveller?.name || d.traveller?.name || 'Anonymous'
            })),
            topTerritories,
            departures,
            systemActivity,
            systemHealth: {
                dbLoad: Math.round((process.memoryUsage().rss / (os.totalmem() / 10)) * 100),
                latency: latency,
                storageLoad: Math.min(Math.round((dbStats.dataSize / (dbStats.storageSize || 1)) * 100), 100)
            }
        };
        await CacheService.set(cacheKey, result, 60); // Cache for 60 seconds
        return result;
    }

    async getFinancialStats() {
        const stats = await Booking.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: { $cond: [{ $eq: ["$paymentStatus", "paid"] }, { $ifNull: ["$pricing.total", 0] }, 0] } },
                    pendingPayouts: { $sum: { $cond: [{ $eq: ["$payout.status", "pending"] }, { $ifNull: ["$pricing.total", 0] }, 0] } },
                    refundsProcessed: { $sum: { $cond: [{ $eq: ["$pricing.refundStatus", "refunded"] }, { $ifNull: ["$pricing.refundAmount", 0] }, 0] } }
                }
            }
        ]);
        return stats[0] || { totalRevenue: 0, pendingPayouts: 0, refundsProcessed: 0 };
    }

    async getAnalyticsData(period = 'monthly') {
        const startDate = getStartDateByPeriod(period);
        const [revenueDataRaw, bookingStatus, userGrowthRaw, topVendors] = await Promise.all([
            Booking.aggregate([
                { $match: { createdAt: { $gte: startDate }, paymentStatus: { $in: ['paid', 'PAID', 'Paid'] } } },
                { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$createdAt" } } }, revenue: { $sum: { $convert: { input: "$pricing.total", to: "double", onError: 0, onNull: 0 } } } } },
                { $project: { date: "$_id", revenue: 1, _id: 0 } },
                { $sort: { date: 1 } }
            ]),
            Booking.aggregate([
                { $group: { _id: "$status", value: { $sum: 1 } } }
            ]),
            User.aggregate([
                { $match: { createdAt: { $gte: startDate }, role: { $in: ['traveller', 'vendor'] } } },
                {
                    $group: {
                        _id: {
                            date: { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$createdAt" } } },
                            role: "$role"
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $group: {
                        _id: "$_id.date",
                        travellers: { $sum: { $cond: [{ $eq: ["$_id.role", "traveller"] }, "$count", 0] } },
                        vendors: { $sum: { $cond: [{ $eq: ["$_id.role", "vendor"] }, "$count", 0] } }
                    }
                },
                { $sort: { _id: 1 } }
            ]),
            Booking.aggregate([
                { $match: { paymentStatus: { $in: ['paid', 'PAID', 'Paid'] } } },
                { $group: { _id: "$vendor", totalRevenue: { $sum: { $convert: { input: "$pricing.total", to: "double", onError: 0, onNull: 0 } } }, bookings: { $sum: 1 } } },
                { $sort: { totalRevenue: -1 } },
                { $limit: 5 }
            ])
        ]);

        // Gap filling for Revenue Data
        const revenueMap = new Map(revenueDataRaw.map(d => [d.date, d.revenue]));
        const userGrowthMap = new Map(userGrowthRaw.map(u => [u._id, { travellers: u.travellers, vendors: u.vendors }]));

        const revenueData = [];
        const userGrowth = [];
        const dateIter = new Date(startDate);
        const today = new Date();

        while (dateIter <= today) {
            const dateStr = dateIter.toISOString().split('T')[0];

            revenueData.push({
                _id: dateStr,
                revenue: revenueMap.get(dateStr) || 0
            });

            const growth = userGrowthMap.get(dateStr) || { travellers: 0, vendors: 0 };
            userGrowth.push({
                _id: dateStr,
                ...growth
            });

            dateIter.setDate(dateIter.getDate() + 1);
        }

        // Resolve vendor names
        const vendorIds = topVendors.map(v => v._id);
        const vendors = await getVendorsBy({ _id: { $in: vendorIds } });
        const vendorMap = vendors.reduce((acc, v) => { acc[v._id.toString()] = v.businessName; return acc; }, {});

        const formattedTopVendors = topVendors.map(v => ({
            name: vendorMap[v._id?.toString()] || 'Unknown Vendor',
            bookings: v.bookings,
            revenue: v.totalRevenue
        }));

        return {
            revenueData,
            bookingStatus: bookingStatus.map(b => ({ name: b._id?.toUpperCase() || 'UNKNOWN', value: b.value })),
            userGrowth,
            topVendors: formattedTopVendors
        };
    }

    async getMapAnalyticsData() {
        const userDistribution = await User.aggregate([
            { $group: { _id: "$address.state", count: { $sum: 1 } } }
        ]);
        return { userDistribution };
    }

    async getCalendarEvents(start, end) {
        const bookings = await getBookingsBy({
            startDate: { $gte: start },
            endDate: { $lte: end }
        }, '', [{ path: 'user', select: 'name' }, { path: 'vendor', select: 'businessName' }]);

        return bookings.map(b => ({
            id: b._id,
            title: b.bookingDetails?.category || 'Booking',
            start: b.startDate,
            end: b.endDate,
            user: b.user?.name,
            type: 'booking'
        }));
    }

    async getSearchAnalytics() {
        const topSearches = await getSearchLogsBy({}, 'query count lastSearched resultsCount', null, { count: -1 }, { limit: 10 });





        const zeroResultSearches = await getSearchLogsBy({ resultsCount: 0 }, 'query count lastSearched', null, { count: -1 }, { limit: 5 });





        return { topSearches, zeroResultSearches };
    }
}

export default new DashboardService();
