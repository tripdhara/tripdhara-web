import { jest } from '@jest/globals';
import { createMockQueryHelpers } from '../../../utils/mockHelpers.js';

const mockQHelpers = createMockQueryHelpers();
jest.unstable_mockModule('@/core/Helpers/queryHelpers', () => mockQHelpers);

jest.unstable_mockModule('@/core/Services/Vendor/BankService.js', () => ({
    default: {
        syncBankDetails: jest.fn(),
        removeBankDetails: jest.fn()
    }
}));

jest.unstable_mockModule('@/core/Events/BusinessEvents.js', () => ({
    default: {
        emitAsync: jest.fn()
    }
}));

const { default: BankController } = await import('@/core/Http/Controllers/Vendor/BankController.js');
const { getBusinessByUserId } = await import('@/core/Helpers/queryHelpers');
const { default: BankService } = await import('@/core/Services/Vendor/BankService.js');
const { default: BusinessEvents } = await import('@/core/Events/BusinessEvents.js');
const { HTTP_STATUS } = await import('@/core/Constants/index.js');
const { NOTIFICATION } = await import('@/core/Constants/notification');
const { createMockReq } = await import('../../../Helpers/testUtils.js');

describe('Vendor BankController', () => {
    let mockReq;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getBankDetails', () => {
        it('should fetch bank details successfully', async () => {
            mockReq = createMockReq({ user: { id: 'u1' } });
            getBusinessByUserId.mockResolvedValue({ bankDetails: { accountNumber: '123' } });

            const response = await BankController.getBankDetails(mockReq);
            const body = await response.json();

            expect(response.status).toBe(HTTP_STATUS.OK);
            expect(body.data.accountNumber).toBe('123');
            expect(getBusinessByUserId).toHaveBeenCalledWith('u1');
        });

        it('should return 404 if vendor not found', async () => {
            mockReq = createMockReq({ user: { id: 'u1' } });
            getBusinessByUserId.mockResolvedValue(null);
            const response = await BankController.getBankDetails(mockReq);
            expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
        });

        it('should handle errors gracefully', async () => {
            mockReq = createMockReq({ user: { id: 'u1' } });
            getBusinessByUserId.mockRejectedValue(new Error('err'));
            const response = await BankController.getBankDetails(mockReq);
            expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
        });
    });

    describe('createBankDetails', () => {
        it('should create bank details successfully', async () => {
            mockReq = createMockReq({ user: { id: 'u1' } });
            mockReq.payload = { accountNumber: '123' };
            BankService.syncBankDetails.mockResolvedValue({ email: 'a@b.com' });

            const response = await BankController.createBankDetails(mockReq);

            expect(response.status).toBe(HTTP_STATUS.CREATED);
            expect(BankService.syncBankDetails).toHaveBeenCalledWith('u1', { accountNumber: '123' });
            expect(BusinessEvents.emitAsync).toHaveBeenCalledWith(
                NOTIFICATION.KEY.BUSINESS.BANK.CREATED,
                expect.objectContaining({ identifier: 'a@b.com' })
            );
        });

        it('should handle errors gracefully', async () => {
            mockReq = createMockReq({ user: { id: 'u1' } });
            BankService.syncBankDetails.mockRejectedValue(new Error('err'));
            const response = await BankController.createBankDetails(mockReq);
            expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
        });
    });

    describe('updateBankDetails', () => {
        it('should update bank details successfully', async () => {
            mockReq = createMockReq({ user: { id: 'u1' } });
            mockReq.payload = { accountNumber: '456' };
            BankService.syncBankDetails.mockResolvedValue({ email: 'a@b.com' });

            const response = await BankController.updateBankDetails(mockReq);
            expect(response.status).toBe(HTTP_STATUS.OK);
            expect(BankService.syncBankDetails).toHaveBeenCalledWith('u1', { accountNumber: '456' });
            expect(BusinessEvents.emitAsync).toHaveBeenCalledWith(
                NOTIFICATION.KEY.BUSINESS.BANK.UPDATED,
                expect.objectContaining({ identifier: 'a@b.com' })
            );
        });

        it('should handle errors gracefully', async () => {
            mockReq = createMockReq({ user: { id: 'u1' } });
            BankService.syncBankDetails.mockRejectedValue(new Error('err'));
            const response = await BankController.updateBankDetails(mockReq);
            expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
        });
    });

    describe('deleteBankDetails', () => {
        it('should delete bank details successfully', async () => {
            mockReq = createMockReq({ user: { id: 'u1' } });
            BankService.removeBankDetails.mockResolvedValue({ email: 'a@b.com', bankDetails: {} });

            const response = await BankController.deleteBankDetails(mockReq);
            expect(response.status).toBe(HTTP_STATUS.OK);
            expect(BankService.removeBankDetails).toHaveBeenCalledWith('u1');
            expect(BusinessEvents.emitAsync).toHaveBeenCalledWith(
                NOTIFICATION.KEY.BUSINESS.BANK.DELETED,
                expect.objectContaining({ identifier: 'a@b.com' })
            );
        });

        it('should handle errors gracefully', async () => {
            mockReq = createMockReq({ user: { id: 'u1' } });
            BankService.removeBankDetails.mockRejectedValue(new Error('err'));
            const response = await BankController.deleteBankDetails(mockReq);
            expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
        });
    });
});
