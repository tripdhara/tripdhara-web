export const packagesApi = (fetcher) => ({
    getBrowse: (params = {}, options = {}) => {
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '')
        );
        const query = new URLSearchParams(cleanParams).toString();
        return fetcher(`packages${query ? `?${query}` : ''}`, {
            next: { revalidate: 120, tags: ['packages'] },
            ...options
        });
    },

    searchNearby: (params = {}, options = {}) => {
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '')
        );
        const query = new URLSearchParams(cleanParams).toString();
        return fetcher(`packages/search${query ? `?${query}` : ''}`, {
            next: { revalidate: 120, tags: ['packages-search'] },
            ...options
        });
    },

    getById: (id, options = {}) => {
        return fetcher(`packages/${id}`, {
            next: { revalidate: 120, tags: [`package-${id}`] },
            ...options
        });
    }
});