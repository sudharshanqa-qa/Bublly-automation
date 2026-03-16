import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: 'test-screenshot-config.spec.ts',
  use: {
    screenshot: { mode: 'only-on-failure', fullPage: true },
    video: 'retain-on-failure',
  },
});
