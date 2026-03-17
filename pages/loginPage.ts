import { Page } from '@playwright/test';
import { LoginUI } from '../ui/LoginUI';

export class loginPage {

  private page: Page;
  readonly ui: LoginUI;

  constructor(page: Page) {
    this.page = page;
    this.ui = new LoginUI(page);
  }

  // Navigate to login page
  async navigateToLogin() {
    await this.page.goto('https://qa-desk.bublly.com/login');
  }

  // Enter work email
  async enterEmail(email: string) {
    await this.ui.emailInput.fill(email);

    // small wait to see action (optional)
    await this.page.waitForTimeout(1000);
  }

  // Click sign in button (email step)
  async clickEmailSignIn() {
    await this.ui.emailSignInBtn.click();

    // wait for password page to load
    await this.ui.passwordInput.waitFor({ state: 'visible', timeout: 20000 });
  }

  // Enter password
  async enterPassword(password: string) {
    await this.ui.passwordInput.fill(password);

    await this.page.waitForTimeout(1000);
  }

  // Click final sign in
  async clickPasswordSignIn() {
    await this.ui.passwordSignInBtn.click();
  }

  // Click forgot password link
  async clickForgotPassword() {
    await this.ui.forgotPasswordLink.waitFor({ state: 'visible', timeout: 15000 });
    await this.ui.forgotPasswordLink.click();
  }

  // Click back button on password step
  async clickBack() {
    await this.ui.backBtn.waitFor({ state: 'visible', timeout: 15000 });
    await this.ui.backBtn.click();
  }

  // Toggle password visibility
  async togglePasswordVisibility() {
    await this.ui.passwordToggleBtn.waitFor({ state: 'visible', timeout: 15000 });
    await this.ui.passwordToggleBtn.click();
  }

}