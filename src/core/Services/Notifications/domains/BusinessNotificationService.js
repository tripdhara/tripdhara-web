import { renderTemplate } from '@/core/Helpers/TemplateHelper.js';
import { getAppConfig } from '@/core/Lib/appConfig.js';
import { getLogger } from '@/core/Lib/logger.js';
import { NOTIFICATION } from '@/core/Constants/notification.js';
import NotificationDispatcher from '@/core/Helpers/Notifications/NotificationDispatcher.js';

export class BusinessNotificationService {

    async sendBusinessWelcomeEmail(email, details) {
        try {
            const businessProfile = details?.businessProfile || {};
            const businessName = businessProfile?.businessName || 'Partner';

            // console.log(businessProfile);
            const account = {
                ID: businessProfile.id,
                NAME: businessName,
                EMAIL: details.email || '',
                PHONE: details.phone || '',
                IMAGE_URL: businessProfile?.profileImage || 'https://media.tripdhara.com/tripdhara_icon_wordmark.png',
                ROLE: details.role,
                FCM_TOKEN: details.fcmToken,

                BUSINESS_OWNER_NAME: businessProfile?.ownerName || '',
                BUSINESS_ADDRESS: businessProfile?.address || '',
                BUSINESS_PHONE: businessProfile?.businessNumber || ''
            };

            const html = await renderTemplate(NOTIFICATION.TEMPLATE.BUSINESS.WELCOME, account);
            await NotificationDispatcher.dispatch({
                contextName: 'businessProfilCreated',
                email: (account.EMAIL) ? {
                    to: email,
                    toName: account.NAME,
                    subject: NOTIFICATION.SUBJECT.BUSINESS.PROFILE_CREATED,
                    html: html
                } : null,

                push: (account.FCM_TOKEN) ? {
                    fcmToken: account.FCM_TOKEN,

                    title: NOTIFICATION.PUSH.BUSINESS.TITLE.PROFILE_CREATED,
                    body: NOTIFICATION.PUSH.BUSINESS.BODY.PROFILE_CREATED,
                    image: account.IMAGE_URL,

                    id: account.ID,
                    type: NOTIFICATION.PUSH.BUSINESS.TYPE.PROFILE_CREATED,
                    role: account.ROLE,

                } : null
            });
            return true;
        } catch (error) {
            getLogger().error({ err: error, email }, '[NotificationService] sendVendorWelcomeEmail Error');
            return false;
        }
    }

    async sendBusinessProfileUpdateEmail(email, details) {
        try {
            const businessProfile = details?.businessProfile || {};
            const businessName = businessProfile?.businessName || 'Partner';
            const account = {
                ID: businessProfile.id,
                NAME: businessName,
                EMAIL: details.email || '',
                PHONE: details.phone || '',
                IMAGE_URL: businessProfile?.profileImage || 'https://media.tripdhara.com/tripdhara_icon_wordmark.png',
                ROLE: details.role,
                FCM_TOKEN: details.fcmToken,

                BUSINESS_OWNER_NAME: businessProfile?.ownerName || '',
                BUSINESS_ADDRESS: businessProfile?.address || '',
                BUSINESS_PHONE: businessProfile?.businessNumber || ''
            };
            const html = await renderTemplate(NOTIFICATION.TEMPLATE.BUSINESS.PROFILE_UPDATE, account);
            await NotificationDispatcher.dispatch({
                contextName: 'businessProfilUpdated',
                email: (account.EMAIL) ? {
                    to: email,
                    toName: account.NAME,
                    subject: NOTIFICATION.SUBJECT.BUSINESS.PROFILE_UPDATE,
                    html: html
                } : null,

                push: (account.FCM_TOKEN) ? {
                    fcmToken: account.FCM_TOKEN,

                    title: NOTIFICATION.PUSH.BUSINESS.TITLE.PROFILE_UPDATE,
                    body: NOTIFICATION.PUSH.BUSINESS.BODY.PROFILE_UPDATE,
                    image: account.IMAGE_URL,

                    id: account.ID,
                    type: NOTIFICATION.PUSH.BUSINESS.TYPE.PROFILE_UPDATE,
                    role: account.ROLE,

                } : null
            });
            return true;
        } catch (error) {
            getLogger().error({ err: error, email }, '[NotificationService] sendUpdateBusinessProfileEmail Error');
            return false;
        }
    }

