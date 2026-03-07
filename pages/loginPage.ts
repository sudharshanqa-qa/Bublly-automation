import { Page } from '@playwright/test';

export class loginPage {

  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigate to login page
  async navigateToLogin() {
    await this.page.goto('https://qa-desk.bublly.com/login');
  }

  // Enter work email
  async enterEmail(email: string) {
    await this.page.locator("//input[@placeholder='Enter your work email']").fill(email);

    // small wait to see action (optional)
    await this.page.waitForTimeout(1000);
  }

  // Click sign in button (email step)
  async clickEmailSignIn() {
    await this.page.locator("//button[@type='submit']").click();

    // wait for password page to load
    await this.page.waitForSelector("//input[@type='password']", { state: 'visible' });
  }

  // Enter password
  async enterPassword(password: string) {
    await this.page.locator("//input[@type='password']").fill(password);

    await this.page.waitForTimeout(1000);
  }

  // Click final sign in
  async clickPasswordSignIn() {
    await this.page.locator("//button[@type='submit']").click();
  }

}