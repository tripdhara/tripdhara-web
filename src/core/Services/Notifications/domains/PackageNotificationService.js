import { renderTemplate } from '@/core/Helpers/TemplateHelper.js';
import { getLogger } from '@/core/Lib/logger.js';
import { NOTIFICATION } from '@/core/Constants/notification.js';
import NotificationDispatcher from '@/core/Helpers/Notifications/NotificationDispatcher.js';
import { APP_DETAILS, NOTIFICATION_CATEGORIES, NOTIFICATION_PRIORITIES } from '@/core/Constants/index.js';

export class PackageNotificationService {

    /**
     * Formats common account and package data for templates and multi-channel dispatch
     * @private
     */
    _formatPackageAccount(email, details = {}) {
        const businessProfile = details?.businessProfile || {};
        const businessName = businessProfile?.businessName || details?.businessName || details?.name || 'Partner';
        const pkg = details?.package || details || {};
        const categoryName = pkg.category_name || pkg.category_slug || pkg.category || details?.category || 'Package';
        const price = pkg.pricing?.sellingPrice || pkg.pricing?.basePrice || pkg.price || '';
        const location = pkg.address || (typeof pkg.location === 'string' ? pkg.location : '') || '';
        const appUrl = APP_DETAILS.APP_URL || 'https://tripdhara.com';

        return {
            ID: businessProfile.id || details.id || '',
            NAME: businessName,
            BUSINESS_NAME: businessName,
            BUSINESS_OWNER_NAME: businessProfile?.ownerName || details.name || '',
            BUSINESS_ADDRESS: businessProfile?.address || '',
            BUSINESS_PHONE: businessProfile?.businessNumber || details.phone || '',
            EMAIL: email || details.email || '',
            PHONE: details.phone || '',
            IMAGE_URL: businessProfile?.profileImage || 'https://media.tripdhara.com/tripdhara_icon_wordmark.png',
            ROLE: details.role,
            FCM_TOKEN: details.fcmToken,

            // Package Specific Placeholders
            ITEM_TITLE: pkg.title || 'Package Item',
            CATEGORY_NAME: categoryName,
            ITEM_ID: (pkg.id || pkg._id || '').toString(),
            PRICE: price ? String(price) : '',
            LOCATION: location,
            STATUS: pkg.isActive === false ? 'Inactive' : 'Active',
            DASHBOARD_URL: `${appUrl}/vendor/packages`,
            UPDATED_AT: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
            DELETED_AT: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
        };
    }

