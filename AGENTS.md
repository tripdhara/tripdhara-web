# Tripdhara Engineering Guidelines

Project: **Tripdhara** (`tripdhara-web`) — Travel & Booking Platform (Next.js 16+ Web Admin/Public SSR + `/api/v1/` Mobile APIs for Traveller & Vendor apps).

## Core Invariants
- **Stack**: Next.js 16+ (App Router), React 19, Tailwind CSS v4 (`src/app/globals.css`), MongoDB (Mongoose 9), Upstash Redis & QStash, Razorpay, Cloudinary, Cloudflare R2, Pino, Zod v4.
- **Language**: Strict ESM JavaScript (`.js`, `.jsx`) with JSDoc. Never introduce TypeScript (`.ts`, `.tsx`).
- **Next.js 16 Convention**: Use `src/proxy.js`; never create deprecated `src/middleware.js`.
- **Domain Rules**: Detailed non-overlapping guidelines live in `.agents/rules/`.
- **Workflow Skills**: Step-by-step runbooks live in `.agents/skills/` (`api-endpoint-scaffold`, `jest-esm-testing`, `qstash-async-job`, `db-seeder-runner`, `deploy-verification`, `seo-audit`, `modern-web-guidance`).
