import dbConnect from '@/core/Config/db.js';
import Package from '@/core/Models/Package.js';
import Category from '@/core/Models/Category.js';
import Blog from '@/core/Models/Blog.js';
import { SCHEMA_KEYS } from '@/core/Constants/categories.js';

export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://tripdhara.in';
    const now = new Date().toISOString();

    // 1. All Static Public Pages across Tripdhara
    const staticRoutes = [
        // Core Hubs & Experience Pillars
        { path: '', priority: 1.0, changeFrequency: 'daily' },
        { path: '/packages', priority: 0.9, changeFrequency: 'daily' },
        { path: '/accommodation', priority: 0.9, changeFrequency: 'daily' },
        { path: '/activities', priority: 0.9, changeFrequency: 'daily' },
        { path: '/rental', priority: 0.9, changeFrequency: 'daily' },
        { path: '/yatra', priority: 0.9, changeFrequency: 'daily' },
        { path: '/blog', priority: 0.8, changeFrequency: 'daily' },

        // Company, Careers & Support Hubs
        { path: '/about', priority: 0.7, changeFrequency: 'weekly' },
        { path: '/careers', priority: 0.7, changeFrequency: 'weekly' },
        { path: '/partner', priority: 0.7, changeFrequency: 'weekly' },
        { path: '/contact', priority: 0.7, changeFrequency: 'weekly' },
        { path: '/faq', priority: 0.7, changeFrequency: 'weekly' },

        // Compliance, Legal & Operational Policies
        { path: '/privacy', priority: 0.5, changeFrequency: 'monthly' },
        { path: '/terms', priority: 0.5, changeFrequency: 'monthly' },
        { path: '/grievance', priority: 0.5, changeFrequency: 'monthly' },
        { path: '/cancellation', priority: 0.5, changeFrequency: 'monthly' },
        { path: '/refund', priority: 0.5, changeFrequency: 'monthly' },
        { path: '/shipping', priority: 0.5, changeFrequency: 'monthly' },
        { path: '/rental-policy', priority: 0.5, changeFrequency: 'monthly' },
        { path: '/eco-policy', priority: 0.5, changeFrequency: 'monthly' },
        { path: '/permit-policy', priority: 0.5, changeFrequency: 'monthly' },
        { path: '/safety-policy', priority: 0.5, changeFrequency: 'monthly' },
        { path: '/vendor-terms', priority: 0.5, changeFrequency: 'monthly' },
    ].map(({ path, priority, changeFrequency }) => ({
        url: `${baseUrl}${path}`,
        lastModified: now,
        changeFrequency,
        priority,
    }));

    let packageRoutes = [];
    let categoryRoutes = [];
    let blogRoutes = [];

    try {
        await dbConnect();

        // 2. Dynamic Experience Packages (/packages/[id])
        const packageCatalogs = await Package.find({}).lean();
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

        // 3. Dynamic Curated Category Routes (/packages?category=[slug])
        const categories = await Category.find({ isActive: { $ne: false } }).select('slug updatedAt').lean();
        (categories || []).forEach((cat) => {
            if (cat?.slug) {
                categoryRoutes.push({
                    url: `${baseUrl}/packages?category=${cat.slug}`,
                    lastModified: cat.updatedAt ? new Date(cat.updatedAt).toISOString() : now,
                    changeFrequency: 'weekly',
                    priority: 0.8,
                });
            }
        });

        // 4. Dynamic Field Guide Articles (/blog/[slug])
        const blogs = await Blog.find({ status: 'published' }).select('slug updatedAt publishedAt').lean();
        (blogs || []).forEach((b) => {
            if (b?.slug) {
                blogRoutes.push({
                    url: `${baseUrl}/blog/${b.slug}`,
                    lastModified: b.updatedAt ? new Date(b.updatedAt).toISOString() : b.publishedAt ? new Date(b.publishedAt).toISOString() : now,
                    changeFrequency: 'weekly',
                    priority: 0.7,
                });
            }
        });
    } catch {
        // Fallback gracefully to static routes if DB is unreachable during build
    }

    return [...staticRoutes, ...categoryRoutes, ...blogRoutes, ...packageRoutes];
}
