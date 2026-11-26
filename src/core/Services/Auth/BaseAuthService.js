import { RESPONSE_MESSAGES, USER_ROLES, STATUS, DEFAULTS } from '@/core/Constants/index.js';
import User from '@/core/Models/User.js';
import Vendor from '@/core/Models/Vendor.js';
import { verifyToken, generateToken, generateAuthTokens, decodeToken } from '@/core/Helpers/jwt.js';
import { mapToGeoJSON } from '@/core/Helpers/geoUtils.js';
import CacheService from '@/core/Services/CacheService.js';
import { userAuthResponse, userBusinessProfileById, userProfileById } from '@/core/Helpers/userProfileHelper.js';
import AppError from '@/core/Errors/AppError.js';
import { getUserById, updateById, getBusinessBy } from '@/core/Helpers/queryHelpers.js';
import NotificationService from '@/core/Services/General/NotificationService.js';
import { getLogger } from '@/core/Lib/logger.js';

class BaseAuthService {
    async generateAndSaveTokens(user, rememberMe = false) {
        const payload = { id: user._id, role: user.role, email: user.email, identifier: user.email || user.phone };
        const tokens = await generateAuthTokens(payload, rememberMe);

        // Save refresh token JTI in Redis for validation/blacklisting. Key: auth:refresh:{userId}:{jti}
        const ttl = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60; // seconds
        await CacheService.set(`auth:refresh:${user._id}:${tokens.refreshJti}`, { createdAt: new Date().toISOString() }, ttl);
        return tokens;
    }

    async verifyToken(userId) {
        const user = await getUserById(userId, '-password');
        if (!user) throw AppError.notFound(RESPONSE_MESSAGES.USER.NOT_FOUND);
        const result = await userAuthResponse(user);
        return result;
    }

    async refreshToken(token) {
        const decoded = await verifyToken(token);
        if (!decoded || decoded.type !== 'refresh' || !decoded.jti) throw AppError.unauthorized(RESPONSE_MESSAGES.AUTH.TOKEN_INVALID);
        const cacheKey = `auth:refresh:${decoded.id}:${decoded.jti}`;
        const isRedisAvailable = await CacheService.isAvailable();
        if (!isRedisAvailable) throw AppError.internal(RESPONSE_MESSAGES.AUTH.AUTH_SERVICE_ERROR);
        const isValid = await CacheService.get(cacheKey);
        if (!isValid) throw AppError.unauthorized(RESPONSE_MESSAGES.AUTH.TOKEN_INVALID);

        const user = { _id: decoded.id, role: decoded.role, email: decoded.email, phone: decoded.identifier };
        const newTokens = await this.generateAndSaveTokens(user, true);
        await CacheService.delete(cacheKey);
        return newTokens;
    }

    async logout(accessToken, refreshToken = null, explicitUserId = null) {
        const accessDecoded = decodeToken(accessToken);
        const userId = explicitUserId || accessDecoded?.id;
        if (!userId) return false;

        // Clear user's FCM token upon logout
        try {
            await User.findByIdAndUpdate(userId, { $set: { fcmToken: DEFAULTS.NULL } });
            await CacheService.delete(`user:profile:${userId}`);
        } catch (fcmErr) {
            // Non-blocking fallback
        }

        // Blacklist access token JTI in Redis until expiry (IAM security law)
        if (accessDecoded?.jti) {
            const exp = accessDecoded.exp;
            const now = Math.floor(Date.now() / 1000);
            const remainingTtl = exp ? Math.max(1, exp - now) : 900;
            await CacheService.set(`blacklist:${accessDecoded.jti}`, true, remainingTtl);
        }

        if (refreshToken) {
            const refreshDecoded = decodeToken(refreshToken);
            if (refreshDecoded && refreshDecoded.jti) {
                await CacheService.delete(`auth:refresh:${refreshDecoded.id}:${refreshDecoded.jti}`);
                return true;
            }
        }

        // Fallback: Invalidate all sessions for this user if no specific refresh token provided
        await CacheService.deletePattern(`auth:refresh:${userId}:*`);
        return true;
    }

    async getUserProfile(userId, forceRefresh = false) {
        const cacheKey = `user:profile:${userId}`;
        if (forceRefresh) await CacheService.delete(cacheKey);
        return await CacheService.getOrSet(cacheKey, async () => {
            const profile = await userProfileById(userId);
            if (!profile) throw AppError.notFound(RESPONSE_MESSAGES.USER.NOT_FOUND);
            return profile;
        }, 3600);
    }

    async updateUserProfile(userId, updates) {
        const existingUser = await getUserById(userId);
        if (!existingUser) throw AppError.notFound(RESPONSE_MESSAGES.ERROR.NOT_FOUND);

        const safeUpdates = { ...updates };
        const forbiddenFields = ['role', 'status', 'isVerified', 'isVendorVerified', 'deletedAt', 'deletedBy', 'deletedReason'];
        forbiddenFields.forEach(field => delete safeUpdates[field]);

        if (safeUpdates.phone === '') safeUpdates.phone = null;

        if (safeUpdates.preferences) {
            const safePreferences = { ...safeUpdates.preferences };
            delete safePreferences.tempRole;
            delete safePreferences.tempExtraData;
            const existingPrefs = existingUser.preferences || {};
            safeUpdates.preferences = {
                ...existingPrefs,
                ...safePreferences,
                notifications: {
                    ...(existingPrefs.notifications || {}),
                    ...(safePreferences.notifications || {})
                }
            };
        }

        if (safeUpdates.socialLinks) {
            safeUpdates.socialLinks = { ...(existingUser.socialLinks || {}), ...safeUpdates.socialLinks };
        }

        if (safeUpdates.address) {
            safeUpdates.address = { ...(existingUser.address || {}), ...safeUpdates.address };
            mapToGeoJSON(safeUpdates.address, 'location');
        }

        const user = await updateById(User, userId, safeUpdates, { returnDocument: 'after' });
        return await userAuthResponse(user);
    }

    async deactivateUserAccount(userId, reason = DEFAULTS.NULL) {
        const updates = {
            deletedAt: new Date(),
            deletedBy: userId,
            deletedReason: reason,
            status: STATUS.DELETED
        };
        const user = await updateById(User, userId, updates, { returnDocument: 'after' });
        if (!user) throw AppError.notFound(RESPONSE_MESSAGES.ERROR.NOT_FOUND);
        return DEFAULTS.TRUE;
    }
}

export default new BaseAuthService();
