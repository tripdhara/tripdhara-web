import { NextResponse } from 'next/server';
import { getPresignedUploadUrl, getMultiplePresignedUploadUrls } from '@/core/Helpers/r2.js';
import { HTTP_STATUS, RESPONSE_MESSAGES } from '@/core/Constants/index.js';
import { getLogger } from '@/core/Lib/logger.js';
import authMiddleware from '@/core/Http/Middleware/auth.js';

const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
];

const MAX_BATCH_FILES = 25;

/**
 * Builds standard hierarchical R2 directory per User ID:
 * - User Profile:                {userId}
 * - Business Profile:            {userId}/business
 * - Business Documents:          {userId}/business/document
 * - Business Category Documents: {userId}/business/{category}
 * - Packages Images:             {userId}/business/package
 */
const buildUserPath = (userId, options = {}) => {
    const rawFolder = (options.folder || options.type || '').trim().toLowerCase();
    const rawCategory = (options.category || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');

    // 1. User Profile: {userId}
    if (['profile', 'profiles', 'user', 'user_profile', 'avatar'].includes(rawFolder)) return userId;

    // 2. Business Profile: {userId}/business
    if (['business', 'business_profile', 'vendor', 'vendors'].includes(rawFolder)) return `${userId}/business`;

    // 3. Business Document: {userId}/business/document
    if (['business/document', 'business/documents', 'document', 'documents', 'business_document', 'vendor_documents'].includes(rawFolder)) return `${userId}/business/documents`;

    // 4. Packages: {userId}/business/package
    if (['business/package', 'business/packages', 'package', 'packages'].includes(rawFolder)) return `${userId}/business/package`;

    // 5. Business Category: {userId}/business/{category}
    if (rawCategory) return `${userId}/business/${rawCategory}`;

    if (rawFolder.startsWith('business/')) {
        const parts = rawFolder.split('/').filter(Boolean);
        if (parts.length >= 2) {
            const sub = parts
                .slice(1)
                .map(part => part.replace(/[^a-z0-9_-]/g, ''))
                .filter(Boolean)
                .join('/');
            return sub ? `${userId}/business/${sub}` : `${userId}/business`;
        }
        return `${userId}/business`;
    }

    const knownCategories = ['homestays', 'homestay', 'cabs', 'cab', 'trekking', 'rafting', 'camping', 'paragliding', 'bike_rental'];
    if (knownCategories.includes(rawFolder)) {
        return `${userId}/business/${rawFolder}`;
    }

    // Fallback: clean custom subfolder scoped under userId (ReDoS-safe)
    const sanitized = rawFolder
        .split('/')
        .map(part => part.replace(/[^a-z0-9_-]/g, ''))
        .filter(Boolean)
        .join('/');
    return sanitized ? `${userId}/${sanitized}` : `${userId}/general`;
};

export async function POST(request) {
    try {
        // Authenticate request - Token is required
        const auth = await authMiddleware(request);
        if (!auth.authorized) {
            return NextResponse.json(
                { success: false, message: RESPONSE_MESSAGES.ERROR.UNAUTHORIZED },
                { status: HTTP_STATUS.UNAUTHORIZED }
            );
        }

        const userId = auth.user.id;

        let body;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { success: false, message: 'Invalid JSON request payload' },
                { status: HTTP_STATUS.BAD_REQUEST }
            );
        }

        const { files, fileName, fileType, folder, type, category } = body || {};

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
                folder: buildUserPath(userId, {
                    folder: item.folder || folder,
                    type: item.type || type,
                    category: item.category || category,
                }),
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

        const targetFolder = buildUserPath(userId, { folder, type, category });
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
