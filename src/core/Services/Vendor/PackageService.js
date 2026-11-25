// import Package from '@/core/Models/Package.js';
import { CATEGORY_MAP } from '@/core/Constants/categories.js';
// import InventoryService from '@/core/Services/Vendor/InventoryService.js';
import { formatInventoryItem } from '@/core/Helpers/InventoryHelper.js';
// import { RESPONSE_MESSAGES } from '@/core/Constants/index.js';
import { item, vendorPackagePayload, findOrCreateCatalog } from '@/core/Helpers/package.js';
import { getPackageItemById, getBusinessById, getBusinessByUserId } from '@/core/Helpers/queryHelpers.js';
import CacheService from '@/core/Services/CacheService.js';
import { getLogger } from '@/core/Lib/logger.js';
// import { AppError } from '@/core/Errors/AppError.js';
import { clearBrowseCache } from '@/core/Helpers/Package/testBrowsePackages.js';

/**
 * PackageService (Vendor Role) - Comprehensive management of vendor catalogs and service items.
 */
class PackageService {

    // Helper: Invalidate caches across vendor & admin domains
    async _invalidateCaches(vendorId, itemId = null) {
        try {
            clearBrowseCache();
            await CacheService.del('admin:packages:all');
            await CacheService.deletePattern('admin:packages:*');
            await CacheService.deletePattern('packages:*');
            if (vendorId) {
                await CacheService.del(`admin:packages:vendor:${vendorId}`);
                await CacheService.del(`vendor:packages:${vendorId}`);
            }
            if (itemId) {
                await CacheService.del(`admin:packages:item:${itemId}`);
            }
        } catch (e) {
            getLogger().warn({ err: e, vendorId, itemId }, '[PackageService] Cache invalidation warning');
        }
    }

    // Helper: Find or Create Catalog for Vendor (Composite lookup)
    async ensureCatalog(userId, vendorId) {
        return await findOrCreateCatalog(userId, vendorId, true);
    }

    // Helper: Formats inventory items for a vendor catalog
    async _getFormattedInventory(userId, vendorId) {
        const catalog = await this.ensureCatalog(userId, vendorId);
        const vendor = await getBusinessById(vendorId, 'category');
        const vendorCategories = vendor?.category || [];

        const allItems = [];
        const itemsByCategory = {};

        const categorySlugs = new Set();
        vendorCategories.forEach(c => {
            if (c.slug) categorySlugs.add(c.slug.trim().toLowerCase());
        });

        Object.entries(CATEGORY_MAP).forEach(([slug, schemaKey]) => {
            if (Array.isArray(catalog[schemaKey]) && catalog[schemaKey].length > 0) {
                categorySlugs.add(slug);
            }
        });

        if (categorySlugs.size === 0) {
            Object.keys(CATEGORY_MAP).forEach(slug => categorySlugs.add(slug));
        }

        categorySlugs.forEach(slug => {
            const schemaKey = CATEGORY_MAP[slug] || slug;
            const categoryItems = catalog[schemaKey] || [];
            if (categoryItems.length > 0 || vendorCategories.some(c => (c.slug || '').trim().toLowerCase() === slug)) {
                const formatted = categoryItems.map(item => this._formatItem(item, slug, vendorCategories));
                const inventoryFormatted = categoryItems.map(item => formatInventoryItem(item, slug, vendorCategories));

                itemsByCategory[slug] = inventoryFormatted;
                allItems.push(...formatted);
            }
        });

        return { catalog, vendorCategories, itemsByCategory, allItems };
    }

    // Get Inventory
    async getInventory(userId, vendorId) {
        const { itemsByCategory } = await this._getFormattedInventory(userId, vendorId);
        return itemsByCategory;
    }

    // Helper to format a single catalog item
    _formatItem(item, categorySlug, vendorCategories = []) {
        return vendorPackagePayload(item, categorySlug, vendorCategories);
    }

    // Add Item
    async addItem(userId, category, data) {
        const result = await item(userId, category, data);
        const vendor = await getBusinessByUserId(userId, '_id');
        await this._invalidateCaches(vendor?._id, result?._id);
        return result;
    }

    // Update Item
    async updateItem(userId, category, data, itemId) {
        const result = await item(userId, category, data, itemId);
        const vendor = await getBusinessByUserId(userId, '_id');
        await this._invalidateCaches(vendor?._id, itemId || result?._id);
        return result;
    }

    async updateServiceItem(userId, category, data, itemId) {
        return await this.updateItem(userId, category, data, itemId);
    }

    // Find Item Details (Unified)
    async findItem(itemId) {
        return await getPackageItemById(itemId);
    }

    async getPackageItem(itemId) {
        return await this.findItem(itemId);
    }

    // =========================================================================
    // Unused / Legacy Methods (commented out after codebase usage audit)
    // =========================================================================

