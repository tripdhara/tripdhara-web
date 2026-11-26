import { jest } from '@jest/globals';

const mockUserAuthResponse = jest.fn((user) => ({ id: user?._id?.toString(), email: user?.email }));

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

const { default: DocumentService } = await import('@/core/Services/Vendor/DocumentService.js');
const { default: Vendor } = await import('@/core/Models/Vendor.js');
const { default: User } = await import('@/core/Models/User.js');

const createVendorQueryMock = (val) => ({
    select: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    lean: jest.fn().mockResolvedValue(val),
    exec: jest.fn().mockResolvedValue(val),
    then: (resolve, reject) => Promise.resolve(val).then(resolve, reject)
});

describe('Vendor DocumentService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(Vendor, 'findOne');
        jest.spyOn(Vendor, 'findOneAndUpdate');
        jest.spyOn(User, 'findById').mockResolvedValue({ _id: 'user123', email: 'vendor@test.com', role: 'vendor' });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('uploadVerificationFiles', () => {
        test('should upload multiple documents successfully', async () => {
            const userId = 'user123';
            const files = {
                panCard: 'http://cloud.com/pan.pdf',
                gstRegistration: 'http://cloud.com/gst.pdf'
            };
            const mockVendor = { _id: 'v1', documents: {} };

            Vendor.findOne.mockReturnValue(createVendorQueryMock(mockVendor));
            Vendor.findOneAndUpdate.mockResolvedValue({ _id: 'v1', documents: { panCard: { url: 'http://cloud.com/pan.pdf' } } });

            const result = await DocumentService.uploadVerificationFiles(userId, files);

            expect(Vendor.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: 'v1' },
                {
                    $set: {
                        'documents.panCard': { url: 'http://cloud.com/pan.pdf', status: 'pending' },
                        'documents.gstRegistration': { url: 'http://cloud.com/gst.pdf', status: 'pending' }
                    }
                },
                expect.objectContaining({ returnDocument: 'after' })
            );
            expect(result).toBeDefined();
        });

        test('should handle aadharCard array', async () => {
            const userId = 'user123';
            const files = {
                aadharCard: ['http://cloud.com/front.jpg', 'http://cloud.com/back.jpg']
            };
            const mockVendor = { _id: 'v1', documents: {} };

            Vendor.findOne.mockReturnValue(createVendorQueryMock(mockVendor));
            Vendor.findOneAndUpdate.mockResolvedValue({ _id: 'v1', documents: { aadharCard: [] } });

            await DocumentService.uploadVerificationFiles(userId, files);

            expect(Vendor.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: 'v1' },
                {
                    $set: {
                        'documents.aadharCard': [
                            { url: 'http://cloud.com/front.jpg', status: 'pending' },
                            { url: 'http://cloud.com/back.jpg', status: 'pending' }
                        ]
                    }
                },
                expect.objectContaining({ returnDocument: 'after' })
            );
        });

        test('should throw error if vendor not found', async () => {
            Vendor.findOne.mockReturnValue(createVendorQueryMock(null));
            await expect(DocumentService.uploadVerificationFiles('u1', {})).rejects.toThrow();
        });
    });

    describe('deleteDocument', () => {
        test('should remove document from profile', async () => {
            Vendor.findOneAndUpdate.mockResolvedValue({ _id: 'v1', documents: {} });

            await DocumentService.deleteDocument('u1', 'doc123');

            expect(Vendor.findOneAndUpdate).toHaveBeenCalledWith(
                { user: 'u1' },
                expect.objectContaining({ $pull: { "documents.aadharCard": { _id: 'doc123' } } }),
                expect.anything()
            );
        });
    });
});
