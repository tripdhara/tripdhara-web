import RazorpayService from '@/core/Services/General/RazorpayService.js';
import BookingService from '@/core/Services/General/BookingService.js';
import { HTTP_STATUS } from '@/core/Constants/index.js';
import Controller from '@/core/Controllers/Controller.js';
import { getWebhookEventBy } from '@/core/Helpers/queryHelpers.js';
import WebhookEvent from '@/core/Models/WebhookEvent.js';

const PAYMENT_EVENTS = new Set(['order.paid', 'payment.captured']);

const getNestedValue = (obj, path) => path.reduce((value, key) => value?.[key], obj);

const extractPaymentIdentifiers = (payload = {}) => ({
  orderId: getNestedValue(payload, ['order', 'entity', 'id']) || getNestedValue(payload, ['payment', 'entity', 'order_id']),
  paymentId: getNestedValue(payload, ['payment', 'entity', 'id']),
  amount: getNestedValue(payload, ['payment', 'entity', 'amount']),
  currency: getNestedValue(payload, ['payment', 'entity', 'currency'])
});

/**
 * PaymentController (General/Public Role) - Handles external payment webhooks.
 */
class PaymentController extends Controller {

  // POST /payment/webhook
  async webhook(req) {
    try {
      const signature = req.headers.get('x-razorpay-signature');
      let body = req.validData || req.jsonBody;
      if (!body && typeof req.json === 'function') {
        try {
          body = await req.json();
        } catch {
          return this.error(HTTP_STATUS.BAD_REQUEST, 'Invalid webhook JSON payload');
        }
      }
      const rawPayload = req.rawBody || (typeof body === 'string' ? body : JSON.stringify(body));

      const isValid = await RazorpayService.verifyWebhookSignature(rawPayload, signature);
      if (!isValid) return this.error(HTTP_STATUS.BAD_REQUEST, 'Invalid webhook signature');

      // Replay Protection: Check if this event was already processed (via Header or Payload ID)
      const eventId = req.headers.get('x-razorpay-event-id') || body?.id || body?.event_id;
      let createdWebhookEvent = false;
      if (eventId) {

          const existingEvent = await getWebhookEventBy({ eventId });
          if (existingEvent) {
              return this.success(HTTP_STATUS.OK, 'Webhook already processed (Replay Protection)', { received: true });
          }
          try {
              await WebhookEvent.create({ eventId, gateway: 'razorpay' });
              createdWebhookEvent = true;
          } catch (createErr) {
              if (createErr?.code === 11000) {
                  return this.success(HTTP_STATUS.OK, 'Webhook already processed (Replay Protection)', { received: true });
              }
              throw createErr;
          }
      }

      const { event, payload } = body || {};
      if (!event || !payload || typeof payload !== 'object') {
        return this.error(HTTP_STATUS.BAD_REQUEST, 'Invalid webhook payload');
      }

      if (PAYMENT_EVENTS.has(event)) {
        const { orderId, paymentId, amount, currency } = extractPaymentIdentifiers(payload);
        if (!orderId || !paymentId) {
          return this.error(HTTP_STATUS.BAD_REQUEST, 'Invalid payment webhook payload');
        }

        try {
          await BookingService.updatePaymentStatus(orderId, paymentId, 'WEBHOOK_VERIFIED', { amount, currency });
        } catch (updateErr) {
          if (createdWebhookEvent && (!updateErr?.statusCode || updateErr.statusCode >= 500)) {
            await WebhookEvent.deleteOne({ eventId }).catch(() => {});
          }
          throw updateErr;
        }
      }

      return this.success(HTTP_STATUS.OK, 'Webhook processed', { received: true });
    } catch (error) {
      return this.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Webhook processing failed');
    }
  }
}

const paymentController = new PaymentController();
export default paymentController;
