import { Page } from '@playwright/test';
import { BoardsUI } from '../ui/BoardsUI';

export class BoardsPage {

  private page: Page;
  readonly ui: BoardsUI;

  constructor(page: Page) {
    this.page = page;
    this.ui = new BoardsUI(page);
  }

  // Navigate to the Boards/Tickets screen via the sidebar nav icon
  async navigateToBoards() {
    await this.ui.boardsNavIcon.waitFor({ state: 'visible', timeout: 15000 });
    await this.ui.boardsNavIcon.click();
    await this.page.waitForURL(/\/tickets/, { timeout: 30000 });
    await this.ui.openColumnHeader.waitFor({ state: 'visible', timeout: 20000 }).catch(() => {});
  }

  // Click a board in the sidebar by name
  async switchBoard(boardName: string) {
    const boardItem = this.page.locator('div[class*="flex gap-2 items-center-safe justify-between"][class*="cursor-pointer"]')
      .filter({ hasText: new RegExp(boardName, 'i') }).first();
    await boardItem.waitFor({ state: 'visible', timeout: 10000 });
    await boardItem.click();
    await this.page.waitForTimeout(1500);
  }

  // Get total number of visible ticket cards on the board
  async getTicketCardCount(): Promise<number> {
    return await this.page.locator('div[role="button"][class*="cursor-grab"]').count();
  }

  // Get the numeric value shown in the Open column count badge
  async getOpenColumnBadgeCount(): Promise<number> {
    const el = this.page.locator('div[class*="w-5"][class*="h-5"][class*="rounded-full"]').first();
    const text = await el.textContent().catch(() => '0');
    return parseInt(text?.trim() || '0', 10);
  }

  // Get the numeric value shown in the Done column count badge
  async getDoneColumnBadgeCount(): Promise<number> {
    const el = this.page.locator('div[class*="w-5"][class*="h-5"][class*="rounded-full"]').nth(1);
    const text = await el.textContent().catch(() => '0');
    return parseInt(text?.trim() || '0', 10);
  }

  // Click a ticket card by index (0-based)
  async clickTicketCard(index: number) {
    const cards = this.page.locator('div[role="button"][class*="cursor-grab"]');
    await cards.nth(index).waitFor({ state: 'visible', timeout: 10000 });
    await cards.nth(index).click();
    await this.page.waitForTimeout(1500);
  }

  // Get the board title text
  async getBoardTitle(): Promise<string> {
    const el = this.page.locator('p[class*="font-semibold"]').first();
    return (await el.textContent().catch(() => ''))?.trim() || '';
  }

  // Get list of board names visible in the sidebar
  async getSidebarBoardNames(): Promise<string[]> {
    const items = this.page.locator('div[class*="flex gap-2 items-center-safe justify-between"][class*="cursor-pointer"]');
    const count = await items.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await items.nth(i).textContent();
      if (text?.trim()) names.push(text.trim());
    }
    return names;
  }

  // Get all ticket IDs visible on the board (TESAFD_ prefix)
  async getVisibleTicketIds(): Promise<string[]> {
    const badges = this.page.locator('p').filter({ hasText: /TESAFD_/ });
    const count = await badges.count();
    const ids: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await badges.nth(i).textContent();
      if (text?.trim()) ids.push(text.trim());
    }
    return ids;
  }

  // Get all priority badge texts visible on the board
  async getVisiblePriorities(): Promise<string[]> {
    const badges = this.page.locator('p[class*="text-primary-warning-800"]');
    const count = await badges.count();
    const priorities: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await badges.nth(i).textContent();
      if (text?.trim()) priorities.push(text.trim());
    }
    return priorities;
  }
}