    /**
     * Sends notification when a new package/item is listed
     */
    async sendPackageCreatedEmail(email, details) {
        try {
            const account = this._formatPackageAccount(email, details);
            const html = await renderTemplate(NOTIFICATION.TEMPLATE.PACKAGE.CREATE, account);

            await NotificationDispatcher.dispatch({
                contextName: 'PackageCreated',
                email: (account.EMAIL) ? {
                    to: email,
                    toName: account.NAME,
                    subject: `New Listing Created: ${account.ITEM_TITLE} - Tripdhara`,
                    html: html
                } : null,

                push: (account.FCM_TOKEN) ? {
                    fcmToken: account.FCM_TOKEN,
                    title: 'New Package Item Added',
                    body: `Your listing "${account.ITEM_TITLE}" has been created successfully.`,
                    image: account.IMAGE_URL,
                    id: account.ITEM_ID,
                    type: 'package_created',
                    role: account.ROLE
                } : null,

                inApp: (account.ID) ? {
                    recipient: account.ID,
                    recipientRole: account.ROLE,
                    title: 'New Package Item Added',
                    message: `Your listing "${account.ITEM_TITLE}" under ${account.CATEGORY_NAME} has been created successfully.`,
                    type: 'package_created',
                    category: NOTIFICATION_CATEGORIES.PACKAGE,
                    priority: NOTIFICATION_PRIORITIES.MEDIUM,
                    referenceId: account.ITEM_ID || account.ID,
                    referenceModel: 'Package',
                    referenceType: 'package_created',
                    imageUrl: account.IMAGE_URL,
                    groupKey: `package_created_${account.ITEM_ID}`,
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
            getLogger().error({ err: error, email }, '[PackageNotificationService] sendPackageCreatedEmail Error');
            return false;
        }
    }

    /**
     * Sends notification when an existing package/item is modified
     */
    async sendPackageUpdatedEmail(email, details) {
        try {
            const account = this._formatPackageAccount(email, details);
            const html = await renderTemplate(NOTIFICATION.TEMPLATE.PACKAGE.UPDATE, account);

            await NotificationDispatcher.dispatch({
                contextName: 'PackageUpdated',
                email: (account.EMAIL) ? {
                    to: email,
                    toName: account.NAME,
                    subject: `Listing Updated: ${account.ITEM_TITLE} - Tripdhara`,
                    html: html
                } : null,

                push: (account.FCM_TOKEN) ? {
                    fcmToken: account.FCM_TOKEN,
                    title: 'Package Item Updated',
                    body: `Your listing "${account.ITEM_TITLE}" has been updated successfully.`,
                    image: account.IMAGE_URL,
                    id: account.ITEM_ID,
                    type: 'package_updated',
                    role: account.ROLE
                } : null,

                inApp: (account.ID) ? {
                    recipient: account.ID,
                    recipientRole: account.ROLE,
                    title: 'Package Item Updated',
                    message: `Your listing "${account.ITEM_TITLE}" has been updated successfully.`,
                    type: 'package_updated',
                    category: NOTIFICATION_CATEGORIES.PACKAGE,
                    priority: NOTIFICATION_PRIORITIES.LOW,
                    referenceId: account.ITEM_ID || account.ID,
                    referenceModel: 'Package',
                    referenceType: 'package_updated',
                    imageUrl: account.IMAGE_URL,
                    groupKey: `package_updated_${account.ITEM_ID}`,
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
            getLogger().error({ err: error, email }, '[PackageNotificationService] sendPackageUpdatedEmail Error');
            return false;
        }
    }

    /**
     * Sends notification when a package/item is deleted
     */
    async sendPackageDeletedEmail(email, details) {
        try {
            const account = this._formatPackageAccount(email, details);
            const html = await renderTemplate(NOTIFICATION.TEMPLATE.PACKAGE.DELETE, account);

            await NotificationDispatcher.dispatch({
                contextName: 'PackageDeleted',
                email: (account.EMAIL) ? {
                    to: email,
                    toName: account.NAME,
                    subject: `Listing Removed: ${account.ITEM_TITLE} - Tripdhara`,
                    html: html
                } : null,

                push: (account.FCM_TOKEN) ? {
                    fcmToken: account.FCM_TOKEN,
                    title: 'Package Listing Removed',
                    body: `Your listing "${account.ITEM_TITLE}" has been removed from your catalog.`,
                    image: account.IMAGE_URL,
                    id: account.ITEM_ID,
                    type: 'package_deleted',
                    role: account.ROLE
                } : null,

                inApp: (account.ID) ? {
                    recipient: account.ID,
                    recipientRole: account.ROLE,
                    title: 'Package Listing Removed',
                    message: `Your listing "${account.ITEM_TITLE}" has been removed from your active catalog.`,
                    type: 'package_deleted',
                    category: NOTIFICATION_CATEGORIES.PACKAGE,
                    priority: NOTIFICATION_PRIORITIES.MEDIUM,
                    referenceId: account.ITEM_ID || account.ID,
                    referenceModel: 'Package',
                    referenceType: 'package_deleted',
                    imageUrl: account.IMAGE_URL,
                    groupKey: `package_deleted_${account.ITEM_ID}`,
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
            getLogger().error({ err: error, email }, '[PackageNotificationService] sendPackageDeletedEmail Error');
            return false;
        }
    }

    /**
     * Sends notification when package status is toggled (Active / Inactive)
     */
    async sendPackageStatusUpdatedEmail(email, details) {
        try {
            const account = this._formatPackageAccount(email, details);
            const template = NOTIFICATION.TEMPLATE.PACKAGE.STATUS || 'Emails/Package/status.html';
            const html = await renderTemplate(template, account);

            await NotificationDispatcher.dispatch({
                contextName: 'PackageStatusUpdated',
                email: (account.EMAIL) ? {
                    to: email,
                    toName: account.NAME,
                    subject: `Listing Status Changed: ${account.ITEM_TITLE} (${account.STATUS}) - Tripdhara`,
                    html: html
                } : null,

                push: (account.FCM_TOKEN) ? {
                    fcmToken: account.FCM_TOKEN,
                    title: 'Listing Status Updated',
                    body: `Your listing "${account.ITEM_TITLE}" is now ${account.STATUS}.`,
                    image: account.IMAGE_URL,
                    id: account.ITEM_ID,
                    type: 'package_status_updated',
                    role: account.ROLE
                } : null,

                inApp: (account.ID) ? {
                    recipient: account.ID,
                    recipientRole: account.ROLE,
                    title: 'Listing Status Updated',
                    message: `Your listing "${account.ITEM_TITLE}" is now ${account.STATUS}.`,
                    type: 'package_status_updated',
                    category: NOTIFICATION_CATEGORIES.PACKAGE,
                    priority: NOTIFICATION_PRIORITIES.LOW,
                    referenceId: account.ITEM_ID || account.ID,
                    referenceModel: 'Package',
                    referenceType: 'package_status_updated',
                    imageUrl: account.IMAGE_URL,
                    groupKey: `package_status_${account.ITEM_ID}`,
                    deliveryStatus: {
                        inApp: true,
                        email: { sent: Boolean(account.EMAIL), sentAt: new Date() },
                        push: { sent: Boolean(account.FCM_TOKEN), sentAt: new Date() }
                    },
                    data: {
                        itemId: account.ITEM_ID,
                        status: account.STATUS
                    }
                } : null
            });

            return true;
        } catch (error) {
            getLogger().error({ err: error, email }, '[PackageNotificationService] sendPackageStatusUpdatedEmail Error');
            return false;
        }
    }
}

export default new PackageNotificationService();
