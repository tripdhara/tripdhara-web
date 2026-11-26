---
name: deploy-verification
description: Pre-flight deployment verification checklist for Tripdhara. Validates Zod environment variables, ESLint, dead code (knip), Jest ESM test suite, security/SEO files, and Next.js production build before release.
---

# Tripdhara Pre-Flight Deployment Verification

## Overview
Standardized pre-flight verification workflow for validating the stability, security, and build health of Tripdhara before committing or deploying to Vercel.

## Step-by-Step Verification Workflow

1. **Verify Environment Variables (`src/core/Config/envValidator.js`)**:
   - Strictly required at boot: `MONGODB_URI`, `JWT_SECRET` (min 32 chars).
   - Integration keys (optional in schema, required when feature is enabled): `NEXT_PUBLIC_API_URL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `QSTASH_TOKEN`, `CLOUDINARY_URL`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `R2_BUCKET`, `R2_ACCOUNT_ID`, `R2_ENDPOINT`, `R2_PUBLIC_URL`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `INDEXNOW_KEY`.
   - Confirm `.env.example` stays aligned with any newly introduced keys.

2. **Run Linter & Dead-Code Checks**:
   - Run ESLint:
     ```bash
     npm run lint
     ```
   - Optionally check unused files/exports configured in `knip.json`:
     ```bash
     npx knip
     ```

3. **Execute Full Jest Test Suite (ESM Mode)**:
   - Run all unit and integration tests:
     ```bash
     npm test
     ```
   - Ensure 0 failing test suites and clean exit.

4. **Validate Next.js Production Build**:
   - Run Next.js production build:
     ```bash
     npm run build
     ```
   - Confirm zero build, ESLint, or route compilation errors.

5. **SEO, GEO & Security Headers Check**:
   - Verify `public/llms.txt`, `public/llms-full.txt`, `src/app/robots.js`, `src/app/sitemap.js`, and `src/app/api/v1/raw-markdown/route.js` are present and valid.
   - Verify edge security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`) remain intact in `next.config.mjs` and `src/proxy.js`.
   - Confirm `src/middleware.js` does not exist (Next.js 16+ uses `src/proxy.js`).
