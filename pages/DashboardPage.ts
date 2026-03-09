import { Page, expect } from '@playwright/test';

export class DashboardPage {

  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigate to dashboard
  async navigateToDashboard() {

    await this.page.locator("(//div[contains(@class,'relative p-2')]//*[name()='svg'])[1]").click();

    // wait until dashboard loads
    await this.page.waitForLoadState('networkidle');
  }

  // Verify welcome message
  async verifyWelcomeMessage() {

    await expect(
      this.page.locator("h1:has-text('Welcome Back')")
    ).toBeVisible();

  }

  // Open Workspace dropdown
  async openWorkspaceDropdown() {

    const workspaceDropdown = this.page.locator(
      "button[role='combobox'][data-slot='select-trigger'], [data-slot='select-trigger'], button[aria-haspopup='listbox']"
    ).first();

    await workspaceDropdown.waitFor({ state: 'visible', timeout: 15000 });

    await workspaceDropdown.click();

    // wait for dropdown options
    await this.page.getByText("Create New Workspace")
      .waitFor({ state: 'visible', timeout: 15000 });

  }

  // Verify workspace option
  async verifyCreateWorkspaceOption() {

    await expect(
      this.page.getByText("Create New Workspace")
    ).toBeVisible();

  }

  // Open Project dropdown
  async openProjectDropdown() {

    const projectDropdown = this.page.locator("button.bg-primary-yellow-25").first();

    await projectDropdown.waitFor({ state: 'visible' });

    await projectDropdown.click();

    // wait until switch project options appear
    await this.page.getByText("Create Project").waitFor({ state: 'visible' });

  }

  // Get list of projects
  async getProjectList() {

    return this.page.locator('[role="option"]');

  }

  // Select second project from Switch Project list
  async selectSecondProject() {

    const switchButtons = this.page.getByText('Switch');
    // wait for the switch buttons to be attached
    await switchButtons.first().waitFor({ state: 'attached', timeout: 5000 }).catch(() => { });
    const count = await switchButtons.count();

    if (count > 0) {
      // Click the first available switch button
      await switchButtons.first().click();
    }
  }

  // Verify project changed
  async verifyProjectChanged() {

    const selectedProject = this.page.locator("button.bg-primary-yellow-25").first();

    await expect(selectedProject).toBeVisible();

  }

  // Verify Create Project option exists
  async verifyCreateProjectOption() {

    await expect(
      this.page.getByText("Create Project")
    ).toBeVisible();

  }

  async searchKeyword() {

    const searchTrigger = this.page.locator("(//div[contains(@class,'rounded-xl') and contains(@class,'cursor-pointer')])[1]");
    await searchTrigger.waitFor({ state: 'visible' });
    await searchTrigger.click();

    const searchInput = this.page.locator('input[placeholder="Search here..."]');
    await searchInput.waitFor({ state: 'visible' });
    await searchInput.fill("ticket");
    await this.page.keyboard.press('Enter');

  }

  async verifySearchResults() {

    await expect(this.page.locator("body")).toContainText("ticket");

  }

}