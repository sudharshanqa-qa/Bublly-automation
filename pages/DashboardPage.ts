import { Page } from '@playwright/test';
import { DashboardUI } from '../ui/DashboardUI';

export class DashboardPage {

  private page: Page;
  readonly ui: DashboardUI;

  constructor(page: Page) {
    this.page = page;
    this.ui = new DashboardUI(page);
  }

  async navigateToDashboard() {
    await this.ui.dashboardIcon.click();
    await this.ui.welcomeMessage.waitFor({ state: 'visible', timeout: 30000 });
  }

  async openWorkspaceDropdown() {
    await this.ui.workspaceDropdown.waitFor({ state: 'visible', timeout: 15000 });
    await this.ui.workspaceDropdown.click();
    await this.page.locator('[role="listbox"]').waitFor({ state: 'visible', timeout: 15000 });
  }

  async openProjectDropdown() {
    await this.ui.projectDropdown.waitFor({ state: 'visible' });
    await this.ui.projectDropdown.click();
    await this.page.locator('[role="dialog"]').waitFor({ state: 'visible', timeout: 15000 });
  }

  async selectSecondProject() {
    const switchButtons = this.ui.switchButtons;
    await switchButtons.first().waitFor({ state: 'attached', timeout: 5000 }).catch(() => { });
    const count = await switchButtons.count();
    if (count > 0) {
      await switchButtons.first().click();
    }
  }

  async searchKeyword() {
    await this.ui.searchTrigger.waitFor({ state: 'visible' });
    await this.ui.searchTrigger.click();
    await this.ui.searchInput.waitFor({ state: 'visible' });
    await this.ui.searchInput.fill("ticket");
    await this.page.keyboard.press('Enter');
  }

  async openFirstTicket() {
    await this.ui.firstTicket.waitFor({ state: 'visible' });
    await this.ui.firstTicket.click();
  }

  async clickCreateProject() {
    await this.ui.createProjectOption.click();
  }

  /** Opens the project dropdown and clicks "Create Project".
   *  Returns true if the modal opened, false if plan is full ("All Used"). */
  async openCreateProjectModal(): Promise<boolean> {
    await this.openProjectDropdown();
    const allUsedBtn = this.page.getByRole('button', { name: 'All Used', exact: true });
    const isAllUsed = await allUsedBtn.isVisible().catch(() => false);
    if (isAllUsed) return false;
    await this.clickCreateProject();
    await this.ui.createProjectModal.waitFor({ state: 'visible', timeout: 8000 });
    return true;
  }

  /** Returns true if "Create New Workspace" option is available in the workspace dropdown. */
  async isWorkspaceCreateAvailable(): Promise<boolean> {
    await this.openWorkspaceDropdown();
    const option = this.page.getByRole('option', { name: /create new workspace/i });
    return await option.isVisible().catch(() => false);
  }

  async getAssignedTicketCount() {
    await this.page.waitForTimeout(2000);
    const countText = await this.ui.assignedToMeText.innerText();
    return parseInt(countText.match(/\d+/)?.[0] || "0");
  }

  async clickViewAllTickets() {
    await this.ui.viewAllButton.click();
  }

  async getTicketRowCount() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(3000);
    return await this.ui.visibleTableRows.count();
  }

  async openNotificationPanel() {
    await this.ui.bellIcon.waitFor({ state: 'visible' });
    await this.ui.bellIcon.click();
    await this.ui.notificationHeading.waitFor({ state: 'visible', timeout: 10000 });
  }

  async openNotificationSettings() {
    await this.ui.notificationSettingsIcon.waitFor({ state: 'visible' });
    await this.ui.notificationSettingsIcon.click();
  }

  async clickCreateWorkspace() {
    await this.ui.createWorkspaceOption.waitFor({ state: 'visible' });
    await this.ui.createWorkspaceOption.click();
  }

  async openProfileMenu() {
    await this.ui.profileMenuBtn.waitFor({ state: 'visible', timeout: 8000 });
    await this.ui.profileMenuBtn.click();
    await this.page.waitForTimeout(2000);
  }

  async clickLogout() {
    await this.ui.logoutBtn.waitFor({ state: 'visible', timeout: 5000 });
    await this.ui.logoutBtn.click();
  }

  async searchInvalidKeyword() {
    await this.ui.searchTrigger.waitFor({ state: 'visible' });
    await this.ui.searchTrigger.click();
    await this.ui.searchInput.waitFor({ state: 'visible' });
    await this.ui.searchInput.fill("invalid_search_gibberish_123");
    await this.page.keyboard.press('Enter');
  }

  async toggleSidebar() {
    await this.ui.sidebarToggleBtn.waitFor({ state: 'visible', timeout: 5000 });
    await this.ui.sidebarToggleBtn.click();
  }

  async openMentions() {
    await this.ui.mentionsMenu.waitFor({ state: 'visible', timeout: 5000 });
    await this.ui.mentionsMenu.click();
  }

  async clickSort() {
    await this.ui.sortBtn.waitFor({ state: 'visible', timeout: 5000 });
    await this.ui.sortBtn.click();
  }

  async toggleTheme() {
    await this.ui.themeToggleBtn.waitFor({ state: 'visible', timeout: 5000 });
    await this.ui.themeToggleBtn.click();
  }

  async fillCreateProjectName(name: string) {
    await this.ui.createProjectNameInput.waitFor({ state: 'visible', timeout: 8000 });
    await this.ui.createProjectNameInput.fill(name);
  }

  async submitCreateProject() {
    await this.ui.createProjectSubmitBtn.waitFor({ state: 'visible', timeout: 5000 });
    await this.ui.createProjectSubmitBtn.click();
  }

  async cancelCreateProject() {
    await this.ui.createProjectCancelBtn.waitFor({ state: 'visible', timeout: 5000 });
    await this.ui.createProjectCancelBtn.click();
  }

  async fillCreateWorkspaceName(name: string) {
    await this.ui.createWorkspaceNameInput.waitFor({ state: 'visible', timeout: 8000 });
    await this.ui.createWorkspaceNameInput.fill(name);
  }

  async selectWorkspaceType(type: string = 'Devops') {
    await this.page.getByRole('button', { name: type, exact: true }).waitFor({ state: 'visible', timeout: 8000 });
    await this.page.getByRole('button', { name: type, exact: true }).click();
  }

  async clickNextInWorkspaceModal() {
    await this.page.getByRole('button', { name: 'Next', exact: true }).waitFor({ state: 'visible', timeout: 8000 });
    await this.page.getByRole('button', { name: 'Next', exact: true }).click();
  }

  async getFirstTicketColumnValue() {
    await this.ui.ticketRows.first().waitFor({ state: 'visible', timeout: 10000 });
    return await this.ui.ticketRows.first().locator('td').first().textContent();
  }
}
