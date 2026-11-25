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
import { getLogger } from '@/core/Lib/logger.js';

class PackageController extends Controller {

    /**
     * Production-safe error handler: exposes only operational AppError messages,
     * hides internal/DB errors behind generic SERVER_ERROR.
     */
    _handleError(error, context = 'PackageController') {
        if (error?.isOperational) {
            return this.error(error.statusCode, error.message);
        }
        getLogger().error({ err: error }, `[${context}] Unexpected error`);
        return this.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, RESPONSE_MESSAGES.ERROR.SERVER_ERROR);
    }

    /**
     * Dispatches package notifications asynchronously without failing the main request.
     */
    async _emitPackageEvent(userId, eventName, pkgResult) {
        if (!pkgResult) return;
        try {
            const user = await User.findById(userId);
            const profile = await userAuthResponse(user);
            if (profile?.email) {
                await PackageEvents.emitAsync(eventName, {
                    identifier: profile.email,
                    details: {
                        ...profile,
                        package: pkgResult
                    }
                });
            }
        } catch (err) {
            getLogger().error({ err, eventName, userId }, '[PackageController] Notification dispatch error');
        }
    }

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
            return this._handleError(error, 'getPackages');
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
            return this._handleError(error, 'getPackageItem');
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

            this._emitPackageEvent(userId, eventName, result);
            return this.success(status, message);
        } catch (error) {
            return this._handleError(error, 'savePackageItem');
        }
    }

    // POST /vendor/package/:itemId/toggle-item
    async updatePackageStatus(req, { params } = {}) {
        try {
            const body = req.payload || {};
            const userId = req.user.id;

            const itemId = params?.itemId || body.itemId;
            if (!itemId) return this.error(HTTP_STATUS.BAD_REQUEST, RESPONSE_MESSAGES.VALIDATION.ITEM_ID_REQUIRED);
            if (!mongoose.Types.ObjectId.isValid(itemId)) return this.error(HTTP_STATUS.BAD_REQUEST, RESPONSE_MESSAGES.VALIDATION.INVALID_ITEM_ID);

            const { category } = body;
            if (!category) return this.error(HTTP_STATUS.BAD_REQUEST, RESPONSE_MESSAGES.ITEM.CATEGORY_REQUIRED);

            const isActive = String(body.isActive).trim().toLowerCase() === 'true';
            const schemaKey = CATEGORY_MAP[category];
            if (!schemaKey) throw AppError.badRequest(RESPONSE_MESSAGES.CATEGORY.INVALID);

            const updated = await Package.updateOne(
                { user: userId, [schemaKey]: { $elemMatch: { _id: itemId, deletedAt: null } } },
                { $set: { [`${schemaKey}.$.isActive`]: isActive } }
            );
            if (updated.matchedCount === 0) return this.error(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.ITEM.NOT_FOUND);
            const vendor = await getBusinessByUserId(userId, '_id');
            await PackageService._invalidateCaches(vendor?._id, itemId);

            const result = await getVendorPackageItemById(userId, category, itemId);
            const eventName = isActive ? NOTIFICATION.KEY.BUSINESS.PACKAGE_ACTIVATED : NOTIFICATION.KEY.BUSINESS.PACKAGE_DEACTIVATED;
            this._emitPackageEvent(userId, eventName, result);

            return this.success(HTTP_STATUS.OK, isActive ? RESPONSE_MESSAGES.PACKAGE.PACKAGE_ACTIVATED : RESPONSE_MESSAGES.PACKAGE.PACKAGE_DEACTIVATED);
        } catch (error) {
            return this._handleError(error, 'updatePackageStatus');
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

            const business = await getBusinessByUserId(userId, '_id category');
            if (!business) return this.error(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.VENDOR.NOT_FOUND);

            const hasCategory = business.category?.some(c => c.slug === category);
            if (!hasCategory) return this.error(HTTP_STATUS.FORBIDDEN, RESPONSE_MESSAGES.VENDOR.UNAUTHORIZED_CATEGORY);

            const isActive = String(body.isActive).trim().toLowerCase() === 'true';

            const updated = await Package.updateOne(
                { user: userId },
                { $set: { [`${schemaKey}.$[elem].isActive`]: isActive } },
                { arrayFilters: [{ 'elem.deletedAt': null }] }
            );
            if (updated.matchedCount === 0) return this.error(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.ITEM.NOT_FOUND);

            await PackageService._invalidateCaches(business._id);

            const categoryName = business.category?.find(c => c.slug === category)?.name || category;
            const eventName = isActive ? NOTIFICATION.KEY.BUSINESS.PACKAGE_BULK_ACTIVATED : NOTIFICATION.KEY.BUSINESS.PACKAGE_BULK_DEACTIVATED;
            this._emitPackageEvent(userId, eventName, {
                id: business._id.toString(),
                category_name: categoryName,
                totalCount: updated.modifiedCount,
                isActive
            });

            return this.success(HTTP_STATUS.OK, isActive ? RESPONSE_MESSAGES.PACKAGE.CATEGORY_STATUS_ACTIVATED : RESPONSE_MESSAGES.PACKAGE.CATEGORY_STATUS_DEACTIVATED);
        } catch (error) {
            return this._handleError(error, 'bulkPackageStatusByCategory');
        }
    }

    // DELETE /vendor/package/:itemId/delete-item
    async removePackageItem(req, { params } = {}) {
        try {
            const body = req.payload || {};
            const userId = req.user.id;

            const itemId = params?.itemId || body.itemId;
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
            this._emitPackageEvent(userId, NOTIFICATION.KEY.BUSINESS.PACKAGE_DELETED, result);

            return this.success(HTTP_STATUS.OK, RESPONSE_MESSAGES.SUCCESS.DELETED);
        } catch (error) {
            return this._handleError(error, 'removePackageItem');
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
            return this._handleError(error, 'bulkPackageRemoveByCategory');
        }
    }
}

const packageController = new PackageController();
export default packageController;
