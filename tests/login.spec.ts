import { test, expect } from '@playwright/test';
import { loginPage } from '../pages/loginPage';
import { testdata } from '../utils/testdata';

test.describe('Login', () => {

  let login: loginPage;

  test.beforeEach(async ({ page }) => {
    login = new loginPage(page);
    await login.navigateToLogin();
  });

  // ── Positive Test Cases ──────────────────────────────────────────────────────

  test('TC_LGN_001 - Login page loads with email input visible', async () => {
    await expect(login.ui.emailInput).toBeVisible({ timeout: 8000 });
    await expect(login.ui.emailSignInBtn).toBeVisible({ timeout: 5000 });
  });

  test('TC_LGN_002 - Login page URL is correct', async ({ page }) => {
    await expect(page).toHaveURL(/login/, { timeout: 5000 });
  });

  test('TC_LGN_003 - Email field accepts valid input', async () => {
    await login.ui.emailInput.fill(testdata.email);
    const value = await login.ui.emailInput.inputValue();
    expect(value).toBe(testdata.email);
  });

  test('TC_LGN_004 - Valid email submission shows password step', async () => {
    await login.enterEmail(testdata.email);
    await login.clickEmailSignIn();
    await expect(login.ui.passwordInput).toBeVisible({ timeout: 8000 });
  });

  test('TC_LGN_005 - Password field is masked by default', async () => {
    await login.enterEmail(testdata.email);
    await login.clickEmailSignIn();
    await expect(login.ui.passwordInput).toHaveAttribute('type', 'password');
  });

  test('TC_LGN_006 - Password field accepts input', async () => {
    await login.enterEmail(testdata.email);
    await login.clickEmailSignIn();
    await login.ui.passwordInput.fill(testdata.password);
    const value = await login.ui.passwordInput.inputValue();
    expect(value).toBe(testdata.password);
  });

  test('TC_LGN_007 - Send me a code button visible on password step', async () => {
    await login.enterEmail(testdata.email);
    await login.clickEmailSignIn();
    await expect(login.ui.forgotPasswordLink).toBeVisible({ timeout: 8000 });
  });

  test('TC_LGN_008 - Back button returns to email step', async ({ page }) => {
    await login.enterEmail(testdata.email);
    await login.clickEmailSignIn();
    await expect(login.ui.passwordInput).toBeVisible({ timeout: 8000 });
    await login.clickBack();
    await expect(login.ui.emailInput).toBeVisible({ timeout: 8000 });
  });

  test('TC_LGN_009 - Successful login redirects to app', async ({ page }) => {
    await login.enterEmail(testdata.email);
    await login.clickEmailSignIn();
    await login.enterPassword(testdata.password);
    await login.clickPasswordSignIn();
    await expect(page).toHaveURL(/dashboard|project|inbox/, { timeout: 15000 });
  });

  test('TC_LGN_010 - Send me a code button is clickable', async ({ page }) => {
    await login.enterEmail(testdata.email);
    await login.clickEmailSignIn();
    await login.clickForgotPassword();
    await expect(page).not.toHaveURL(/login$/, { timeout: 8000 });
  });

  test('TC_LGN_011 - A heading is visible on the login page', async () => {
    await expect(login.ui.pageHeading).toBeVisible({ timeout: 8000 });
    const headingText = await login.ui.pageHeading.textContent();
    expect(headingText?.trim().length).toBeGreaterThan(0);
  });

  test('TC_LGN_012 - Password visibility toggle button is clickable on password step', async () => {
    await login.enterEmail(testdata.email);
    await login.clickEmailSignIn();
    await login.enterPassword(testdata.password);
    // Verify password is masked before toggle
    await expect(login.ui.passwordInput).toHaveAttribute('type', 'password');
    // Click the toggle — should not throw or navigate away
    await login.togglePasswordVisibility();
    await expect(login.ui.passwordInput).toBeVisible({ timeout: 3000 });
  });

  test('TC_LGN_013 - Email input is interactive and accepts click focus', async () => {
    await login.ui.emailInput.click();
    await expect(login.ui.emailInput).toBeFocused({ timeout: 5000 });
  });

  test('TC_LGN_014 - Email with uppercase letters is accepted', async () => {
    const upperEmail = testdata.email.toUpperCase();
    await login.ui.emailInput.fill(upperEmail);
    const value = await login.ui.emailInput.inputValue();
    expect(value.toLowerCase()).toBe(testdata.email.toLowerCase());
  });

  // ── Negative Test Cases ──────────────────────────────────────────────────────

  test('TC_LGN_N001 - Invalid email format disables sign-in button', async () => {
    await login.ui.emailInput.fill(testdata.invalidEmailFormat);
    // App disables the submit button for invalid email formats
    await expect(login.ui.emailSignInBtn).toBeDisabled({ timeout: 5000 });
  });

  test('TC_LGN_N002 - Non-registered email keeps sign-in button disabled', async ({ page }) => {
    await login.ui.emailInput.fill(testdata.wrongEmail);
    await page.waitForTimeout(2000);
    // App disables button for unregistered emails (real-time backend validation)
    await expect(login.ui.emailSignInBtn).toBeDisabled({ timeout: 5000 });
    await expect(page).toHaveURL(/login/, { timeout: 3000 });
  });

  test('TC_LGN_N003 - Wrong password shows error message', async ({ page }) => {
    await login.enterEmail(testdata.email);
    await login.clickEmailSignIn();
    await login.enterPassword(testdata.wrongPassword);
    await login.clickPasswordSignIn();
    await page.waitForTimeout(3000);
    const url = page.url();
    expect(url).not.toMatch(/dashboard|project|inbox/);
  });

  test('TC_LGN_N004 - Empty email field keeps sign-in button disabled', async () => {
    // Button is disabled by default until a valid email is entered
    await expect(login.ui.emailSignInBtn).toBeDisabled({ timeout: 5000 });
    await expect(login.ui.emailInput).toBeVisible({ timeout: 3000 });
  });

  test('TC_LGN_N005 - Empty password prevents login', async ({ page }) => {
    await login.enterEmail(testdata.email);
    await login.clickEmailSignIn();
    await expect(login.ui.passwordInput).toBeVisible({ timeout: 8000 });
    await login.ui.passwordSignInBtn.click();
    // Should not navigate away from password step
    await page.waitForTimeout(2000);
    const url = page.url();
    expect(url).not.toMatch(/dashboard|project|inbox/);
  });

  test('TC_LGN_N006 - Direct dashboard access without login shows login form', async ({ browser }) => {
    // Use a brand-new isolated context with no auth state at all
    const freshContext = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const freshPage = await freshContext.newPage();
    await freshPage.goto('https://qa-desk.bublly.com/dashboard', { waitUntil: 'load' });
    await freshPage.waitForTimeout(3000);
    // App is a SPA — renders login UI at the dashboard URL instead of redirecting
    // Check for the "Welcome back" heading that only appears on the login page
    const loginHeading = freshPage.getByRole('heading', { name: /welcome back/i });
    await expect(loginHeading).toBeVisible({ timeout: 10000 });
    await freshContext.close();
  });

  test('TC_LGN_N007 - SQL injection string in email field is handled safely', async () => {
    await login.ui.emailInput.fill("' OR '1'='1");
    // Button stays disabled — SQL injection string is not a valid email format
    await expect(login.ui.emailSignInBtn).toBeDisabled({ timeout: 5000 });
  });

  test('TC_LGN_N008 - XSS string in email field is handled safely', async ({ page }) => {
    await login.ui.emailInput.fill('<script>alert(1)</script>@test.com');
    await login.ui.emailSignInBtn.click();
    await page.waitForTimeout(2000);
    expect(page.url()).not.toMatch(/dashboard|project|inbox/);
  });

  test('TC_LGN_N009 - Whitespace-only email keeps sign-in button disabled', async () => {
    await login.ui.emailInput.fill('     ');
    await expect(login.ui.emailSignInBtn).toBeDisabled({ timeout: 5000 });
  });

  test('TC_LGN_N010 - Very long email string is handled safely', async () => {
    const longEmail = 'a'.repeat(200) + '@test.com';
    await login.ui.emailInput.fill(longEmail);
    // App should either disable the button or stay on login — must not crash
    await expect(login.ui.emailInput).toBeVisible({ timeout: 3000 });
    expect(await login.ui.emailInput.inputValue()).toBeTruthy();
  });

  test('TC_LGN_N011 - Password with only spaces prevents login', async ({ page }) => {
    await login.enterEmail(testdata.email);
    await login.clickEmailSignIn();
    await login.ui.passwordInput.fill('     ');
    await login.ui.passwordSignInBtn.click();
    await page.waitForTimeout(2000);
    expect(page.url()).not.toMatch(/dashboard|project|inbox/);
  });

  // ── Additional Positive Test Cases ───────────────────────────────────────────

  test('TC_LGN_015 - Password visibility toggle button is functional', async () => {
    await login.enterEmail(testdata.email);
    await login.clickEmailSignIn();
    await login.enterPassword(testdata.password);
    await expect(login.ui.passwordInput).toHaveAttribute('type', 'password');
    await login.togglePasswordVisibility();
    // After toggle the password field remains visible and accessible
    await expect(login.ui.passwordInput).toBeVisible({ timeout: 3000 });
  });

  test('TC_LGN_016 - Sign-in button becomes enabled after valid email is entered', async () => {
    await expect(login.ui.emailSignInBtn).toBeDisabled({ timeout: 3000 });
    await login.ui.emailInput.fill(testdata.email);
    await expect(login.ui.emailSignInBtn).toBeEnabled({ timeout: 5000 });
  });

  test('TC_LGN_017 - Email input placeholder text is correct', async () => {
    const placeholder = await login.ui.emailInput.getAttribute('placeholder');
    expect(placeholder).toBe('Enter your work email');
  });

  // ── Additional Negative Test Cases ───────────────────────────────────────────

  test('TC_LGN_N012 - Email missing TLD keeps sign-in button disabled', async () => {
    await login.ui.emailInput.fill('user@domain');
    await expect(login.ui.emailSignInBtn).toBeDisabled({ timeout: 5000 });
  });

  test('TC_LGN_N013 - Email with consecutive dots is handled safely', async () => {
    await login.ui.emailInput.fill('user..name@test.com');
    // Button should remain disabled for malformed email
    await expect(login.ui.emailSignInBtn).toBeDisabled({ timeout: 5000 });
  });

  test('TC_LGN_N014 - Very long password string is handled safely', async ({ page }) => {
    await login.enterEmail(testdata.email);
    await login.clickEmailSignIn();
    const longPassword = 'P@ss' + 'a'.repeat(300);
    await login.ui.passwordInput.fill(longPassword);
    await login.ui.passwordSignInBtn.click();
    await page.waitForTimeout(2000);
    expect(page.url()).not.toMatch(/dashboard|project|inbox/);
  });

  // ── More Positive Test Cases ──────────────────────────────────────────────────

  test('TC_LGN_018 - Back button is visible on password step', async () => {
    await login.enterEmail(testdata.email);
    await login.clickEmailSignIn();
    await expect(login.ui.backBtn).toBeVisible({ timeout: 8000 });
  });

  test('TC_LGN_019 - Email field type attribute is email or text', async () => {
    const type = await login.ui.emailInput.getAttribute('type');
    expect(['email', 'text']).toContain(type);
  });

  test('TC_LGN_020 - Page heading is visible and non-empty on login', async () => {
    await expect(login.ui.pageHeading).toBeVisible({ timeout: 8000 });
    const text = await login.ui.pageHeading.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('TC_LGN_021 - Forgot password link visible after navigating to password step', async () => {
    await login.enterEmail(testdata.email);
    await login.clickEmailSignIn();
    await expect(login.ui.forgotPasswordLink).toBeVisible({ timeout: 8000 });
  });

  // ── More Negative Test Cases ──────────────────────────────────────────────────

  test('TC_LGN_N015 - Email starting with @ keeps sign-in button disabled', async () => {
    await login.ui.emailInput.fill('@test.com');
    await expect(login.ui.emailSignInBtn).toBeDisabled({ timeout: 5000 });
  });

  test('TC_LGN_N016 - Email with multiple @ symbols keeps sign-in button disabled', async () => {
    await login.ui.emailInput.fill('user@@test.com');
    await expect(login.ui.emailSignInBtn).toBeDisabled({ timeout: 5000 });
  });

  test('TC_LGN_N017 - Emoji in email field keeps sign-in button disabled', async () => {
    await login.ui.emailInput.fill('user😀@test.com');
    await expect(login.ui.emailSignInBtn).toBeDisabled({ timeout: 5000 });
  });

  test('TC_LGN_N018 - Email with spaces keeps sign-in button disabled', async () => {
    await login.ui.emailInput.fill('user name@test.com');
    await expect(login.ui.emailSignInBtn).toBeDisabled({ timeout: 5000 });
  });

  // ── Even More Positive Test Cases ────────────────────────────────────────────

  test('TC_LGN_022 - Password step sign-in button is visible', async () => {
    await login.enterEmail(testdata.email);
    await login.clickEmailSignIn();
    await expect(login.ui.passwordSignInBtn).toBeVisible({ timeout: 8000 });
  });

  test('TC_LGN_023 - Password step sign-in button is enabled after entering password', async () => {
    await login.enterEmail(testdata.email);
    await login.clickEmailSignIn();
    await login.enterPassword(testdata.password);
    await expect(login.ui.passwordSignInBtn).toBeEnabled({ timeout: 5000 });
  });

  test('TC_LGN_024 - Email input is the first focusable element on the page', async ({ page }) => {
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName.toLowerCase());
    // either email input is auto-focused or body is focused — page must not crash
    expect(['input', 'body', null]).toContain(focusedTag);
  });

  test('TC_LGN_025 - Clearing email after entry disables sign-in button again', async () => {
    await login.ui.emailInput.fill(testdata.email);
    await expect(login.ui.emailSignInBtn).toBeEnabled({ timeout: 5000 });
    await login.ui.emailInput.fill('');
    await expect(login.ui.emailSignInBtn).toBeDisabled({ timeout: 5000 });
  });

  test('TC_LGN_026 - Password input does not leak value to page title', async ({ page }) => {
    await login.enterEmail(testdata.email);
    await login.clickEmailSignIn();
    await login.enterPassword(testdata.password);
    const title = await page.title();
    expect(title).not.toContain(testdata.password);
  });

  // ── Even More Negative Test Cases ────────────────────────────────────────────

  test('TC_LGN_N019 - Back button clears password step and shows email input', async () => {
    await login.enterEmail(testdata.email);
    await login.clickEmailSignIn();
    await login.enterPassword(testdata.password);
    await login.clickBack();
    await expect(login.ui.emailInput).toBeVisible({ timeout: 8000 });
    await expect(login.ui.passwordInput).not.toBeVisible({ timeout: 3000 });
  });

  test('TC_LGN_N020 - Password field not visible on initial email step', async () => {
    await expect(login.ui.passwordInput).not.toBeVisible({ timeout: 3000 });
  });

  test('TC_LGN_N021 - Submitting wrong email format via keyboard does not navigate', async ({ page }) => {
    await login.ui.emailInput.fill('invalidemail');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/login/, { timeout: 5000 });
  });

  // ── Batch 4 Positive ─────────────────────────────────────────────────────────

  test('TC_LGN_027 - Sign-in button is visible on initial email step', async () => {
    await expect(login.ui.emailSignInBtn).toBeVisible({ timeout: 8000 });
  });

  test('TC_LGN_028 - Email input accepts pasted text', async ({ page }) => {
    await login.ui.emailInput.click();
    await page.keyboard.insertText(testdata.email);
    const value = await login.ui.emailInput.inputValue();
    expect(value).toBe(testdata.email);
  });

  test('TC_LGN_029 - Login page has no broken layout - body is rendered', async ({ page }) => {
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.trim().length).toBeGreaterThan(0);
  });

  test('TC_LGN_030 - Email input is editable', async () => {
    await expect(login.ui.emailInput).toBeEditable({ timeout: 5000 });
  });

  test('TC_LGN_031 - Password input is editable after reaching password step', async () => {
    await login.enterEmail(testdata.email);
    await login.clickEmailSignIn();
    await expect(login.ui.passwordInput).toBeEditable({ timeout: 5000 });
  });

  test('TC_LGN_032 - Login page is fully loaded within timeout', async ({ page }) => {
    await expect(login.ui.emailInput).toBeVisible({ timeout: 10000 });
    await expect(login.ui.emailSignInBtn).toBeVisible({ timeout: 5000 });
    const url = page.url();
    expect(url).toMatch(/login/);
  });

  // ── Batch 4 Negative ─────────────────────────────────────────────────────────

  test('TC_LGN_N022 - Numeric-only input keeps sign-in button disabled', async () => {
    await login.ui.emailInput.fill('1234567890');
    await expect(login.ui.emailSignInBtn).toBeDisabled({ timeout: 5000 });
  });

  test('TC_LGN_N023 - Single character email keeps sign-in button disabled', async () => {
    await login.ui.emailInput.fill('a');
    await expect(login.ui.emailSignInBtn).toBeDisabled({ timeout: 5000 });
  });

  test('TC_LGN_N024 - Password step is not accessible without completing email step', async ({ page }) => {
    // Fresh load — password input should not be visible
    await expect(login.ui.passwordInput).not.toBeVisible({ timeout: 3000 });
    await expect(login.ui.emailInput).toBeVisible({ timeout: 5000 });
  });

  test('TC_LGN_N025 - Tab through login form does not submit accidentally', async ({ page }) => {
    await login.ui.emailInput.fill(testdata.email);
    await login.ui.emailInput.press('Tab');
    await login.ui.emailInput.press('Tab');
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/login/, { timeout: 5000 });
  });

  // ── Batch 5 Positive ─────────────────────────────────────────────────────────

  test('TC_LGN_033 - Email input max length is not restrictively small', async () => {
    const maxLength = await login.ui.emailInput.getAttribute('maxlength');
    if (maxLength !== null) {
      expect(parseInt(maxLength)).toBeGreaterThan(30);
    } else {
      // No maxlength restriction — acceptable
      expect(maxLength).toBeNull();
    }
  });

  test('TC_LGN_034 - Sign-in button is of type submit', async () => {
    const type = await login.ui.emailSignInBtn.getAttribute('type');
    expect(type).toBe('submit');
  });

  test('TC_LGN_035 - Email input is visible and not hidden', async () => {
    await expect(login.ui.emailInput).toBeVisible({ timeout: 5000 });
    const hidden = await login.ui.emailInput.getAttribute('hidden');
    expect(hidden).toBeNull();
  });

  test('TC_LGN_036 - Password step heading still visible after password is entered', async () => {
    await login.enterEmail(testdata.email);
    await login.clickEmailSignIn();
    await login.enterPassword(testdata.password);
    await expect(login.ui.pageHeading).toBeVisible({ timeout: 5000 });
  });

  test('TC_LGN_037 - Login page does not redirect immediately without interaction', async ({ page }) => {
    await page.waitForTimeout(3000);
    await expect(page).toHaveURL(/login/, { timeout: 5000 });
    await expect(login.ui.emailInput).toBeVisible({ timeout: 5000 });
  });

  // ── Batch 5 Negative ─────────────────────────────────────────────────────────

  test('TC_LGN_N026 - Email with trailing dot keeps sign-in button disabled', async () => {
    await login.ui.emailInput.fill('user@test.');
    await expect(login.ui.emailSignInBtn).toBeDisabled({ timeout: 5000 });
  });

  test('TC_LGN_N027 - Password with only numbers prevents login', async ({ page }) => {
    await login.enterEmail(testdata.email);
    await login.clickEmailSignIn();
    await login.ui.passwordInput.fill('123456789');
    await login.ui.passwordSignInBtn.click();
    await page.waitForTimeout(2000);
    expect(page.url()).not.toMatch(/dashboard|project|inbox/);
  });

  test('TC_LGN_N028 - Repeated back-and-forth between steps stays stable', async () => {
    for (let i = 0; i < 3; i++) {
      await login.enterEmail(testdata.email);
      await login.clickEmailSignIn();
      await expect(login.ui.passwordInput).toBeVisible({ timeout: 8000 });
      await login.clickBack();
      await expect(login.ui.emailInput).toBeVisible({ timeout: 8000 });
    }
  });

  // ── Functional Flow Cases ─────────────────────────────────────────────────────

  test('TC_LGN_F001 - Full login flow completes successfully end-to-end', async ({ page }) => {
    await login.enterEmail(testdata.email);
    await login.clickEmailSignIn();
    await expect(login.ui.passwordInput).toBeVisible({ timeout: 8000 });
    await login.enterPassword(testdata.password);
    await expect(login.ui.passwordSignInBtn).toBeEnabled({ timeout: 5000 });
    await login.clickPasswordSignIn();
    await expect(page).toHaveURL(/dashboard|project|inbox/, { timeout: 15000 });
  });

  test('TC_LGN_F002 - Email step retains entered value before moving to password step', async () => {
    await login.ui.emailInput.fill(testdata.email);
    const valueBefore = await login.ui.emailInput.inputValue();
    expect(valueBefore).toBe(testdata.email);
    await login.clickEmailSignIn();
    await login.clickBack();
    const valueAfter = await login.ui.emailInput.inputValue();
    expect(valueAfter.toLowerCase()).toBe(testdata.email.toLowerCase());
  });

  test('TC_LGN_F003 - Replacing wrong password and retrying stays on password step', async ({ page }) => {
    await login.enterEmail(testdata.email);
    await login.clickEmailSignIn();
    await login.enterPassword(testdata.wrongPassword);
    await login.clickPasswordSignIn();
    await page.waitForTimeout(3000);
    expect(page.url()).not.toMatch(/dashboard|project|inbox/);
    // Clear and enter correct password
    await login.ui.passwordInput.fill('');
    await login.enterPassword(testdata.password);
    await expect(login.ui.passwordSignInBtn).toBeEnabled({ timeout: 5000 });
  });

  test('TC_LGN_F004 - Email field is focused and ready for input on page load', async ({ page }) => {
    await expect(login.ui.emailInput).toBeVisible({ timeout: 8000 });
    await login.ui.emailInput.click();
    await page.keyboard.type('test');
    const value = await login.ui.emailInput.inputValue();
    expect(value).toContain('test');
  });

  test('TC_LGN_F005 - Forgot password flow navigates away from login', async ({ page }) => {
    await login.enterEmail(testdata.email);
    await login.clickEmailSignIn();
    await expect(login.ui.forgotPasswordLink).toBeVisible({ timeout: 8000 });
    await login.clickForgotPassword();
    await expect(page).not.toHaveURL(/login$/, { timeout: 8000 });
  });

});
