import { STATUS, RESPONSE_MESSAGES, DEFAULTS } from '@/core/Constants/index.js';
import { verifyToken } from '@/core/Helpers/jwt.js';
import { getUserById } from '@/core/Helpers/queryHelpers.js';
import CacheService from '@/core/Services/CacheService.js';
import { getLogger } from '@/core/Lib/logger.js';

const authMiddleware = async (req) => {
    try {
        let token = null;

        // 1. Authorization header (Bearer <token>)
        const authHeader = req.headers?.get?.('authorization') || '';
        const bearerMatch = authHeader.match(/^Bearer\s+(.+)$/i);
        if (bearerMatch) token = bearerMatch[1];

        // 2. Query parameter (?token=) for real-time stream
        if (!token && req.url?.includes('/stream')) token = new URL(req.url).searchParams.get('token');

        // 3. Cookie (token)
        if (!token) {
            token = req.cookies?.get?.('token')?.value;
            if (!token && req.headers?.get) {
                const cookieMatch = (req.headers.get('cookie') || '').match(/(?:^|;\s*)token=([^;]+)/);
                if (cookieMatch) token = decodeURIComponent(cookieMatch[1]);
            }
        }

        if (!token) return { authorized: DEFAULTS.FALSE, message: RESPONSE_MESSAGES.AUTH.NO_TOKEN };

        const decoded = await verifyToken(token);
        if (!decoded) return { authorized: DEFAULTS.FALSE, message: RESPONSE_MESSAGES.AUTH.TOKEN_INVALID };
        if (decoded.type && decoded.type !== 'access') return { authorized: DEFAULTS.FALSE, message: RESPONSE_MESSAGES.AUTH.TOKEN_INVALID }

        // Check Redis for blacklisted JTI (logout / token revocation)
        if (decoded.jti) {
            try {
                const isBlacklisted = await CacheService.get(`blacklist:${decoded.jti}`);
                if (isBlacklisted) return { authorized: DEFAULTS.FALSE, message: RESPONSE_MESSAGES.AUTH.TOKEN_INVALID };
            } catch (cacheErr) {
                getLogger().error({ err: cacheErr, jti: decoded.jti }, '[AuthMiddleware] Redis token blacklist lookup failed');
            }
        }

        const user = await getUserById(decoded.id, 'status deletedAt role preferences fcmToken');

        const statusMap = {
            [STATUS.DELETED]: RESPONSE_MESSAGES.AUTH.ACCOUNT_DELETED,
            [STATUS.BLOCKED]: RESPONSE_MESSAGES.AUTH.ACCOUNT_BLOCKED,
            [STATUS.SUSPENDED]: RESPONSE_MESSAGES.AUTH.ACCOUNT_SUSPENDED,
        };

        const denialReason = (!user || user.deletedAt) ? RESPONSE_MESSAGES.AUTH.ACCOUNT_DELETED : statusMap[user.status];
        return denialReason ? { authorized: DEFAULTS.FALSE, message: denialReason } : { authorized: DEFAULTS.TRUE, user: { ...user, id: user._id.toString() } };
    } catch (error) {
        getLogger().error({ err: error }, '[AuthMiddleware] Authentication service failure');
        return { authorized: DEFAULTS.FALSE, message: RESPONSE_MESSAGES.AUTH.AUTH_SERVICE_ERROR };
    }
};

export default authMiddleware;