    async sendBusinessProfileActivatedEmail(email, details) {
        try {
            const businessProfile = details?.businessProfile || {};
            const businessName = businessProfile?.businessName || 'Partner';
            const account = {
                ID: businessProfile.id,
                NAME: businessName,
                EMAIL: details.email || '',
                PHONE: details.phone || '',
                IMAGE_URL: businessProfile?.profileImage || 'https://media.tripdhara.com/tripdhara_icon_wordmark.png',
                ROLE: details.role,
                FCM_TOKEN: details.fcmToken,

                BUSINESS_OWNER_NAME: businessProfile?.ownerName || '',
                BUSINESS_ADDRESS: businessProfile?.address || '',
                BUSINESS_PHONE: businessProfile?.businessNumber || '',
                ACTIVATION_DATE: businessProfile?.deletedAt,
                STATUS: businessProfile?.status
            };
            const html = await renderTemplate(NOTIFICATION.TEMPLATE.BUSINESS.PROFILE_ACTIVATED, account);
            await NotificationDispatcher.dispatch({
                contextName: 'businessProfileActivate',
                email: (account.EMAIL) ? {
                    to: email,
                    toName: account.NAME,
                    subject: NOTIFICATION.SUBJECT.BUSINESS.PROFILE_ACTIVATED,
                    html: html
                } : null,

                push: (account.FCM_TOKEN) ? {
                    fcmToken: account.FCM_TOKEN,

                    title: NOTIFICATION.PUSH.BUSINESS.TITLE.PROFILE_ACTIVATED,
                    body: NOTIFICATION.PUSH.BUSINESS.BODY.PROFILE_ACTIVATED,
                    image: account.IMAGE_URL,

                    id: account.ID,
                    type: NOTIFICATION.PUSH.BUSINESS.TYPE.PROFILE_ACTIVATED,
                    role: account.ROLE,

                } : null
            });
            return true;
        } catch (error) {
            getLogger().error({ err: error, email }, '[NotificationService] sendBusinessProfileDeactivatedEmail Error');
            return false;
        }
    }

    async sendBusinessProfileDeactivatedEmail(email, details) {
        try {
            const businessProfile = details?.businessProfile || {};
            const businessName = businessProfile?.businessName || 'Partner';
            const accountDetails = {
                USER_NAME: details?.name,
                FCM_TOKEN: details?.fcmToken,
                IMAGE_URL: businessProfile?.profileImage || details?.profileImage || null,
                ID: businessProfile?.id || details?.id || '',
                BUSINESS_NAME: businessName,
                BUSINESS_OWNER_NAME: businessProfile?.ownerName || '',
                BUSINESS_ADDRESS: businessProfile?.address || '',
                BUSINESS_PHONE: businessProfile?.businessNumber || '',
                DEACTIVATION_DATE: businessProfile?.updatedAt,
                STATUS: businessProfile?.status
            };
            const html = await renderTemplate(NOTIFICATION.TEMPLATE.BUSINESS.PROFILE_DEACTIVATED, accountDetails);
            const tasks = [
                this._sendEmailHelper({
                    to: email,
                    toName: accountDetails.BUSINESS_NAME,
                    subject: NOTIFICATION.SUBJECT.BUSINESS.PROFILE_DEACTIVATED,
                    html: html
                })
            ];
            if (accountDetails.FCM_TOKEN) {
                const payload = {
                    fcmToken: accountDetails.FCM_TOKEN,
                    id: accountDetails.ID,
                    image: accountDetails.IMAGE_URL,
                    title: NOTIFICATION.PUSH.BUSINESS.TITLE.PROFILE_DEACTIVATED,
                    body: NOTIFICATION.PUSH.BUSINESS.BODY.PROFILE_DEACTIVATED,
                    type: NOTIFICATION.PUSH.BUSINESS.TYPE.PROFILE_DEACTIVATED
                };
                tasks.push(this._sendPushNotificationPayload(payload));
            }
            const results = await Promise.allSettled(tasks);
            results.forEach((res, index) => {
                if (res.status === 'rejected') getLogger().error({ err: res.reason, task: index === 0 ? 'Email' : 'PushNotification', email }, '[NotificationService] sendBusinessProfileDeactivatedEmail subtask failed');
            });
            return true;
        } catch (error) {
            getLogger().error({ err: error, email }, '[NotificationService] sendBusinessProfileDeactivatedEmail Error');
            return false;
        }
    }

