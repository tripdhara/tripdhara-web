---
name: api-endpoint-scaffold
description: Step-by-step workflow for creating or updating Tripdhara REST endpoints under /api/v1/ with Router.group(), Zod validation, helper reuse, ACID/BASE compliance, mobile backward-compatibility checks, and OpenAPI synchronization.
---

# Tripdhara `/api/v1/` Endpoint Workflow

## Overview
Use this skill when adding or modifying backend API routes, controllers, services, or Zod schemas in Tripdhara.

## Step-by-Step Procedure

1. **Mobile Impact Analysis (Mandatory First Step)**:
   - Check whether the endpoint is consumed by Traveller or Vendor mobile apps (`/api/v1/traveller/*`, `/api/v1/vendor/*`).
   - Preserve existing JSON keys, types, and envelopes (`{ success, message, data }` or `{ success, message, data, pagination }`). Breaking contract changes require a `/api/v2/` route.

2. **Inspect Helpers Before Writing Logic**:
   - Check `src/core/Helpers/index.js` (`queryHelpers.js`, `response.js`, `validation.js`, `security.js`, `dateUtils.js`, `mathUtils.js`, domain helpers).
   - Reuse existing helpers instead of duplicating DB queries or response builders.

3. **Register Route via `Router.group()`**:
   - Define routes in `src/core/Routes/<Domain>/*.routes.js` and mount them in the domain barrel (`traveller.js`, `vendor.js`, `admin.js`, `public.js`, `auth.js`) wired to `createNextRouter()` (`src/core/Helpers/nextApiWrapper.js`).
   - Enforce RBAC via `Router.group({ prefix, middleware: ['auth'], roles: [USER_ROLES.*] }, [...])`.
   - Attach a Zod `schema` on mutating routes so `nextApiWrapper.js` validates input and `openApi.js` generates request body schemas automatically.

4. **Implement Controller & Service (Strict MVC)**:
   - Keep `src/app/api/**` free of business logic.
   - Controller (`src/core/Http/Controllers/`) handles request extraction and returns `successResponse`, `paginatedResponse`, or `errorResponse` (`src/core/Helpers/response.js`).
   - Service (`src/core/Services/`) implements business rules:
     - Use `.lean()` for read queries.
     - Wrap multi-document financial/booking/inventory writes in `session.withTransaction()`.
     - Invalidate Redis cache keys on mutations.
     - Log errors with `getLogger(requestId)` (Pino) and throw `AppError` (`src/core/Errors/AppError.js`).
     - Log admin/critical mutations via `AuditService` (`src/core/Services/Admin/AuditService.js`).

5. **Verify OpenAPI & Tests**:
   - Verify `/api/openapi` (`src/app/api/openapi/route.js` + `src/core/Helpers/openApi.js`) reflects the new route cleanly.
   - Add/update Jest ESM unit tests (see the `jest-esm-testing` skill) and run `npm test`.
