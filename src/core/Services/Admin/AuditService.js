import AuditLog from '@/core/Models/AuditLog.js';
import { getRequestMetadata } from '@/core/Helpers/requestUtils.js';
import { redactSensitiveData } from '@/core/Helpers/security.js';
import { getAuditLogsBy, countAuditLogsBy } from '@/core/Helpers/queryHelpers.js';
import AppError from '@/core/Helpers/AppError.js';

/**
 * AuditService (Admin Role)
 * Centralized logging, diff tracking, threat intelligence, and one-click rollback.
 */
class AuditService {
    /**
     * Calculates field-level difference between old and new state for visual inspector.
     */
    computeDiff(oldState, newState) {
        if (!oldState || !newState || typeof oldState !== 'object' || typeof newState !== 'object') {
            return [];
        }
        const diffs = [];
        const ignoredKeys = new Set(['_id', '__v', 'createdAt', 'updatedAt', 'password', 'salt', 'token']);
        const allKeys = new Set([...Object.keys(oldState), ...Object.keys(newState)]);

        for (const key of allKeys) {
            if (ignoredKeys.has(key)) continue;
            const oldVal = oldState[key];
            const newVal = newState[key];

            const oldJson = JSON.stringify(oldVal !== undefined ? oldVal : null);
            const newJson = JSON.stringify(newVal !== undefined ? newVal : null);

            if (oldJson !== newJson) {
                diffs.push({
                    field: key,
                    old: oldVal !== undefined ? oldVal : null,
                    new: newVal !== undefined ? newVal : null
                });
            }
        }
        return diffs;
    }

