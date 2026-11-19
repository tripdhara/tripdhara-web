import { EventEmitter } from 'events';
import BusinessNotificationService from '@/core/Services/Notifications/domains/BusinessNotificationService.js';
import { getLogger } from '@/core/Lib/logger.js';
import { NOTIFICATION } from '../Constants/notification.js';

const BusinessEvents = new EventEmitter();

// ================================================================== //
//                                                                    //
//                   BUSINESS Events Emails                           //
//                                                                    //
// ================================================================== //
const registerEmailListener = (eventKey, handlerFn) => {
    BusinessEvents.on(eventKey, async ({ identifier, details, businessName = {} }) => {
        try {
            if (identifier && identifier.includes('@')) {
                await handlerFn(identifier, details, businessName);
            }
        } catch (error) {
            getLogger().error({ err: error }, `[BusinessEvents] Error handling ${eventKey}`);
        }
    });
};

// Business Profile Emails
registerEmailListener(NOTIFICATION.KEY.BUSINESS.PROFILE_CREATED, (id, data) => BusinessNotificationService.sendBusinessWelcomeEmail(id, data));
registerEmailListener(NOTIFICATION.KEY.BUSINESS.PROFILE_UPDATED, (id, data) => BusinessNotificationService.sendBusinessProfileUpdateEmail(id, data));

registerEmailListener(NOTIFICATION.KEY.BUSINESS.PROFILE_ACTIVATED, (id, data) => BusinessNotificationService.sendBusinessProfileActivatedEmail(id, data));
registerEmailListener(NOTIFICATION.KEY.BUSINESS.PROFILE_DEACTIVATED, (id, data) => BusinessNotificationService.sendBusinessProfileDeactivatedEmail(id, data));
registerEmailListener(NOTIFICATION.KEY.BUSINESS.PROFILE_APPROVED, (id, data) => BusinessNotificationService.sendBusinessProfileApprovedEmail(id, data));

registerEmailListener(NOTIFICATION.KEY.BUSINESS.OPERATING_STATUS_UPDATED, (id, data) => BusinessNotificationService.sendBusinessOperationalStatusEmail(id, data));
registerEmailListener(NOTIFICATION.KEY.BUSINESS.PROFILE_DELETED, (id, data) => BusinessNotificationService.sendBusinessProfileDeletedEmail(id, data));

// Business Document Emails
registerEmailListener(NOTIFICATION.KEY.BUSINESS.DOCUMENT_UPLOADED, (id, data) => BusinessNotificationService.sendVendorDocumentsReceivedEmail(id, data));

// Business Bank Details Emails
registerEmailListener(NOTIFICATION.KEY.BUSINESS.BANK.CREATED, (id, data) => BusinessNotificationService.sendBusinessBankDetailsCreatedEmail(id, data));
registerEmailListener(NOTIFICATION.KEY.BUSINESS.BANK.UPDATED, (id, data) => BusinessNotificationService.sendBusinessBankDetailsUpdatedEmail(id, data));
registerEmailListener(NOTIFICATION.KEY.BUSINESS.BANK.DELETED, (id, data) => BusinessNotificationService.sendBusinessBankDetailsDeletedEmail(id, data));

BusinessEvents.emitAsync = async function (event, data) {
    const listeners = this.listeners(event);
    if (!listeners || listeners.length === 0) return [];
    return await Promise.all(listeners.map(fn => fn(data)));
};

export default BusinessEvents;
