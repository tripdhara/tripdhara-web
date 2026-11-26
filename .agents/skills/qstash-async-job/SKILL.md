---
name: qstash-async-job
description: Standard procedure for offloading heavy background tasks (emails, invoice PDFs, OCR, push notifications) to Upstash QStash and handling them in QStashWebhookController.
---

# Tripdhara Upstash QStash Async Job Workflow

## Overview
Tripdhara keeps API latency low by offloading slow I/O and CPU tasks (Nodemailer emails, PDF invoice generation, Tesseract.js OCR, FCM push notifications) to Upstash QStash queues and returning `202 Accepted` early from API endpoints.

## Step-by-Step Procedure

1. **Dispatch from Service**:
   - Enqueue the job payload `{ type, payload }` to `/api/webhooks/qstash` using the QStash helper/client rather than awaiting email/OCR/PDF work inline in the HTTP request lifecycle.
   - Return `202 Accepted` (`HTTP_STATUS.ACCEPTED`) when the endpoint's primary action is queuing background work.

2. **Implement Job Handler in `QStashWebhookController`**:
   - Add a `type` branch in `src/core/Http/Controllers/General/QStashWebhookController.js` (`processJob(req)`).
   - Keep heavy imports lazy (`await import(...)`) if only needed by specific job types (as done for `OCRService`).
   - Return `this.success(HTTP_STATUS.OK, ...)` on completion or `this.error(HTTP_STATUS.INTERNAL_SERVER_ERROR, ...)` so QStash retries transient failures.

3. **Signature Verification (`src/app/api/webhooks/qstash/route.js`)**:
   - The webhook route wraps `handler` with `verifySignatureAppRouter` from `@upstash/qstash/nextjs` when `QSTASH_CURRENT_SIGNING_KEY` and `QSTASH_NEXT_SIGNING_KEY` are configured.
   - Ensure both signing keys are set in production so unsigned requests are rejected.

4. **Logging & Idempotency**:
   - Log job execution with `getLogger(req.requestId)` (Pino) without logging PII or secrets.
   - Make job handlers idempotent where possible in case QStash retries delivery.
