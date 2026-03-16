import { Page, Locator } from '@playwright/test';

export class LoginUI {
    readonly emailInput: Locator;
    readonly emailSignInBtn: Locator;
    readonly passwordInput: Locator;
    readonly passwordSignInBtn: Locator;

    // Additional locators
    readonly pageHeading: Locator;
    readonly errorMessage: Locator;
    readonly forgotPasswordLink: Locator;
    readonly backBtn: Locator;
    readonly passwordToggleBtn: Locator;

    constructor(page: Page) {
        this.emailInput = page.locator("//input[@placeholder='Enter your work email']");
        this.emailSignInBtn = page.locator("//button[@type='submit']");
        this.passwordInput = page.locator("//input[@type='password']");
        this.passwordSignInBtn = page.locator("//button[@type='submit']");

        this.pageHeading = page.locator('h1, h2').first();
        this.errorMessage = page.locator('[role="alert"], .text-red-500, p.text-red, .error-message').first();
        this.forgotPasswordLink = page.getByRole('button', { name: /send me a code/i });
        this.backBtn = page.getByRole('button', { name: /back/i }).first();
        this.passwordToggleBtn = page.locator('button[aria-label*="password"], button[type="button"]').last();
    }
}
