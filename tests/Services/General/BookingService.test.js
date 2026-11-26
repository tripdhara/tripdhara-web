import { jest } from '@jest/globals';
import BookingService from '@/core/Services/General/BookingService.js';
import Booking from '@/core/Models/Booking.js';
import NotificationService from '@/core/Services/General/NotificationService.js';

describe('General BookingService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(Booking, 'findById');
        jest.spyOn(Booking, 'findOne');
        jest.spyOn(NotificationService, 'notifyBookingStatus').mockResolvedValue(true);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('getBookingById should return populated booking', async () => {
        const mockBooking = { _id: 'b1' };
        const queryMock = {
            populate: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(mockBooking)
        };
        Booking.findById.mockReturnValue(queryMock);

        const result = await BookingService.getBookingById('b1');
        expect(result).toEqual(mockBooking);
    });

    test('updatePaymentStatus should update booking and notify', async () => {
        const mockBooking = {
            _id: 'b1',
            paymentStatus: 'pending',
            timeline: [],
            save: jest.fn().mockResolvedValue(true)
        };
        Booking.findOne.mockReturnValue({
            session: jest.fn().mockResolvedValue(mockBooking)
        });

        const result = await BookingService.updatePaymentStatus('order123', 'pay123', 'sig123');

        expect(result.paymentStatus).toBe('paid');
        expect(result.status).toBe('confirmed');
        expect(mockBooking.save).toHaveBeenCalled();
        expect(NotificationService.notifyBookingStatus).toHaveBeenCalledWith('b1', 'confirmed');
    });

    test('updatePaymentStatus should throw error if booking not found', async () => {
        Booking.findOne.mockReturnValue({
            session: jest.fn().mockResolvedValue(null)
        });
        await expect(BookingService.updatePaymentStatus('order123', 'pay123', 'sig123')).rejects.toThrow();
    });

    test('updatePaymentStatus should reject webhook when amount or currency mismatches booking total', async () => {
        const mockBooking = {
            _id: 'b1',
            pricing: { total: 5000 },
            paymentStatus: 'pending',
            timeline: [],
            save: jest.fn().mockResolvedValue(true)
        };
        Booking.findOne.mockReturnValue({
            session: jest.fn().mockResolvedValue(mockBooking)
        });

        await expect(
            BookingService.updatePaymentStatus('order123', 'pay123', 'WEBHOOK_VERIFIED', { amount: 100, currency: 'INR' })
        ).rejects.toThrow('Payment amount or currency mismatch.');
        expect(mockBooking.save).not.toHaveBeenCalled();
    });
});
