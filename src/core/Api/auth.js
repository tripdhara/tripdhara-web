export const authApi = (fetcher) => ({
    verify: () => fetcher('auth/token/verify'),
    logout: (body = {}) => fetcher('auth/logout', { method: 'POST', body: JSON.stringify(body) }),
    refreshToken: () => fetcher('auth/token/refresh'),
});

