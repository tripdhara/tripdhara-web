import DocumentService from '@/core/Services/Vendor/DocumentService.js';
import BusinessService from '@/core/Services/Vendor/BusinessService.js';
import { HTTP_STATUS, RESPONSE_MESSAGES } from '@/core/Constants/index.js';
import Controller from '@/core/Controllers/Controller.js';
import BusinessEvents from '@/events/BusinessEvents.js';
import { NOTIFICATION } from '@/core/Constants/notification';

/**
 * BusinessDocumentController (Vendor Role) - Specialized management of
 * business verification files and identity compliance.
 */
class BusinessDocumentController extends Controller {

    // GET /vendor/business/documents
    async getDocuments(req) {
        try {
            const vendor = await BusinessService.getBusinessByUserId(req.user.id);
            if (!vendor) return this.error(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.VENDOR.NOT_FOUND);
            return this.success(HTTP_STATUS.OK, RESPONSE_MESSAGES.VENDOR.DOCUMENTS_FETCHED, vendor.documents);
        } catch (error) {
            return this.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, RESPONSE_MESSAGES.ERROR.SERVER_ERROR);
        }
    }

    // POST /vendor/business/documents/upload
    async uploadDocuments(req) {
        try {
            const body = req.payload;
            const userId = req.user.id;
            const result = await DocumentService.uploadVerificationFiles(userId, body);
            if (result?.email) BusinessEvents.emit(NOTIFICATION.KEY.BUSINESS.DOCUMENT_UPLOADED, { identifier: result.email, details: result });
            return this.success(HTTP_STATUS.OK, RESPONSE_MESSAGES.VENDOR.DOCUMENTS_UPLOADED, result);
        } catch (error) {
            return this.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, RESPONSE_MESSAGES.ERROR.SERVER_ERROR);
        }
    }

    // PATCH /vendor/business/documents/update
    async updateDocument(req) {
        try {
            const body = req.payload;
            const result = await DocumentService.updateDocument(req.user.id, body);
            return this.success(HTTP_STATUS.OK, RESPONSE_MESSAGES.VENDOR.DOCUMENT_UPDATED, result);
        } catch (error) {
            return this.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, RESPONSE_MESSAGES.ERROR.SERVER_ERROR);
        }
    }

    // DELETE /vendor/business/documents/delete
    async deleteDocument(req) {
        try {
            const body = req.payload;
            const result = await DocumentService.deleteDocument(req.user.id, body.documentId);
            return this.success(HTTP_STATUS.OK, RESPONSE_MESSAGES.VENDOR.DOCUMENT_DELETED, result);
        } catch (error) {
            return this.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, RESPONSE_MESSAGES.ERROR.SERVER_ERROR);
        }
    }
}

const businessDocumentController = new BusinessDocumentController();
export default businessDocumentController;
