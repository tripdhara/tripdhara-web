import { jest } from '@jest/globals';

const mockLogger = {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
};

jest.unstable_mockModule('@/core/Lib/logger.js', () => ({
    getLogger: jest.fn().mockReturnValue(mockLogger),
}));

jest.unstable_mockModule('@/core/Lib/appConfig.js', () => ({
    getAppConfig: jest.fn().mockImplementation(() => Promise.resolve({
        cloudinary: { url: 'cloudinary://test:test@test' }
    }))
}));

jest.unstable_mockModule('sharp', () => ({
    default: jest.fn().mockReturnValue({
        resize: jest.fn().mockReturnThis(),
        webp: jest.fn().mockReturnThis(),
        toBuffer: jest.fn().mockResolvedValue(Buffer.from('mock-image'))
    })
}));

const { uploadToCloudinary } = await import('@/core/Helpers/cloudinary.js');
const { v2: cloudinary } = await import('cloudinary');
import { HTTP_STATUS } from '@/core/Constants/index.js';

describe('Cloudinary Helper', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.clearAllMocks();
        process.env = { ...originalEnv, CLOUDINARY_URL: 'cloudinary://test:test@test' };
        
        jest.spyOn(cloudinary.uploader, 'upload').mockImplementation(() => {});
        jest.spyOn(cloudinary, 'config').mockImplementation(() => {});
    });

    afterEach(() => {
        process.env = originalEnv;
        jest.restoreAllMocks();
    });

    test('should upload file successfully without upload_preset when CLOUDINARY_UPLOAD_PRESET is not defined', async () => {
        delete process.env.CLOUDINARY_UPLOAD_PRESET;
        const mockFile = {
            type: 'image/jpeg',
            size: 1024,
            arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8))
        };

        cloudinary.uploader.upload.mockResolvedValue({
            secure_url: 'http://res.cloudinary.com/test.jpg',
            public_id: 'test_id'
        });

        const result = await uploadToCloudinary(mockFile, 'test-folder');
        expect(result.url).toBe('http://res.cloudinary.com/test.jpg');
        expect(cloudinary.uploader.upload).toHaveBeenCalledWith(
            expect.stringContaining('data:image/webp;base64,'),
            expect.not.objectContaining({ upload_preset: expect.anything() })
        );
    });

    test('should include upload_preset when CLOUDINARY_UPLOAD_PRESET is defined', async () => {
        process.env.CLOUDINARY_UPLOAD_PRESET = 'custom_preset';
        const mockFile = {
            type: 'image/jpeg',
            size: 1024,
            arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8))
        };

        cloudinary.uploader.upload.mockResolvedValue({
            secure_url: 'http://res.cloudinary.com/test.jpg',
            public_id: 'test_id'
        });

        const result = await uploadToCloudinary(mockFile, 'test-folder');
        expect(result.url).toBe('http://res.cloudinary.com/test.jpg');
        expect(cloudinary.uploader.upload).toHaveBeenCalledWith(
            expect.stringContaining('data:image/webp;base64,'),
            expect.objectContaining({ upload_preset: 'custom_preset' })
        );
    });

    test('should not retry on 4xx client errors from Cloudinary', async () => {
        const mockFile = {
            type: 'image/jpeg',
            size: 1024,
            arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8))
        };

        const clientError = new Error('Upload preset not found');
        clientError.http_code = 400;

        cloudinary.uploader.upload.mockRejectedValue(clientError);

        await expect(uploadToCloudinary(mockFile, 'test-folder')).rejects.toMatchObject({
            status: HTTP_STATUS.INTERNAL_SERVER_ERROR
        });

        // 4xx errors should not be retried, so upload is called exactly once
        expect(cloudinary.uploader.upload).toHaveBeenCalledTimes(1);
    });

    test('should reject invalid file types', async () => {
        const mockFile = {
            type: 'text/plain',
            size: 1024
        };

        await expect(uploadToCloudinary(mockFile)).rejects.toMatchObject({
            status: HTTP_STATUS.BAD_REQUEST
        });
    });
});
