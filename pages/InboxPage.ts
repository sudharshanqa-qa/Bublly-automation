import { Page } from '@playwright/test';
import { InboxUI } from '../ui/InboxUI';

export class InboxPage {

  private page: Page;
  readonly ui: InboxUI;

  constructor(page: Page) {
    this.page = page;
    this.ui = new InboxUI(page);
  }

  // Navigate to inbox directly via URL, then open first conversation
  async navigateToInbox() {
    const urlMatch = this.page.url().match(/\/project\/([^/]+)/);
    if (urlMatch) {
      await this.page.goto(`https://qa-desk.bublly.com/project/${urlMatch[1]}/inbox`);
    }
    await this.page.waitForURL(/\/inbox/, { timeout: 15000 });
    // Click "All" to ensure conversations are visible (My Inbox may be empty)
    await this.page.getByText('All', { exact: true }).first().click();
    await this.page.waitForTimeout(1000);
    // Open the first conversation from the list
    await this.ui.firstTicketItem.waitFor({ state: 'visible', timeout: 15000 });
    await this.ui.firstTicketItem.click();
    await this.page.waitForTimeout(2000);
  }

  // Open a ticket by index (0-based) in the ticket list
  async openTicketByIndex(index: number) {
    const items = this.ui.ticketItems;
    await items.nth(index).waitFor({ state: 'visible', timeout: 10000 });
    await items.nth(index).click();
    await this.page.waitForTimeout(1500);
  }

  // Type text into the reply editor
  async typeReply(text: string) {
    await this.ui.replyEditor.waitFor({ state: 'visible', timeout: 8000 });
    await this.ui.replyEditor.click();
    await this.ui.replyEditor.fill(text);
  }

  // Clear the reply editor
  async clearReply() {
    await this.ui.replyEditor.waitFor({ state: 'visible', timeout: 8000 });
    await this.ui.replyEditor.click();
    await this.page.keyboard.press('Control+A');
    await this.page.keyboard.press('Delete');
  }

  // Click the send button
  async clickSend() {
    await this.ui.sendButton.waitFor({ state: 'visible', timeout: 8000 });
    await this.ui.sendButton.click();
    await this.page.waitForTimeout(2000);
  }

  // Open the status dropdown in metadata
  async openStatusDropdown() {
    await this.ui.statusDropdown.waitFor({ state: 'visible', timeout: 8000 });
    await this.ui.statusDropdown.click();
    await this.page.waitForTimeout(1000);
  }

  // Select a status option by text
  async selectStatus(status: string) {
    await this.page.getByRole('option', { name: new RegExp(status, 'i') }).first().waitFor({ state: 'visible', timeout: 5000 });
    await this.page.getByRole('option', { name: new RegExp(status, 'i') }).first().click();
    await this.page.waitForTimeout(1500);
  }

  // Open the priority dropdown in metadata
  async openPriorityDropdown() {
    await this.ui.priorityDropdown.waitFor({ state: 'visible', timeout: 8000 });
    await this.ui.priorityDropdown.click();
    await this.page.waitForTimeout(1000);
  }

  // Select a priority option by text
  async selectPriority(priority: string) {
    await this.page.getByRole('option', { name: new RegExp(priority, 'i') }).first().waitFor({ state: 'visible', timeout: 5000 });
    await this.page.getByRole('option', { name: new RegExp(priority, 'i') }).first().click();
    await this.page.waitForTimeout(1500);
  }

  // Get count of visible ticket items in the list
  async getTicketListCount() {
    return await this.ui.ticketItems.count();
  }

  // Navigate back to dashboard via sidebar icon
  async goToDashboard() {
    await this.ui.dashboardNavIcon.waitFor({ state: 'visible', timeout: 8000 });
    await this.ui.dashboardNavIcon.click();
    await this.page.waitForURL(/dashboard/, { timeout: 10000 });
  }
}
