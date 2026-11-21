import { renderTemplate } from '@/core/Helpers/TemplateHelper.js';
import { getLogger } from '@/core/Lib/logger.js';
import { NOTIFICATION } from '@/core/Constants/notification.js';
import NotificationDispatcher from '@/core/Helpers/Notifications/NotificationDispatcher.js';
import { APP_DETAILS, NOTIFICATION_CATEGORIES, NOTIFICATION_PRIORITIES } from '@/core/Constants/index.js';

export class PackageNotificationService {

    /**
     * Common account & package payload formatter without redundant fallbacks
     * @private
     */
    _formatPackageAccount(email, details) {
        const business = details.businessProfile;
        const pkg = details.package;

        return {
            ID: business?.id ?? details.id,
            NAME: business?.businessName ?? details.name,
            BUSINESS_NAME: business?.businessName ?? details.name,
            BUSINESS_OWNER_NAME: business?.ownerName ?? details.name,
            BUSINESS_ADDRESS: business?.address,
            BUSINESS_PHONE: business?.businessNumber ?? details.phone,
            EMAIL: email ?? details.email,
            PHONE: details.phone,
            IMAGE_URL: business?.profileImage,
            ROLE: details.role,
            FCM_TOKEN: details.fcmToken,

            ITEM_TITLE: pkg.title,
            CATEGORY_NAME: pkg.category_name,
            ITEM_ID: pkg.id,
            PRICE: pkg.pricing?.sellingPrice,
            LOCATION: pkg.address,
            STATUS: pkg.isActive ? 'Active' : 'Inactive',
            DASHBOARD_URL: `${APP_DETAILS.APP_URL}/vendor/packages`,
            UPDATED_AT: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
            DELETED_AT: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
        };
    }

    /**
     * Centralized multi-channel dispatcher
     * @private
     */
    async _notify(email, details, config) {
        try {
            const account = this._formatPackageAccount(email, details);
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
                    id: account.ITEM_ID,
                    type: config.type,
                    role: account.ROLE
                } : null,

                inApp: account.ID ? {
                    recipient: account.ID,
                    recipientRole: account.ROLE,
                    title: config.title,
                    message,
                    type: config.type,
                    category: NOTIFICATION_CATEGORIES.PACKAGE,
                    priority: config.priority,
                    referenceId: account.ITEM_ID,
                    referenceModel: 'Package',
                    referenceType: config.type,
                    imageUrl: account.IMAGE_URL,
                    groupKey: `package_${config.type}_${account.ITEM_ID}`,
                    deliveryStatus: {
                        inApp: true,
                        email: { sent: Boolean(account.EMAIL), sentAt: new Date() },
                        push: { sent: Boolean(account.FCM_TOKEN), sentAt: new Date() }
                    },
                    data: {
                        itemId: account.ITEM_ID,
                        category: account.CATEGORY_NAME
                    }
                } : null
            });

            return true;
        } catch (error) {
            getLogger().error({ err: error, email }, `[PackageNotificationService] ${config.contextName} Error`);
            return false;
        }
    }

    // --- Action Methods ---

    sendPackageCreatedEmail(email, details) {
        return this._notify(email, details, {
            contextName: 'PackageCreated',
            template: NOTIFICATION.TEMPLATE.PACKAGE.CREATE,
            subject: NOTIFICATION.SUBJECT.BUSINESS.PACKAGE_CREATED,
            title: NOTIFICATION.PUSH.BUSINESS.TITLE.PACKAGE_CREATED,
            message: NOTIFICATION.PUSH.BUSINESS.BODY.PACKAGE_CREATED,
            type: NOTIFICATION.PUSH.BUSINESS.TYPE.PACKAGE_CREATED,
            priority: NOTIFICATION_PRIORITIES.MEDIUM
        });
    }

    sendPackageUpdatedEmail(email, details) {
        return this._notify(email, details, {
            contextName: 'PackageUpdated',
            subject: NOTIFICATION.SUBJECT.BUSINESS.PACKAGE_UPDATED,
            title: NOTIFICATION.PUSH.BUSINESS.TITLE.PACKAGE_UPDATED,
            message: NOTIFICATION.PUSH.BUSINESS.BODY.PACKAGE_UPDATED,
            type: NOTIFICATION.PUSH.BUSINESS.TYPE.PACKAGE_UPDATED,
            priority: NOTIFICATION_PRIORITIES.MEDIUM
        });
    }

    sendPackageDeletedEmail(email, details) {
        return this._notify(email, details, {
            contextName: 'PackageDeleted',
            template: NOTIFICATION.TEMPLATE.PACKAGE.DELETE,
            subject: NOTIFICATION.SUBJECT.BUSINESS.PACKAGE_DELETED,
            title: NOTIFICATION.PUSH.BUSINESS.TITLE.PACKAGE_DELETED,
            message: NOTIFICATION.PUSH.BUSINESS.BODY.PACKAGE_DELETED,
            type: NOTIFICATION.PUSH.BUSINESS.TYPE.PACKAGE_DELETED,
            priority: NOTIFICATION_PRIORITIES.MEDIUM
        });
    }

    sendPackageStatusUpdatedEmail(email, details) {
        return this._notify(email, details, {
            contextName: 'PackageStatusUpdated',
            template: NOTIFICATION.TEMPLATE.PACKAGE.STATUS,
            subject: NOTIFICATION.SUBJECT.BUSINESS.PACKAGE_STATUS_UPDATED,
            title: NOTIFICATION.PUSH.BUSINESS.TITLE.PACKAGE_STATUS_UPDATED,
            message: NOTIFICATION.PUSH.BUSINESS.BODY.PACKAGE_STATUS_UPDATED,
            type: NOTIFICATION.PUSH.BUSINESS.TYPE.PACKAGE_STATUS_UPDATED,
            priority: NOTIFICATION_PRIORITIES.MEDIUM
        });
    }
}

export default new PackageNotificationService();