    async sendBusinessProfileApprovedEmail(email, details) {
        try {
            const businessProfile = details?.businessProfile || {};
            const businessName = businessProfile?.businessName || 'Partner';
            const account = {
                ID: businessProfile.id,
                NAME: businessName,
                EMAIL: details.email || '',
                PHONE: details.phone || '',
                IMAGE_URL: businessProfile?.profileImage || 'https://media.tripdhara.com/tripdhara_icon_wordmark.png',
                ROLE: details.role,
                FCM_TOKEN: details.fcmToken,

                BUSINESS_OWNER_NAME: businessProfile?.ownerName || '',
                BUSINESS_ADDRESS: businessProfile?.address || '',
                BUSINESS_PHONE: businessProfile?.businessNumber || '',
                ACTIVATION_DATE: businessProfile?.deletedAt,
                STATUS: businessProfile?.status
            };
            const html = await renderTemplate(NOTIFICATION.TEMPLATE.BUSINESS.PROFILE_APPROVED, account);
            await NotificationDispatcher.dispatch({
                contextName: 'businessProfileActivate',
                email: (account.EMAIL) ? {
                    to: email,
                    toName: account.NAME,
                    subject: NOTIFICATION.SUBJECT.BUSINESS.PROFILE_APPROVED,
                    html: html
                } : null,

                push: (account.FCM_TOKEN) ? {
                    fcmToken: account.FCM_TOKEN,

                    title: NOTIFICATION.PUSH.BUSINESS.TITLE.PROFILE_APPROVED,
                    body: NOTIFICATION.PUSH.BUSINESS.BODY.PROFILE_APPROVED,
                    image: account.IMAGE_URL,

                    id: account.ID,
                    type: NOTIFICATION.PUSH.BUSINESS.TYPE.PROFILE_APPROVED,
                    role: account.ROLE,

                } : null
            });
            return true;
        } catch (error) {
            getLogger().error({ err: error, email }, '[NotificationService] sendBusinessProfileDeactivatedEmail Error');
            return false;
        }
    }

    async sendBusinessOperationalStatusEmail(email, details) {
        try {
            const businessProfile = details?.businessProfile || {};
            const businessName = businessProfile?.businessName || 'Partner';
            const account = {
                ID: businessProfile.id,
                NAME: businessName,
                EMAIL: details.email || '',
                PHONE: details.phone || '',
                IMAGE_URL: businessProfile?.profileImage || 'https://media.tripdhara.com/tripdhara_icon_wordmark.png',
                ROLE: details.role,
                FCM_TOKEN: details.fcmToken,

                BUSINESS_OWNER_NAME: businessProfile?.ownerName || '',
                BUSINESS_ADDRESS: businessProfile?.address || '',
                BUSINESS_PHONE: businessProfile?.businessNumber || '',
                DEACTIVATION_DATE: businessProfile?.deletedAt,
                STATUS: businessProfile?.status
            };
            const html = await renderTemplate(NOTIFICATION.TEMPLATE.BUSINESS.OPERATING_STATUS_UPDATED, account);
            await NotificationDispatcher.dispatch({
                contextName: 'businessProfilOperatingStatus',
                email: (account.EMAIL) ? {
                    to: email,
                    toName: account.NAME,
                    subject: NOTIFICATION.SUBJECT.BUSINESS.OPERATING_STATUS_UPDATED,
                    html: html
                } : null,

                push: (account.FCM_TOKEN) ? {
                    fcmToken: account.FCM_TOKEN,

                    title: NOTIFICATION.PUSH.BUSINESS.TITLE.OPERATING_STATUS_UPDATED,
                    body: NOTIFICATION.PUSH.BUSINESS.BODY.OPERATING_STATUS_UPDATED,
                    image: account.IMAGE_URL,

                    id: account.ID,
                    type: NOTIFICATION.PUSH.BUSINESS.TYPE.OPERATING_STATUS_UPDATED,
                    role: account.ROLE,

                } : null
            })
            return true;
        } catch (error) {
            getLogger().error({ err: error, email }, '[NotificationService] sendBusinessOperationalStatusEmail Error');
            return false;
        }
    }

