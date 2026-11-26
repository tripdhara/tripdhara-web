import { jest } from '@jest/globals';
import { createMockQueryHelpers, createMockModels } from '../../../utils/mockHelpers.js';

const mockQHelpers = createMockQueryHelpers();
const mockModels = createMockModels();
const mockGetVendorPackages = jest.fn();
const mockGetVendorPackageItemById = jest.fn();
const mockUserAuthResponse = jest.fn().mockResolvedValue({ id: 'user123', email: 'v@test.com' });

jest.unstable_mockModule('@/core/Helpers/queryHelpers.js', () => mockQHelpers);
jest.unstable_mockModule('@/core/Models/index', () => mockModels);
jest.unstable_mockModule('@/core/Models/User', () => ({ default: mockModels.User }));
jest.unstable_mockModule('@/core/Helpers/Package/vendorPackage.js', () => ({
    getVendorPackages: mockGetVendorPackages,
    getVendorPackageItemById: mockGetVendorPackageItemById
}));
jest.unstable_mockModule('@/core/Helpers/userProfileHelper', () => ({
    userAuthResponse: mockUserAuthResponse
}));
jest.unstable_mockModule('@/events/PackageEvents', () => ({
    default: {
        emitAsync: jest.fn().mockResolvedValue([])
    }
}));
jest.unstable_mockModule('@/core/Services/Vendor/PackageService.js', () => ({
    default: {
        addItem: jest.fn(),
        updateItem: jest.fn(),
        _invalidateCaches: jest.fn().mockResolvedValue(true)
    }
}));

const { default: PackageController } = await import('@/core/Http/Controllers/Vendor/PackageController.js');
const { default: PackageService } = await import('@/core/Services/Vendor/PackageService.js');
const { HTTP_STATUS, RESPONSE_MESSAGES } = await import('@/core/Constants/index.js');
const { createMockReq } = await import('../../../Helpers/testUtils.js');

describe('Vendor PackageController', () => {
    let mockReq;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('getPackages', () => {
        test('should return packages for authenticated vendor', async () => {
            const mockResult = {
                items: [{ id: 'pkg1', title: 'Kedarkantha' }],
                pagination: { total: 1, page: 1, limit: 5, totalPages: 1 }
            };
            mockReq = createMockReq({
                user: { id: 'user123', role: 'vendor' },
                url: 'http://localhost/vendor/packages?page=1&limit=5'
            });
            mockGetVendorPackages.mockResolvedValue(mockResult);

            const response = await PackageController.getPackages(mockReq);
            const body = await response.json();

            expect(response.status).toBe(HTTP_STATUS.OK);
            expect(body.data).toEqual(mockResult.items);
            expect(mockGetVendorPackages).toHaveBeenCalledWith(expect.objectContaining({ userId: 'user123' }));
        });
    });

    describe('addPackageItem', () => {
        test('should add package item successfully', async () => {
            const mockItem = { _id: 'item123', title: 'Test Trek' };
            mockReq = createMockReq({ user: { id: 'user123', role: 'vendor' } });
            mockReq.payload = { category: 'trekking', title: 'Test Trek' };
            PackageService.addItem.mockResolvedValue(mockItem);

            const response = await PackageController.addPackageItem(mockReq);
            const body = await response.json();

            expect(response.status).toBe(HTTP_STATUS.CREATED);
            expect(body.message).toBe(RESPONSE_MESSAGES.PACKAGE.CREATED);
            expect(PackageService.addItem).toHaveBeenCalledWith('user123', 'trekking', mockReq.payload);
        });

        test('should return 400 when category is missing', async () => {
            mockReq = createMockReq({ user: { id: 'user123', role: 'vendor' } });
            mockReq.payload = { title: 'Test Trek' };

            const response = await PackageController.addPackageItem(mockReq);
            expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
        });
    });

    describe('updatePackageStatus', () => {
        test('should toggle package item status successfully', async () => {
            const validItemId = '507f1f77bcf86cd799439011';
            mockReq = createMockReq({
                user: { id: 'user123', role: 'vendor' },
                params: { itemId: validItemId }
            });
            mockReq.payload = { category: 'trekking', isActive: true };
            mockModels.Package.updateOne.mockResolvedValue({ matchedCount: 1, modifiedCount: 1 });
            mockQHelpers.getBusinessByUserId.mockResolvedValue({ _id: 'vendor123' });
            mockGetVendorPackageItemById.mockResolvedValue({ id: validItemId, isActive: true });

            const response = await PackageController.updatePackageStatus(mockReq, { params: { itemId: validItemId } });
            expect(response.status).toBe(HTTP_STATUS.OK);
            expect(mockModels.Package.updateOne).toHaveBeenCalled();
            expect(PackageService._invalidateCaches).toHaveBeenCalledWith('vendor123', validItemId);
        });
    });
});
