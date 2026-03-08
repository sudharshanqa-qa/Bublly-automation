import { Page, expect } from '@playwright/test';
export class DashboardPage {
  private page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async navigateToDashboard() {
    await this.page.locator("(//div[contains(@class,'relative p-2')]//*[name()='svg'])[1]").click();
    // Wait for the dashboard/home page to be fully loaded
    await this.page.waitForLoadState('networkidle');
  }

  async verifyWelcomeMessage() {
    await expect(this.page.locator("h1:has-text('Welcome Back')")).toBeVisible();
  }

  async openWorkspaceDropdown() {
    // Try multiple selectors for the workspace dropdown
    const workspaceDropdown = this.page.locator(
      "button[role='combobox'][data-slot='select-trigger'], [data-slot='select-trigger'], button[aria-haspopup='listbox']"
    ).first();

    // Wait for the dropdown button to be visible before interacting
    await workspaceDropdown.waitFor({ state: 'visible', timeout: 15000 });
    await workspaceDropdown.click();

    // Wait for the dropdown menu / "Create New Workspace" option to appear
    await this.page.getByText("Create New Workspace").waitFor({ state: 'visible', timeout: 15000 });
  }

  async verifyCreateWorkspaceOption() {
    await expect(this.page.getByText("Create New Workspace")).toBeVisible();
  }

  async openProjectDropdown() {
  const projectDropdown = this.page.getByRole('button', { name: /project/i });

  await projectDropdown.click();

  await this.page.waitForTimeout(1000);  // small delay for dropdown animation
}

async verifyCreateProjectOption() {
  await expect(this.page.getByText("Create Project")).toBeVisible();
}
}   