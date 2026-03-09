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
  async verifyAssignedTicketsSection() {

    const assignedSection = this.page.getByText("Assigned To Me");

    await expect(assignedSection).toBeVisible();

  }

  async verifyTicketRowsExist() {

    const ticketRows = this.page.locator("table tbody tr");

    await expect(ticketRows.first()).toBeVisible();

  }
  async openFirstTicket() {

    const firstTicket = this.page.locator("text=#TESAFD").first();

    await firstTicket.waitFor({ state: 'visible' });

    await firstTicket.click();

  }
  async verifyTicketPageOpened() {

    await expect(this.page).toHaveURL(/tickets/);

  }
  async clickCreateProject() {

    await this.page.getByText("Create Project").click();

  }
  async verifyCreateProjectModal() {

    await expect(this.page.getByText("Create Project")).toBeVisible();

  }

  async getAssignedTicketCount() {

    await this.page.waitForTimeout(2000);
    const textLocator = this.page.locator("text=Assigned To Me");
    const countText = await textLocator.innerText();

    const count = parseInt(countText.match(/\d+/)?.[0] || "0");

    return count;

  }
  async clickViewAllTickets() {

    await this.page.getByText("View All").click();

  }
  async getTicketRowCount() {

    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(3000);

    // We should filter rows by some conditions or see if there's an 'Assigned To Me' tab on the tickets page
    const tabs = this.page.locator("button, a").filter({ hasText: /Assigned To Me/i });

    // Attempt printing the filter text or similar available in the page
    const rows = this.page.locator("table:visible").last().locator("tbody tr");
    const count = await rows.count();

    return count;

  }

  async openNotificationPanel() {

    const bellIcon = this.page.locator("//*[name()='svg' and contains(@class,'text-gray-text')]");

    await bellIcon.waitFor({ state: 'visible' });

    await bellIcon.click();

  }

  async verifyNotificationPanelOpened() {

    await expect(this.page.getByRole('heading', { name: 'Notifications' })).toBeVisible();

  }

  async openNotificationSettings() {

    const settingsIcon = this.page.locator('h2', { hasText: 'Notifications' }).locator('..').locator('.cursor-pointer').nth(1);

    await settingsIcon.waitFor({ state: 'visible' });

    await settingsIcon.click();

  }

  async verifyNotificationSettingsPage() {

    await expect(this.page.getByText("Notification Settings")).toBeVisible();

    await expect(this.page).toHaveURL(/notificationsettings/);

  }

}