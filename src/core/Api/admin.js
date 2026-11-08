const prepareBody = (data) => data instanceof FormData ? data : JSON.stringify(data);

export const adminApi = (fetcher) => ({
    // Dashboard & Analytics
    stats: {
        getStats: () => fetcher('admin/stats'),
        getAnalytics: (params) => {
            const query = params ? `?${new URLSearchParams(params).toString()}` : '';
            return fetcher(`admin/analytics${query}`);
        },
    },

    auditLogs: {
        getAll: (params) => {
            const query = params ? `?${new URLSearchParams(params).toString()}` : '';
            return fetcher(`admin/audit-logs${query}`);
        }
    },

    // Profile & Auth
    profile: {
        get: () => fetcher('admin/profile'),
        update: (data) => fetcher('admin/profile', { method: 'PATCH', body: prepareBody(data) }),
        changePassword: (data) => fetcher('admin/change-password', { method: 'POST', body: prepareBody(data) }),
        resetPassword: (data) => fetcher('admin/reset-password', { method: 'POST', body: prepareBody(data) }),
    },

    // User Management: Travellers
    travellers: {
        getAll: () => fetcher('admin/travellers'),
        getById: (id) => fetcher(`admin/travellers/${id}`),
        create: (data) => fetcher('admin/travellers/create', { method: 'POST', body: prepareBody(data) }),
        update: (id, data) => fetcher(`admin/travellers/${id}/update`, { method: 'PATCH', body: prepareBody(data) }),
        delete: (id) => fetcher(`admin/travellers/${id}/delete`, { method: 'DELETE' }),
    },

    // User Management: Vendors
    vendors: {
        getAll: () => fetcher('admin/vendors'),
        getById: (id) => fetcher(`admin/vendors/${id}`),
        getPackages: (id) => fetcher(`admin/vendors/${id}/packages`),
        create: (data) => fetcher('admin/vendors/create', { method: 'POST', body: prepareBody(data) }),
        update: (id, data) => fetcher(`admin/vendors/${id}/update`, { method: 'PATCH', body: prepareBody(data) }),
        delete: (id) => fetcher(`admin/vendors/${id}/delete`, { method: 'DELETE' }),
        globalApprove: (data) => fetcher('admin/approve-vendor', { method: 'POST', body: prepareBody(data) }),
    },

    // Trust & Compliance
    compliance: {
        verifyDocument: (data) => fetcher('admin/verify-document', { method: 'POST', body: prepareBody(data) }),
        verifyCategoryDoc: (data) => fetcher('admin/verify-category-document', { method: 'POST', body: prepareBody(data) }),
        triggerOCR: (data) => fetcher('admin/trigger-ocr', { method: 'POST', body: prepareBody(data) }),
    },

    // Inventory Hub
    packages: {
        getAll: () => fetcher('admin/packages'),
        updateStatus: (id, data) => fetcher(`admin/packages/${id}/status`, { method: 'PATCH', body: prepareBody(data) }),
        addOnBehalf: (data) => fetcher('admin/packages/add', { method: 'POST', body: prepareBody(data) }),
        addItemOnBehalf: (data) => fetcher('admin/packages/add-item', { method: 'POST', body: prepareBody(data) }),
        getItem: (id) => fetcher(`admin/packages/item/${id}`),
        updateItem: (id, data) => fetcher(`admin/packages/item/${id}`, { method: 'PATCH', body: prepareBody(data) }),
    },

    // Operations Hub
    bookings: {
        getAll: (params) => {
            const query = params ? `?${new URLSearchParams(params).toString()}` : '';
            return fetcher(`admin/bookings${query}`);
        },
        create: (data) => fetcher('admin/bookings/create', { method: 'POST', body: prepareBody(data) }),
        getById: (id) => fetcher(`admin/bookings/${id}`),
        sendInvoice: (id) => fetcher(`admin/bookings/${id}/invoice`, { method: 'POST' }),
        downloadInvoice: (id, type = 'traveller') => fetcher(`admin/bookings/${id}/download-invoice?type=${type}`, { method: 'GET' }),
    },

    payments: {
        getHistory: () => fetcher('admin/payments'),
        payout: (data) => fetcher('admin/payments/payout', { method: 'POST', body: prepareBody(data) }),
        refund: (data) => fetcher('admin/payments/refund', { method: 'POST', body: prepareBody(data) }),
    },

    // Moderation & Social
    reviews: {
        getPending: () => fetcher('admin/reviews'),
        updateStatus: (id, data) => fetcher(`admin/reviews/${id}`, { method: 'PATCH', body: prepareBody(data) }),
        reject: (id) => fetcher(`admin/reviews/${id}`, { method: 'DELETE' }),
    },

    disputes: {
        getAll: () => fetcher('admin/disputes'),
        resolve: (id, data) => fetcher(`admin/disputes/${id}`, { method: 'PATCH', body: prepareBody(data) }),
        getMessages: (id) => fetcher(`admin/disputes/${id}/messages`),
        sendMessage: (id, data) => fetcher(`admin/disputes/${id}/messages`, { method: 'POST', body: prepareBody(data) }),
    },

    inquiries: {
        getAll: () => fetcher('admin/inquiries'),
        update: (id, data) => fetcher(`admin/inquiries/${id}`, { method: 'PATCH', body: prepareBody(data) }),
        delete: (id) => fetcher(`admin/inquiries/${id}`, { method: 'DELETE' }),
    },

    // Marketing Hub
    marketing: {
        banners: {
            getAll: () => fetcher('admin/marketing/banners'),
            add: (data) => fetcher('admin/marketing/banners', { method: 'POST', body: prepareBody(data) }),
            update: (id, data) => fetcher(`admin/marketing/banners/${id}`, { method: 'PUT', body: prepareBody(data) }),
            delete: (id) => fetcher(`admin/marketing/banners/${id}`, { method: 'DELETE' }),
        },
        coupons: {
            getAll: () => fetcher('admin/marketing/coupons'),
            create: (data) => fetcher('admin/marketing/coupons', { method: 'POST', body: prepareBody(data) }),
            update: (id, data) => fetcher(`admin/marketing/coupons/${id}`, { method: 'PUT', body: prepareBody(data) }),
            delete: (id) => fetcher(`admin/marketing/coupons/${id}`, { method: 'DELETE' }),
        }
    },

    blogs: {
        getAll: (params) => {
            const query = params ? `?${new URLSearchParams(params).toString()}` : '';
            return fetcher(`admin/blogs${query}`);
        },
        create: (data) => fetcher('admin/blogs', { method: 'POST', body: prepareBody(data) }),
        getById: (id) => fetcher(`admin/blogs/${id}`),
        update: (id, data) => fetcher(`admin/blogs/${id}`, { method: 'PUT', body: prepareBody(data) }),
        delete: (id) => fetcher(`admin/blogs/${id}`, { method: 'DELETE' }),
    },

    // Taxonomy Hub
    categories: {
        getAll: () => fetcher('admin/categories'),
        create: (data) => fetcher('admin/categories', { method: 'POST', body: prepareBody(data) }),
        update: (id, data) => fetcher(`admin/categories/${id}`, { method: 'PUT', body: prepareBody(data) }),
        delete: (id) => fetcher(`admin/categories/${id}`, { method: 'DELETE' }),
        seed: () => fetcher('admin/categories/seed', { method: 'POST' }),
    },

    documents: {
        getAll: (params) => {
            const query = params ? `?${new URLSearchParams(params).toString()}` : '';
            return fetcher(`admin/category-documents${query}`);
        },
        create: (data) => fetcher('admin/category-documents', { method: 'POST', body: prepareBody(data) }),
        getById: (id) => fetcher(`admin/category-documents/${id}`),
        update: (id, data) => fetcher(`admin/category-documents/${id}`, { method: 'PUT', body: prepareBody(data) }),
        delete: (id) => fetcher(`admin/category-documents/${id}`, { method: 'DELETE' }),
    },

    // System Configuration
    settings: {
        get: () => fetcher('admin/settings'),
        update: (data) => fetcher('admin/settings', { method: 'POST', body: prepareBody(data) }),
    },

    policies: {
        getAll: () => fetcher('admin/policies'),
        save: (data) => fetcher('admin/policies', { method: 'POST', body: prepareBody(data) }),
        seed: () => fetcher('admin/policies/seed', { method: 'POST' }),
    },

    // Geography
    locations: {
        createCountry: (data) => fetcher('admin/countries', { method: 'POST', body: prepareBody(data) }),
        createState: (data) => fetcher('admin/states', { method: 'POST', body: prepareBody(data) }),
    }
});
