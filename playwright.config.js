// playwright.config.js
// =============================================
// Playwright Configuration File
// Configures API and UI projects, workers,
// reporters, global setup, and timeouts.
// =============================================

import { defineConfig, devices } from '@playwright/test';
import { apiConfig }              from './src/config/api.config.js';

export default defineConfig({
  // ── Global test directory ──────────────────────────────
  testDir: './tests',

  // ── Parallelism ────────────────────────────────────────
  // Each worker runs independently with its own APIRequestContext.
  // API tests: maximise workers; UI tests: limit to avoid flakiness.
  fullyParallel: true,

  // Fail the build on CI if any test.only() is accidentally committed.
  forbidOnly: !!process.env.CI,

  // Retry failed tests on CI (useful for transient network issues in API tests).
  retries: process.env.CI ? 2 : 0,

  // Global worker count — overridden per project below.
  workers: process.env.CI ? 4 : undefined,

  // ── Reporters ─────────────────────────────────────────
  reporter: [
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['list'],
    ...(process.env.CI ? [['github']] : []),
  ],

  // ── Global settings applied to all projects ────────────
  use: {
    // Base URL — resolved from the active environment in apiConfig.
    baseURL: apiConfig.baseURL,

    // Capture traces on first retry (great for debugging flaky tests).
    trace: 'on-first-retry',

    // Extra HTTP headers added to every request context.
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      'Accept':       'application/json',
    },
  },

  // ── Projects ───────────────────────────────────────────
  projects: [
    // ── API Tests ────────────────────────────────────────
    {
      name: 'api',
      testDir: './tests',
      use: {
        // No browser needed for API-only tests.
        // Playwright spins up an APIRequestContext instead.
        baseURL: apiConfig.baseURL,
      },
      // High worker count for pure API tests.
      // Workers are isolated so parallel runs are safe.
      workers: 8,
    },

    // ── UI Tests (Chromium) ────────────────────────────
    {
      name: 'ui',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        // UI tests talk to the same environment as API tests.
        baseURL: apiConfig.baseURL,
        // Always capture traces for UI tests.
        trace: 'on',
        screenshot: 'only-on-failure',
        video:      'retain-on-failure',
      },
      // Limit UI workers — too many parallel browsers can cause flakiness.
      workers: process.env.CI ? 2 : 1,
      // Run API tests before UI tests (dependency ordering).
      dependencies: [],
    },

    // ── Combined: API first, then UI ───────────────────
    // Run with: playwright test --project=full-suite
    {
      name: 'full-suite',
      testDir: './tests',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: apiConfig.baseURL,
      },
      workers: process.env.CI ? 4 : 2,
    },
  ],

  // ── Timeouts ───────────────────────────────────────────
  timeout:       apiConfig.defaultTimeout,
  expect: {
    timeout: 10_000,
  },

  // ── Output directories ─────────────────────────────────
  outputDir: 'reports/test-results',
});
