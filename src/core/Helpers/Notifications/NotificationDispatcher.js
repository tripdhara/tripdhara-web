import nodemailer from 'nodemailer';
import { getAppConfig } from '@/core/Lib/appConfig.js';
import { getLogger } from '@/core/Lib/logger.js';
import AppError from '@/core/Errors/AppError.js';
import { SYSTEM_ENV } from '@/core/Constants/index.js';
import Notification from '@/core/Models/Notification.js';
import CacheService from '@/core/Services/CacheService.js';
import { PushNotificationService } from '@/core/Services/PushNotificationService.js';
import { notificationEmitter } from '@/core/Services/General/NotificationService.js';

/**
 * NotificationDispatcher
 * Unified multi-channel dispatcher supporting Email, Push, In-App, SMS, and WhatsApp.
 */
export class NotificationDispatcher {
    static _transporter = null;

    /**
     * Serverless-optimized SMTP Transporter (pool disabled on Vercel to avoid stale sockets)
     */
    static async _getTransporter() {
        const isServerless = SYSTEM_ENV.IS_SERVERLESS;
        if (!isServerless && NotificationDispatcher._transporter) {
            return NotificationDispatcher._transporter;
        }

        const config = await getAppConfig();
        const { host, port = 587, user, pass } = config.smtp || {};

        const transporter = nodemailer.createTransport({
            host,
            port: Number(port),
            secure: Number(port) === 465,
            auth: { user, pass },
            pool: !isServerless,
            connectionTimeout: 10000,
            tls: { rejectUnauthorized: false }
        });

        if (!isServerless) NotificationDispatcher._transporter = transporter;
        return transporter;
    }

    /**
     * In-App Notification (DB + Redis Cache + SSE)
     */
    static async dispatchInApp(payload) {
        if (!payload?.recipient) return null;

        const notif = await Notification.create(payload);
        await CacheService.del(`user:notifications:unread:${payload.recipient}`).catch(() => { });
        notificationEmitter.emit('notification', {
            recipientId: payload.recipient.toString(),
            notification: notif
        });

        return notif;
    }

    /**
     * Email Dispatcher (SMTP)
     */
    static async dispatchEmail({ to, toName, subject, html, text, attachments }) {
        if (!to) throw AppError.badRequest("Recipient email address ('to') is required");

        const config = await getAppConfig();
        const transporter = await NotificationDispatcher._getTransporter();

        const fromAddress = config.smtp?.from_address || config.smtp?.user;
        const fromName = config.smtp?.from_name;

        return await transporter.sendMail({
            from: fromName ? { name: fromName, address: fromAddress } : fromAddress,
            to: toName ? { name: toName, address: to } : to,
            replyTo: fromAddress,
            subject,
            html,
            ...(text && { text }),
            ...(attachments && { attachments })
        });
    }

    /**
     * Push Notification Dispatcher (FCM)
     */
    static async dispatchPush({ fcmToken, title, body, image, id, type, role, data }) {
        if (!fcmToken) return null;

        return await PushNotificationService.sendToDevice(
            fcmToken,
            { title, body, ...(image && { image }) },
            {
                referenceId: String(id),
                referenceType: String(type),
                ...(role && { role: String(role) }),
                ...(data || {})
            }
        );
    }

    /**
     * SMS Dispatcher (MSG91 Flow API)
     */
    static async dispatchSMS({ phone, message }) {
        if (!phone || !message) return false;

        const config = await getAppConfig();
        const authKey = config?.msg91?.auth_key || config?.secrets?.msg91_auth_key;
        const templateId = config?.msg91?.template_id || config?.secrets?.msg91_template_id;

        if (!authKey) return false;

        const formattedPhone = String(phone).replace(/^\+/, '');
        const response = await fetch('https://control.msg91.com/api/v5/flow/', {
            method: 'POST',
            headers: {
                'authkey': authKey,
                'content-type': 'application/json'
            },
            signal: AbortSignal.timeout(5000),
            body: JSON.stringify({
                template_id: templateId || 'default',
                short_url: '0',
                recipients: [{ mobiles: formattedPhone, message }]
            })
        });

        return response.ok;
    }

    /**
     * WhatsApp Dispatcher (MSG91 WhatsApp Flow API)
     */
    static async dispatchWhatsApp({ phone, message }) {
        if (!phone || !message) return false;

        const config = await getAppConfig();
        const authKey = config?.msg91?.auth_key || config?.secrets?.msg91_auth_key;
        if (!authKey) return false;

        const formattedPhone = String(phone).replace(/^\+/, '');
        try {
            const response = await fetch('https://control.msg91.com/api/v5/flow/', {
                method: 'POST',
                headers: {
                    'authkey': authKey,
                    'content-type': 'application/json'
                },
                signal: AbortSignal.timeout(5000),
                body: JSON.stringify({
                    template_id: config?.msg91?.whatsapp_template_id || config?.msg91?.template_id || 'default',
                    short_url: '0',
                    recipients: [{ mobiles: formattedPhone, message }]
                })
            });
            return response.ok;
        } catch (error) {
            getLogger().error({ err: error, phone }, '[NotificationDispatcher] WhatsApp Dispatch failed');
            return false;
        }
    }

    /**
     * Master Multi-Channel Dispatcher
     * Supports: email, push, inApp, sms, whatsapp
     * All channels are optional. Pass only the channels you need, or null/undefined to skip.
     */
    static async dispatch({ contextName = 'Notification', email, push, inApp, sms, whatsapp } = {}) {
        const tasks = [];
        const channels = [];

        // 1. In-App Notification (Database + SSE)
        if (inApp?.recipient) {
            tasks.push(NotificationDispatcher.dispatchInApp(inApp));
            channels.push('InApp');
        }

        // 2. Email Task (SMTP)
        if (email?.to) {
            tasks.push(NotificationDispatcher.dispatchEmail(email));
            channels.push('Email');
        }

        // 3. Push Notification Task (FCM)
        if (push?.fcmToken) {
            tasks.push(NotificationDispatcher.dispatchPush(push));
            channels.push('PushNotification');
        }

        // 4. SMS Task (MSG91 Flow)
        if (sms?.phone && sms?.message) {
            tasks.push(NotificationDispatcher.dispatchSMS(sms));
            channels.push('SMS');
        }

        // 5. WhatsApp Task (MSG91 Flow)
        if (whatsapp?.phone && whatsapp?.message) {
            tasks.push(NotificationDispatcher.dispatchWhatsApp(whatsapp));
            channels.push('WhatsApp');
        }

        if (tasks.length === 0) return true;

        const results = await Promise.allSettled(tasks);

        results.forEach((res, index) => {
            if (res.status === 'rejected') getLogger().error({ err: res.reason, channel: channels[index], context: contextName }, `[NotificationDispatcher] ${contextName} failed on channel: ${channels[index]}`);
        });

        return results;
    }
}

export default NotificationDispatcher;
