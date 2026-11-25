import PackageService from '@/core/Services/Vendor/PackageService.js';
import { CATEGORY_MAP } from '@/core/Constants/categories.js';
import { HTTP_STATUS, RESPONSE_MESSAGES } from '@/core/Constants/index.js';
import Controller from '@/core/Controllers/Controller.js';
import { getBusinessByUserId, getPackageBy } from '@/core/Helpers/queryHelpers.js';
import { getVendorPackages, getVendorPackageItemById } from '@/core/Helpers/Package/vendorPackage.js';
import { parseQuery } from '@/core/Helpers/search.js';
import User from '@/core/Models/User';
import { userAuthResponse } from '@/core/Helpers/userProfileHelper';
import { NOTIFICATION } from '@/core/Constants/notification';
import PackageEvents from '@/events/PackageEvents';
import mongoose from 'mongoose';
import AppError from '@/core/Helpers/AppError';
import { Package } from '@/core/Models/index';

class PackageController extends Controller {

    // GET /vendor/packages
    async getPackages(req) {
        try {
            const userId = req.user.id;
            const options = parseQuery(req.url);
            const result = await getVendorPackages({ userId, ...options });
            const isEmpty = !result || (Array.isArray(result.items || result.data) && result.items.length === 0);
            const message = isEmpty ? RESPONSE_MESSAGES.PACKAGE.EMPTY : RESPONSE_MESSAGES.PACKAGE.FETCHED;

            if (result && result.pagination) return this.paginatedSuccess(HTTP_STATUS.OK, message, result.items || result.data, result.pagination);
            return this.success(HTTP_STATUS.OK, message, result);
        } catch (error) {
            return this.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, RESPONSE_MESSAGES.ERROR.SERVER_ERROR);
        }
    }

    // GET /vendor/package/item/:category/:itemId
    async getPackageItem(req, { params } = {}) {
        try {
            const userId = req.user.id;
            const { category, itemId } = params;
            const result = await getVendorPackageItemById(userId, category, itemId);
            if (!result) return this.error(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.ITEM.NOT_FOUND);
            return this.success(HTTP_STATUS.OK, RESPONSE_MESSAGES.SUCCESS.FETCHED, result);
        } catch (error) {
            return this.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, RESPONSE_MESSAGES.ERROR.SERVER_ERROR);
        }
    }

    // POST /vendor/package/add-item
    async addPackageItem(req, { params } = {}) {
        return this.savePackageItem(req, { params, isUpdate: false });
    }

    // PATCH /vendor/package/update-item && PUT vendor/package/:itemId/update-item
    async updatePackageItem(req, { params } = {}) {
        return this.savePackageItem(req, { params, isUpdate: true });
    }

    // Unified package saving controller logic (both addition and update)
    async savePackageItem(req, { params = {}, isUpdate } = {}) {
        try {
            const body = req.payload;
            const category = body.category;
            if (!category) return this.error(HTTP_STATUS.BAD_REQUEST, RESPONSE_MESSAGES.ITEM.CATEGORY_REQUIRED);

            const userId = req.user.id;
            const itemId = isUpdate ? (params?.itemId || body.itemId) : null;
            if (isUpdate && !itemId) return this.error(HTTP_STATUS.BAD_REQUEST, RESPONSE_MESSAGES.VALIDATION.ITEM_ID_REQUIRED);

            let result;
            let status = HTTP_STATUS.CREATED;
            let message = RESPONSE_MESSAGES.PACKAGE.CREATED;
            let eventName = NOTIFICATION.KEY.BUSINESS.PACKAGE_CREATED;
            if (isUpdate) {
                result = await PackageService.updateItem(userId, category, body, itemId);
                status = HTTP_STATUS.OK;
                message = RESPONSE_MESSAGES.PACKAGE.UPDATED;
                eventName = NOTIFICATION.KEY.BUSINESS.PACKAGE_UPDATED;
            } else {
                result = await PackageService.addItem(userId, category, body);
            }
            const user = await User.findById(req.user.id);
            const profile = await userAuthResponse(user);
            if (profile?.email) {
                PackageEvents.emitAsync(eventName, {
                    identifier: profile.email,
                    details: {
                        ...profile,
                        package: result
                    }
                });
            }
            return this.success(status, message);
        } catch (error) {
            console.log(error);
            return this.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, RESPONSE_MESSAGES.ERROR.SERVER_ERROR);
        }
    }

    // POST /vendor/package/:itemId/toggle-item
    async updatePackageStatus(req, { params } = {}) {
        try {
            const body = req.payload || {};
            const userId = req.user.id;

            const itemId = params.itemId || body.itemId;
            if (!itemId) return this.error(HTTP_STATUS.BAD_REQUEST, RESPONSE_MESSAGES.VALIDATION.ITEM_ID_REQUIRED);
            if (!mongoose.Types.ObjectId.isValid(itemId)) return this.error(HTTP_STATUS.BAD_REQUEST, RESPONSE_MESSAGES.VALIDATION.INVALID_ITEM_ID);

            const { category } = body;
            if (!category) return this.error(HTTP_STATUS.BAD_REQUEST, RESPONSE_MESSAGES.ITEM.CATEGORY_REQUIRED);

            const isActive = String(body.isActive).trim().toLowerCase() === 'true';
            const schemaKey = CATEGORY_MAP[category];
            if (!schemaKey) throw AppError.badRequest(RESPONSE_MESSAGES.CATEGORY.INVALID);

            const updated = await Package.updateOne(
                { user: userId, [`${schemaKey}._id`]: itemId },
                { $set: { [`${schemaKey}.$.isActive`]: isActive } }
            );
            if (updated.matchedCount === 0) return this.error(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.ITEM.NOT_FOUND);
            const vendor = await getBusinessByUserId(userId, '_id');
            await PackageService._invalidateCaches(vendor?._id, itemId);

            const result = await getVendorPackageItemById(userId, category, itemId);
            const eventName = isActive ? NOTIFICATION.KEY.BUSINESS.PACKAGE_ACTIVATED : NOTIFICATION.KEY.BUSINESS.PACKAGE_DEACTIVATED;

            const user = await User.findById(req.user.id);
            const profile = await userAuthResponse(user);
            if (profile?.email) {
                PackageEvents.emitAsync(eventName, {
                    identifier: profile.email,
                    details: {
                        ...profile,
                        package: result
                    }
                });
            }

            return this.success(HTTP_STATUS.OK, isActive ? RESPONSE_MESSAGES.PACKAGE.PACKAGE_ACTIVATED : RESPONSE_MESSAGES.PACKAGE.PACKAGE_DEACTIVATED);
        } catch (error) {
            const status = error.message?.toLowerCase().includes('authorized') ? HTTP_STATUS.FORBIDDEN : HTTP_STATUS.BAD_REQUEST;
            return this.error(status, error.message);
        }
    }

    // POST /vendor/package/:category/toggle
    async bulkPackageStatusByCategory(req, { params } = {}) {
        try {
            const { category } = params;

            const schemaKey = CATEGORY_MAP[category];
            if (!schemaKey) throw AppError.badRequest(RESPONSE_MESSAGES.CATEGORY.INVALID);

            const body = req.payload || {};
            const userId = req.user.id;

            const isActive = String(body.isActive).trim().toLowerCase() === 'true';

            await Package.updateOne(
                { user: userId },
                { $set: { [`${schemaKey}.$[].isActive`]: isActive } }
            );
            const vendor = await getBusinessByUserId(userId, '_id');
            await PackageService._invalidateCaches(vendor?._id);
            return this.success(HTTP_STATUS.OK, isActive ? RESPONSE_MESSAGES.PACKAGE.CATEGORY_STATUS_ACTIVATED : RESPONSE_MESSAGES.PACKAGE.CATEGORY_STATUS_DEACTIVATED);
        } catch (error) {
            return this.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message || RESPONSE_MESSAGES.ERROR.SERVER_ERROR);
        }
    }

    // DELETE /vendor/package/:itemId/delete-item
    async removePackageItem(req, { params } = {}) {
        try {
            const body = req.payload || {};
            const userId = req.user.id;

            const { itemId } = params || body;
            if (!itemId) return this.error(HTTP_STATUS.BAD_REQUEST, RESPONSE_MESSAGES.VALIDATION.ITEM_ID_REQUIRED);
            if (!mongoose.Types.ObjectId.isValid(itemId)) return this.error(HTTP_STATUS.BAD_REQUEST, RESPONSE_MESSAGES.VALIDATION.INVALID_ITEM_ID);

            const { category } = body;
            if (!category) return this.error(HTTP_STATUS.BAD_REQUEST, RESPONSE_MESSAGES.ITEM.CATEGORY_REQUIRED);

            const schemaKey = CATEGORY_MAP[category];
            if (!schemaKey) throw AppError.badRequest(RESPONSE_MESSAGES.CATEGORY.INVALID);

            const business = await getBusinessByUserId(userId);
            if (!business) return this.error(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.VENDOR.NOT_FOUND);

            const businessId = business._id.toString();

            let pkg = await getPackageBy({ user: userId, vendor: businessId }, '', null, { lean: false });
            if (!pkg) return this.error(HTTP_STATUS.BAD_REQUEST, RESPONSE_MESSAGES.CATEGORY.INVALID);

            const targetItem = pkg[schemaKey].id(itemId);
            if (!targetItem || targetItem.deletedAt) return this.error(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.ITEM.NOT_FOUND);

            targetItem.deletedAt = new Date();
            targetItem.isActive = false;
            pkg.markModified(schemaKey);
            await pkg.save();

            await PackageService._invalidateCaches(businessId, itemId);
            const result = await getVendorPackageItemById(userId, category, itemId);

            const user = await User.findById(req.user.id);
            const profile = await userAuthResponse(user);
            if (profile?.email) {
                PackageEvents.emitAsync(NOTIFICATION.KEY.BUSINESS.PACKAGE_DELETED, {
                    identifier: profile.email,
                    details: {
                        ...profile,
                        package: result
                    }
                });
            }
            return this.success(HTTP_STATUS.OK, RESPONSE_MESSAGES.SUCCESS.DELETED);
        } catch (error) {
            const status = error.message?.toLowerCase().includes('authorized') ? HTTP_STATUS.FORBIDDEN : HTTP_STATUS.BAD_REQUEST;
            return this.error(status, error.message);
        }
    }

    // DELETE /vendor/package/:category/delete
    async bulkPackageRemoveByCategory(req, { params } = {}) {
        try {
            const body = req.payload || {};
            const userId = req.user.id;

            const category = (params?.category || body?.category || '').trim();
            if (!category) return this.error(HTTP_STATUS.BAD_REQUEST, RESPONSE_MESSAGES.ITEM.CATEGORY_REQUIRED);

            const schemaKey = CATEGORY_MAP[category];
            if (!schemaKey) throw AppError.badRequest(RESPONSE_MESSAGES.CATEGORY.INVALID);

            const business = await getBusinessByUserId(userId);
            if (!business) return this.error(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.VENDOR.NOT_FOUND);

            const hasCategory = business.category?.some(c => c.slug === category);
            if (!hasCategory) return this.error(HTTP_STATUS.FORBIDDEN, RESPONSE_MESSAGES.VENDOR.UNAUTHORIZED_CATEGORY);

            const businessId = business._id.toString();

            let pkg = await getPackageBy({ user: userId, vendor: businessId }, '', null, { lean: false });
            if (!pkg) return this.error(HTTP_STATUS.BAD_REQUEST, RESPONSE_MESSAGES.CATEGORY.INVALID);

            const items = pkg[schemaKey] || [];
            const targetItems = items.filter(item => !item.deletedAt);
            if (!targetItems.length) return this.error(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.ITEM.NOT_FOUND);

            const now = new Date();
            targetItems.forEach(item => {
                item.deletedAt = now;
                item.isActive = false;
            });

            pkg.markModified(schemaKey);
            await pkg.save();
            await PackageService._invalidateCaches(businessId);
            return this.success(HTTP_STATUS.OK, RESPONSE_MESSAGES.SUCCESS.DELETED);
        } catch (error) {
            const status = error.message?.toLowerCase().includes('authorized') ? HTTP_STATUS.FORBIDDEN : HTTP_STATUS.BAD_REQUEST;
            return this.error(status, error.message);
        }
    }
}

const packageController = new PackageController();
export default packageController;
