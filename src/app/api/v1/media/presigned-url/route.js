import { NextResponse } from 'next/server';
import { getPresignedUploadUrl, getMultiplePresignedUploadUrls } from '@/core/Helpers/r2.js';
import { HTTP_STATUS, RESPONSE_MESSAGES } from '@/core/Constants/index.js';
import { getLogger } from '@/core/Lib/logger.js';

const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
];

const ALLOWED_FOLDERS = [
    'profiles',
    'travellers',
    'vendors',
    'vendor_documents',
    'packages',
    'homestays',
    'cabs',
    'blogs',
    'reviews',
    'general',
];

const MAX_BATCH_FILES = 25;

const sanitizeFolder = (folder) => {
    if (!folder || typeof folder !== 'string') return 'general';
    return ALLOWED_FOLDERS.some((f) => folder.startsWith(f)) ? folder : 'general';
};

export async function POST(request) {
    try {
        let body;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { success: false, message: 'Invalid JSON request payload' },
                { status: HTTP_STATUS.BAD_REQUEST }
            );
        }

        const { files, fileName, fileType, folder = 'general' } = body || {};

        // 1. MULTIPLE FILES BATCH CASE
        if (Array.isArray(files)) {
            if (files.length === 0) {
                return NextResponse.json(
                    { success: false, message: 'files array cannot be empty' },
                    { status: HTTP_STATUS.BAD_REQUEST }
                );
            }

            if (files.length > MAX_BATCH_FILES) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Maximum ${MAX_BATCH_FILES} files allowed per request`,
                    },
                    { status: HTTP_STATUS.BAD_REQUEST }
                );
            }

            // Validate all files in batch
            for (let i = 0; i < files.length; i++) {
                const item = files[i];
                if (!item || !item.fileName || !item.fileType) {
                    return NextResponse.json(
                        {
                            success: false,
                            message: `Item at index ${i} is missing fileName or fileType`,
                        },
                        { status: HTTP_STATUS.BAD_REQUEST }
                    );
                }
                if (!ALLOWED_MIME_TYPES.includes(item.fileType.toLowerCase())) {
                    return NextResponse.json(
                        {
                            success: false,
                            message: `Invalid fileType for "${item.fileName}". Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
                        },
                        { status: HTTP_STATUS.BAD_REQUEST }
                    );
                }
            }

            const sanitizedFiles = files.map((item) => ({
                fileName: item.fileName,
                fileType: item.fileType.toLowerCase(),
                folder: sanitizeFolder(item.folder || folder),
            }));

            const presignedData = await getMultiplePresignedUploadUrls(sanitizedFiles);

            return NextResponse.json(
                {
                    success: true,
                    message: `${presignedData.length} presigned upload URLs generated successfully`,
                    data: presignedData,
                },
                { status: HTTP_STATUS.OK }
            );
        }

        // 2. SINGLE FILE CASE (Backwards-compatible)
        if (!fileName || !fileType) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Provide either "files" array or "fileName" and "fileType" for upload',
                },
                { status: HTTP_STATUS.BAD_REQUEST }
            );
        }

        if (!ALLOWED_MIME_TYPES.includes(fileType.toLowerCase())) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Invalid fileType. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
                },
                { status: HTTP_STATUS.BAD_REQUEST }
            );
        }

        const targetFolder = sanitizeFolder(folder);
        const presignedData = await getPresignedUploadUrl({
            fileName,
            fileType: fileType.toLowerCase(),
            folder: targetFolder,
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Presigned upload URL generated successfully',
                data: presignedData,
            },
            { status: HTTP_STATUS.OK }
        );
    } catch (error) {
        getLogger().error({ err: error }, '[API Presigned URL] Error generating upload URL');
        return NextResponse.json(
            {
                success: false,
                message: error.message || RESPONSE_MESSAGES.ERROR.SERVER_ERROR,
            },
            { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
        );
    }
}
