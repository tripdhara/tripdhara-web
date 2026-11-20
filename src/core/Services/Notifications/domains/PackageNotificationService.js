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
            const subject = typeof config.subject === 'function' ? config.subject(account) : config.subject;
            const message = typeof config.message === 'function' ? config.message(account) : config.message;

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
            subject: (acc) => `New Listing Created: ${acc.ITEM_TITLE} - Tripdhara`,
            title: 'New Package Item Added',
            message: (acc) => `Your listing "${acc.ITEM_TITLE}" has been created successfully.`,
            type: 'package_created',
            priority: NOTIFICATION_PRIORITIES.MEDIUM
        });
    }

    sendPackageUpdatedEmail(email, details) {
        return this._notify(email, details, {
            contextName: 'PackageUpdated',
            template: NOTIFICATION.TEMPLATE.PACKAGE.UPDATE,
            subject: (acc) => `Listing Updated: ${acc.ITEM_TITLE} - Tripdhara`,
            title: 'Package Item Updated',
            message: (acc) => `Your listing "${acc.ITEM_TITLE}" has been updated successfully.`,
            type: 'package_updated',
            priority: NOTIFICATION_PRIORITIES.LOW
        });
    }

    sendPackageDeletedEmail(email, details) {
        return this._notify(email, details, {
            contextName: 'PackageDeleted',
            template: NOTIFICATION.TEMPLATE.PACKAGE.DELETE,
            subject: (acc) => `Listing Removed: ${acc.ITEM_TITLE} - Tripdhara`,
            title: 'Package Listing Removed',
            message: (acc) => `Your listing "${acc.ITEM_TITLE}" has been removed from catalog.`,
            type: 'package_deleted',
            priority: NOTIFICATION_PRIORITIES.MEDIUM
        });
    }

    sendPackageStatusUpdatedEmail(email, details) {
        return this._notify(email, details, {
            contextName: 'PackageStatusUpdated',
            template: NOTIFICATION.TEMPLATE.PACKAGE.STATUS,
            subject: (acc) => `Listing Status Changed: ${acc.ITEM_TITLE} (${acc.STATUS}) - Tripdhara`,
            title: 'Listing Status Updated',
            message: (acc) => `Your listing "${acc.ITEM_TITLE}" is now ${acc.STATUS}.`,
            type: 'package_status_updated',
            priority: NOTIFICATION_PRIORITIES.LOW
        });
    }
}

export default new PackageNotificationService();
