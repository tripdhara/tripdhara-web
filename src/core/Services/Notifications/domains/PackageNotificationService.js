import { renderTemplate } from '@/core/Helpers/TemplateHelper.js';
import { getAppConfig } from '@/core/Lib/appConfig.js';
import { getLogger } from '@/core/Lib/logger.js';
import { NOTIFICATION } from '@/core/Constants/notification.js';
import NotificationDispatcher from '@/core/Helpers/Notifications/NotificationDispatcher.js';

export class PackageNotificationService {

    async sendPackageCreatedEmail(email, details) {

    }

    async sendPackageUpdatedEmail(email, details) {

    }

    async sendPackageDeletedEmail(email, details) {

    }

}

export default new PackageNotificationService();