import { NextResponse } from 'next/server';
import { verifySignatureAppRouter } from '@upstash/qstash/nextjs';
import QStashWebhookController from '@/core/Http/Controllers/General/QStashWebhookController.js';
import { getLogger } from '@/core/Lib/logger.js';

/**
 * QStash Webhook Receiver (Serverless Background Job Processor)
 * Delegates job execution to QStashWebhookController.
 */
async function handler(req) {
    return await QStashWebhookController.processJob(req);
}

const hasKeys = Boolean(process.env.QSTASH_CURRENT_SIGNING_KEY && process.env.QSTASH_NEXT_SIGNING_KEY);

export const POST = hasKeys
    ? verifySignatureAppRouter(handler, {
        currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
        nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY
    })
    : async function () {
        getLogger().error('[QStash Webhook] QSTASH_CURRENT_SIGNING_KEY and QSTASH_NEXT_SIGNING_KEY are missing. Rejecting request.');
        return NextResponse.json({ success: false, message: 'QStash signing keys are not configured' }, { status: 500 });
    };

