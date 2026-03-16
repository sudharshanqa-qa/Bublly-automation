import { test, expect } from '@playwright/test';

test('fail test', async ({ page }) => {
  await page.goto('https://example.com');
  test.info().annotations.push({ type: 'test', description: 'Testing full page screenshot failure' });
  expect(1).toBe(2);
});
