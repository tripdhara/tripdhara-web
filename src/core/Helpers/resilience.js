import { getLogger } from '@/core/Lib/logger.js';

/**
 * Resilience utilities for external gateway integrations.
 */

/**
 * Wraps an asynchronous operation with exponential backoff retries.
 *
 * @param {Function} operation - The async function to execute.
 * @param {Object} options - Configuration for retries.
 * @param {number} [options.maxRetries=3] - Maximum number of retry attempts.
 * @param {number} [options.baseDelayMs=500] - Base delay in milliseconds before the first retry.
 * @param {Function} [options.shouldRetry] - Optional function to determine if an error should trigger a retry.
 * @returns {Promise<any>}
 */
export const withRetry = async (operation, options = {}) => {
    const maxRetries = options.maxRetries ?? 3;
    const baseDelayMs = options.baseDelayMs ?? 500;
    const defaultShouldRetry = (error) => {
        // Do not retry 4xx client errors (e.g., 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found)
        // Rate limiting (429) can be retried
        const status = error?.http_code || error?.status || error?.statusCode;
        if (typeof status === 'number' && status >= 400 && status < 500 && status !== 429) {
            return false;
        }
        return true;
    };
    const shouldRetry = options.shouldRetry ?? defaultShouldRetry;

    let attempt = 0;

    while (attempt <= maxRetries) {
        try {
            return await operation();
        } catch (error) {
            attempt++;
            
            if (attempt > maxRetries || !shouldRetry(error)) {
                throw error;
            }

            const delay = baseDelayMs * Math.pow(2, attempt - 1);
            
            // Add slight jitter (0-20%) to prevent thundering herd
            const jitter = delay * (Math.random() * 0.2);
            
            if (process.env.NODE_ENV !== 'test') {
                getLogger().warn({ attempt, err: error?.message }, `[Resilience] Attempt ${attempt} failed. Retrying in ${Math.round(delay + jitter)}ms...`);
            }
            
            await new Promise((resolve) => setTimeout(resolve, delay + jitter));
        }
    }
};
