import { USER_ROLES, RESPONSE_MESSAGES, DEFAULTS } from '@/core/Constants/index.js';

/**
 * Validates if the authenticated user has the required role.
 * Includes defense-in-depth against unauthorized privilege escalation and supports role hierarchy.
 * This should be called after `authMiddleware` has populated `req.user`.
 *
 * @param {Object} req - The request object (must contain req.user)
 * @param {Array<string>|string} allowedRoles - Roles allowed to access the resource
 * @returns {Object} { authorized: boolean, message?: string }
 */
export const roleMiddleware = (req, allowedRoles = []) => {
    if (!req.user) return { authorized: DEFAULTS.FALSE, message: RESPONSE_MESSAGES.AUTH.UNAUTHORIZED };

    const adminTierRoles = [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.DEVELOPER].filter(Boolean);
    const original = req.user.role;
    const temp = req.user.preferences?.tempRole;

    const isEscalationAttempt = temp && adminTierRoles.includes(temp) && !adminTierRoles.includes(original);
    const switchRole = (!isEscalationAttempt && temp && temp !== original) ? temp : original;
    const roles = Array.isArray(allowedRoles) ? allowedRoles : (allowedRoles ? [allowedRoles] : []);

    if (roles.length > 0) {
        const effectiveAllowedRoles = roles.includes(USER_ROLES.ADMIN) ? [...new Set([...roles, ...adminTierRoles])] : roles;
        if (!effectiveAllowedRoles.includes(switchRole)) {
            const isStrictAdminOnly = roles.includes(USER_ROLES.ADMIN) && roles.length === 1;
            const errorMessage = isStrictAdminOnly ? RESPONSE_MESSAGES.AUTH.ADMIN_ONLY : RESPONSE_MESSAGES.ERROR.FORBIDDEN;
            return { authorized: DEFAULTS.FALSE, message: errorMessage };
        }
    }

    return { authorized: DEFAULTS.TRUE };
};

export default roleMiddleware;
