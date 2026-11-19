import { EventEmitter } from 'events';
import CategoryNotificationService from '@/core/Services/Notifications/domains/CategoryNotificationService.js';
import { getLogger } from '@/core/Lib/logger.js';
import { NOTIFICATION } from '../Constants/notification.js';

const CategoryEvents = new EventEmitter();

// ================================================================== //
//                                                                    //
//                      Category Events Emails                        //
//                                                                    //
// ================================================================== //
const categoryEmailListener = (eventKey, handlerFn) => {
    CategoryEvents.on(eventKey, async ({ identifier, details, businessName = {} }) => {
        try {
            if (identifier && identifier.includes('@')) {
                await handlerFn(identifier, details, businessName);
            }
        } catch (error) {
            getLogger().error({ err: error }, `[CategoryEvents] Error handling ${eventKey}`);
        }
    });
};

// Business Profile Emails
categoryEmailListener(NOTIFICATION.KEY.BUSINESS.CATEGORY_DOCUMENT_UPLOADED, (id, data) => CategoryNotificationService.sendBusinessCategoryDocumentUploadEmail(id, data));

CategoryEvents.emitAsync = async function (event, data) {
    const listeners = this.listeners(event);
    if (!listeners || listeners.length === 0) return [];
    return await Promise.all(listeners.map(fn => fn(data)));
};

export default CategoryEvents;