import { DEFAULTS } from '@/core/Constants/index.js';

const STORAGE_KEYS = {
    TOKEN: 'token',
    ROLE: 'role'
};

export const getToken = () => {
    if (typeof window === 'undefined') return DEFAULTS.NULL;
    try {
        return localStorage.getItem(STORAGE_KEYS.TOKEN) || DEFAULTS.NULL;
    } catch {
        return DEFAULTS.NULL;
    }
};

export const getRole = () => {
    if (typeof window === 'undefined') return DEFAULTS.NULL;
    try {
        return localStorage.getItem(STORAGE_KEYS.ROLE) || DEFAULTS.NULL;
    } catch {
        return DEFAULTS.NULL;
    }
};

export const setToken = (token, role) => {
    if (typeof window === 'undefined') return;
    try {
        if (token) {
            localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        } else {
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
        }

        if (role) {
            localStorage.setItem(STORAGE_KEYS.ROLE, role);
        } else {
            localStorage.removeItem(STORAGE_KEYS.ROLE);
        }
    } catch {
        // Gracefully handle private browsing or quota limits
    }
};

export const removeToken = () => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.ROLE);
    } catch {
        // Gracefully handle private browsing or quota limits
    }
};

export default { getToken, getRole, setToken, removeToken };

