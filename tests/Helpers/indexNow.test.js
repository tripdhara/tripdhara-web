import { jest } from '@jest/globals';

describe('Industry Standard: IndexNow Helper', () => {
    let notifyIndexNow;
    const originalFetch = global.fetch;
    const originalIndexNowKey = process.env.INDEXNOW_KEY;

    beforeAll(async () => {
        process.env.INDEXNOW_KEY = 'test_indexnow_api_key';
        const module = await import('@/core/Helpers/indexNow.js');
        notifyIndexNow = module.notifyIndexNow;
    });

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.INDEXNOW_KEY = 'test_indexnow_api_key';
    });

    afterAll(() => {
        global.fetch = originalFetch;
        if (originalIndexNowKey !== undefined) {
            process.env.INDEXNOW_KEY = originalIndexNowKey;
        } else {
            delete process.env.INDEXNOW_KEY;
        }
    });

    it('[Validation] should return error when no URLs are provided', async () => {
        const resNull = await notifyIndexNow(null);
        expect(resNull).toEqual({ success: false, message: 'No URLs provided' });

        const resEmpty = await notifyIndexNow([]);
        expect(resEmpty).toEqual({ success: false, message: 'No URLs provided' });
    });

    it('[Success] should post payload and return success when API responds with 200 or 202', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            status: 200
        });

        const testUrls = ['https://tripdhara.in/packages/trek-1'];
        const res = await notifyIndexNow(testUrls);

        expect(global.fetch).toHaveBeenCalledWith(
            'https://api.indexnow.org/indexnow',
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: expect.stringContaining('tripdhara.in')
            })
        );
        expect(res.success).toBe(true);
        expect(res.status).toBe(200);
        expect(res.urls).toEqual(testUrls);
    });

    it('[Success] should accept a single URL string and wrap it into an array', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            status: 202
        });

        const singleUrl = 'https://tripdhara.in/homestays/homestay-1';
        const res = await notifyIndexNow(singleUrl);

        expect(res.success).toBe(true);
        expect(res.status).toBe(202);
        expect(res.urls).toEqual([singleUrl]);
    });

    it('[Failure] should return error object if fetch throws an exception', async () => {
        global.fetch = jest.fn().mockRejectedValue(new Error('Network offline'));

        const res = await notifyIndexNow(['https://tripdhara.in/packages/trek-1']);
        expect(res.success).toBe(false);
        expect(res.error).toBe('Network offline');
    });
});