    async sendBusinessProfileDeletedEmail(email, details) {
        try {
            const businessProfile = details?.businessProfile || {};
            const businessName = businessProfile?.businessName || 'Partner';
            const accountDetails = {
                USER_NAME: details?.name,
                FCM_TOKEN: details?.fcmToken,
                IMAGE_URL: businessProfile?.profileImage || details?.profileImage || null,
                ID: businessProfile?.id || details?.id || '',
                BUSINESS_NAME: businessName,
                BUSINESS_OWNER_NAME: businessProfile?.ownerName || '',
                BUSINESS_ADDRESS: businessProfile?.address || '',
                BUSINESS_PHONE: businessProfile?.businessNumber || ''
            };
            const html = await renderTemplate(NOTIFICATION.TEMPLATE.BUSINESS.PROFILE_DELETED, accountDetails);
            const tasks = [
                this._sendEmailHelper({
                    to: email,
                    toName: accountDetails.BUSINESS_NAME,
                    subject: NOTIFICATION.SUBJECT.BUSINESS.PROFILE_DELETED,
                    html: html
                })
            ];
            if (accountDetails.FCM_TOKEN) {
                const payload = {
                    fcmToken: accountDetails.FCM_TOKEN,
                    id: accountDetails.ID,
                    image: accountDetails.IMAGE_URL,
                    title: NOTIFICATION.PUSH.BUSINESS.TITLE.ACCOUNT_DELETED,
                    body: NOTIFICATION.PUSH.BUSINESS.BODY.ACCOUNT_DELETED,
                    type: NOTIFICATION.PUSH.BUSINESS.TYPE.ACCOUNT_DELETED
                };
                tasks.push(this._sendPushNotificationPayload(payload));
            }
            const results = await Promise.allSettled(tasks);
            results.forEach((res, index) => {
                if (res.status === 'rejected') getLogger().error({ err: res.reason, task: index === 0 ? 'Email' : 'PushNotification', email }, '[NotificationService] sendBusinessProfileDeletedEmail subtask failed');
            });
            return true;
        } catch (error) {
            getLogger().error({ err: error, email }, '[NotificationService] sendBusinessProfileDeletedEmail Error');
            return false;
        }
    }

    // Business's Bank Details Created/Updated
    async sendBusinessBankDetailsCreatedEmail(email, details) {
        try {
            const businessProfile = details?.businessProfile || {};
            const businessName = businessProfile?.businessName || 'Partner';
            const account = {
                ID: businessProfile.id,
                NAME: businessName,
                EMAIL: details.email || '',
                PHONE: details.phone || '',
                IMAGE_URL: businessProfile?.profileImage || 'https://media.tripdhara.com/tripdhara_icon_wordmark.png',
                ROLE: details.role,
                FCM_TOKEN: details.fcmToken,

                BUSINESS_OWNER_NAME: businessProfile?.ownerName || '',
                BUSINESS_ADDRESS: businessProfile?.address || '',
                BUSINESS_PHONE: businessProfile?.businessNumber || ''
            };
            const html = await renderTemplate(NOTIFICATION.TEMPLATE.BUSINESS.BANK_DETAILS_CREATED, account);
            await NotificationDispatcher.dispatch({
                contextName: 'businessBankDetailsCreated',
                email: (account.EMAIL) ? {
                    to: email,
                    toName: account.NAME,
                    subject: NOTIFICATION.SUBJECT.BUSINESS.BANK.BANK_DETAILS_CREATED,
                    html: html
                } : null,

                push: (account.FCM_TOKEN) ? {
                    fcmToken: account.FCM_TOKEN,

                    title: NOTIFICATION.PUSH.BUSINESS.TITLE.BANK_DETAILS_CREATED,
                    body: NOTIFICATION.PUSH.BUSINESS.BODY.BANK_DETAILS_CREATED,
                    image: account.IMAGE_URL,

                    id: account.ID,
                    type: NOTIFICATION.PUSH.BUSINESS.TYPE.BANK_DETAILS_CREATED,
                    role: account.ROLE,

                } : null
            });
            return true;
        } catch (error) {
            getLogger().error({ err: error }, "[NotificationService] Business Bank Details Created Email Error");
            return false;
        }
    }

