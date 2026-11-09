import { jest } from '@jest/globals';
import { withRetry } from '@/core/Helpers/resilience.js';

describe('Helpers: resilience.js', () => {
    it('should export withRetry function', () => {
        expect(typeof withRetry).toBe('function');
    });

    it('should succeed on first try without retrying', async () => {
        const fn = jest.fn().mockResolvedValue('success');
        const result = await withRetry(fn, { maxRetries: 3, baseDelayMs: 10 });
        expect(result).toBe('success');
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on transient server error and succeed', async () => {
        const fn = jest.fn()
            .mockRejectedValueOnce(new Error('Network timeout'))
            .mockResolvedValueOnce('recovered');

        const result = await withRetry(fn, { maxRetries: 3, baseDelayMs: 10 });
        expect(result).toBe('recovered');
        expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should not retry on 4xx client errors by default', async () => {
        const err400 = new Error('Bad Request');
        err400.http_code = 400;

        const fn = jest.fn().mockRejectedValue(err400);

        await expect(withRetry(fn, { maxRetries: 3, baseDelayMs: 10 })).rejects.toThrow('Bad Request');
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on 429 rate-limited errors', async () => {
        const err429 = new Error('Too Many Requests');
        err429.status = 429;

        const fn = jest.fn()
            .mockRejectedValueOnce(err429)
            .mockResolvedValueOnce('rate limit passed');

        const result = await withRetry(fn, { maxRetries: 3, baseDelayMs: 10 });
        expect(result).toBe('rate limit passed');
        expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should respect custom shouldRetry callback', async () => {
        const customErr = new Error('Custom Error');
        const fn = jest.fn().mockRejectedValue(customErr);

        await expect(withRetry(fn, { 
            maxRetries: 3, 
            baseDelayMs: 10,
            shouldRetry: () => false
        })).rejects.toThrow('Custom Error');

        expect(fn).toHaveBeenCalledTimes(1);
    });
});
