import { renderTemplate } from '@/core/Helpers/TemplateHelper.js';
import { getAppConfig } from '@/core/Lib/appConfig.js';
import { getLogger } from '@/core/Lib/logger.js';
import { NOTIFICATION } from '@/core/Constants/notification.js';
import NotificationDispatcher from '@/core/Helpers/Notifications/NotificationDispatcher.js';

export class UserNotificationService {

    async sendProfileUpdateEmail(email, details) {
        try {
            const account = {
                ID: details.id,
                NAME: details.name || 'User',
                EMAIL: details.email || '',
                PHONE: details.phone || '',
                IMAGE_URL: details?.profileImage || 'https://media.tripdhara.com/tripdhara_icon_wordmark.png',
                ROLE: details.role,
                FCM_TOKEN: details.fcmToken,

                UPDATE_TIME: details?.updatedAt || '',
                SECURITY_URL: 'https://tripdhara.com/security'
            }
            const html = await renderTemplate(NOTIFICATION.TEMPLATE.USER.PROFILE.UPDATED, account);
            await NotificationDispatcher.dispatch({
                contextName: 'UserProfileUpdate',
                email: (account.EMAIL) ? {
                    to: email,
                    toName: account.NAME,
                    subject: NOTIFICATION.SUBJECT.USER.PROFILE_UPDATE,
                    html: html
                } : null,

                push: (account.FCM_TOKEN) ? {
                    fcmToken: account.FCM_TOKEN,
                    title: NOTIFICATION.PUSH.USER.TITLE.PROFILE_UPDATE,
                    body: NOTIFICATION.PUSH.USER.BODY.PROFILE_UPDATE,
                    image: account.IMAGE_URL,
                    id: account.ID,
                    type: NOTIFICATION.PUSH.USER.TYPE.PROFILE_UPDATE,
                    role: account.ROLE,
                } : null
            });
            return true;
        } catch (error) {
            getLogger().error({ err: error }, "[NotificationService] sendProfileUpdateEmail Error");
            return false;
        }
    }
}

export default new UserNotificationService();