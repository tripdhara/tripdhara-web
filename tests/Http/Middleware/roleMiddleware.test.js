import { jest } from '@jest/globals';

jest.unstable_mockModule('@/core/Constants/index.js', () => ({
    USER_ROLES: { ADMIN: 'admin', SUPER_ADMIN: 'super_admin', DEVELOPER: 'developer', VENDOR: 'vendor', TRAVELLER: 'traveller' },
    RESPONSE_MESSAGES: {
        AUTH: { UNAUTHORIZED: 'Unauthorized', ADMIN_ONLY: 'Admin only' },
        ERROR: { FORBIDDEN: 'Forbidden' }
    },
    DEFAULTS: { TRUE: true, FALSE: false }
}));

const { roleMiddleware } = await import('@/core/Http/Middleware/roleMiddleware.js');

describe('Role Middleware', () => {
    it('should return UNAUTHORIZED if no user in request', () => {
        const result = roleMiddleware({});
        expect(result).toEqual({ authorized: false, message: 'Unauthorized' });
    });

    it('should authorize if no allowed roles are specified', () => {
        const result = roleMiddleware({ user: { role: 'traveller' } });
        expect(result).toEqual({ authorized: true });
    });

    it('should authorize if user role is in allowed roles', () => {
        const result = roleMiddleware({ user: { role: 'vendor' } }, ['vendor', 'admin']);
        expect(result).toEqual({ authorized: true });
    });

    it('should deny if user role is not in allowed roles', () => {
        const result = roleMiddleware({ user: { role: 'traveller' } }, ['vendor']);
        expect(result).toEqual({ authorized: false, message: 'Forbidden' });
    });

    it('should return ADMIN_ONLY if only admin is allowed and user is not admin', () => {
        const result = roleMiddleware({ user: { role: 'vendor' } }, ['admin']);
        expect(result).toEqual({ authorized: false, message: 'Admin only' });
    });

    it('should handle tempRole switching properly', () => {
        const result = roleMiddleware({ 
            user: { role: 'admin', preferences: { tempRole: 'vendor' } } 
        }, ['vendor']);
        expect(result).toEqual({ authorized: true });
    });

    it('should prevent non-admin privilege escalation via tempRole', () => {
        const result = roleMiddleware({ 
            user: { role: 'traveller', preferences: { tempRole: 'admin' } } 
        }, ['admin']);
        expect(result).toEqual({ authorized: false, message: 'Admin only' });
    });

    it('should allow super_admin on admin-restricted routes', () => {
        const result = roleMiddleware({ 
            user: { role: 'super_admin' } 
        }, ['admin']);
        expect(result).toEqual({ authorized: true });
    });

    it('should allow developer on admin-restricted routes', () => {
        const result = roleMiddleware({ 
            user: { role: 'developer' } 
        }, ['admin']);
        expect(result).toEqual({ authorized: true });
    });

    it('should safely accept allowedRoles as a string', () => {
        const result = roleMiddleware({ 
            user: { role: 'admin' } 
        }, 'admin');
        expect(result).toEqual({ authorized: true });
    });
});
