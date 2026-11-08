import Cookies from 'js-cookie';
import { DEFAULTS } from '@/core/Constants/index.js';

const STORAGE_KEYS = {
    TOKEN: 'token',
    ROLE: 'role'
};

const getCookieOptions = (rememberMe = false) => ({
    expires: rememberMe ? 30 : 1, // 30 days or 1 day
    path: '/',
    sameSite: 'lax',
    secure: typeof window !== 'undefined' && window.location.protocol === 'https:'
});

/**
 * Synchronous client-side token retrieval (Cookie -> localStorage).
 */
export const getToken = () => {
    if (typeof window === 'undefined') return DEFAULTS.NULL;
    try {
        return Cookies.get(STORAGE_KEYS.TOKEN) || localStorage.getItem(STORAGE_KEYS.TOKEN) || DEFAULTS.NULL;
    } catch {
        return DEFAULTS.NULL;
    }
};

/**
 * Synchronous client-side role retrieval.
 */
export const getRole = () => {
    if (typeof window === 'undefined') return DEFAULTS.NULL;
    try {
        return Cookies.get(STORAGE_KEYS.ROLE) || localStorage.getItem(STORAGE_KEYS.ROLE) || DEFAULTS.NULL;
    } catch {
        return DEFAULTS.NULL;
    }
};

/**
 * Universal cookie + localStorage persistence for browser sessions.
 */
export const setToken = (token, role, rememberMe = DEFAULTS.FALSE) => {
    if (typeof window === 'undefined') return;
    try {
        const cookieOpts = getCookieOptions(rememberMe);

        if (token) {
            Cookies.set(STORAGE_KEYS.TOKEN, token, cookieOpts);
            localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        } else {
            Cookies.remove(STORAGE_KEYS.TOKEN, { path: '/' });
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
        }

        if (role) {
            Cookies.set(STORAGE_KEYS.ROLE, role, cookieOpts);
            localStorage.setItem(STORAGE_KEYS.ROLE, role);
        } else {
            Cookies.remove(STORAGE_KEYS.ROLE, { path: '/' });
            localStorage.removeItem(STORAGE_KEYS.ROLE);
        }
    } catch (error) {
        // Gracefully handle private browsing or quota limits
    }
};

/**
 * Clean session removal from both Cookies and localStorage.
 */
export const removeToken = () => {
    if (typeof window === 'undefined') return;
    try {
        Cookies.remove(STORAGE_KEYS.TOKEN, { path: '/' });
        Cookies.remove(STORAGE_KEYS.ROLE, { path: '/' });
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.ROLE);
    } catch (error) {
        // Gracefully handle private browsing or quota limits
    }
};

/**
 * Serverless / Server-side token extractor from incoming Next.js request headers.
 */
export const getServerToken = async () => {
    if (typeof window !== 'undefined') return getToken();
    try {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        return cookieStore.get(STORAGE_KEYS.TOKEN)?.value || DEFAULTS.NULL;
    } catch {
        return DEFAULTS.NULL;
    }
};

/**
 * Universal token resolver: checks client memory first, then serverless request cookies.
 */
export const getAuthToken = async () => {
    if (typeof window !== 'undefined' || process.env.NODE_ENV === 'test') {
        return getToken();
    }
    return await getServerToken();
};

/**
 * Resolves base URL for serverless fetch calls (http://localhost:PORT on server, '' in browser).
 */
export const getApiBaseUrl = () => {
    if (typeof window !== 'undefined' || process.env.NODE_ENV === 'test') return '';
    return process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_API_URL || (process.env.PORT ? `http://localhost:${process.env.PORT}` : 'http://localhost:3000');
};

/**
 * Universal Authorization headers builder for fetcher clients.
 */
export const getAuthHeaders = async (customHeaders = {}) => {
    const token = await getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...customHeaders
    };
};

export default {
    getToken,
    getRole,
    setToken,
    removeToken,
    getServerToken,
    getAuthToken,
    getApiBaseUrl,
    getAuthHeaders
};
