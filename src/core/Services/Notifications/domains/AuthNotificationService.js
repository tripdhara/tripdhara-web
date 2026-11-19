import { renderTemplate } from '@/core/Helpers/TemplateHelper.js';
import { getAppConfig } from '@/core/Lib/appConfig.js';
import { getLogger } from '@/core/Lib/logger.js';
import { NOTIFICATION } from '@/core/Constants/notification.js';
import NotificationDispatcher from '@/core/Helpers/Notifications/NotificationDispatcher.js';

export class AuthNotificationService {

    async sendSecureCodeEmail(email, data) {
        try {
            const details = { OTP: data }
            const html = await renderTemplate(NOTIFICATION.TEMPLATE.USER.OTP, details);
            await NotificationDispatcher.dispatch({
                contextName: 'SecureCode',
                email: (email) ? {
                    to: email,
                    subject: NOTIFICATION.SUBJECT.AUTH.OTP,
                    html: html
                } : null,
            });
            return true;
        } catch (error) {
            getLogger().error({ err: error, email }, '[AuthNotificationService] sendSecureCodeEmail Error');
            return false;
        }
    }

    async sendWelcomeEmail(email, details) {
        try {
            const config = await getAppConfig();
            const exploreUrl = config?.app?.url ? `${config.app.url}/explore` : 'https://tripdhara.com/explore';
            const account = {
                NAME: details?.name || 'User',
                EMAIL: details?.email || '',
                ACCOUNT_IDENTIFIER: email || details?.email || '',
                JOIN_DATE: details?.createdAt || '',
                EXPLORE_URL: exploreUrl,
            }
            const html = await renderTemplate(NOTIFICATION.TEMPLATE.USER.WELCOME, account);
            await NotificationDispatcher.dispatch({
                contextName: 'WelcomeUser',
                email: (account.EMAIL) ? {
                    to: email,
                    subject: NOTIFICATION.SUBJECT.AUTH.WELCOME,
                    html: html
                } : null
            });
            return true;
        } catch (error) {
            getLogger().error({ err: error }, "[NotificationService] sendWelcomeEmail Error");
            return false;
        }
    }

    async sendAlertEmail(email, details, metadata = {}) {
        try {
            const config = await getAppConfig();
            const baseUrl = config?.app?.url || 'https://tripdhara.com';
            const securityUrl = `${baseUrl}/security`;
            const revokeUrl = metadata.sessionId ? `${baseUrl}/auth/revoke-session?id=${metadata.sessionId}` : `${baseUrl}/security`;

            const account = {
                ID: details.id,
                NAME: details.name || 'User',
                EMAIL: details.email || '',
                PHONE: details.phone || '',
                IMAGE_URL: 'https://media.tripdhara.com/tripdhara_icon_wordmark.png',
                ROLE: details.role,
                FCM_TOKEN: details.fcmToken,
                IS_NEW_USER: details.isNewUser || false,

                ACCOUNT_IDENTIFIER: details.email,
                AUTH_METHOD: metadata.authMethod,

                // rawDevice
                OS: metadata.rawDevice.os,
                BROWSER: metadata.rawDevice.browser,
                DEVICE_TYPE: metadata.rawDevice.deviceType,
                DEVICE_NAME: metadata.rawDevice.deviceName,
                SUMMARY: metadata.rawDevice.summary,

                // appInfo
                APP_VERSION: metadata.appInfo.appVersion,
                PLATFORM: metadata.appInfo.platform,
                DEVICE_ID: metadata.appInfo.deviceId,
                CARRIER: metadata.appInfo.carrier,

                // ip
                IP_ADDRESS: metadata.ipAddress,
                REAL_IP: metadata.realIp,
                IP: metadata.ip,

                // Device
                DEVICE: metadata.device,

                // location
                LOCATION: metadata.location,

                // cdn
                DATACENTER: metadata.cdn.datacenter,
                TIME: details.loginTime,
                NEW_DEVICE_BADGE: Boolean(metadata.isNewDevice),
                SECURITY_URL: securityUrl,
                REVOKE_URL: revokeUrl
            }
            const html = await renderTemplate(NOTIFICATION.TEMPLATE.USER.ALERT, account);
            await NotificationDispatcher.dispatch({
                contextName: 'LoginAlert',
                email: (account.EMAIL) ? {
                    to: email,
                    toName: account.NAME,
                    subject: NOTIFICATION.SUBJECT.AUTH.ALERT,
                    html: html
                } : null,

                push: (account.FCM_TOKEN && !account.IS_NEW_USER) ? {
                    fcmToken: account.FCM_TOKEN,
                    title: NOTIFICATION.PUSH.USER.TITLE.WELCOME,
                    body: NOTIFICATION.PUSH.USER.BODY.WELCOME,
                    image: account.IMAGE_URL,
                    id: account.ID,
                    type: NOTIFICATION.PUSH.USER.TYPE.WELCOME,
                    role: account.ROLE,
                } : null
            });

            return true;
        } catch (error) {
            getLogger().error({ err: error, email }, '[AuthNotificationService] sendAlertEmail Error');
            return false;
        }
    }
}

export default new AuthNotificationService();