    /**
     * Calculates Haversine distance in kilometers between two geo coordinates.
     */
    calculateDistanceKm(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    /**
     * Detects impossible geographic travel anomalies between successive events.
     */
    async checkAnomaly(userId, currentLat, currentLon, currentCity, currentCountry) {
        if (!userId || currentLat == null || currentLon == null) return null;
        try {
            const lastLog = await AuditLog.findOne({
                userId,
                'ipLocation.latitude': { $ne: null },
                'ipLocation.longitude': { $ne: null }
            }).sort({ createdAt: -1 });

            if (!lastLog || !lastLog.ipLocation?.latitude) return null;

            const prevLat = lastLog.ipLocation.latitude;
            const prevLon = lastLog.ipLocation.longitude;
            const distanceKm = this.calculateDistanceKm(prevLat, prevLon, currentLat, currentLon);
            const timeDiffHours = (Date.now() - new Date(lastLog.createdAt).getTime()) / (1000 * 60 * 60);

            // If distance > 100km and velocity exceeds 850 km/h (passenger flight speed)
            if (distanceKm > 100 && timeDiffHours > 0) {
                const speedKmh = distanceKm / timeDiffHours;
                if (speedKmh > 850) {
                    return {
                        type: 'IMPOSSIBLE_TRAVEL',
                        distanceKm: Math.round(distanceKm),
                        timeDiffHours: Math.round(timeDiffHours * 10) / 10,
                        speedKmh: Math.round(speedKmh),
                        fromCity: lastLog.ipLocation.city || 'Unknown',
                        fromCountry: lastLog.ipLocation.country || 'Unknown',
                        toCity: currentCity || 'Unknown',
                        toCountry: currentCountry || 'Unknown',
                        message: `Physical travel speed ${Math.round(speedKmh)} km/h exceeds normal aircraft transit`
                    };
                }
            }
        } catch {
            // safe fallback
        }
        return null;
    }

    /**
     * Log an administrative action to the AuditLog collection.
     */
    async logAction(userId, action, target, targetId, details = {}, req = null, options = {}) {
        try {
            if (req) req._auditLogged = true; // Flag to prevent duplicate logging in apiHandler
            const metadata = getRequestMetadata(req);
            const logData = {
                userId,
                action: action.toUpperCase(),
                target: target.toUpperCase(),
                targetId: String(targetId),
                details: redactSensitiveData(details),
                ipAddress: metadata?.ipAddress,
                userAgent: metadata?.userAgent
            };

            if (metadata?.location && typeof metadata.location === 'object') {
                logData.ipLocation = {
                    city: metadata.location.city || null,
                    region: metadata.location.region || null,
                    country: metadata.location.country || null,
                    asn: metadata.location.asn || null,
                    summary: metadata.location.summary || null
                };
            }
            if (metadata?.device) {
                logData.device = metadata.device;
            }

            // Feature 1: Before vs After State Snapshots and Diffing
            if (options.previousState && options.newState) {
                logData.previousState = redactSensitiveData(options.previousState);
                logData.newState = redactSensitiveData(options.newState);
                logData.diff = this.computeDiff(logData.previousState, logData.newState);
            } else if (options.previousState) {
                logData.previousState = redactSensitiveData(options.previousState);
            } else if (options.newState) {
                logData.newState = redactSensitiveData(options.newState);
            }
            if (options.diff) {
                logData.diff = options.diff;
            }

            // Feature 2: Threat Intelligence & Impossible Travel
            if (options.security) {
                logData.security = options.security;
            } else if (metadata?.location?.latitude && metadata?.location?.longitude) {
                const anomaly = await this.checkAnomaly(
                    userId,
                    metadata.location.latitude,
                    metadata.location.longitude,
                    metadata.location.city,
                    metadata.location.country
                );
                if (anomaly) {
                    logData.security = {
                        threatScore: 85,
                        riskLevel: 'HIGH',
                        isProxyOrHosting: false,
                        riskFlags: ['IMPOSSIBLE_TRAVEL_ANOMALY'],
                        anomaly
                    };
                }
            }

            await AuditLog.create(logData);
        } catch (error) {
            // Intentionally silent or use a generic logging mechanism
        }
    }

    /**
     * Retrieve and filter system audit logs.
     */
    async getAuditLogs(filter = {}, page = 1, limit = 20) {
        const query = {};
        if (filter.userId) query.userId = filter.userId;
        if (filter.adminId) query.userId = filter.adminId; // Backwards compatibility
        if (filter.action) query.action = filter.action.toUpperCase();
        if (filter.target) query.target = filter.target.toUpperCase();
        if (filter.startDate || filter.endDate) {
            query.createdAt = {};
            if (filter.startDate) query.createdAt.$gte = new Date(filter.startDate);
            if (filter.endDate) query.createdAt.$lte = new Date(filter.endDate);
        }

        const safeLimit = parseInt(limit) || 20;
        const total = await countAuditLogsBy(query);
        const logs = await getAuditLogsBy(
            query,
            '',
            { path: 'userId', select: 'name email role' },
            { createdAt: -1 },
            { skip: (page - 1) * safeLimit, limit: safeLimit }
        );

        return {
            logs,
            total,
            totalPages: Math.ceil(total / safeLimit)
        };
    }

    /**
     * Resolve Mongoose model for a given target entity name.
     */
    async getModelForTarget(target) {
        const t = String(target || '').toUpperCase();
        switch (t) {
            case 'PACKAGE': {
                const { default: Package } = await import('@/core/Models/Package.js');
                return Package;
            }
            case 'USER': {
                const { default: User } = await import('@/core/Models/User.js');
                return User;
            }
            case 'VENDOR': {
                const { default: Vendor } = await import('@/core/Models/Vendor.js');
                return Vendor;
            }
            case 'BOOKING': {
                const { default: Booking } = await import('@/core/Models/Booking.js');
                return Booking;
            }
            case 'SETTING': {
                const { default: Setting } = await import('@/core/Models/Setting.js');
                return Setting;
            }
            case 'CATEGORY': {
                const { default: Category } = await import('@/core/Models/Category.js');
                return Category;
            }
            case 'COUPON': {
                const { default: Coupon } = await import('@/core/Models/Coupon.js');
                return Coupon;
            }
            case 'POLICY': {
                const { default: Policy } = await import('@/core/Models/Policy.js');
                return Policy;
            }
            default:
                return null;
        }
    }

    /**
     * Feature 3: One-Click Rollback / Revert Action
     */
    async rollbackAction(auditLogId, adminUserId) {
        const log = await AuditLog.findById(auditLogId);
        if (!log) {
            throw new AppError('Audit log entry not found', 404);
        }
        if (log.isRolledBack) {
            throw new AppError('This action has already been rolled back', 400);
        }

        const Model = await this.getModelForTarget(log.target);
        if (!Model) {
            throw new AppError(`Rollback not supported for entity type: ${log.target}`, 400);
        }

        let restored = null;
        const cleanPrevious = log.previousState ? { ...log.previousState } : null;
        if (cleanPrevious) {
            delete cleanPrevious._id;
            delete cleanPrevious.__v;
            delete cleanPrevious.createdAt;
            delete cleanPrevious.updatedAt;
        }

        if (log.action === 'UPDATE') {
            if (!cleanPrevious) {
                throw new AppError('No previous state snapshot recorded to rollback this mutation', 400);
            }
            restored = await Model.findByIdAndUpdate(log.targetId, { $set: cleanPrevious }, { new: true });
        } else if (log.action === 'DELETE') {
            if (!cleanPrevious) {
                throw new AppError('No previous state snapshot recorded to re-create the deleted entity', 400);
            }
            restored = await Model.create({ ...cleanPrevious, _id: log.targetId });
        } else if (log.action === 'CREATE') {
            restored = await Model.findByIdAndDelete(log.targetId);
        } else {
            throw new AppError(`Rollback not supported for operation action: ${log.action}`, 400);
        }

        log.isRolledBack = true;
        log.rolledBackAt = new Date();
        log.rolledBackBy = adminUserId;
        await log.save();

        return {
            logId: log._id,
            target: log.target,
            targetId: log.targetId,
            action: log.action,
            restored
        };
    }
}

export default new AuditService();
