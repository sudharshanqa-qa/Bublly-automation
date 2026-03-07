import { Page, expect } from '@playwright/test';
export class DashboardPage {
private page: Page;
constructor(page: Page) {   
    this.page = page;
}

async navigateToDashboard() {
  await this.page.locator("(//div[contains(@class,'relative p-2')]//*[name()='svg'])[1]").click();
}

async verifyWelcomeMessage() {
  await expect(this.page.locator("h1:has-text('Welcome Back')")).toBeVisible();
}

async openWorkspaceDropdown() {
  await this.page.locator("//button[@role='combobox' and @data-slot='select-trigger']").press('Enter');
   await this.page.waitForTimeout(5000);

}

async verifyCreateWorkspaceOption() {
  await expect(this.page.locator("text=Create New Workspace")).toBeVisible();
}
}   