    async sendBusinessBankDetailsUpdatedEmail(email, details) {
        try {
            const businessProfile = details?.businessProfile || {};
            const businessName = businessProfile?.businessName || 'Partner';
            const account = {
                ID: businessProfile.id,
                NAME: businessName,
                EMAIL: details.email || '',
                PHONE: details.phone || '',
                IMAGE_URL: businessProfile?.profileImage || 'https://media.tripdhara.com/tripdhara_icon_wordmark.png',
                ROLE: details.role,
                FCM_TOKEN: details.fcmToken,

                BUSINESS_OWNER_NAME: businessProfile?.ownerName || '',
                BUSINESS_ADDRESS: businessProfile?.address || '',
                BUSINESS_PHONE: businessProfile?.businessNumber || ''
            };
            const html = await renderTemplate(NOTIFICATION.TEMPLATE.BUSINESS.BANK_DETAILS_UPDATED, account);
            await NotificationDispatcher.dispatch({
                contextName: 'businessBankDetailsUpdated',
                email: (account.EMAIL) ? {
                    to: email,
                    toName: account.NAME,
                    subject: NOTIFICATION.SUBJECT.BUSINESS.BANK.BANK_DETAILS_UPDATED,
                    html: html
                } : null,

                push: (account.FCM_TOKEN) ? {
                    fcmToken: account.FCM_TOKEN,

                    title: NOTIFICATION.PUSH.BUSINESS.TITLE.BANK_DETAILS_UPDATED,
                    body: NOTIFICATION.PUSH.BUSINESS.BODY.BANK_DETAILS_UPDATED,
                    image: account.IMAGE_URL,

                    id: account.ID,
                    type: NOTIFICATION.PUSH.BUSINESS.TYPE.BANK_DETAILS_UPDATED,
                    role: account.ROLE,

                } : null
            });
            return true;
        } catch (error) {
            getLogger().error({ err: error }, "[NotificationService] Business Bank Details Updated Email Error");
            return false;
        }
    }

    async sendBusinessBankDetailsDeletedEmail(email, details) {
        try {
            const businessProfile = details?.businessProfile || {};
            const businessName = businessProfile?.businessName || 'Partner';
            const account = {
                ID: businessProfile.id,
                NAME: businessName,
                EMAIL: details.email || '',
                PHONE: details.phone || '',
                IMAGE_URL: businessProfile?.profileImage || 'https://media.tripdhara.com/tripdhara_icon_wordmark.png',
                ROLE: details.role,
                FCM_TOKEN: details.fcmToken,

                BUSINESS_OWNER_NAME: businessProfile?.ownerName || '',
                BUSINESS_ADDRESS: businessProfile?.address || '',
                BUSINESS_PHONE: businessProfile?.businessNumber || ''
            };
            const html = await renderTemplate(NOTIFICATION.TEMPLATE.BUSINESS.BANK_DETAILS_REMOVED, account);
            await NotificationDispatcher.dispatch({
                contextName: 'businessBankDetailsUpdated',
                email: (account.EMAIL) ? {
                    to: email,
                    toName: account.NAME,
                    subject: NOTIFICATION.SUBJECT.BUSINESS.BANK.BANK_DETAILS_REMOVED,
                    html: html
                } : null,

                push: (account.FCM_TOKEN) ? {
                    fcmToken: account.FCM_TOKEN,

                    title: NOTIFICATION.PUSH.BUSINESS.TITLE.BANK_DETAILS_REMOVED,
                    body: NOTIFICATION.PUSH.BUSINESS.BODY.BANK_DETAILS_REMOVED,
                    image: account.IMAGE_URL,

                    id: account.ID,
                    type: NOTIFICATION.PUSH.BUSINESS.TYPE.BANK_DETAILS_REMOVED,
                    role: account.ROLE,

                } : null
            });
            return true;
        } catch (error) {
            getLogger().error({ err: error }, "[NotificationService] Business Bank Details Updated Email Error");
            return false;
        }
    }

    // Business Document Uploaded
    async sendBusinessDocumentsEmail(email, businessName) {
        try {
            const html = await renderTemplate('Emails/vendor/documents.html', { BUSINESS_NAME: businessName });
            await this._sendEmailHelper({ to: email, toName: businessName, subject: `Documents Received - Tripdhara`, html: html });
            return true;
        } catch (error) {
            getLogger().error({ err: error }, "[NotificationService] sendVendorDocumentsReceivedEmail Error");
            return false;
        }
    }

    // Business Document Updated 
    async sendBusinessDocumentsUpdatedEmail(email, businessName) {
        try {
            const html = await renderTemplate('Emails/vendor/documents.html', { BUSINESS_NAME: businessName });
            await this._sendEmailHelper({ to: email, toName: businessName, subject: `Documents Received - Tripdhara`, html: html });
            return true;
        } catch (error) {
            getLogger().error({ err: error }, "[NotificationService] sendVendorDocumentsReceivedEmail Error");
            return false;
        }
    }
}

export default new BusinessNotificationService();