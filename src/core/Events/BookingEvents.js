import { EventEmitter } from 'events';
import BookingNotificationService from '@/core/Services/Notifications/domains/BookingNotificationService.js';
import { getLogger } from '@/core/Lib/logger.js';
import { NOTIFICATION } from '../Constants/notification.js';

const BookingEvents = new EventEmitter();

// ================================================================== //
//                                                                    //
//                      BOOKING Events Emails                         //
//                                                                    //
// ================================================================== //
const bookingEmailListener = (eventKey, handlerFn) => {
    BookingEvents.on(eventKey, async ({ identifier, details, businessName = {} }) => {
        try {
            if (identifier && identifier.includes('@')) {
                await handlerFn(identifier, details, businessName);
            }
        } catch (error) {
            getLogger().error({ err: error }, `[BookingEvents] Error handling ${eventKey}`);
        }
    });
};

// Business Profile Emails
// bookingEmailListener(NOTIFICATION.KEY.BUSINESS.PROFILE_CREATED, (id, data) => BookingNotificationService.sendBusinessWelcomeEmail(id, data));

BookingEvents.emitAsync = async function (event, data) {
    const listeners = this.listeners(event);
    if (!listeners || listeners.length === 0) return [];
    return await Promise.all(listeners.map(fn => fn(data)));
};

export default BookingEvents;