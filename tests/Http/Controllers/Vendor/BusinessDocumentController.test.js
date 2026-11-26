import BusinessDocumentController from '@/controllers/Vendor/BusinessDocumentController';
import DocumentService from '@/core/Services/Vendor/DocumentService.js';
import BusinessService from '@/core/Services/Vendor/BusinessService.js';
import BusinessEvents from '@/events/BusinessEvents.js';
import { createMockReq } from '../../../Helpers/testUtils.js';
import { HTTP_STATUS, RESPONSE_MESSAGES } from '@/constants/index.js';
import { jest } from '@jest/globals';

// Mock Services
jest.unstable_mockModule('@/core/Services/Vendor/DocumentService.js', () => ({
    default: {
        uploadVerificationFiles: jest.fn(),
        updateDocument: jest.fn(),
        deleteDocument: jest.fn()
    }
}));

jest.unstable_mockModule('@/core/Services/Vendor/BusinessService.js', () => ({
    default: {
        getBusinessByUserId: jest.fn()
    }
}));

jest.unstable_mockModule('@/core/Events/BusinessEvents.js', () => ({
    default: {
        emit: jest.fn()
    }
}));

// Re-import controller
const { default: MockedBusinessDocumentController } = await import('@/controllers/Vendor/BusinessDocumentController');

describe('Industry Standard: BusinessDocumentController API Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getDocuments', () => {
        it('[Success] should return vendor documents successfully', async () => {
            const mockVendor = { documents: { panCard: 'pan.pdf' } };
            BusinessService.getBusinessByUserId = jest.fn().mockResolvedValue(mockVendor);

            const req = createMockReq({ user: { id: 'user123' } });
            const response = await MockedBusinessDocumentController.getDocuments(req);
            const body = await response.json();

            expect(BusinessService.getBusinessByUserId).toHaveBeenCalledWith('user123');
            expect(response.status).toBe(HTTP_STATUS.OK);
            expect(body.message).toBe(RESPONSE_MESSAGES.VENDOR.DOCUMENTS_FETCHED);
            expect(body.data).toEqual(mockVendor.documents);
        });

        it('[Failure] should return internal server error if service fails', async () => {
            BusinessService.getBusinessByUserId = jest.fn().mockRejectedValue(new Error('Service failure'));

            const req = createMockReq({ user: { id: 'user123' } });
            const response = await MockedBusinessDocumentController.getDocuments(req);
            const body = await response.json();

            expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
            expect(body.message).toBe(RESPONSE_MESSAGES.ERROR.SERVER_ERROR);
        });
    });

    describe('uploadDocuments', () => {
        it('[Success] should upload documents and emit event', async () => {
            const mockResult = { email: 'vendor@test.com', businessName: 'Test Biz' };
            DocumentService.uploadVerificationFiles = jest.fn().mockResolvedValue(mockResult);
            BusinessEvents.emit = jest.fn();

            const req = createMockReq({ user: { id: 'user123' } });
            req.payload = { file: 'data' };

            const response = await MockedBusinessDocumentController.uploadDocuments(req);
            const body = await response.json();

            expect(DocumentService.uploadVerificationFiles).toHaveBeenCalledWith('user123', { file: 'data' });
            expect(BusinessEvents.emit).toHaveBeenCalledWith('vendor.document_uploaded', { identifier: 'vendor@test.com', details: mockResult });
            expect(response.status).toBe(HTTP_STATUS.OK);
            expect(body.message).toBe(RESPONSE_MESSAGES.VENDOR.DOCUMENTS_UPLOADED);
        });

        it('[Failure] should return internal server error if upload fails', async () => {
            DocumentService.uploadVerificationFiles = jest.fn().mockRejectedValue(new Error('Upload error'));

            const req = createMockReq({ user: { id: 'user123' } });
            req.payload = {};

            const response = await MockedBusinessDocumentController.uploadDocuments(req);

            expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
        });
    });

    describe('updateDocument', () => {
        it('[Success] should update document successfully', async () => {
            DocumentService.updateDocument = jest.fn().mockResolvedValue({ id: 'doc1' });

            const req = createMockReq({ user: { id: 'user123' } });
            req.payload = { docData: 'new' };

            const response = await MockedBusinessDocumentController.updateDocument(req);
            const body = await response.json();

            expect(DocumentService.updateDocument).toHaveBeenCalledWith('user123', { docData: 'new' });
            expect(response.status).toBe(HTTP_STATUS.OK);
            expect(body.message).toBe(RESPONSE_MESSAGES.VENDOR.DOCUMENT_UPDATED);
        });
    });

    describe('deleteDocument', () => {
        it('[Success] should delete document successfully', async () => {
            DocumentService.deleteDocument = jest.fn().mockResolvedValue(true);

            const req = createMockReq({ user: { id: 'user123' } });
            req.payload = { documentId: 'doc1' };

            const response = await MockedBusinessDocumentController.deleteDocument(req);
            const body = await response.json();

            expect(DocumentService.deleteDocument).toHaveBeenCalledWith('user123', 'doc1');
            expect(response.status).toBe(HTTP_STATUS.OK);
            expect(body.message).toBe(RESPONSE_MESSAGES.VENDOR.DOCUMENT_DELETED);
        });
    });
});
