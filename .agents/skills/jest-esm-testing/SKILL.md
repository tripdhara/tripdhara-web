---
name: jest-esm-testing
description: Operational guide for writing and running Jest unit and integration tests in Tripdhara's ESM codebase using jest.unstable_mockModule, dynamic imports, and tests/utils/mockHelpers.js.
---

# Tripdhara Jest ESM Testing Workflow

## Overview
Tripdhara runs Jest in Node ESM mode (`"type": "module"` in `package.json`). Standard `jest.mock()` fails with ESM modules; all mocks must use `jest.unstable_mockModule` before dynamic imports.

## Required Test Structure

1. **Declare Mocks Before Importing Under Test**:
   - Import `jest` from `@jest/globals`.
   - Reuse utilities from `tests/utils/mockHelpers.js`:
     - `createMockQueryHelpers(overrides)`
     - `createDynamicModel(overrides)` / `createMockModels(overrides)`
     - `createMockSession()` / `createMockMongoose(overrides)`
     - `createMockCacheService(overrides)`
   - Register module mocks with `jest.unstable_mockModule('@/core/...', () => (...))`.

2. **Dynamically Import Modules After Mocks**:
   - Load the service, controller, or helper under test using `const { default: MyService } = await import('@/core/Services/...')` **after** all `jest.unstable_mockModule` calls.

3. **Reset State Between Tests**:
   - Include `beforeEach(() => { jest.clearAllMocks(); });` in every suite to prevent mock call leakage.

4. **Standard Assertions**:
   - **Services**: Test Cache Hit vs Cache Miss paths when caching applies, verify `.rejects.toThrow()` for `AppError` cases, and verify `session.withTransaction` callbacks execute on transactional writes.
   - **Controllers**: Verify HTTP status codes (`HTTP_STATUS`) and the standard envelope (`{ success, message, data }` or `{ success, message, data, pagination }`).

## Running Tests
- Full suite:
  ```bash
  npm test
  ```
- Single test file (using the Node ESM flags from `package.json`):
  ```bash
  node --no-warnings --experimental-vm-modules --expose-gc node_modules/jest/bin/jest.js tests/path/to/file.test.js --runInBand
  ```
