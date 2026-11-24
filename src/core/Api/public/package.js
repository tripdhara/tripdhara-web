export const packagesApi = (fetcher) => ({
    getBrowse: (params = {}, options = {}) => {
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '')
        );
        const query = new URLSearchParams(cleanParams).toString();
        return fetcher(`packages${query ? `?${query}` : ''}`, {
            cache: 'no-store',
            ...options
        });
    },

    searchNearby: (params = {}, options = {}) => {
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '')
        );
        const query = new URLSearchParams(cleanParams).toString();
        return fetcher(`packages/search${query ? `?${query}` : ''}`, {
            cache: 'no-store',
            ...options
        });
    },

    getById: (id, options = {}) => {
        return fetcher(`packages/${id}`, {
            cache: 'no-store',
            ...options
        });
    }
});