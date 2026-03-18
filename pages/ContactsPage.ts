import { Page } from '@playwright/test';
import { ContactsUI } from '../ui/ContactsUI';

export class ContactsPage {

  public page: Page;
  readonly ui: ContactsUI;

  constructor(page: Page) {
    this.page = page;
    this.ui = new ContactsUI(page);
  }

  // Navigate to the Contacts screen via the sidebar nav icon
  async navigateToContacts(): Promise<void> {
    await this.ui.contactsNavIcon.waitFor({ state: 'visible', timeout: 15000 });
    await this.ui.contactsNavIcon.click();
    await this.page.waitForURL(/\/contacts/, { timeout: 30000 });
    await this.ui.contactListContainer.waitFor({ state: 'visible', timeout: 20000 }).catch(() => {});
  }

  // Opens search input (click icon), types keyword, waits for list to filter
  async searchContact(keyword: string): Promise<void> {
    await this.ui.searchIconButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.ui.searchIconButton.click();
    await this.ui.searchInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.ui.searchInput.fill(keyword);
    await this.page.waitForTimeout(1000);
  }

  // Clears search input, waits for full list to return
  async clearSearch(): Promise<void> {
    await this.ui.searchInput.fill('');
    await this.ui.firstContactItem.waitFor({ state: 'visible', timeout: 15000 });
  }

  // Clicks contact at 0-based index, waits for detail page to load
  async clickContact(index: number): Promise<void> {
    const rows = this.ui.contactListItems;
    await rows.nth(index).waitFor({ state: 'visible', timeout: 10000 });
    await rows.nth(index).click();
    await this.page.waitForURL(/\/contacts\/users\//, { timeout: 30000 });
    await this.ui.detailPanelName.waitFor({ state: 'visible', timeout: 20000 });
  }

  // Returns count of visible contact rows
  async getContactCount(): Promise<number> {
    return await this.ui.contactListItems.count();
  }

  // Returns array of contact name strings
  async getContactNames(): Promise<string[]> {
    const items = this.ui.contactNames;
    const count = await items.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await items.nth(i).textContent();
      if (text?.trim()) names.push(text.trim());
    }
    return names;
  }

  // Returns first contact name
  async getFirstContactName(): Promise<string> {
    const el = this.ui.contactNames.first();
    return (await el.textContent().catch(() => ''))?.trim() || '';
  }

  // Returns name from detail page
  async getDetailPanelName(): Promise<string> {
    return (await this.ui.detailPanelName.textContent().catch(() => ''))?.trim() || '';
  }

  // Returns email from detail page
  async getDetailPanelEmail(): Promise<string> {
    return (await this.ui.detailPanelEmail.textContent().catch(() => ''))?.trim() || '';
  }

  // Returns location from detail page (no phone field exists)
  async getDetailPanelLocation(): Promise<string> {
    return (await this.ui.detailPanelLocation.textContent().catch(() => ''))?.trim() || '';
  }

  // Returns array of activity strings (empty array [] if none — never null)
  async getDetailPanelActivities(): Promise<string[]> {
    const items = this.ui.detailPanelActivities;
    const count = await items.count();
    if (count === 0) return [];
    const activities: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await items.nth(i).textContent();
      if (text?.trim()) activities.push(text.trim());
    }
    return activities;
  }

  // Returns count of conversations in timeline (number, parsed from DOM)
  async getDetailPanelConversations(): Promise<number> {
    return await this.ui.detailPanelConversations.count();
  }

  // Returns whether detail panel name is visible (true = detail page loaded)
  async isDetailPanelVisible(): Promise<boolean> {
    return await this.ui.detailPanelName.isVisible().catch(() => false);
  }
}
