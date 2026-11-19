import Vendor from '@/core/Models/Vendor.js';
import Category from '@/core/Models/Category.js';
import CategoryDocument from '@/core/Models/CategoryDocument.js';
import VendorDocument from '@/core/Models/VendorDocument.js';
import { uploadToCloudinary } from '@/core/Helpers/cloudinary.js';
import { RESPONSE_MESSAGES, VERIFICATION_STATUS } from '@/core/Constants/index.js';
import CacheService from '@/core/Services/CacheService.js';
import { getBusinessByUserId, getVendorDocumentsBy, getCategoriesBy, getCategoryBy, getCategoryDocumentsBy, getBusinessBy } from '@/core/Helpers/queryHelpers.js';
import { evaluateCategoryDocumentStatus } from '@/core/Helpers/categoryHelper.js';
import { AppError } from '@/core/Errors/AppError.js';

/**
 * CategoryService (Vendor Scope) - Facilitates the lifecycle of business
 * classification and category-specific compliance.
 */
class CategoryService {

    // Helper to invalidate vendor profile caches
    async invalidateVendorCaches(userId, vendorId = null) {
        await CacheService.del('admin:vendors:all');
        await CacheService.del('admin:dashboard:stats');
        if (userId) {
            await CacheService.del(`admin:vendors:${userId}`);
            await CacheService.del(`user:profile:${userId}`);
        }
        if (vendorId) {
            await CacheService.del(`admin:vendors:${vendorId}`);
        }
    }

    // List categories currently assigned to the vendor along with document status summary
    async getAssignedCategories(userId) {
        const vendor = await getBusinessByUserId(userId);
        if (!vendor || !vendor.category || vendor.category.length === 0) return [];

        const assignedSlugs = vendor.category.map(c => c.slug);
        const dbCategories = await getCategoriesBy({ slug: { $in: assignedSlugs } }, '_id name slug');
        const docs = await getVendorDocumentsBy({ user: userId, vendor: vendor._id }, 'category_slug document_slug url status rejection_reason issue_date expiry_date createdAt');
        const categoryReqs = await getCategoryDocumentsBy({ isActive: true }, 'name slug category_slug');

        return vendor.category.map(cat => {
            const dbCat = dbCategories.find(c => c.slug === cat.slug);
            const categoryObj = {
                _id: dbCat?._id || cat._id || cat.id,
                name: dbCat?.name || cat.name,
                slug: cat.slug
            };
            const catDocs = docs.filter(d => d.category_slug === cat.slug);
            const catReqs = categoryReqs.filter(r => r.category_slug === cat.slug);
            return evaluateCategoryDocumentStatus(categoryObj, catDocs, catReqs);
        });
    }

    // Assign a new business category to vendor profile
    async assignCategoryToVendor(userId, categoryData) {
        const slug = categoryData.slug || categoryData;

        // Fetch category from database instead of constants
        const categoryDoc = await getCategoryBy({ slug, isActive: true });
        if (!categoryDoc) {
            throw AppError.badRequest(RESPONSE_MESSAGES.CATEGORY.INVALID);
        }

        // Check if vendor profile exists
        const vendor = await Vendor.findOne({ user: userId, deletedAt: null });
        if (!vendor) throw AppError.notFound(RESPONSE_MESSAGES.VENDOR.NOT_FOUND);

        // Check if vendor already has this category assigned
        const isDuplicate = vendor.category?.some(c => c.slug === slug);
        if (isDuplicate) {
            throw AppError.conflict(RESPONSE_MESSAGES.CATEGORY.ALREADY_ASSIGNED);
        }

        vendor.category.push({
            slug: categoryDoc.slug,
            name: categoryDoc.name
        });

        const saved = await vendor.save();
        await this.invalidateVendorCaches(userId, vendor._id);
        return saved;
    }

    // Remove a business category from vendor profile
    async removeCategoryFromVendor(userId, categorySlug) {
        const vendor = await Vendor.findOneAndUpdate(
            { user: userId, deletedAt: null },
            { $pull: { category: { slug: categorySlug } } },
            { returnDocument: 'after' }
        );
        if (vendor) {
            await this.invalidateVendorCaches(userId, vendor._id);
        }
        return vendor;
    }

    // Get list of categories that the vendor hasn't chosen yet
    async getEligibleCategories(userId) {
        const allCategories = await getCategoriesBy({ isActive: true }, 'name slug description');
        const vendor = await getBusinessBy({ user: userId, deletedAt: null });
        const assignedSlugs = vendor?.category?.map(c => c.slug) || [];
        return allCategories.filter(category => !assignedSlugs.includes(category.slug));
    }

    // Get real document requirements for a specific category (Only if assigned)
    async getDocuments(userId, categorySlug) {
        const vendor = await getBusinessByUserId(userId, 'category');
        const isAssigned = vendor?.category?.some(c => c.slug === categorySlug);
        if (!isAssigned) {
            throw AppError.badRequest(RESPONSE_MESSAGES.CATEGORY.NOT_ASSIGNED);
        }
        return await this.getRequirementsBySlug(categorySlug);
    }

    // Get list of required documents for any category (Bypasses assignment check)
    async getRequirementsBySlug(categorySlug) {
        const dbDocs = await getCategoryDocumentsBy({ category_slug: categorySlug, isActive: true }, 'name slug isMandatory');
        return dbDocs;
    }

    // Submit/Upload documents for a specific category
    async uploadDocuments(userId, categorySlug, req) {
        const vendor = await getBusinessByUserId(userId, '_id');
        const { document_slug = [], image = [], issue_date = [], expiry_date = [] } = req.payload;

        const uploadPromises = document_slug.map((docSlug, index) =>
            VendorDocument.findOneAndUpdate(
                {
                    user: userId,
                    vendor: vendor._id,
                    category_slug: categorySlug,
                    document_slug: docSlug,
                },
                {
                    $set: {
                        url: image[index],
                        issue_date: issue_date[index] || null,
                        expiry_date: expiry_date[index] || null,
                        status: VERIFICATION_STATUS.PENDING
                    }
                },
                { upsert: true, returnDocument: 'after' }
            )
        );

        const results = await Promise.all(uploadPromises);
        await this.invalidateVendorCaches(userId, vendor._id);
        return results;
    }

    // Get list of all documents already uploaded by the vendor across all categories
    async getUploadedDocuments(userId) {
        const vendor = await getBusinessByUserId(userId, '_id');
        if (!vendor) throw AppError.notFound(RESPONSE_MESSAGES.VENDOR.NOT_FOUND);
        return await getVendorDocumentsBy({
            user: userId,
            vendor: vendor._id
        }, 'category_slug document_slug url status rejection_reason createdAt');
    }
}

export default new CategoryService();
