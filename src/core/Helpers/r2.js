import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import { getLogger } from '@/core/Lib/logger.js';

/**
 * Cloudflare R2 S3-Compatible Client
 */
export const getR2Client = () => {
    const endpoint = process.env.R2_ENDPOINT;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

    if (!endpoint || !accessKeyId || !secretAccessKey) {
        throw new Error('Cloudflare R2 credentials (R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY) are not properly configured.');
    }

    return new S3Client({
        region: 'auto',
        endpoint,
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
        forcePathStyle: true,
        requestChecksumCalculation: 'WHEN_REQUIRED',
        responseChecksumValidation: 'WHEN_REQUIRED',
    });
};

const getBucketName = () => process.env.R2_BUCKET || 'tripdhara-media';
const getPublicBaseUrl = () => (process.env.R2_PUBLIC_URL || 'https://media.tripdhara.com').replace(/\/$/, '');

/**
 * Generates a presigned PUT URL allowing Mobile App / Web to upload directly to R2 bucket.
 * 
 * @param {Object} options
 * @param {string} options.fileName - Original file name (e.g. 'avatar.jpg')
 * @param {string} options.fileType - MIME type (e.g. 'image/jpeg', 'image/png', 'application/pdf')
 * @param {string} [options.folder='general'] - Target directory inside bucket
 * @param {number} [options.expiresIn=900] - URL validity in seconds (default: 15 mins)
 * @returns {Promise<{ uploadUrl: string, fileKey: string, publicUrl: string }>}
 */
const MAX_R2_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const sanitizeR2Folder = (folder = 'general') => {
    return String(folder || 'general')
        .split('/')
        .map(seg => seg.trim().replace(/[^a-zA-Z0-9_-]/g, ''))
        .filter(seg => seg && seg !== '.' && seg !== '..')
        .join('/') || 'general';
};

export const getPresignedUploadUrl = async ({ fileName, fileType, folder = 'general', expiresIn = 900, fileSize = null }) => {
    try {
        const client = getR2Client();
        const bucket = getBucketName();
        const publicBaseUrl = getPublicBaseUrl();

        if (fileSize !== null && fileSize !== undefined) {
            const sizeBytes = Number(fileSize);
            if (!Number.isFinite(sizeBytes) || sizeBytes <= 0 || sizeBytes > MAX_R2_FILE_SIZE_BYTES) {
                throw new Error(`Invalid fileSize. Must be between 1 byte and ${MAX_R2_FILE_SIZE_BYTES} bytes.`);
            }
        }

        // Sanitize file extension
        const rawExt = fileName && fileName.includes('.') ? fileName.split('.').pop() : '';
        const ext = rawExt ? `.${rawExt.toLowerCase().replace(/[^a-z0-9]/g, '')}` : '';

        // Generate safe unique key (blocks path traversal)
        const cleanFolder = sanitizeR2Folder(folder);
        const randomHex = crypto.randomBytes(6).toString('hex');
        const fileKey = `${cleanFolder}/${Date.now()}-${randomHex}${ext}`;

        const commandInput = {
            Bucket: bucket,
            Key: fileKey,
            ContentType: fileType,
        };
        if (fileSize !== null && fileSize !== undefined) {
            commandInput.ContentLength = Number(fileSize);
        }

        const command = new PutObjectCommand(commandInput);

        const uploadUrl = await getSignedUrl(client, command, { expiresIn });

        return {
            uploadUrl,
            fileKey,
            publicUrl: `${publicBaseUrl}/${fileKey}`,
        };
    } catch (error) {
        getLogger().error({ err: error, folder, fileName, fileType }, '[R2 Helper] Failed to generate presigned upload URL');
        throw error;
    }
};

/**
 * Generates multiple presigned upload URLs concurrently.
 * 
 * @param {Array<{ fileName: string, fileType: string, folder?: string }>} files
 * @param {string} [defaultFolder='general']
 * @param {number} [expiresIn=900]
 * @returns {Promise<Array<{ fileName: string, uploadUrl: string, fileKey: string, publicUrl: string }>>}
 */
export const getMultiplePresignedUploadUrls = async (files = [], defaultFolder = 'general', expiresIn = 900) => {
    if (!Array.isArray(files) || files.length === 0) return [];

    return Promise.all(
        files.map(async (file) => {
            const targetFolder = file.folder || defaultFolder;
            const res = await getPresignedUploadUrl({
                fileName: file.fileName,
                fileType: file.fileType,
                folder: targetFolder,
                expiresIn,
                fileSize: file.fileSize,
            });

            return {
                fileName: file.fileName,
                ...res,
            };
        })
    );
};

/**
 * Optional: Delete an object from R2 by its full URL or fileKey
 * @param {string} urlOrKey - Full public URL or bucket key
 */
export const deleteFromR2 = async (urlOrKey) => {
    try {
        if (!urlOrKey) return false;
        const publicBaseUrl = getPublicBaseUrl();
        const fileKey = urlOrKey.startsWith(publicBaseUrl)
            ? urlOrKey.replace(`${publicBaseUrl}/`, '')
            : urlOrKey;
        if (!fileKey || fileKey.includes('..') || fileKey.startsWith('/')) return false;

        const client = getR2Client();
        const command = new DeleteObjectCommand({
            Bucket: getBucketName(),
            Key: fileKey,
        });

        await client.send(command);
        return true;
    } catch (error) {
        getLogger().warn({ err: error, urlOrKey }, '[R2 Helper] Failed to delete file from R2');
        return false;
    }
};

