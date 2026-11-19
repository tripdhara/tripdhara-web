import { EventEmitter } from 'events';
import SystemNotificationService from '@/core/Services/Notifications/domains/SystemNotificationService.js';
import { getLogger } from '@/core/Lib/logger.js';
import { NOTIFICATION } from '../Constants/notification.js';

const SystemEvents = new EventEmitter();

// ================================================================== //
//                                                                    //
//                      PACKAGE Events Emails                         //
//                                                                    //
// ================================================================== //
const packageEmailListener = (eventKey, handlerFn) => {
    SystemEvents.on(eventKey, async ({ identifier, details, businessName = {} }) => {
        try {
            if (identifier && identifier.includes('@')) {
                await handlerFn(identifier, details, businessName);
            }
        } catch (error) {
            getLogger().error({ err: error }, `[SystemEvents] Error handling ${eventKey}`);
        }
    });
};

// Business Profile Emails
// packageEmailListener(NOTIFICATION.KEY.BUSINESS.PROFILE_CREATED, (id, data) => NotificationService.sendBusinessWelcomeEmail(id, data));

SystemEvents.emitAsync = async function (event, data) {
    const listeners = this.listeners(event);
    if (!listeners || listeners.length === 0) return [];
    return await Promise.all(listeners.map(fn => fn(data)));
};

export default SystemEvents;