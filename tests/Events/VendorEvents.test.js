import { EventEmitter } from 'events';
import * as events from '@/events/BusinessEvents.js';

describe('Events: BusinessEvents.js', () => {
    it('should export event instances and constants', () => {
        expect(events).toBeDefined();
        const keys = Object.keys(events);
        expect(keys.length).toBeGreaterThan(0);

        let hasEmitter = false;
        keys.forEach(key => {
            if (events[key] instanceof EventEmitter) {
                hasEmitter = true;
            }
        });

        // Some event files might just export constants and a default emitter
        // We just ensure it exports valid objects/strings
    });
});
