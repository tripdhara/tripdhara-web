export const servicesApi = (fetcher) => ({
    // Categories
    categories: {
        getAll: (options = {}) => fetcher('categories', {
            next: { revalidate: 300, tags: ['categories'] },
            ...options
        }),
        getById: (id, options = {}) => fetcher(`categories/${id}`, options)
    },

    // Inquiries & Newsletter Subscriptions
    inquiries: {
        submit: (data) => fetcher('inquiries', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        subscribeNewsletter: (email) => fetcher('newsletter/subscribe', {
            method: 'POST',
            body: JSON.stringify({ email })
        })
    },

    // Policies
    policies: {
        getByTarget: (target, type, options = {}) => fetcher(`policies/${target}/${type}`, {
            next: { revalidate: 3600, tags: ['policies'] },
            ...options
        })
    },

    // Locations (Countries & States)
    locations: {
        getCountries: (options = {}) => fetcher('countries', {
            next: { revalidate: 86400, tags: ['countries'] },
            ...options
        }),
        getStates: (countryCode, options = {}) => fetcher(`states?countryCode=${countryCode}`, {
            next: { revalidate: 86400, tags: ['states'] },
            ...options
        })
    }
});