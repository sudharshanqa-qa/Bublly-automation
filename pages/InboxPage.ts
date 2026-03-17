import { Page } from '@playwright/test';
import { InboxUI } from '../ui/InboxUI';

export class InboxPage {

  private page: Page;
  readonly ui: InboxUI;

  constructor(page: Page) {
    this.page = page;
    this.ui = new InboxUI(page);
  }

  // Navigate to inbox and open the first conversation so the detail panel is loaded
  async navigateToInbox() {
    const url = this.page.url();

    // Login redirects to /project/{id}/inbox/{channelId} (e.g. /inbox/81).
    // The base /inbox URL shows "My Inbox" which is empty for this user.
    // Navigating to /inbox/{channelId}/all/open shows all conversations in that channel.
    const projectMatch = url.match(/\/project\/([^/]+)/);
    const channelMatch = url.match(/\/inbox\/(\d+)/);

    if (projectMatch) {
      let targetUrl: string;
      if (channelMatch) {
        targetUrl = `https://qa-desk.bublly.com/project/${projectMatch[1]}/inbox/${channelMatch[1]}/all/open`;
      } else {
        targetUrl = `https://qa-desk.bublly.com/project/${projectMatch[1]}/inbox`;
      }
      await this.page.goto(targetUrl);
      await this.page.waitForURL(/\/inbox/, { timeout: 30000 });
    } else {
      // Fallback: on /dashboard — use sidebar inbox link
      const inboxLink = this.page.locator('a[href*="/inbox"]').first();
      if (await inboxLink.isVisible({ timeout: 8000 }).catch(() => false)) {
        await inboxLink.click();
        await this.page.waitForURL(/\/inbox/, { timeout: 30000 });
      }
    }
    // Wait for conversation list to be ready before interacting
    const firstConvo = this.page.locator('div[class*="cursor-pointer"][class*="py-3"]').first();
    await firstConvo.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});

    // Use .last() to match the same element as ui.replyEditor
    const replyEditor = this.page.locator('div[contenteditable="true"]').last();

    // Only click the first conversation if the detail panel is not already open
    const alreadyOpen = await replyEditor.isVisible({ timeout: 2000 }).catch(() => false);
    if (!alreadyOpen) {
      if (await firstConvo.isVisible({ timeout: 5000 }).catch(() => false)) {
        await firstConvo.click();
      }
    }

    // Wait for reply editor — confirms the detail panel is open
    await replyEditor.waitFor({ state: 'visible', timeout: 20000 });
    // Wait for metadata panel — confirms the right sidebar has fully rendered
    await this.page.locator('div[class*="space-y-3"][class*="bg-grey"]').first()
      .waitFor({ state: 'visible', timeout: 20000 }).catch(() => {});
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
    // pressSequentially fires real keyboard events so React state updates correctly
    await this.ui.replyEditor.pressSequentially(text, { delay: 20 });
  }

  // Clear the reply editor
  async clearReply() {
    await this.ui.replyEditor.waitFor({ state: 'visible', timeout: 8000 });
    await this.ui.replyEditor.click();
    // Meta+A selects all content in contenteditable on macOS (Ctrl+A doesn't always work)
    await this.page.keyboard.press('Meta+A');
    await this.page.keyboard.press('Backspace');
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
    await this.ui.dashboardNavIcon.waitFor({ state: 'visible', timeout: 15000 });
    await this.ui.dashboardNavIcon.click();
    await this.page.waitForURL(/dashboard/, { timeout: 20000 });
  }
}
