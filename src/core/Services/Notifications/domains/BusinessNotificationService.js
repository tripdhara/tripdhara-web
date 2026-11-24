import { renderTemplate } from '@/core/Helpers/TemplateHelper.js';
import { getLogger } from '@/core/Lib/logger.js';
import { NOTIFICATION } from '@/core/Constants/notification.js';
import NotificationDispatcher from '@/core/Helpers/Notifications/NotificationDispatcher.js';
import { NOTIFICATION_CATEGORIES, NOTIFICATION_PRIORITIES } from '@/core/Constants/index.js';

export class BusinessNotificationService {

    /**
     * Common account & business payload formatter without redundant fallbacks
     * @private
     */
    _formatBusinessAccount(email, details) {
        const business = details.businessProfile;

        return {
            ID: business?.id ?? details.id,
            NAME: business?.businessName ?? details.name,
            USER_NAME: details.name,
            BUSINESS_NAME: business?.businessName ?? details.name,
            BUSINESS_OWNER_NAME: business?.ownerName ?? details.name,
            BUSINESS_ADDRESS: business?.address,
            BUSINESS_PHONE: business?.businessNumber ?? details.phone,
            EMAIL: email ?? details.email,
            PHONE: details.phone,
            IMAGE_URL: business?.profileImage,
            ROLE: details.role,
            FCM_TOKEN: details.fcmToken,

            STATUS: business?.status,
            STATUS_TEXT: business?.status,
            ACTIVATION_DATE: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
            APPROVE_DATE: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
            DEACTIVATION_DATE: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
            UPDATED_AT: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
            REASON: details.reason
        };
    }

    /**
     * Centralized multi-channel dispatcher
     * @private
     */
    async _notify(email, details, config) {
        try {
            const account = this._formatBusinessAccount(email, details);
            const html = await renderTemplate(config.template, account);
            const subject = config.subject;
            const message = config.message;

            await NotificationDispatcher.dispatch({
                contextName: config.contextName,
                email: account.EMAIL ? {
                    to: email,
                    toName: account.NAME,
                    subject,
                    html
                } : null,

                push: account.FCM_TOKEN ? {
                    fcmToken: account.FCM_TOKEN,
                    title: config.title,
                    body: message,
                    image: account.IMAGE_URL,
                    id: account.ID,
                    type: config.type,
                    role: account.ROLE
                } : null,

                inApp: account.ID ? {
                    recipient: account.ID,
                    recipientRole: account.ROLE,
                    title: config.title,
                    message,
                    type: config.type,
                    category: NOTIFICATION_CATEGORIES.BUSINESS,
                    priority: NOTIFICATION_PRIORITIES.MEDIUM,
                    referenceId: account.ID,
                    referenceModel: 'Vendor',
                    referenceType: config.type,
                    imageUrl: account.IMAGE_URL,
                    groupKey: `business_${config.type}_${account.ID}`,
                    deliveryStatus: {
                        inApp: true,
                        email: { sent: Boolean(account.EMAIL), sentAt: new Date() },
                        push: { sent: Boolean(account.FCM_TOKEN), sentAt: new Date() }
                    },
                    data: {
                        businessId: account.ID
                    }
                } : null
            });

            return true;
        } catch (error) {
            getLogger().error({ err: error, email }, `[BusinessNotificationService] ${config.contextName} Error`);
            return false;
        }
    }

    // --- Action Methods ---

    sendBusinessWelcomeEmail(email, details) {
        return this._notify(email, details, {
            contextName: 'BusinessWelcome',
            template: NOTIFICATION.TEMPLATE.BUSINESS.WELCOME,
            subject: NOTIFICATION.SUBJECT.BUSINESS.PROFILE_CREATED,
            title: NOTIFICATION.PUSH.BUSINESS.TITLE.PROFILE_CREATED,
            message: NOTIFICATION.PUSH.BUSINESS.BODY.PROFILE_CREATED,
            type: NOTIFICATION.PUSH.BUSINESS.TYPE.PROFILE_CREATED
        });
    }

    sendBusinessProfileUpdateEmail(email, details) {
        return this._notify(email, details, {
            contextName: 'BusinessProfileUpdated',
            template: NOTIFICATION.TEMPLATE.BUSINESS.PROFILE_UPDATE,
            subject: NOTIFICATION.SUBJECT.BUSINESS.PROFILE_UPDATE,
            title: NOTIFICATION.PUSH.BUSINESS.TITLE.PROFILE_UPDATE,
            message: NOTIFICATION.PUSH.BUSINESS.BODY.PROFILE_UPDATE,
            type: NOTIFICATION.PUSH.BUSINESS.TYPE.PROFILE_UPDATE
        });
    }

    sendBusinessProfileActivatedEmail(email, details) {
        return this._notify(email, details, {
            contextName: 'BusinessProfileActivated',
            template: NOTIFICATION.TEMPLATE.BUSINESS.PROFILE_ACTIVATED,
            subject: NOTIFICATION.SUBJECT.BUSINESS.PROFILE_ACTIVATED,
            title: NOTIFICATION.PUSH.BUSINESS.TITLE.PROFILE_ACTIVATED,
            message: NOTIFICATION.PUSH.BUSINESS.BODY.PROFILE_ACTIVATED,
            type: NOTIFICATION.PUSH.BUSINESS.TYPE.PROFILE_ACTIVATED
        });
    }

    sendBusinessProfileDeactivatedEmail(email, details) {
        return this._notify(email, details, {
            contextName: 'BusinessProfileDeactivated',
            template: NOTIFICATION.TEMPLATE.BUSINESS.PROFILE_DEACTIVATED,
            subject: NOTIFICATION.SUBJECT.BUSINESS.PROFILE_DEACTIVATED,
            title: NOTIFICATION.PUSH.BUSINESS.TITLE.PROFILE_DEACTIVATED,
            message: NOTIFICATION.PUSH.BUSINESS.BODY.PROFILE_DEACTIVATED,
            type: NOTIFICATION.PUSH.BUSINESS.TYPE.PROFILE_DEACTIVATED
        });
    }

