---
name: db-seeder-runner
description: Standard operational procedure for running Tripdhara MongoDB seeders, resetting test collections, and populating dummy vendor packages, homestays, cab routes, and admin accounts safely.
---

# Tripdhara Database Seeder & Data Management Workflow

## Overview
This skill guides the execution of MongoDB seed scripts (`src/core/Database/Seeders/ResetAndSeed.js` and `src/core/Database/Seeders/MassSeeder.js`) for local and staging environments without risking production data loss.

## Seeder Commands

1. **Reset & Clean Database**:
   - Clears collections and populates baseline categories, category documents, users, settings, locations, and policies:
     ```bash
     npm run seed
     ```
     *(Equivalent: `node src/core/Database/Seeders/ResetAndSeed.js`)*

2. **Mass Populate Demo Data**:
   - Generates large-scale synthetic users, vendors, and packages using `@faker-js/faker` and batched writes:
     ```bash
     npm run seed:mass
     ```
     *(Supports optional flags: `node src/core/Database/Seeders/MassSeeder.js --vendors=5000 --users=10000 --batchSize=500`)*

## Safety Constraints
- **NEVER** run seeder scripts when `NODE_ENV=production`, `APP_ENV=production`, or `MONGODB_URI` points to a production cluster.
- `ResetAndSeed.js` deletes all documents across collections (`collection.deleteMany({})`) before seeding — verify `.env` points to a local or disposable test database first.
- For high-volume writes in custom seeders, use batched `insertMany()` or `bulkWrite()` operations (reserve `.lean()` strictly for read queries).
