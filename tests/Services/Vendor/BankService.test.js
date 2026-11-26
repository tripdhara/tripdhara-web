import { jest } from '@jest/globals';

const mockUserAuthResponse = jest.fn((user) => ({ id: user?._id?.toString(), email: user?.email, businessProfile: { bankDetails: {} } }));

jest.unstable_mockModule('@/core/Helpers/userProfileHelper.js', () => ({
    userPayload: jest.fn(),
    userPayloadMini: jest.fn(),
    userDetailsPayload: jest.fn(),
    userProfileById: jest.fn(),
    userBusinessProfileById: jest.fn(),
    userBusinessPayload: jest.fn(),
    userAuthResponse: mockUserAuthResponse,
    default: { userAuthResponse: mockUserAuthResponse }
}));

const { default: BankService } = await import('@/core/Services/Vendor/BankService.js');
const { default: Vendor } = await import('@/core/Models/Vendor.js');
const { default: User } = await import('@/core/Models/User.js');

const createVendorQueryMock = (val) => ({
    select: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    lean: jest.fn().mockResolvedValue(val),
    exec: jest.fn().mockResolvedValue(val),
    then: (resolve, reject) => Promise.resolve(val).then(resolve, reject)
});

describe('Vendor BankService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(Vendor, 'findOne');
        jest.spyOn(Vendor, 'findOneAndUpdate');
        jest.spyOn(User, 'findById').mockResolvedValue({ _id: 'user123', email: 'vendor@test.com', role: 'vendor' });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('updateBankDetails', () => {
        test('should update bank details without file upload', async () => {
            const userId = 'user123';
            const bankData = { accountHolderName: 'John Doe', accountNumber: '12345' };
            const mockVendor = { _id: 'v1', bankDetails: {} };

            Vendor.findOne.mockReturnValue(createVendorQueryMock(mockVendor));
            Vendor.findOneAndUpdate.mockResolvedValue({ _id: 'v1', bankDetails: bankData });

            const result = await BankService.updateBankDetails(userId, bankData);

            expect(Vendor.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: 'v1' },
                { $set: { bankDetails: expect.objectContaining(bankData) } },
                expect.objectContaining({ returnDocument: 'after' })
            );
            expect(result).toBeDefined();
        });

        test('should update bank details with cancelledCheque URL', async () => {
            const userId = 'user123';
            const bankData = { cancelledCheque: 'http://cloud.com/img' };
            const mockVendor = { _id: 'v1', bankDetails: {} };

            Vendor.findOne.mockReturnValue(createVendorQueryMock(mockVendor));
            Vendor.findOneAndUpdate.mockResolvedValue({
                _id: 'v1',
                bankDetails: { cancelledCheque: { url: 'http://cloud.com/img' } }
            });

            const result = await BankService.updateBankDetails(userId, bankData);

            expect(Vendor.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: 'v1' },
                { $set: { bankDetails: expect.objectContaining({ cancelledCheque: { url: 'http://cloud.com/img' } }) } },
                expect.any(Object)
            );
            expect(result).toBeDefined();
        });
    });

    describe('deleteBankDetails', () => {
        test('should remove bank details', async () => {
            const populateMock = jest.fn().mockResolvedValue({ _id: 'v1' });
            Vendor.findOneAndUpdate.mockReturnValue({
                populate: populateMock
            });

            await BankService.deleteBankDetails('u1');

            expect(Vendor.findOneAndUpdate).toHaveBeenCalledWith(
                { user: 'u1', deletedAt: null },
                { $unset: { bankDetails: "" } },
                expect.anything()
            );
            expect(User.findById).toHaveBeenCalledWith('u1');
        });
    });
});
