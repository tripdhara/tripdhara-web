export const authApi = (fetcher) => ({
    verify: () => fetcher('/api/auth/token/verify'),
    logout: (body = {}) => fetcher('/api/auth/logout', { method: 'POST', body: JSON.stringify(body) }),
    refreshToken: () => fetcher('/api/auth/token/refresh'),
});

