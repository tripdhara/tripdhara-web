---
name: seo-audit
description: Technical SEO, JSON-LD structured data, Core Web Vitals, and GEO (Generative Engine Optimization / LLM visibility) audit workflow for Tripdhara.
---

# Tripdhara Technical SEO & GEO Audit Workflow

## Overview
Use this skill when auditing Tripdhara's search engine indexability, structured data, Core Web Vitals, or AI answer-engine visibility (Google AI Overviews, ChatGPT Search, Perplexity, Claude).

## Audit Checklist

1. **Crawlability & Indexing**:
   - Inspect `src/app/robots.js` for crawler directives (`*`, `GPTBot`, `ChatGPT-User`, `PerplexityBot`, `Google-Extended`, `ClaudeBot`).
   - Inspect `src/app/sitemap.js` for static hubs, dynamic packages, categories, and blogs returning valid canonical URLs.
   - Verify IndexNow key file in `public/` (`public/tripdhara-indexnow-key-2026.txt`) and submission logic in `src/core/Helpers/indexNow.js`.

2. **GEO / LLM Feeds**:
   - Verify `public/llms.txt` and `public/llms-full.txt` reflect current services, pricing, and routes.
   - Verify `src/app/api/v1/raw-markdown/route.js` serves clean `text/markdown` with accurate fares, routes, and cache headers.

3. **On-Page Metadata & JSON-LD Schema**:
   - Check `src/app/layout.js` and `src/core/Helpers/metadata.js` for canonical tags, OpenGraph metadata, heading hierarchy (`h1`–`h6`), and JSON-LD (`Organization`, `WebSite`, `TouristTrip`, `VacationRental`, `Hotel`, `BreadcrumbList`, `FAQPage`, `LocalBusiness`).

4. **Performance & Media**:
   - Audit Core Web Vitals targets (`LCP < 1.2s`, `CLS < 0.05`, `INP < 100ms`), image optimization (`next/image`, AVIF/WebP, Sharp compression), and missing `alt` attributes.
   - Check `next.config.mjs` `images.remotePatterns` and security headers.

5. **Output**:
   - Summarize findings by severity and ICE impact (Impact, Confidence, Ease), citing exact file paths and concrete fixes. Only generate report files under `{domain}-audit/` when explicitly requested.
