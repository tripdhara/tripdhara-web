import CategoryService from '@/core/Services/Vendor/CategoryService.js';
import { HTTP_STATUS, RESPONSE_MESSAGES } from '@/core/Constants/index.js';
import Controller from '@/core/Controllers/Controller.js';
import CategoryEvents from '@/events/CategoryEvents';
import { NOTIFICATION } from '@/core/Constants/notification';
import User from '@/core/Models/User';
import { userAuthResponse } from '@/core/Helpers/userProfileHelper';

/**
 * CategoryController (Vendor Role) - Specialized management of
 * business-specific taxonomies and category verification documents.
 */
class CategoryController extends Controller {

    // GET /vendor/category/
    async getCategories(req) {
        try {
            const categories = await CategoryService.getAssignedCategories(req.user.id);
            return this.success(HTTP_STATUS.OK, RESPONSE_MESSAGES.VENDOR.CATEGORIES_FETCHED, categories);
        } catch (error) {
            return this.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, RESPONSE_MESSAGES.ERROR.SERVER_ERROR);
        }
    }

    // POST /vendor/category/
    async assignCategory(req) {
        try {
            const body = req.payload;
            const updatedVendor = await CategoryService.assignCategoryToVendor(req.user.id, body);
            return this.success(HTTP_STATUS.OK, RESPONSE_MESSAGES.CATEGORY.ADDED, updatedVendor.category);
        } catch (error) {
            return this.error(HTTP_STATUS.BAD_REQUEST, RESPONSE_MESSAGES.ERROR.SERVER_ERROR);
        }
    }

    // DELETE /vendor/category/:slug
    async removeCategory(req, { params }) {
        try {
            const slug = params.slug || req.payload.slug;
            const updatedVendor = await CategoryService.removeCategoryFromVendor(req.user.id, slug);
            return this.success(HTTP_STATUS.OK, RESPONSE_MESSAGES.CATEGORY.REMOVED, updatedVendor.category);
        } catch (error) {
            return this.error(HTTP_STATUS.BAD_REQUEST, RESPONSE_MESSAGES.ERROR.SERVER_ERROR);
        }
    }

    // GET /vendor/category/eligible (Retrieve unassigned categories for the vendor)
    async getEligibleCategories(req) {
        try {
            const categories = await CategoryService.getEligibleCategories(req.user.id);
            return this.success(HTTP_STATUS.OK, RESPONSE_MESSAGES.VENDOR.ELIGIBLE_CATEGORIES_FETCHED, categories);
        } catch (error) {
            return this.error(HTTP_STATUS.BAD_REQUEST, RESPONSE_MESSAGES.ERROR.SERVER_ERROR);
        }
    }

    // GET /vendor/category/documents (Retrieve document requirements)
    async getCategoryDocuments(req, { params } = {}) {
        try {
            const slug = params.slug || (req.payload && (req.payload.slug || req.payload.category_slug));
            if (!slug) return this.error(HTTP_STATUS.BAD_REQUEST, RESPONSE_MESSAGES.VALIDATION.REQUIRED_FIELDS);

            const docs = await CategoryService.getDocuments(req.user.id, slug);
            return this.success(HTTP_STATUS.OK, RESPONSE_MESSAGES.VENDOR.CATEGORY_DOCS_FETCHED, docs);
        } catch (error) {
            return this.error(HTTP_STATUS.BAD_REQUEST, RESPONSE_MESSAGES.ERROR.SERVER_ERROR);
        }
    }

    // GET /vendor/category/requirements/:slug (Fetch documents without assignment check)
    async getCategoryRequirements(req, { params }) {
        try {
            const slug = params.slug;
            if (!slug) return this.error(HTTP_STATUS.BAD_REQUEST, RESPONSE_MESSAGES.VALIDATION.REQUIRED_FIELDS);

            const docs = await CategoryService.getRequirementsBySlug(slug);
            return this.success(HTTP_STATUS.OK, RESPONSE_MESSAGES.VENDOR.CATEGORY_DOCS_LIST_FETCHED, docs);
        } catch (error) {
            return this.error(HTTP_STATUS.BAD_REQUEST, RESPONSE_MESSAGES.ERROR.SERVER_ERROR);
        }
    }

    // POST /vendor/category/documents/upload
    async uploadDocuments(req, { params } = {}) {
        try {
            const slug = params.slug || (req.payload && (req.payload.slug || req.payload.category_slug));
            if (!slug) return this.error(HTTP_STATUS.BAD_REQUEST, RESPONSE_MESSAGES.VALIDATION.REQUIRED_FIELDS);
            const result = await CategoryService.uploadDocuments(req.user.id, slug, req);
            // 2. Full Business/User Profile fetch karein taaki account object ban sake
            const user = await User.findById(req.user.id);
            const profile = await userAuthResponse(user);
            // 3. Event emit karein
            if (profile?.email) {
                CategoryEvents.emitAsync(NOTIFICATION.KEY.BUSINESS.CATEGORY_DOCUMENT_UPLOADED, {
                    identifier: profile.email,
                    details: {
                        ...profile,
                        category_slug: slug,
                        documents: result
                    }
                });
            }
            return this.success(HTTP_STATUS.OK, RESPONSE_MESSAGES.VENDOR.CATEGORY_DOCS_UPLOADED);
        } catch (error) {
            console.log('error', error)
            return this.error(HTTP_STATUS.BAD_REQUEST, RESPONSE_MESSAGES.ERROR.SERVER_ERROR);
        }
    }

    // GET /vendor/category/documents/uploaded (Retrieve all submitted compliance files for the vendor)
    async getUploadedDocuments(req) {
        try {
            const docs = await CategoryService.getUploadedDocuments(req.user.id);
            return this.success(HTTP_STATUS.OK, RESPONSE_MESSAGES.VENDOR.CATEGORY_DOCS_ALL_FETCHED, docs);
        } catch (error) {
            return this.error(HTTP_STATUS.BAD_REQUEST, RESPONSE_MESSAGES.ERROR.SERVER_ERROR);
        }
    }
}

const categoryController = new CategoryController();
export default categoryController;