    /*
    // Helper: Internal catalog ownership verifier
    async _verifyOwnership(id, userId, vendorId) {
        const pkg = await fetchPackageById(id, '', null, { lean: false });
        if (!pkg) throw AppError.notFound(RESPONSE_MESSAGES.PACKAGE.CATALOG_NOT_FOUND);
        if (pkg.vendor.toString() !== vendorId.toString() || pkg.user.toString() !== userId.toString()) {
            throw AppError.forbidden(RESPONSE_MESSAGES.PACKAGE.CATALOG_UNAUTHORIZED);
        }
        return pkg;
    }

    // Get Catalog
    async getCatalog(userId, vendorId) {
        return await this.ensureCatalog(userId, vendorId);
    }

    // Find All
    async getPackages(userId, vendorId, page = 1, limit = 10) {
        return await this.findAllPaginated(userId, vendorId, page, limit);
    }

    // Find All Paginated
    async findAllPaginated(userId, vendorId, page = 1, limit = 10) {
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.max(1, parseInt(limit) || 10);

        const { catalog, allItems } = await this._getFormattedInventory(userId, vendorId);
        const total = allItems.length;
        const startIndex = (pageNum - 1) * limitNum;

        return {
            catalogId: catalog._id,
            vendorId: catalog.vendor,
            items: allItems.slice(startIndex, startIndex + limitNum),
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum) || 0
            }
        };
    }

    // Compatibility helper for tests
    async getFormattedVendorCatalog(userId, vendorId) {
        return await this.findAllPaginated(userId, vendorId);
    }

    // Create Package
    async initializeVendorPackage(userId, vendorId) {
        return await this.ensureCatalog(userId, vendorId);
    }

    // Update Package
    async updatePackage(id, userId, vendorId, data) {
        const pkg = await this._verifyOwnership(id, userId, vendorId);
        Object.assign(pkg, data);
        const saved = await pkg.save();
        await this._invalidateCaches(vendorId, id);
        return saved;
    }

    // Delete Package
    async deletePackage(id, userId, vendorId) {
        await this._verifyOwnership(id, userId, vendorId);
        const deleted = await deleteById(Package, id);
        await this._invalidateCaches(vendorId, id);
        return deleted;
    }

    // Update Package Status
    async updatePackageStatus(id, userId, vendorId, isActive) {
        const pkg = await this._verifyOwnership(id, userId, vendorId);
        pkg.isActive = isActive;
        const saved = await pkg.save();
        await this._invalidateCaches(vendorId, id);
        return saved;
    }

    async addServiceItem(userId, category, data) {
        return await this.addItem(userId, category, data);
    }

    // Remove Item
    async removeItem(userId, vendorId, category, itemId) {
        const vendor = await getBusinessById(vendorId, '_id');
        if (!vendor) throw AppError.notFound(RESPONSE_MESSAGES.VENDOR.NOT_FOUND);
        const pkg = await getPackageBy({ user: userId, vendor: vendorId }, '', null, { lean: false });
        if (!pkg) throw AppError.notFound(RESPONSE_MESSAGES.PACKAGE.CATALOG_NOT_FOUND);

        const schemaKey = CATEGORY_MAP[category] || category;
        if (pkg[schemaKey] === undefined) {
            throw AppError.badRequest(RESPONSE_MESSAGES.CATEGORY.INVALID);
        }

        pkg[schemaKey].pull({ _id: itemId });
        await pkg.save();
        await this._invalidateCaches(vendorId, itemId);
        return { itemId, deleted: true };
    }

    // Update range (Vendor Management)
    async updateRange(userId, vendorId, itemId, serviceType, startDate, endDate, settings) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const updates = [];
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            updates.push({ date: new Date(d), ...settings });
        }
        const res = await InventoryService.update(vendorId, itemId, serviceType, updates);
        await this._invalidateCaches(vendorId, itemId);
        return res;
    }

    // Update category range (Vendor Management)
    async updateCategoryRange(userId, vendorId, serviceType, startDate, endDate, settings) {
        const pkg = await getPackageBy({ user: userId, vendor: vendorId });
        if (!pkg || !pkg[serviceType]) return null;

        const results = [];
        for (const item of pkg[serviceType]) {
            const res = await this.updateRange(userId, vendorId, item._id, serviceType, startDate, endDate, settings);
            results.push(res);
        }
        await this._invalidateCaches(vendorId);
        return results;
    }

    // Toggle Category Status (Bulk)
    async toggleCategoryStatus(userId, vendorId, category, isActive) {
        const vendor = await getBusinessById(vendorId, '_id');
        if (!vendor) throw AppError.notFound(RESPONSE_MESSAGES.VENDOR.NOT_FOUND);
        const pkg = await getPackageBy({ user: userId, vendor: vendorId }, '', null, { lean: false });
        if (!pkg) throw AppError.notFound(RESPONSE_MESSAGES.PACKAGE.CATALOG_NOT_FOUND);

        const schemaKey = CATEGORY_MAP[category] || category;
        if (pkg[schemaKey] === undefined) throw AppError.badRequest(RESPONSE_MESSAGES.ERROR.INVALID_CATEGORY);

        pkg[schemaKey].forEach(item => {
            item.isActive = isActive;
        });

        const saved = await pkg.save();
        await this._invalidateCaches(vendorId);
        return saved;
    }

    // Helper for controller
    async getPackageById(id) {
        return await fetchPackageById(id);
    }
    */
}

export default new PackageService();
