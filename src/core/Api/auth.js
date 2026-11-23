export const authApi = (fetcher) => ({
    login: (body) => fetcher('auth/login', { method: 'POST', body: JSON.stringify(body) }),
    forgotPassword: (body) => fetcher('auth/forget-password', { method: 'POST', body: JSON.stringify(body) }),
    verify: () => fetcher('auth/token/verify'),
    logout: (body = {}) => fetcher('auth/logout', { method: 'POST', body: JSON.stringify(body) }),
    refreshToken: () => fetcher('auth/token/refresh'),
});
