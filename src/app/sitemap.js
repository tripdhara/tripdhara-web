import dbConnect from '@/core/Config/db.js';
import { getPackagesBy } from '@/core/Helpers/queryHelpers.js';
import { SCHEMA_KEYS } from '@/core/Constants/categories.js';

export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://tripdhara.in';
    const now = new Date().toISOString();

    // Core Static Routes (Actual live website pages)
    const staticRoutes = [
        '',
        '/about',
        '/packages',
        '/blog',
        '/faq',
        '/contact',
        '/careers',
        '/partner',
        '/privacy',
        '/terms',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: now,
        changeFrequency: route === '' || route === '/packages' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : route === '/packages' ? 0.9 : 0.7,
    }));

    let packageRoutes = [];

    try {
        await dbConnect();

        const packageCatalogs = await getPackagesBy({});
        const schemaKeyList = Object.values(SCHEMA_KEYS);

        (packageCatalogs || []).forEach((catalog) => {
            schemaKeyList.forEach((schemaKey) => {
                const items = catalog[schemaKey];
                if (Array.isArray(items)) {
                    items.forEach((item) => {
                        if (item && item._id && item.isPublished !== false && item.isActive !== false) {
                            packageRoutes.push({
                                url: `${baseUrl}/packages/${item._id}`,
                                lastModified: item.updatedAt ? new Date(item.updatedAt).toISOString() : now,
                                changeFrequency: 'weekly',
                                priority: 0.8,
                            });
                        }
                    });
                }
            });
        });
    } catch {
        // Fallback to static routes if DB is unreachable during build
    }

    return [...staticRoutes, ...packageRoutes];
}
