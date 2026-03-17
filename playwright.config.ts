import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Automatically retry failed test cases (maximum 2 retries) */
  retries: 2,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use with organized test-results folder by default */
  reporter: 'html',
  /* Increase per-test timeout to handle slow network responses from remote QA environment */
  timeout: 90000,

  /* Shared settings for all the projects below. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

     headless: true, // Run tests in headed mode for better visibility during development

    /* Increase navigation timeout for slow remote environment */
    navigationTimeout: 45000,

    /* Capture full-page screenshots for failed tests */
    screenshot: { mode: 'only-on-failure', fullPage: true },

    /* Record screen/video for failed tests (stored in organized folders) */
    video: 'retain-on-failure',

    /* Collect trace when retrying the failed test. */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment for other browsers
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
