
import BankService from '@/core/Services/Vendor/BankService.js';
import BusinessEvents from '@/core/Events/BusinessEvents.js';
import { getLogger } from '@/core/Lib/logger';
import { getBusinessByUserId } from '@/core/Helpers/queryHelpers';
import { HTTP_STATUS, RESPONSE_MESSAGES } from '@/core/Constants/index.js';
import { NOTIFICATION } from '@/core/Constants/notification';
import Controller from '@/core/Controllers/Controller.js';

/**
 * BankController (Vendor Role) - Specialized management of
 * operational payout credentials and secure bank identity.
 */
class BankController extends Controller {

    // GET /vendor/bank/
    async getBankDetails(req) {
        try {
            const userId = req.user.id;
            const vendor = await getBusinessByUserId(userId);
            if (!vendor) return this.error(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.VENDOR.NOT_FOUND);
            return this.success(HTTP_STATUS.OK, RESPONSE_MESSAGES.VENDOR.BANK_FETCHED, vendor.bankDetails);
        } catch (error) {
            getLogger().error({ err: error }, '[BankController] getBankDetails error');
            return this.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, RESPONSE_MESSAGES.ERROR.SERVER_ERROR);
        }
    }

    // POST /vendor/bank/create
    async createBankDetails(req) {
        try {
            const body = req.payload;
            const userId = req.user.id;
            const result = await BankService.syncBankDetails(userId, body);
            if (result.email) await BusinessEvents.emitAsync(NOTIFICATION.KEY.BUSINESS.BANK.CREATED, { identifier: result.email, details: result });
            return this.success(HTTP_STATUS.CREATED, RESPONSE_MESSAGES.VENDOR.BANK_CREATED);
        } catch (error) {
            getLogger().error({ err: error }, '[BankController] createBankDetails error');
            return this.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, RESPONSE_MESSAGES.ERROR.SERVER_ERROR);
        }
    }

    // PATCH /vendor/bank/update
    async updateBankDetails(req) {
        try {
            const body = req.payload;
            const result = await BankService.syncBankDetails(req.user.id, body);
            if (result.email) await BusinessEvents.emitAsync(NOTIFICATION.KEY.BUSINESS.BANK.UPDATED, { identifier: result.email, details: result });
            return this.success(HTTP_STATUS.OK, RESPONSE_MESSAGES.VENDOR.BANK_UPDATED);
        } catch (error) {
            getLogger().error({ err: error }, '[BankController] updateBankDetails error');
            return this.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, RESPONSE_MESSAGES.ERROR.SERVER_ERROR);
        }
    }

    // DELETE /vendor/bank/delete
    async deleteBankDetails(req) {
        try {
            const result = await BankService.removeBankDetails(req.user.id);
            if (result.email) await BusinessEvents.emitAsync(NOTIFICATION.KEY.BUSINESS.BANK.DELETED, { identifier: result.email, details: result });
            return this.success(HTTP_STATUS.OK, RESPONSE_MESSAGES.VENDOR.BANK_DELETED);
        } catch (error) {
            getLogger().error({ err: error }, '[BankController] deleteBankDetails error');
            return this.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, RESPONSE_MESSAGES.ERROR.SERVER_ERROR);
        }
    }
}

const bankController = new BankController();
export default bankController;
