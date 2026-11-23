import CacheService from './CacheService.js';
import { getLogger } from '@/core/Lib/logger.js';

// In-memory cache for fast lookup (24 hours TTL)
const memoryCache = new Map();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

class IpService {
    /**
     * Determines whether an IP is loopback or RFC1918 private subnet.
     */
    isPrivateOrLocal(ip) {
        if (!ip) return true;
        const clean = ip.trim();
        if (clean === '127.0.0.1' || clean === '::1' || clean === 'localhost') return true;
        // RFC1918 private IPv4 ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
        if (/^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/.test(clean)) return true;
        // IPv6 link-local (fe80::) or unique local (fc00::, fd00::)
        if (/^(fe80:|fc00:|fd00:)/i.test(clean)) return true;
        return false;
    }

    /**
     * Analyzes ASN, ISP, and provider metadata to detect datacenter IPs, hosting providers, or proxies.
     */
    detectHostingOrProxy(data) {
        if (!data) return { isProxyOrHosting: false, threatScore: 0, riskLevel: 'LOW', riskFlags: [] };
        const riskFlags = [];
        let threatScore = 0;

        if (data.proxy) {
            riskFlags.push('ANONYMOUS_PROXY');
            threatScore += 50;
        }
        if (data.hosting) {
            riskFlags.push('HOSTING_PROVIDER');
            threatScore += 35;
        }

        const ispOrgAs = `${data.isp || ''} ${data.org || ''} ${data.as || ''} ${data.asnName || ''}`.toLowerCase();
        const hostingKeywords = [
            'amazon', 'aws', 'google cloud', 'gcp', 'digitalocean', 'hetzner', 'ovh',
            'linode', 'azure', 'microsoft', 'oracle', 'leaseweb', 'm247', 'datacamp',
            'vpn', 'tor', 'private internet access', 'nordvpn', 'expressvpn', 'choopa',
            'vultr', 'alibaba', 'cloudflare'
        ];

        if (hostingKeywords.some(k => ispOrgAs.includes(k))) {
            if (!riskFlags.includes('HOSTING_PROVIDER')) riskFlags.push('DATACENTER_IP');
            threatScore = Math.max(threatScore, 40);
        }

        const isProxyOrHosting = threatScore >= 35;
        const riskLevel = threatScore >= 60 ? 'HIGH' : (threatScore >= 30 ? 'MEDIUM' : 'LOW');

        return {
            isProxyOrHosting,
            threatScore,
            riskLevel,
            riskFlags
        };
    }

    /**
     * Performs an accurate geolocation & ISP lookup for a public IP address.
     * If an IP is a private subnet or loopback, it is strictly NOT queried to public GeoIP
     * and NOT overwritten by the host machine's public IP.
     */
    async lookup(ip) {
        if (!ip) return null;
        const cleanIp = ip.trim();

        // 1. Private subnets (RFC 1918) and Loopback have no public GeoIP or ISP
        if (this.isPrivateOrLocal(cleanIp)) {
            const isLocal = cleanIp === '127.0.0.1' || cleanIp === '::1' || cleanIp === 'localhost';
            return {
                ip: cleanIp,
                isPrivate: !isLocal,
                isLocal,
                city: null,
                region: null,
                country: null,
                countryCode: null,
                postalCode: null,
                latitude: null,
                longitude: null,
                timezone: null,
                isp: null,
                asn: null,
                asnName: null,
                summary: null,
                security: {
                    threatScore: 0,
                    riskLevel: 'LOW',
                    isProxyOrHosting: false,
                    riskFlags: isLocal ? ['LOOPBACK'] : ['PRIVATE_SUBNET']
                }
            };
        }

        const cacheKey = `ip:geo:${cleanIp}`;

        // 2. Check in-memory cache
        const memEntry = memoryCache.get(cacheKey);
        if (memEntry && Date.now() - memEntry.timestamp < CACHE_TTL_MS) {
            return memEntry.data;
        }

        // 3. Check Redis cache
        try {
            const cached = await CacheService.get(cacheKey);
            if (cached) {
                memoryCache.set(cacheKey, { timestamp: Date.now(), data: cached });
                return cached;
            }
        } catch {
            // Redis error handled silently
        }

        // 4. Primary Lookup: ip-api.com for public IPs
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 3000);

            const url = `http://ip-api.com/json/${cleanIp}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query,proxy,hosting`;
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeout);

            if (response.ok) {
                const data = await response.json();
                if (data && data.status === 'success') {
                    const security = this.detectHostingOrProxy(data);
                    const info = {
                        ip: data.query || cleanIp,
                        isPrivate: false,
                        isLocal: false,
                        city: data.city || null,
                        region: data.regionName || data.region || null,
                        country: data.country || null,
                        countryCode: data.countryCode || null,
                        postalCode: data.zip || null,
                        latitude: data.lat || null,
                        longitude: data.lon || null,
                        timezone: data.timezone || null,
                        isp: data.isp || data.org || null,
                        asn: data.as ? data.as.split(' ')[0] : null,
                        asnName: data.as || null,
                        summary: [data.city, data.regionName, data.country].filter(Boolean).join(', ') || null,
                        security
                    };

                    memoryCache.set(cacheKey, { timestamp: Date.now(), data: info });
                    CacheService.set(cacheKey, info, 86400).catch(() => {});
                    return info;
                }
            }
        } catch (error) {
            getLogger().debug({ ip: cleanIp, err: error.message }, '[IpService] Primary IP query failed, trying secondary');
        }

        // 5. Secondary Lookup: ipwho.is (HTTPS fallback)
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 3000);

            const url = `https://ipwho.is/${cleanIp}`;
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeout);

            if (response.ok) {
                const data = await response.json();
                if (data && data.success) {
                    const security = this.detectHostingOrProxy({
                        isp: data.connection?.isp,
                        org: data.connection?.org,
                        as: data.connection?.asn ? `AS${data.connection.asn}` : ''
                    });

                    const info = {
                        ip: data.ip || cleanIp,
                        isPrivate: false,
                        isLocal: false,
                        city: data.city || null,
                        region: data.region || null,
                        country: data.country || null,
                        countryCode: data.country_code || null,
                        postalCode: data.postal || null,
                        latitude: data.latitude || null,
                        longitude: data.longitude || null,
                        timezone: data.timezone?.id || null,
                        isp: data.connection?.isp || data.connection?.org || null,
                        asn: data.connection?.asn ? `AS${data.connection.asn}` : null,
                        asnName: data.connection?.org || null,
                        summary: [data.city, data.region, data.country].filter(Boolean).join(', ') || null,
                        security
                    };

                    memoryCache.set(cacheKey, { timestamp: Date.now(), data: info });
                    CacheService.set(cacheKey, info, 86400).catch(() => {});
                    return info;
                }
            }
        } catch (error) {
            getLogger().debug({ ip: cleanIp, err: error.message }, '[IpService] Secondary IP query failed');
        }

        // Clean return with nulls when offline
        return {
            ip: cleanIp,
            isPrivate: false,
            isLocal: false,
            city: null,
            region: null,
            country: null,
            countryCode: null,
            postalCode: null,
            latitude: null,
            longitude: null,
            timezone: null,
            isp: null,
            asn: null,
            asnName: null,
            summary: null,
            security: {
                threatScore: 0,
                riskLevel: 'LOW',
                isProxyOrHosting: false,
                riskFlags: []
            }
        };
    }
}

export default new IpService();
