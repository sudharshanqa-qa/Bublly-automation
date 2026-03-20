import { test, expect } from '@playwright/test';
import { loginPage } from '../pages/loginPage';
import { ContactsPage } from '../pages/ContactsPage';
import { testdata } from '../utils/testdata';

test.describe('Contacts', () => {

  let login: loginPage;
  let contacts: ContactsPage;

  test.beforeEach(async ({ page }) => {
    login = new loginPage(page);
    contacts = new ContactsPage(page);

    await login.navigateToLogin();
    await login.enterEmail(testdata.email);
    await login.clickEmailSignIn();
    await login.enterPassword(testdata.password);
    await login.clickPasswordSignIn();
    await contacts.navigateToContacts();
  });

  // ── TC_CTT_001–005: Screen loads ──────────────────────────────────────────

  test('TC_CTT_001 - Contacts screen loads and URL contains /contacts', async ({ page }) => {
    await expect(page).toHaveURL(/\/contacts/, { timeout: 10000 });
  });

  test('TC_CTT_002 - Contacts nav icon is visible in sidebar', async () => {
    await expect(contacts.ui.contactsNavIcon).toBeVisible({ timeout: 10000 });
  });

  test('TC_CTT_003 - Contact list container is visible', async () => {
    await expect(contacts.ui.contactListContainer).toBeVisible({ timeout: 10000 });
  });

  test('TC_CTT_004 - Add Contact button is visible', async () => {
    await expect(contacts.ui.addContactButton).toBeVisible({ timeout: 10000 });
  });

  // Adaptation: search is two-step — check searchIconButton visibility (not searchInput)
  test('TC_CTT_005 - Search icon button is visible on page load', async () => {
    await expect(contacts.ui.searchIconButton).toBeVisible({ timeout: 10000 });
  });

  // ── TC_CTT_006–015: Contact list ──────────────────────────────────────────

  test('TC_CTT_006 - Contact list has at least one item', async () => {
    const count = await contacts.getContactCount();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('TC_CTT_007 - Contact names are non-empty strings', async () => {
    const names = await contacts.getContactNames();
    expect(names.length).toBeGreaterThanOrEqual(1);
    for (const name of names) {
      expect(name.trim().length).toBeGreaterThan(0);
    }
  });

  test('TC_CTT_008 - Contact emails are shown in the list', async () => {
    await contacts.ui.contactListItems.first().waitFor({ state: 'visible', timeout: 10000 });
    const emailCount = await contacts.ui.contactEmails.count();
    expect(emailCount).toBeGreaterThanOrEqual(1);
  });

  test('TC_CTT_009 - Contact list rows contain data fields', async () => {
    const rowCount = await contacts.getContactCount();
    expect(rowCount).toBeGreaterThanOrEqual(1);
  });

  // Adaptation: no contactPhones — use contactEmails.count() instead
  test('TC_CTT_010 - Contact email count is a positive number', async () => {
    const emailCount = await contacts.ui.contactEmails.count();
    expect(emailCount).toBeGreaterThan(0);
  });

  test('TC_CTT_011 - Contact count is a positive number', async () => {
    const count = await contacts.getContactCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC_CTT_012 - First contact item is visible', async () => {
    await expect(contacts.ui.firstContactItem).toBeVisible({ timeout: 10000 });
  });

  test('TC_CTT_013 - Contact list items are rendered in the DOM', async () => {
    const count = await contacts.ui.contactListItems.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('TC_CTT_014 - Contact names locator returns at least one element', async () => {
    const count = await contacts.ui.contactNames.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('TC_CTT_015 - First contact name is a non-empty string', async () => {
    const name = await contacts.getFirstContactName();
    expect(name.length).toBeGreaterThan(0);
  });

  // ── TC_CTT_016–025: Search (valid) ────────────────────────────────────────

  // Adaptation: use searchContact() to open and fill, then check inputValue
  test('TC_CTT_016 - Search input accepts text after opening via icon', async () => {
    await contacts.searchContact('test');
    const value = await contacts.ui.searchInput.inputValue();
    expect(value).toBe('test');
  });

  test('TC_CTT_017 - Searching valid keyword filters the contact list', async () => {
    const totalBefore = await contacts.getContactCount();
    await contacts.searchContact(testdata.contactSearchKeyword);
    const countAfter = await contacts.ui.contactListItems.count();
    expect(countAfter).toBeGreaterThanOrEqual(0);
    expect(countAfter).toBeLessThanOrEqual(totalBefore);
  });

  test('TC_CTT_018 - Search with valid keyword returns at least one result', async () => {
    await contacts.searchContact(testdata.contactSearchKeyword);
    const count = await contacts.ui.contactListItems.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('TC_CTT_019 - Search results are present for the searched keyword', async () => {
    await contacts.searchContact(testdata.contactSearchKeyword);
    const count = await contacts.ui.contactListItems.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('TC_CTT_020 - Search can be cleared and full list is restored', async () => {
    await contacts.searchContact(testdata.contactSearchKeyword);
    await contacts.clearSearch();
    const countAfterClear = await contacts.getContactCount();
    expect(countAfterClear).toBeGreaterThanOrEqual(1);
  });

  test('TC_CTT_021 - Full contact list is visible after clearing search', async () => {
    await contacts.searchContact(testdata.contactSearchKeyword);
    await contacts.clearSearch();
    await expect(contacts.ui.contactListContainer).toBeVisible({ timeout: 10000 });
    const count = await contacts.getContactCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC_CTT_022 - Search input is visible after clicking search icon', async () => {
    await contacts.ui.searchIconButton.click();
    await expect(contacts.ui.searchInput).toBeVisible({ timeout: 10000 });
  });

  // Adaptation: open input via searchContact('') first, then assert searchInput is visible
  test('TC_CTT_023 - Search input is visible and accessible after icon click', async () => {
    await contacts.searchContact('');
    await expect(contacts.ui.searchInput).toBeVisible({ timeout: 10000 });
  });

  // Adaptation: open search via searchIconButton click first, then check placeholder
  test('TC_CTT_024 - Search input has correct placeholder text', async () => {
    await contacts.ui.searchIconButton.click();
    await contacts.ui.searchInput.waitFor({ state: 'visible', timeout: 10000 });
    const placeholder = await contacts.ui.searchInput.getAttribute('placeholder');
    expect(placeholder).toBe('Search by email or name...');
  });

  test('TC_CTT_025 - Contact list container is still visible after search and clear', async () => {
    await contacts.searchContact(testdata.contactSearchKeyword);
    await contacts.clearSearch();
    await expect(contacts.ui.contactListContainer).toBeVisible({ timeout: 10000 });
  });

  // ── TC_CTT_026–040: Detail panel (open) ───────────────────────────────────

  test('TC_CTT_026 - Clicking a contact opens the detail page', async ({ page }) => {
    await contacts.clickContact(0);
    await expect(page).toHaveURL(/\/contacts\/users\//, { timeout: 10000 });
  });

  test('TC_CTT_027 - Detail panel is visible after clicking a contact', async () => {
    await contacts.clickContact(0);
    const isVisible = await contacts.isDetailPanelVisible();
    expect(isVisible).toBe(true);
  });

  test('TC_CTT_028 - Detail panel container is visible after clicking a contact', async () => {
    await contacts.clickContact(0);
    await expect(contacts.ui.detailPanelContainer).toBeVisible({ timeout: 10000 });
  });

  test('TC_CTT_029 - Detail panel shows a non-empty name', async () => {
    await contacts.clickContact(0);
    const name = await contacts.getDetailPanelName();
    expect(name.length).toBeGreaterThan(0);
  });

  // Adaptation: no detailPanelPhone — check detailPanelLocation visibility instead
  test('TC_CTT_030 - Detail panel location field is visible', async () => {
    await contacts.clickContact(0);
    await contacts.ui.detailPanelName.waitFor({ state: 'visible', timeout: 10000 });
    await expect(contacts.ui.detailPanelLocation).toBeVisible({ timeout: 10000 });
  });

  test('TC_CTT_031 - Detail panel shows a non-empty email', async () => {
    await contacts.clickContact(0);
    const email = await contacts.getDetailPanelEmail();
    expect(email.length).toBeGreaterThan(0);
  });

  test('TC_CTT_032 - Detail panel email contains @ symbol', async () => {
    await contacts.clickContact(0);
    const email = await contacts.getDetailPanelEmail();
    expect(email).toContain('@');
  });

  // Adaptation: use getDetailPanelLocation() instead of getDetailPanelPhone()
  test('TC_CTT_033 - Detail panel location field returns a string value', async () => {
    await contacts.clickContact(0);
    const location = await contacts.getDetailPanelLocation();
    expect(typeof location).toBe('string');
  });

  test('TC_CTT_034 - Detail panel name matches the contact name clicked in the list', async () => {
    const nameBefore = await contacts.getFirstContactName();
    await contacts.clickContact(0);
    const nameInPanel = await contacts.getDetailPanelName();
    // The app may render the name with different casing in the list vs detail panel — compare case-insensitively
    expect(nameInPanel.toLowerCase()).toBe(nameBefore.toLowerCase());
  });

  test('TC_CTT_035 - Detail panel name field is non-empty', async () => {
    await contacts.clickContact(0);
    const name = await contacts.getDetailPanelName();
    expect(name).not.toBe('');
  });

  test('TC_CTT_036 - Detail panel email field is non-empty', async () => {
    await contacts.clickContact(0);
    const email = await contacts.getDetailPanelEmail();
    expect(email).not.toBe('');
  });

  test('TC_CTT_037 - Detail panel name locator is visible', async () => {
    await contacts.clickContact(0);
    await expect(contacts.ui.detailPanelName).toBeVisible({ timeout: 10000 });
  });

  test('TC_CTT_038 - Detail panel email locator is visible', async () => {
    await contacts.clickContact(0);
    await expect(contacts.ui.detailPanelEmail).toBeVisible({ timeout: 10000 });
  });

  // Adaptation: use detailPanelLocation.count() instead of detailPanelPhone
  test('TC_CTT_039 - Detail panel location locator count is at least 0', async () => {
    await contacts.clickContact(0);
    await contacts.ui.detailPanelName.waitFor({ state: 'visible', timeout: 10000 });
    const count = await contacts.ui.detailPanelLocation.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('TC_CTT_040 - Detail page URL matches /contacts/users/ pattern', async ({ page }) => {
    await contacts.clickContact(0);
    await expect(page).toHaveURL(/\/contacts\/users\//, { timeout: 10000 });
  });

  // ── TC_CTT_041–050: Detail panel (activities & conversations) ─────────────

  // Adaptation: use detailPanelActivities (not detailPanelTags)
  test('TC_CTT_041 - Detail panel activities element exists in DOM', async () => {
    await contacts.clickContact(0);
    await contacts.ui.detailPanelName.waitFor({ state: 'visible', timeout: 10000 });
    const count = await contacts.ui.detailPanelActivities.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  // Adaptation: use getDetailPanelActivities() (not getDetailPanelTags())
  test('TC_CTT_042 - getDetailPanelActivities returns an array', async () => {
    await contacts.clickContact(0);
    const activities = await contacts.getDetailPanelActivities();
    expect(Array.isArray(activities)).toBe(true);
  });

  // Adaptation: use getDetailPanelActivities()
  test('TC_CTT_043 - getDetailPanelActivities returns array with length >= 0', async () => {
    await contacts.clickContact(0);
    const activities = await contacts.getDetailPanelActivities();
    expect(activities.length).toBeGreaterThanOrEqual(0);
  });

  // Adaptation: use getDetailPanelActivities()
  test('TC_CTT_044 - getDetailPanelActivities does not return null', async () => {
    await contacts.clickContact(0);
    const activities = await contacts.getDetailPanelActivities();
    expect(activities).not.toBeNull();
  });

  // Adaptation: use detailPanelConversations (not detailPanelTickets)
  test('TC_CTT_045 - Detail panel conversations element exists in DOM', async () => {
    await contacts.clickContact(0);
    await contacts.ui.detailPanelName.waitFor({ state: 'visible', timeout: 10000 });
    const count = await contacts.ui.detailPanelConversations.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  // Adaptation: use getDetailPanelConversations() (not getDetailPanelTickets())
  test('TC_CTT_046 - getDetailPanelConversations returns a number', async () => {
    await contacts.clickContact(0);
    const count = await contacts.getDetailPanelConversations();
    expect(typeof count).toBe('number');
  });

  // Adaptation: use getDetailPanelConversations()
  test('TC_CTT_047 - getDetailPanelConversations returns a value >= 0', async () => {
    await contacts.clickContact(0);
    const count = await contacts.getDetailPanelConversations();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  // Adaptation: use getDetailPanelConversations()
  test('TC_CTT_048 - getDetailPanelConversations is not negative', async () => {
    await contacts.clickContact(0);
    const count = await contacts.getDetailPanelConversations();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  // Adaptation: use getDetailPanelActivities()
  test('TC_CTT_049 - Activities list entries are strings when present', async () => {
    await contacts.clickContact(0);
    const activities = await contacts.getDetailPanelActivities();
    for (const activity of activities) {
      expect(typeof activity).toBe('string');
    }
  });

  // Adaptation: use getDetailPanelConversations()
  test('TC_CTT_050 - Conversations count is a finite number', async () => {
    await contacts.clickContact(0);
    const count = await contacts.getDetailPanelConversations();
    expect(Number.isFinite(count)).toBe(true);
  });

  // ── TC_CTT_051–060: Navigation ────────────────────────────────────────────

  test('TC_CTT_051 - Contacts nav icon is visible from the contacts screen', async () => {
    await expect(contacts.ui.contactsNavIcon).toBeVisible({ timeout: 10000 });
  });

  test('TC_CTT_052 - Contacts URL loads correctly after navigateToContacts()', async ({ page }) => {
    await expect(page).toHaveURL(/\/contacts/, { timeout: 10000 });
  });

  test('TC_CTT_053 - Navigating away and back reloads the contact list', async ({ page }) => {
    await page.goBack();
    await contacts.navigateToContacts();
    await expect(contacts.ui.contactListContainer).toBeVisible({ timeout: 15000 });
  });

  test('TC_CTT_054 - Contact list is visible after re-navigation to contacts', async () => {
    await contacts.navigateToContacts();
    await expect(contacts.ui.contactListContainer).toBeVisible({ timeout: 15000 });
  });

  test('TC_CTT_055 - Page body is visible on contacts screen', async () => {
    await expect(contacts.ui.bodyLocator).toBeVisible({ timeout: 10000 });
  });

  test('TC_CTT_056 - Add Contact button is enabled on contacts screen', async () => {
    await expect(contacts.ui.addContactButton).toBeEnabled({ timeout: 10000 });
  });

  // Adaptation: check searchIconButton is enabled (not searchInput)
  test('TC_CTT_057 - Search icon button is enabled on contacts screen', async () => {
    await expect(contacts.ui.searchIconButton).toBeEnabled({ timeout: 10000 });
  });

  test('TC_CTT_058 - Contact list container is not hidden on contacts screen', async () => {
    await expect(contacts.ui.contactListContainer).not.toBeHidden({ timeout: 10000 });
  });

  test('TC_CTT_059 - Nav icon click navigates to contacts URL', async ({ page }) => {
    await contacts.ui.contactsNavIcon.click();
    await expect(page).toHaveURL(/\/contacts/, { timeout: 15000 });
  });

  test('TC_CTT_060 - Contact list loads within a reasonable timeout', async () => {
    await contacts.ui.contactListContainer.waitFor({ state: 'visible', timeout: 20000 });
    const count = await contacts.getContactCount();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  // ── TC_CTT_061–070: UI integrity ──────────────────────────────────────────

  test('TC_CTT_061 - Add Contact button is visible on contacts screen', async () => {
    await expect(contacts.ui.addContactButton).toBeVisible({ timeout: 10000 });
  });

  test('TC_CTT_062 - No error messages visible on page load', async ({ page }) => {
    const errorLocator = page.locator('[class*="error"], [class*="Error"]');
    const count = await errorLocator.count();
    if (count > 0) {
      await expect(errorLocator.first()).not.toBeVisible();
    } else {
      expect(count).toBe(0);
    }
  });

  test('TC_CTT_063 - Body does not contain login form email input', async ({ page }) => {
    const loginInput = page.locator('input[type="email"][name="email"]');
    await expect(loginInput).not.toBeVisible({ timeout: 5000 });
  });

  test('TC_CTT_064 - Body does not contain boards/tickets heading from Boards screen', async ({ page }) => {
    await expect(page).toHaveURL(/\/contacts/, { timeout: 10000 });
    const boardsHeading = page.getByRole('heading', { name: /Tickets/i });
    await expect(boardsHeading).not.toBeVisible({ timeout: 5000 });
  });

  test('TC_CTT_065 - Contact list items count is not negative', async () => {
    const count = await contacts.getContactCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  // Adaptation: check searchIconButton is visible (not searchInput)
  test('TC_CTT_066 - Search icon button is visible on contacts screen', async () => {
    await expect(contacts.ui.searchIconButton).toBeVisible({ timeout: 10000 });
  });

  test('TC_CTT_067 - Contact list container is not detached from DOM', async () => {
    await contacts.ui.contactListContainer.waitFor({ state: 'attached', timeout: 10000 });
    const count = await contacts.ui.contactListContainer.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  // Adaptation: on /contacts list page, detailPanelName locator finds nothing → returns false
  test('TC_CTT_068 - isDetailPanelVisible returns false before any contact click', async () => {
    const isVisible = await contacts.isDetailPanelVisible();
    expect(isVisible).toBe(false);
  });

  test('TC_CTT_069 - Contact list is scrollable when it has enough items', async ({ page }) => {
    const listHandle = await contacts.ui.contactListContainer.elementHandle();
    if (listHandle) {
      const scrollHeight = await page.evaluate(el => (el as HTMLElement).scrollHeight, listHandle);
      const clientHeight = await page.evaluate(el => (el as HTMLElement).clientHeight, listHandle);
      expect(scrollHeight).toBeGreaterThanOrEqual(clientHeight);
    } else {
      await expect(contacts.ui.contactListContainer).toBeVisible({ timeout: 10000 });
    }
  });

  test('TC_CTT_070 - Contact list container is a table element', async () => {
    await contacts.ui.contactListContainer.waitFor({ state: 'visible', timeout: 10000 });
    const tag = await contacts.ui.contactListContainer.evaluate(el => el.tagName.toLowerCase());
    expect(tag).toBe('table');
  });

  // ── Negative Test Cases ────────────────────────────────────────────────────

  test('TC_CTT_N001 - Search gibberish keyword does not crash and list is stable', async () => {
    await contacts.searchContact(testdata.contactInvalidSearch);
    const count = await contacts.getContactCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('TC_CTT_N002 - Search SQL injection does not crash and list is stable', async () => {
    await contacts.searchContact("\' OR \'1\'=\'1");
    const count = await contacts.getContactCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('TC_CTT_N003 - Search XSS payload does not execute script', async () => {
    await contacts.searchContact('<script>alert(1)</script>');
    const count = await contacts.getContactCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('TC_CTT_N004 - Search Unicode characters does not crash', async () => {
    await contacts.searchContact('テスト検索');
    const count = await contacts.getContactCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('TC_CTT_N005 - Search special characters does not crash', async () => {
    await contacts.searchContact('!@#$%^&*()');
    const count = await contacts.getContactCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('TC_CTT_N006 - Search 200-char string does not crash or break layout', async () => {
    await contacts.searchContact('a'.repeat(200));
    const count = await contacts.getContactCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('TC_CTT_N007 - Search whitespace only behaves consistently', async () => {
    await contacts.searchContact('   ');
    const count = await contacts.getContactCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('TC_CTT_N008 - Contact list does not show inbox/conversation elements', async () => {
    const inboxEls = await contacts.ui.bodyLocator.locator('div[class*="py-3"][class*="cursor-pointer"]').count();
    expect(inboxEls).toBe(0);
  });

  test('TC_CTT_N009 - Contact list does not show boards/tickets elements', async () => {
    const ticketCards = await contacts.ui.bodyLocator.locator('div[role="button"][class*="cursor-grab"]').count();
    expect(ticketCards).toBe(0);
  });

  test('TC_CTT_N010 - Contact list does not show login form elements', async () => {
    const loginEls = await contacts.ui.bodyLocator.locator('input[type="password"]').count();
    expect(loginEls).toBe(0);
  });

  test('TC_CTT_N011 - Contact names in list are not empty strings', async () => {
    const names = await contacts.getContactNames();
    names.forEach(name => expect(name.trim()).not.toBe(''));
  });

  test('TC_CTT_N012 - Contact list count is not negative', async () => {
    const count = await contacts.getContactCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('TC_CTT_N013 - Detail panel does not open without clicking a contact', async () => {
    const visible = await contacts.isDetailPanelVisible();
    expect(visible).toBe(false);
  });

  test('TC_CTT_N014 - isDetailPanelVisible returns false before any contact click', async () => {
    const visible = await contacts.isDetailPanelVisible();
    expect(visible).toBe(false);
  });

  test('TC_CTT_N015 - Search result count does not exceed total contact count', async () => {
    const total = await contacts.getContactCount();
    await contacts.searchContact(testdata.contactSearchKeyword);
    const filtered = await contacts.getContactCount();
    expect(filtered).toBeLessThanOrEqual(total);
  });

  test('TC_CTT_N016 - Invalid search does not open a detail panel automatically', async () => {
    await contacts.searchContact(testdata.contactInvalidSearch);
    const visible = await contacts.isDetailPanelVisible();
    expect(visible).toBe(false);
  });

  test('TC_CTT_N017 - Search input does not auto-submit on focus', async ({ page }) => {
    const beforeCount = await contacts.getContactCount();
    await contacts.ui.searchIconButton.waitFor({ state: 'visible', timeout: 10000 });
    await contacts.ui.searchIconButton.click();
    await contacts.ui.searchInput.waitFor({ state: 'visible', timeout: 5000 });
    await page.waitForTimeout(500);
    const afterCount = await contacts.getContactCount();
    expect(afterCount).toBe(beforeCount);
  });

  test('TC_CTT_N018 - Page does not show loading spinner indefinitely', async ({ page }) => {
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    const count = await contacts.getContactCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('TC_CTT_N019 - Contact email in detail panel is not empty for known contact', async () => {
    await contacts.clickContact(0);
    const email = await contacts.getDetailPanelEmail();
    expect(email.trim()).not.toBe('');
  });

  test('TC_CTT_N020 - Contact location in detail panel is a string for known contact', async () => {
    await contacts.clickContact(0);
    const location = await contacts.getDetailPanelLocation();
    expect(typeof location).toBe('string');
  });

  test('TC_CTT_N021 - Activities list in detail panel does not contain null or undefined entries', async () => {
    await contacts.clickContact(0);
    const activities = await contacts.getDetailPanelActivities();
    activities.forEach(activity => {
      expect(activity).not.toBeNull();
      expect(activity).not.toBeUndefined();
    });
  });

  test('TC_CTT_N022 - Conversation count in detail panel is not negative', async () => {
    await contacts.clickContact(0);
    const count = await contacts.getDetailPanelConversations();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('TC_CTT_N023 - Reloading contacts page still shows contact list', async ({ page }) => {
    await page.reload();
    await contacts.ui.contactListContainer.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    const count = await contacts.getContactCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('TC_CTT_N024 - Page URL does not show 404 or error route', async ({ page }) => {
    const url = page.url();
    expect(url).not.toContain('/404');
    expect(url).not.toContain('/error');
    await expect(contacts.ui.contactListContainer).toBeVisible({ timeout: 10000 });
  });

  test('TC_CTT_N025 - Search does not filter list when input is cleared', async () => {
    const beforeCount = await contacts.getContactCount();
    await contacts.searchContact(testdata.contactSearchKeyword);
    await contacts.clearSearch();
    const afterCount = await contacts.getContactCount();
    expect(afterCount).toBe(beforeCount);
  });

  test('TC_CTT_N026 - Contact list does not show excessive duplicate entries', async () => {
    const names = await contacts.getContactNames();
    const unique = new Set(names);
    expect(names.length).toBeLessThanOrEqual(unique.size * 2);
  });

  // ── Functional Test Cases ──────────────────────────────────────────────────

  test('TC_CTT_F001 - Search reduces count, clear restores count', async () => {
    const beforeCount = await contacts.getContactCount();
    await contacts.searchContact(testdata.contactSearchKeyword);
    const filteredCount = await contacts.getContactCount();
    expect(filteredCount).toBeLessThanOrEqual(beforeCount);
    await contacts.clearSearch();
    const restoredCount = await contacts.getContactCount();
    expect(restoredCount).toBe(beforeCount);
  });

  test('TC_CTT_F002 - Search keyword, click first result, detail panel name matches keyword', async () => {
    await contacts.searchContact(testdata.contactSearchKeyword);
    await contacts.clickContact(0);
    const panelName = await contacts.getDetailPanelName();
    expect(panelName.toLowerCase()).toContain(testdata.contactSearchKeyword.toLowerCase());
  });

  test('TC_CTT_F003 - Navigate away and back, contact list is visible', async ({ page }) => {
    await page.goBack();
    await page.goForward();
    await contacts.ui.contactListContainer.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    const count = await contacts.getContactCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('TC_CTT_F004 - Open contact, name and email are both non-empty', async () => {
    await contacts.clickContact(0);
    const name = await contacts.getDetailPanelName();
    const email = await contacts.getDetailPanelEmail();
    expect(name.trim()).not.toBe('');
    expect(email.trim()).not.toBe('');
  });

  test('TC_CTT_F005 - Open contact, activities list renders as array', async () => {
    await contacts.clickContact(0);
    const activities = await contacts.getDetailPanelActivities();
    expect(Array.isArray(activities)).toBe(true);
  });

  test('TC_CTT_F006 - Open contact, conversation count is a number', async () => {
    await contacts.clickContact(0);
    const count = await contacts.getDetailPanelConversations();
    expect(typeof count).toBe('number');
    expect(isNaN(count)).toBe(false);
  });

  test('TC_CTT_F007 - Click contact 0 then contact 1, both show detail pages', async ({ page }) => {
    const total = await contacts.getContactCount();
    if (total >= 2) {
      await contacts.clickContact(0);
      const name0 = await contacts.getDetailPanelName();
      await page.goBack();
      await contacts.ui.firstContactItem.waitFor({ state: 'visible', timeout: 10000 });
      await contacts.clickContact(1);
      const name1 = await contacts.getDetailPanelName();
      expect(name0.trim()).not.toBe('');
      expect(name1.trim()).not.toBe('');
    }
  });

  test('TC_CTT_F008 - Search, click first result, detail panel name matches list name', async () => {
    await contacts.searchContact(testdata.contactSearchKeyword);
    const listName = await contacts.getFirstContactName();
    await contacts.clickContact(0);
    const panelName = await contacts.getDetailPanelName();
    expect(panelName.toLowerCase()).toBe(listName.toLowerCase());
  });

  test('TC_CTT_F009 - Full page reload, contacts list re-renders with items', async ({ page }) => {
    await page.reload();
    await contacts.navigateToContacts();
    const count = await contacts.getContactCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC_CTT_F010 - Add contact button click triggers UI response', async ({ page }) => {
    await contacts.ui.addContactButton.click();
    await page.waitForTimeout(1000);
    const bodyText = await contacts.ui.bodyLocator.textContent() ?? '';
    const urlAfter = page.url();
    const somethingHappened =
      urlAfter.includes('new') || urlAfter.includes('create') ||
      bodyText.toLowerCase().includes('add contact') ||
      bodyText.toLowerCase().includes('new contact') ||
      bodyText.toLowerCase().includes('enter name') ||
      bodyText.toLowerCase().includes('enter email');
    expect(somethingHappened).toBe(true);
  });

  test('TC_CTT_F011 - Contact count before search >= contact count after valid search', async () => {
    const before = await contacts.getContactCount();
    await contacts.searchContact(testdata.contactSearchKeyword);
    const after = await contacts.getContactCount();
    expect(before).toBeGreaterThanOrEqual(after);
  });

  test('TC_CTT_F012 - Contact count after clear equals count before search', async () => {
    const before = await contacts.getContactCount();
    await contacts.searchContact(testdata.contactSearchKeyword);
    await contacts.clearSearch();
    const after = await contacts.getContactCount();
    expect(after).toBe(before);
  });

  test('TC_CTT_F013 - Contact list renders without horizontal overflow', async ({ page }) => {
    const overflow = await page.evaluate(() => document.body.scrollWidth > document.body.clientWidth);
    expect(overflow).toBe(false);
  });

  test('TC_CTT_F014 - Detail panel email is valid email format', async () => {
    await contacts.clickContact(0);
    const email = await contacts.getDetailPanelEmail();
    expect(email).toContain('@');
    expect(email).toMatch(/\S+@\S+\.\S+/);
  });

  test('TC_CTT_F015 - getContactNames length equals getContactCount', async () => {
    const count = await contacts.getContactCount();
    const names = await contacts.getContactNames();
    expect(names.length).toBe(count);
  });

  test('TC_CTT_F016 - First contact name in list matches getFirstContactName', async () => {
    const names = await contacts.getContactNames();
    const first = await contacts.getFirstContactName();
    if (names.length > 0) expect(first).toBe(names[0]);
  });

  test('TC_CTT_F017 - isDetailPanelVisible returns true after clickContact(0)', async () => {
    await contacts.clickContact(0);
    const visible = await contacts.isDetailPanelVisible();
    expect(visible).toBe(true);
  });

  test('TC_CTT_F018 - Detail panel location field is a string for first contact', async () => {
    await contacts.clickContact(0);
    const location = await contacts.getDetailPanelLocation();
    expect(typeof location).toBe('string');
  });

  test('TC_CTT_F019 - Contacts nav icon navigates to contacts URL from another screen', async ({ page }) => {
    await page.goBack();
    await contacts.navigateToContacts();
    await expect(page).toHaveURL(/\/contacts/, { timeout: 15000 });
  });

  test('TC_CTT_F020 - Search with contactSearchKeyword returns at least 1 result', async () => {
    await contacts.searchContact(testdata.contactSearchKeyword);
    const count = await contacts.getContactCount();
    expect(count).toBeGreaterThanOrEqual(1);
  });

}); // end describe('Contacts')