    sendBusinessProfileApprovedEmail(email, details) {
        return this._notify(email, details, {
            contextName: 'BusinessProfileApproved',
            template: NOTIFICATION.TEMPLATE.BUSINESS.PROFILE_APPROVED,
            subject: NOTIFICATION.SUBJECT.BUSINESS.PROFILE_APPROVED,
            title: NOTIFICATION.PUSH.BUSINESS.TITLE.PROFILE_APPROVED,
            message: NOTIFICATION.PUSH.BUSINESS.BODY.PROFILE_APPROVED,
            type: NOTIFICATION.PUSH.BUSINESS.TYPE.PROFILE_APPROVED
        });
    }

    sendBusinessOperationalStatusEmail(email, details) {
        return this._notify(email, details, {
            contextName: 'BusinessOperationalStatus',
            template: NOTIFICATION.TEMPLATE.BUSINESS.OPERATING_STATUS_UPDATED,
            subject: NOTIFICATION.SUBJECT.BUSINESS.OPERATING_STATUS_UPDATED,
            title: NOTIFICATION.PUSH.BUSINESS.TITLE.OPERATING_STATUS_UPDATED,
            message: NOTIFICATION.PUSH.BUSINESS.BODY.OPERATING_STATUS_UPDATED,
            type: NOTIFICATION.PUSH.BUSINESS.TYPE.OPERATING_STATUS_UPDATED
        });
    }

    sendBusinessProfileDeletedEmail(email, details) {
        return this._notify(email, details, {
            contextName: 'BusinessProfileDeleted',
            template: NOTIFICATION.TEMPLATE.BUSINESS.PROFILE_DELETED,
            subject: NOTIFICATION.SUBJECT.BUSINESS.PROFILE_DELETED,
            title: NOTIFICATION.PUSH.BUSINESS.TITLE.ACCOUNT_DELETED,
            message: NOTIFICATION.PUSH.BUSINESS.BODY.ACCOUNT_DELETED,
            type: NOTIFICATION.PUSH.BUSINESS.TYPE.ACCOUNT_DELETED
        });
    }

    sendBusinessBankDetailsCreatedEmail(email, details) {
        return this._notify(email, details, {
            contextName: 'BusinessBankDetailsCreated',
            template: NOTIFICATION.TEMPLATE.BUSINESS.BANK_DETAILS_CREATED,
            subject: NOTIFICATION.SUBJECT.BUSINESS.BANK.BANK_DETAILS_CREATED,
            title: NOTIFICATION.PUSH.BUSINESS.TITLE.BANK_DETAILS_CREATED,
            message: NOTIFICATION.PUSH.BUSINESS.BODY.BANK_DETAILS_CREATED,
            type: NOTIFICATION.PUSH.BUSINESS.TYPE.BANK_DETAILS_CREATED
        });
    }

    sendBusinessBankDetailsUpdatedEmail(email, details) {
        return this._notify(email, details, {
            contextName: 'BusinessBankDetailsUpdated',
            template: NOTIFICATION.TEMPLATE.BUSINESS.BANK_DETAILS_UPDATED,
            subject: NOTIFICATION.SUBJECT.BUSINESS.BANK.BANK_DETAILS_UPDATED,
            title: NOTIFICATION.PUSH.BUSINESS.TITLE.BANK_DETAILS_UPDATED,
            message: NOTIFICATION.PUSH.BUSINESS.BODY.BANK_DETAILS_UPDATED,
            type: NOTIFICATION.PUSH.BUSINESS.TYPE.BANK_DETAILS_UPDATED
        });
    }

    sendBusinessBankDetailsDeletedEmail(email, details) {
        return this._notify(email, details, {
            contextName: 'BusinessBankDetailsDeleted',
            template: NOTIFICATION.TEMPLATE.BUSINESS.BANK_DETAILS_REMOVED,
            subject: NOTIFICATION.SUBJECT.BUSINESS.BANK.BANK_DETAILS_REMOVED,
            title: NOTIFICATION.PUSH.BUSINESS.TITLE.BANK_DETAILS_REMOVED,
            message: NOTIFICATION.PUSH.BUSINESS.BODY.BANK_DETAILS_REMOVED,
            type: NOTIFICATION.PUSH.BUSINESS.TYPE.BANK_DETAILS_REMOVED
        });
    }

    sendBusinessDocumentsEmail(email, details) {
        return this._notify(email, details, {
            contextName: 'BusinessDocumentsUploaded',
            template: NOTIFICATION.TEMPLATE.BUSINESS.DOCUMENT_UPLOADED,
            subject: NOTIFICATION.SUBJECT.BUSINESS.DOCUMENT_UPLOADED,
            title: NOTIFICATION.PUSH.BUSINESS.TITLE.DOCUMENT_UPLOADED,
            message: NOTIFICATION.PUSH.BUSINESS.BODY.DOCUMENT_UPLOADED,
            type: NOTIFICATION.PUSH.BUSINESS.TYPE.DOCUMENT_UPLOADED
        });
    }

    sendBusinessDocumentsUpdatedEmail(email, details) {
        return this._notify(email, details, {
            contextName: 'BusinessDocumentsUpdated',
            template: 'Emails/vendor/documents.html',
            subject: 'Documents Received - Tripdhara',
            title: 'Documents Received',
            message: 'Your documents have been received successfully.',
            type: 'documents_received'
        });
    }
}

export default new BusinessNotificationService();
