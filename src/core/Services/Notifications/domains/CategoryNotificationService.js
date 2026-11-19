import { renderTemplate } from '@/core/Helpers/TemplateHelper.js';
import { getAppConfig } from '@/core/Lib/appConfig.js';
import { getLogger } from '@/core/Lib/logger.js';
import { NOTIFICATION } from '@/core/Constants/notification.js';
import NotificationDispatcher from '@/core/Helpers/Notifications/NotificationDispatcher.js';
import { getCategoryBySlug, getCategoryDocumentsBy } from '@/core/Helpers/queryHelpers.js';
import { NOTIFICATION_CATEGORIES, NOTIFICATION_PRIORITIES } from '@/core/Constants/index';

export class CategoryNotificationService {

    async sendBusinessCategoryDocumentUploadEmail(email, details) {
        try {
            const businessProfile = details?.businessProfile || {};
            const businessName = businessProfile?.businessName || 'Partner';
            const documents = details?.documents || [];
            const categorySlug = details?.category_slug;
            const category = await getCategoryBySlug(categorySlug, '_id name');
            const categoryName = category?.name;
            const docSlugs = documents.map(d => d.document_slug);
            const categoryDocs = await getCategoryDocumentsBy(
                { category_slug: categorySlug, slug: { $in: docSlugs } },
                'name slug'
            );
            const docNameMap = new Map(categoryDocs.map(cd => [cd.slug, cd.name]));
            const getDocName = (slug) => docNameMap.get(slug) || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

            const attachments = documents.map(doc => ({
                filename: `${getDocName(doc.document_slug)}.jpg`,
                path: doc.url
            }));

            const documentRows = documents.map((doc, i) => `
                <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 10px 14px; font-size: 13px; color: #64748b;">${i + 1}</td>
                    <td style="padding: 10px 14px; font-size: 13.5px; font-weight: 600; color: #1e293b;">${getDocName(doc.document_slug)}</td>
                    <td style="padding: 10px 14px; text-align: right;"><a href="${doc.url}" target="_blank" style="color: #1a7045; text-decoration: none; font-weight: 600; font-size: 13px;">View File &rarr;</a></td>
                </tr>
            `).join('');

            const account = {
                ID: businessProfile.id,
                NAME: businessName,
                BUSINESS_NAME: businessName,
                EMAIL: details.email || '',
                PHONE: details.phone || '',
                IMAGE_URL: businessProfile?.profileImage || 'https://media.tripdhara.com/tripdhara_icon_wordmark.png',
                ROLE: details.role,
                FCM_TOKEN: details.fcmToken,

                BUSINESS_OWNER_NAME: businessProfile?.ownerName || '',
                BUSINESS_ADDRESS: businessProfile?.address || '',
                BUSINESS_PHONE: businessProfile?.businessNumber || '',
                CATEGORY_NAME: categoryName,
                DOCUMENT_ROWS: documentRows
            };

            const html = await renderTemplate(NOTIFICATION.TEMPLATE.CATEGORY.CATEGORY_DOCUMENT_UPLOADED, account);
            await NotificationDispatcher.dispatch({
                contextName: 'CategoryDocumentsUploaded',
                email: (account.EMAIL) ? {
                    to: email,
                    toName: account.NAME,
                    subject: `Documents Received for ${account.CATEGORY_NAME} - Tripdhara`,
                    html: html,
                    attachments: attachments
                } : null,

                push: (account.FCM_TOKEN) ? {
                    fcmToken: account.FCM_TOKEN,
                    title: NOTIFICATION.PUSH.BUSINESS.TITLE.CATEGORY_DOCUMENT_UPLOADED,
                    body: `${account.CATEGORY_NAME} ` + NOTIFICATION.PUSH.BUSINESS.BODY.CATEGORY_DOCUMENT_UPLOADED,
                    image: account.IMAGE_URL,

                    id: account.ID,
                    type: NOTIFICATION.PUSH.BUSINESS.TYPE.CATEGORY_DOCUMENT_UPLOADED,
                    role: account.ROLE,
                } : null,

                // inApp Object:
                inApp: (details.id) ? {
                    recipient: details.id,
                    recipientRole: account.ROLE,
                    title: NOTIFICATION.PUSH.BUSINESS.TITLE.CATEGORY_DOCUMENT_UPLOADED,
                    message: `${account.CATEGORY_NAME} ` + NOTIFICATION.PUSH.BUSINESS.BODY.CATEGORY_DOCUMENT_UPLOADED,
                    type: NOTIFICATION.PUSH.BUSINESS.TYPE.CATEGORY_DOCUMENT_UPLOADED,
                    category: NOTIFICATION_CATEGORIES.CATEGORY,
                    priority: NOTIFICATION_PRIORITIES.MEDIUM,
                    referenceId: category._id,
                    referenceModel: 'Category',
                    referenceType: NOTIFICATION.PUSH.BUSINESS.TYPE.CATEGORY_DOCUMENT_UPLOADED,
                    imageUrl: account.IMAGE_URL,
                    groupKey: `category_docs_${categorySlug}_${details.id}`,
                    deliveryStatus: {
                        inApp: true,
                        email: { sent: Boolean(account.EMAIL), sentAt: new Date() },
                        push: { sent: Boolean(account.FCM_TOKEN), sentAt: new Date() }
                    },
                    data: {
                        categorySlug: categorySlug,
                        totalDocuments: documents.length
                    }
                } : null
            });
            return true;
        } catch (error) {
            getLogger().error({ err: error, email }, '[CategoryNotificationService] sendBusinessCategoryDocumentUploadEmail Error');
            return false;
        }
    }
}

export default new CategoryNotificationService();