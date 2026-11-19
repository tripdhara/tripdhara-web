import { uploadToCloudinary } from '@/core/Helpers/cloudinary.js';
import { RESPONSE_MESSAGES, VERIFICATION_STATUS } from '@/core/Constants/index.js';
import Vendor from '@/core/Models/Vendor.js';
import User from '@/core/Models/User.js';
import CacheService from '@/core/Services/CacheService.js';
import { AppError } from '@/core/Errors/AppError.js';
import { getBusinessByUserId } from '@/core/Helpers/queryHelpers.js';
import { userAuthResponse } from '@/core/Helpers/userProfileHelper.js';

class DocumentService {
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

    async uploadVerificationFiles(userId, payload) {
        const vendor = await getBusinessByUserId(userId, '_id');
        if (!vendor) throw AppError.notFound(RESPONSE_MESSAGES.VENDOR.NOT_FOUND);

        const updatePayload = {};
        if (payload.aadharCard) {
            updatePayload['documents.aadharCard'] = payload.aadharCard.map(url => ({
                url,
                status: VERIFICATION_STATUS.PENDING
            }));
        }

        const singleDocs = ['panCard', 'businessRegistration', 'gstRegistration'];
        for (const key of singleDocs) {
            if (payload[key]) {
                updatePayload[`documents.${key}`] = {
                    url: payload[key],
                    status: VERIFICATION_STATUS.PENDING
                };
            }
        }

        const updatedVendor = await Vendor.findOneAndUpdate(
            { _id: vendor._id },
            { $set: updatePayload },
            { returnDocument: 'after' }
        );
        if (updatedVendor) {
            await this.invalidateVendorCaches(userId, vendor._id);
        }
        const user = await User.findById(userId);
        return userAuthResponse(user);
    }

    /**
     * Update specific document metadata or replace file
     */
    async updateDocument(userId, updateData) {
        const vendor = await Vendor.findOneAndUpdate(
            { user: userId },
            { $set: { "documents.$[elem]": updateData.fileData } },
            { arrayFilters: [{ "elem._id": updateData.id }], returnDocument: 'after' }
        );
        if (vendor) {
            await this.invalidateVendorCaches(userId, vendor._id);
        }
        return vendor ? vendor.documents : null;
    }

    /**
     * Remove a document from the business profile
     */
    async deleteDocument(userId, documentId) {
        const vendor = await Vendor.findOneAndUpdate(
            { user: userId },
            { $pull: { "documents.aadharCard": { _id: documentId } } },
            { returnDocument: 'after' }
        );
        if (vendor) {
            await this.invalidateVendorCaches(userId, vendor._id);
        }
        return vendor ? vendor.documents : null;
    }

    // --- INDUSTRY STANDARD ALIASES ---
    async removeDocument(...args) { return this.deleteDocument(...args); }
}

export default new DocumentService();
