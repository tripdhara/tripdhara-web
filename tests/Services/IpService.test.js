import { jest } from '@jest/globals';

jest.unstable_mockModule('@/core/Services/CacheService.js', () => ({
    default: {
        get: jest.fn().mockResolvedValue(null),
        set: jest.fn().mockResolvedValue(true)
    }
}));

jest.unstable_mockModule('@/core/Lib/logger.js', () => ({
    getLogger: () => ({
        debug: jest.fn(),
        error: jest.fn(),
        info: jest.fn()
    })
}));

const { default: IpService } = await import('@/core/Services/IpService.js');

describe('IpService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('isPrivateOrLocal', () => {
        it('should return true for localhost and loopback IPs', () => {
            expect(IpService.isPrivateOrLocal('127.0.0.1')).toBe(true);
            expect(IpService.isPrivateOrLocal('::1')).toBe(true);
            expect(IpService.isPrivateOrLocal('localhost')).toBe(true);
            expect(IpService.isPrivateOrLocal('')).toBe(true);
            expect(IpService.isPrivateOrLocal(null)).toBe(true);
        });

        it('should return true for RFC1918 private IPs', () => {
            expect(IpService.isPrivateOrLocal('10.0.0.1')).toBe(true);
            expect(IpService.isPrivateOrLocal('192.168.1.1')).toBe(true);
            expect(IpService.isPrivateOrLocal('172.16.0.5')).toBe(true);
        });

        it('should return false for public internet IPs', () => {
            expect(IpService.isPrivateOrLocal('8.8.8.8')).toBe(false);
            expect(IpService.isPrivateOrLocal('49.36.211.99')).toBe(false);
            expect(IpService.isPrivateOrLocal('103.21.244.2')).toBe(false);
        });
    });

    describe('lookup', () => {
        it('should strictly preserve private subnet IP and NOT call external GeoIP', async () => {
            const mockFetch = jest.fn();
            global.fetch = mockFetch;

            const res = await IpService.lookup('192.168.1.50');
            expect(res).toBeDefined();
            expect(res.ip).toBe('192.168.1.50');
            expect(res.isPrivate).toBe(true);
            expect(res.city).toBeNull();
            expect(res.isp).toBeNull();
            expect(mockFetch).not.toHaveBeenCalled();
        });

        it('should strictly preserve 127.0.0.1 loopback and NOT call external GeoIP', async () => {
            const mockFetch = jest.fn();
            global.fetch = mockFetch;

            const res = await IpService.lookup('127.0.0.1');
            expect(res).toBeDefined();
            expect(res.ip).toBe('127.0.0.1');
            expect(res.isLocal).toBe(true);
            expect(res.city).toBeNull();
            expect(res.isp).toBeNull();
            expect(mockFetch).not.toHaveBeenCalled();
        });

        it('should lookup real provider response for public IP with zero fake strings', async () => {
            const mockFetch = jest.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    status: 'success',
                    country: 'India',
                    countryCode: 'IN',
                    region: 'UP',
                    regionName: 'Uttar Pradesh',
                    city: 'Lucknow',
                    zip: '226003',
                    lat: 26.8373,
                    lon: 80.9165,
                    timezone: 'Asia/Kolkata',
                    isp: 'Reliance Jio Infocomm Limited',
                    org: 'RJIL North FTTX PUBLIC',
                    as: 'AS55836 Reliance Jio Infocomm Limited',
                    query: '49.36.211.99'
                })
            });
            global.fetch = mockFetch;

            const res = await IpService.lookup('49.36.211.99');
            expect(res).toBeDefined();
            expect(res.ip).toBe('49.36.211.99');
            expect(res.city).toBe('Lucknow');
            expect(res.region).toBe('Uttar Pradesh');
            expect(res.country).toBe('India');
            expect(res.isp).toBe('Reliance Jio Infocomm Limited');
            expect(res.asn).toBe('AS55836');

            // Must NOT contain any fake dummy strings
            expect(res.isp).not.toBe('Loopback Device');
            expect(res.country).not.toBe('Local Environment');
            expect(res.asn).not.toBe('AS0');
        });

        it('should return clean nulls on complete failure without fake placeholder strings', async () => {
            global.fetch = jest.fn().mockRejectedValue(new Error('Network offline'));

            const res = await IpService.lookup('99.99.99.99');
            expect(res).toBeDefined();
            expect(res.city).toBeNull();
            expect(res.isp).toBeNull();
            expect(res.asn).toBeNull();
            expect(res.summary).toBeNull();
        });
    });
});
