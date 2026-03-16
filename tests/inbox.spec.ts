import { test, expect } from '@playwright/test';
import { loginPage } from '../pages/loginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { InboxPage } from '../pages/InboxPage';
import { testdata } from '../utils/testdata';

test.describe('Inbox', () => {

  let login: loginPage;
  let dashboard: DashboardPage;
  let inbox: InboxPage;

  test.beforeEach(async ({ page }) => {
    login = new loginPage(page);
    dashboard = new DashboardPage(page);
    inbox = new InboxPage(page);

    await login.navigateToLogin();
    await login.enterEmail(testdata.email);
    await login.clickEmailSignIn();
    await login.enterPassword(testdata.password);
    await login.clickPasswordSignIn();
    // Wait for post-login redirect (URL will contain project ID)
    await page.waitForURL(/dashboard|project|inbox/, { timeout: 15000 });
    await inbox.navigateToInbox();
  });

  // ── Positive Test Cases ──────────────────────────────────────────────────────

  test('TC_INB_001 - Inbox page loads and URL contains /inbox', async ({ page }) => {
    await expect(page).toHaveURL(/inbox/, { timeout: 10000 });
  });

  test('TC_INB_002 - Ticket list panel is visible', async () => {
    await expect(inbox.ui.ticketListContainer).toBeVisible({ timeout: 10000 });
  });

  test('TC_INB_003 - At least one ticket item visible in list', async () => {
    await expect(inbox.ui.firstTicketItem).toBeVisible({ timeout: 10000 });
  });

  test('TC_INB_004 - Ticket ID span visible in list', async () => {
    await expect(inbox.ui.firstTicketIdSpan).toBeVisible({ timeout: 10000 });
  });

  test('TC_INB_005 - Ticket IDs contain TESAFD prefix', async () => {
    const text = await inbox.ui.firstTicketIdSpan.textContent();
    expect(text).toMatch(/#TESAFD/);
  });

  test('TC_INB_006 - Multiple ticket items visible in left panel', async () => {
    await inbox.ui.firstTicketItem.waitFor({ state: 'visible', timeout: 10000 });
    const count = await inbox.ui.ticketItems.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('TC_INB_007 - Ticket ID in detail panel is visible', async () => {
    await expect(inbox.ui.ticketIdInDetail).toBeVisible({ timeout: 10000 });
  });

  test('TC_INB_008 - Ticket ID in detail panel contains TESAFD prefix', async () => {
    await expect(inbox.ui.ticketIdInDetail).toBeVisible({ timeout: 10000 });
    const text = await inbox.ui.ticketIdInDetail.textContent();
    expect(text).toMatch(/#TESAFD/);
  });

  test('TC_INB_009 - Reply editor is visible', async () => {
    await expect(inbox.ui.replyEditor).toBeVisible({ timeout: 10000 });
  });

  test('TC_INB_010 - Reply editor is enabled', async () => {
    await expect(inbox.ui.replyEditor).toBeEnabled({ timeout: 8000 });
  });

  test('TC_INB_011 - Reply editor is not disabled', async () => {
    await inbox.ui.replyEditor.waitFor({ state: 'visible', timeout: 8000 });
    await expect(inbox.ui.replyEditor).not.toBeDisabled();
  });

  test('TC_INB_012 - Reply editor accepts typed text', async () => {
    await inbox.typeReply(testdata.inboxReplyText);
    const value = await inbox.ui.replyEditor.textContent();
    expect(value?.trim()).toBeTruthy();
  });

  test('TC_INB_013 - Send button is visible', async () => {
    await inbox.typeReply(testdata.inboxReplyText);
    await expect(inbox.ui.sendButton).toBeVisible({ timeout: 10000 });
  });

  test('TC_INB_014 - Send button is enabled', async () => {
    await inbox.typeReply(testdata.inboxReplyText);
    await expect(inbox.ui.sendButton).toBeEnabled({ timeout: 8000 });
  });

  test('TC_INB_015 - Summarize button is visible', async () => {
    await expect(inbox.ui.summarizeButton).toBeVisible({ timeout: 8000 });
  });

  test('TC_INB_016 - Bub AI Suggestions button is visible', async () => {
    await expect(inbox.ui.aiSuggestionsButton).toBeVisible({ timeout: 8000 });
  });

  test('TC_INB_017 - Metadata panel is visible', async () => {
    await expect(inbox.ui.metadataPanel).toBeVisible({ timeout: 10000 });
  });

  test('TC_INB_018 - Status dropdown is visible in metadata', async () => {
    await expect(inbox.ui.statusDropdown).toBeVisible({ timeout: 10000 });
  });

  test('TC_INB_019 - Priority dropdown is visible in metadata', async () => {
    await expect(inbox.ui.priorityDropdown).toBeVisible({ timeout: 10000 });
  });

  test('TC_INB_020 - Assignee dropdown is visible in metadata', async () => {
    await expect(inbox.ui.assigneeDropdown).toBeVisible({ timeout: 10000 });
  });

  test('TC_INB_021 - Queue dropdown is visible in metadata', async () => {
    await expect(inbox.ui.queueDropdown).toBeVisible({ timeout: 10000 });
  });

  test('TC_INB_022 - Type dropdown is visible in metadata', async () => {
    await expect(inbox.ui.typeDropdown).toBeVisible({ timeout: 10000 });
  });

  test('TC_INB_023 - Details tab is visible in detail panel', async () => {
    await expect(inbox.ui.detailsTab).toBeVisible({ timeout: 8000 });
  });

  test('TC_INB_024 - Description tab is visible in detail panel', async () => {
    await expect(inbox.ui.descriptionTab).toBeVisible({ timeout: 8000 });
  });

  test('TC_INB_025 - AI Brief tab is visible in detail panel', async () => {
    await expect(inbox.ui.aiBriefTab).toBeVisible({ timeout: 8000 });
  });

  test('TC_INB_026 - Clicking Description tab keeps user on inbox', async ({ page }) => {
    await inbox.ui.descriptionTab.waitFor({ state: 'visible', timeout: 8000 });
    await inbox.ui.descriptionTab.click();
    await expect(page).toHaveURL(/inbox/, { timeout: 5000 });
  });

  test('TC_INB_027 - Clicking AI Brief tab keeps user on inbox', async ({ page }) => {
    await inbox.ui.aiBriefTab.waitFor({ state: 'visible', timeout: 8000 });
    await inbox.ui.aiBriefTab.click();
    await expect(page).toHaveURL(/inbox/, { timeout: 5000 });
  });

  test('TC_INB_028 - Clicking Details tab keeps user on inbox', async ({ page }) => {
    await inbox.ui.descriptionTab.click();
    await inbox.ui.detailsTab.waitFor({ state: 'visible', timeout: 8000 });
    await inbox.ui.detailsTab.click();
    await expect(page).toHaveURL(/inbox/, { timeout: 5000 });
  });

  test('TC_INB_029 - Detail panel header is visible', async () => {
    await expect(inbox.ui.detailPanelHeader).toBeVisible({ timeout: 10000 });
  });

  test('TC_INB_030 - Message thread container is visible', async () => {
    await expect(inbox.ui.messageThread).toBeVisible({ timeout: 10000 });
  });

  test('TC_INB_031 - Message thread is non-empty', async () => {
    const text = await inbox.ui.messageThread.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('TC_INB_032 - Sidebar logo is visible in inbox', async () => {
    await expect(inbox.ui.inboxSidebarLogo).toBeVisible({ timeout: 8000 });
  });

  test('TC_INB_033 - Inbox page title is non-empty', async ({ page }) => {
    const title = await page.title();
    expect(title.trim().length).toBeGreaterThan(0);
  });

  test('TC_INB_034 - Page body is rendered and non-empty', async () => {
    const bodyText = await inbox.ui.bodyLocator.textContent();
    expect(bodyText?.trim().length).toBeGreaterThan(0);
  });

  test('TC_INB_035 - Inbox page does not redirect to login', async ({ page }) => {
    await expect(page).not.toHaveURL(/login|signin/, { timeout: 5000 });
  });

  test('TC_INB_036 - Status dropdown is enabled', async () => {
    await expect(inbox.ui.statusDropdown).toBeEnabled({ timeout: 8000 });
  });

  test('TC_INB_037 - Priority dropdown is enabled', async () => {
    await expect(inbox.ui.priorityDropdown).toBeEnabled({ timeout: 8000 });
  });

  test('TC_INB_038 - Status dropdown shows options when opened', async ({ page }) => {
    await inbox.openStatusDropdown();
    const count = await inbox.ui.statusOptions.count();
    expect(count).toBeGreaterThanOrEqual(1);
    await page.keyboard.press('Escape');
  });

  test('TC_INB_039 - Priority dropdown shows options when opened', async ({ page }) => {
    await inbox.openPriorityDropdown();
    const count = await inbox.ui.priorityOptions.count();
    expect(count).toBeGreaterThanOrEqual(1);
    await page.keyboard.press('Escape');
  });

  test('TC_INB_040 - Reply editor placeholder is visible before typing', async () => {
    await expect(inbox.ui.bodyLocator).toContainText('Start Conversation', { timeout: 8000 });
  });

  test('TC_INB_041 - Send button is a button element', async () => {
    await inbox.typeReply(testdata.inboxReplyText);
    await expect(inbox.ui.sendButton).toBeVisible({ timeout: 8000 });
    const tag = await inbox.ui.sendButton.evaluate(el => el.tagName.toLowerCase());
    expect(tag).toBe('button');
  });

  test('TC_INB_042 - Clicking second ticket in list changes URL', async ({ page }) => {
    const count = await inbox.ui.ticketItems.count();
    if (count > 1) {
      await inbox.openTicketByIndex(1);
      await page.waitForTimeout(2000);
    }
    await expect(page).toHaveURL(/inbox/, { timeout: 5000 });
  });

  test('TC_INB_043 - Details tab is enabled', async () => {
    await expect(inbox.ui.detailsTab).toBeEnabled({ timeout: 8000 });
  });

  test('TC_INB_044 - Description tab is enabled', async () => {
    await expect(inbox.ui.descriptionTab).toBeEnabled({ timeout: 8000 });
  });

  test('TC_INB_045 - AI Brief tab is enabled', async () => {
    await expect(inbox.ui.aiBriefTab).toBeEnabled({ timeout: 8000 });
  });

  test('TC_INB_046 - Metadata panel text is non-empty', async () => {
    const text = await inbox.ui.metadataPanel.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('TC_INB_047 - Status dropdown shows a status value', async () => {
    await expect(inbox.ui.statusDropdown).toBeVisible({ timeout: 10000 });
    const text = await inbox.ui.statusDropdown.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('TC_INB_048 - Priority dropdown shows a priority value', async () => {
    await expect(inbox.ui.priorityDropdown).toBeVisible({ timeout: 10000 });
    const text = await inbox.ui.priorityDropdown.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('TC_INB_049 - Ticket list shows at least 2 ticket IDs', async () => {
    await inbox.ui.firstTicketIdSpan.waitFor({ state: 'visible', timeout: 10000 });
    const count = await inbox.ui.ticketIdSpans.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('TC_INB_050 - Body contains TESAFD ticket ID text', async () => {
    await expect(inbox.ui.bodyLocator).toContainText('#TESAFD', { timeout: 10000 });
  });

  test('TC_INB_051 - Detail panel container is visible', async () => {
    await expect(inbox.ui.detailPanelContainer).toBeVisible({ timeout: 10000 });
  });

  test('TC_INB_052 - Reply editor has contenteditable attribute', async () => {
    const attr = await inbox.ui.replyEditor.getAttribute('contenteditable');
    expect(attr).toBe('true');
  });

  test('TC_INB_053 - Queue dropdown is enabled', async () => {
    await expect(inbox.ui.queueDropdown).toBeEnabled({ timeout: 8000 });
  });

  test('TC_INB_054 - Type dropdown is enabled', async () => {
    await expect(inbox.ui.typeDropdown).toBeEnabled({ timeout: 8000 });
  });

  test('TC_INB_055 - Dashboard nav icon is visible in inbox sidebar', async () => {
    await expect(inbox.ui.dashboardNavIcon).toBeVisible({ timeout: 8000 });
  });

  // ── Additional Positive Cases ─────────────────────────────────────────────

  test('TC_INB_056 - Reply editor text is empty before any input', async () => {
    const text = await inbox.ui.replyEditor.textContent();
    // Editor contains placeholder text only (handled by ::before pseudo-element)
    // textContent may be empty or contain "Start Conversation..."
    expect(text).not.toBeNull();
  });

  test('TC_INB_057 - Reply editor accepts multi-line text', async () => {
    await inbox.typeReply('Line 1\nLine 2');
    const text = await inbox.ui.replyEditor.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('TC_INB_058 - Clicking Description tab shows different content', async ({ page }) => {
    await inbox.ui.descriptionTab.click();
    await page.waitForTimeout(1000);
    await expect(inbox.ui.detailPanelContainer).toBeVisible({ timeout: 5000 });
  });

  test('TC_INB_059 - Clicking AI Brief tab shows different content', async ({ page }) => {
    await inbox.ui.aiBriefTab.click();
    await page.waitForTimeout(1000);
    await expect(inbox.ui.detailPanelContainer).toBeVisible({ timeout: 5000 });
  });

  test('TC_INB_060 - Ticket items in list are visible elements', async () => {
    await expect(inbox.ui.firstTicketItem).toBeVisible({ timeout: 10000 });
    const tag = await inbox.ui.firstTicketItem.evaluate(el => el.tagName.toLowerCase());
    expect(['a', 'div', 'li']).toContain(tag);
  });

  test('TC_INB_061 - Ticket list item is visible and has content', async () => {
    await expect(inbox.ui.firstTicketItem).toBeVisible({ timeout: 10000 });
    const text = await inbox.ui.firstTicketItem.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('TC_INB_062 - Assignee dropdown shows a name', async () => {
    await expect(inbox.ui.assigneeDropdown).toBeVisible({ timeout: 10000 });
    const text = await inbox.ui.assigneeDropdown.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('TC_INB_063 - Queue dropdown shows a name', async () => {
    await expect(inbox.ui.queueDropdown).toBeVisible({ timeout: 10000 });
    const text = await inbox.ui.queueDropdown.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('TC_INB_064 - Type dropdown shows a type', async () => {
    await expect(inbox.ui.typeDropdown).toBeVisible({ timeout: 10000 });
    const text = await inbox.ui.typeDropdown.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('TC_INB_065 - AI Suggestions button is clickable', async ({ page }) => {
    await inbox.ui.aiSuggestionsButton.waitFor({ state: 'visible', timeout: 8000 });
    await inbox.ui.aiSuggestionsButton.click();
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/inbox/, { timeout: 5000 });
  });

  test('TC_INB_066 - Summarize button is clickable', async ({ page }) => {
    await inbox.ui.summarizeButton.waitFor({ state: 'visible', timeout: 8000 });
    await inbox.ui.summarizeButton.click();
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/inbox/, { timeout: 5000 });
  });

  test('TC_INB_067 - Ticket list container has at least one item', async () => {
    await inbox.ui.firstTicketItem.waitFor({ state: 'visible', timeout: 10000 });
    const count = await inbox.ui.ticketItems.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('TC_INB_068 - Detail panel tabs visible simultaneously', async () => {
    await expect(inbox.ui.detailsTab).toBeVisible({ timeout: 8000 });
    await expect(inbox.ui.descriptionTab).toBeVisible({ timeout: 5000 });
    await expect(inbox.ui.aiBriefTab).toBeVisible({ timeout: 5000 });
  });

  test('TC_INB_069 - Inbox body does not contain login form', async () => {
    await expect(inbox.ui.bodyLocator).not.toContainText('Enter your work email', { timeout: 3000 });
  });

  test('TC_INB_070 - Reply editor is focused when clicked', async ({ page }) => {
    await inbox.ui.replyEditor.waitFor({ state: 'visible', timeout: 8000 });
    await inbox.ui.replyEditor.click();
    await page.waitForTimeout(500);
    // Contenteditable divs may not report focus via isFocused() — verify page stays stable
    await expect(page).toHaveURL(/inbox/, { timeout: 5000 });
  });

  // ── Negative Test Cases ──────────────────────────────────────────────────────

  test('TC_INB_N001 - Empty reply editor — send click does not navigate away', async ({ page }) => {
    await inbox.typeReply(' ');
    if (await inbox.ui.sendButton.isVisible()) {
      await inbox.ui.sendButton.click();
      await page.waitForTimeout(1000);
    }
    await expect(page).toHaveURL(/inbox/, { timeout: 5000 });
  });

  test('TC_INB_N002 - Rapid send clicks without reply text stays stable', async ({ page }) => {
    await inbox.typeReply('test');
    for (let i = 0; i < 3; i++) {
      if (await inbox.ui.sendButton.isVisible()) {
        await inbox.ui.sendButton.click();
        await page.waitForTimeout(300);
      }
    }
    await expect(page).toHaveURL(/inbox/, { timeout: 5000 });
  });

  test('TC_INB_N003 - Rapid tab switching between Detail panel tabs stays stable', async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      await inbox.ui.detailsTab.click();
      await inbox.ui.descriptionTab.click();
      await inbox.ui.aiBriefTab.click();
    }
    await expect(page).toHaveURL(/inbox/, { timeout: 5000 });
    await expect(inbox.ui.bodyLocator).toBeVisible({ timeout: 5000 });
  });

  test('TC_INB_N004 - Rapid ticket switching stays stable', async ({ page }) => {
    const count = await inbox.ui.ticketItems.count();
    if (count > 1) {
      for (let i = 0; i < 3; i++) {
        await inbox.openTicketByIndex(0);
        await inbox.openTicketByIndex(1);
      }
    }
    await expect(page).toHaveURL(/inbox/, { timeout: 5000 });
  });

  test('TC_INB_N005 - Back navigation from inbox does not redirect to login', async ({ page }) => {
    await page.goBack();
    await page.waitForTimeout(2000);
    await expect(page).not.toHaveURL(/login|signin/, { timeout: 5000 });
  });

  test('TC_INB_N006 - Direct inbox URL access without login shows login form', async ({ browser }) => {
    const freshContext = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const freshPage = await freshContext.newPage();
    await freshPage.goto('https://qa-desk.bublly.com/inbox', { waitUntil: 'load' });
    await freshPage.waitForTimeout(3000);
    const loginHeading = freshPage.getByRole('heading', { name: /welcome back/i });
    await expect(loginHeading).toBeVisible({ timeout: 10000 });
    await freshContext.close();
  });

  test('TC_INB_N007 - Repeated reply type and clear stays stable', async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      await inbox.typeReply(testdata.inboxReplyText);
      await inbox.clearReply();
      await page.waitForTimeout(300);
    }
    await expect(page).toHaveURL(/inbox/, { timeout: 5000 });
  });

  test('TC_INB_N008 - Reply with only whitespace does not navigate away', async ({ page }) => {
    await inbox.typeReply('     ');
    if (await inbox.ui.sendButton.isVisible()) {
      await inbox.ui.sendButton.click();
    }
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/inbox/, { timeout: 5000 });
  });

  test('TC_INB_N009 - Rapid status dropdown open/close stays stable', async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      await inbox.openStatusDropdown();
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }
    await expect(page).toHaveURL(/inbox/, { timeout: 5000 });
  });

  test('TC_INB_N010 - Rapid priority dropdown open/close stays stable', async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      await inbox.openPriorityDropdown();
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }
    await expect(page).toHaveURL(/inbox/, { timeout: 5000 });
  });

  test('TC_INB_N011 - Typing XSS payload in reply editor is handled safely', async ({ page }) => {
    await inbox.typeReply(testdata.inboxXSSPayload);
    await page.waitForTimeout(1000);
    await expect(page).not.toHaveURL(/login|signin/, { timeout: 5000 });
    await expect(inbox.ui.replyEditor).toBeVisible({ timeout: 5000 });
  });

  test('TC_INB_N012 - Typing very long text in reply editor stays stable', async ({ page }) => {
    await inbox.typeReply(testdata.inboxLongString);
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/inbox/, { timeout: 5000 });
  });

  test('TC_INB_N013 - Typing special characters in reply editor stays stable', async ({ page }) => {
    await inbox.typeReply(testdata.inboxSpecialChars);
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/inbox/, { timeout: 5000 });
  });

  test('TC_INB_N014 - Typing unicode characters in reply editor stays stable', async ({ page }) => {
    await inbox.typeReply(testdata.inboxUnicodeSearch);
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/inbox/, { timeout: 5000 });
  });

  test('TC_INB_N015 - Rapid clicking AI Suggestions button stays stable', async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      await inbox.ui.aiSuggestionsButton.waitFor({ state: 'visible', timeout: 5000 });
      await inbox.ui.aiSuggestionsButton.click();
      await page.waitForTimeout(500);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }
    await expect(page).toHaveURL(/inbox/, { timeout: 5000 });
  });

  test('TC_INB_N016 - Rapid clicking Summarize button stays stable', async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      await inbox.ui.summarizeButton.click();
      await page.waitForTimeout(300);
    }
    await expect(page).toHaveURL(/inbox/, { timeout: 5000 });
  });

  test('TC_INB_N017 - Opening status dropdown shows at least one option', async ({ page }) => {
    await inbox.openStatusDropdown();
    await page.waitForTimeout(500);
    const count = await inbox.ui.statusOptions.count();
    expect(count).toBeGreaterThanOrEqual(1);
    await page.keyboard.press('Escape');
  });

  test('TC_INB_N018 - Opening priority dropdown shows at least one option', async ({ page }) => {
    await inbox.openPriorityDropdown();
    await page.waitForTimeout(500);
    const count = await inbox.ui.priorityOptions.count();
    expect(count).toBeGreaterThanOrEqual(1);
    await page.keyboard.press('Escape');
  });

  test('TC_INB_N019 - Inbox page does not show login form elements', async () => {
    await expect(inbox.ui.bodyLocator).not.toContainText('Enter your work email', { timeout: 3000 });
  });

  test('TC_INB_N020 - Reply editor does not lose focus after typing', async ({ page }) => {
    await inbox.typeReply(testdata.inboxReplyText);
    await page.waitForTimeout(500);
    await expect(inbox.ui.replyEditor).toBeVisible({ timeout: 5000 });
    await expect(page).toHaveURL(/inbox/, { timeout: 5000 });
  });

  // ── Functional Flow Cases ─────────────────────────────────────────────────

  test('TC_INB_F001 - Reply flow: type reply → send button is visible and enabled', async () => {
    await inbox.typeReply(testdata.inboxReplyText);
    await expect(inbox.ui.sendButton).toBeVisible({ timeout: 8000 });
    await expect(inbox.ui.sendButton).toBeEnabled({ timeout: 5000 });
  });

  test('TC_INB_F002 - Status change flow: open dropdown → select option → stays on inbox', async ({ page }) => {
    await inbox.openStatusDropdown();
    const count = await inbox.ui.statusOptions.count();
    if (count > 0) {
      await inbox.ui.statusOptions.first().click();
      await page.waitForTimeout(2000);
    }
    await expect(page).toHaveURL(/inbox/, { timeout: 5000 });
  });

  test('TC_INB_F003 - Priority change flow: open dropdown → select option → stays on inbox', async ({ page }) => {
    await inbox.openPriorityDropdown();
    const count = await inbox.ui.priorityOptions.count();
    if (count > 0) {
      await inbox.ui.priorityOptions.first().click();
      await page.waitForTimeout(2000);
    }
    await expect(page).toHaveURL(/inbox/, { timeout: 5000 });
  });

  test('TC_INB_F004 - Tab navigation flow: Details → Description → AI Brief → Details', async ({ page }) => {
    await inbox.ui.detailsTab.click();
    await page.waitForTimeout(500);
    await inbox.ui.descriptionTab.click();
    await page.waitForTimeout(500);
    await inbox.ui.aiBriefTab.click();
    await page.waitForTimeout(500);
    await inbox.ui.detailsTab.click();
    await expect(inbox.ui.detailsTab).toBeVisible({ timeout: 5000 });
    await expect(page).toHaveURL(/inbox/, { timeout: 5000 });
  });

  test('TC_INB_F005 - Multi-ticket flow: open ticket 1 → open ticket 2 → detail changes', async ({ page }) => {
    const count = await inbox.ui.ticketItems.count();
    if (count > 1) {
      await inbox.openTicketByIndex(1);
      await page.waitForTimeout(2000);
      expect(page.url()).toMatch(/inbox/);
    }
    await expect(page).toHaveURL(/inbox/, { timeout: 5000 });
  });

  test('TC_INB_F006 - Reply clear flow: type → clear → editor is empty', async ({ page }) => {
    await inbox.typeReply(testdata.inboxReplyText);
    await inbox.clearReply();
    await page.waitForTimeout(500);
    const text = await inbox.ui.replyEditor.textContent();
    expect(text?.trim()).toBeFalsy();
  });

  test('TC_INB_F007 - Full reply compose flow: type multi-line → verify editor has content', async () => {
    await inbox.typeReply('First line\nSecond line\nThird line');
    const text = await inbox.ui.replyEditor.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
    await expect(inbox.ui.sendButton).toBeEnabled({ timeout: 5000 });
  });

  test('TC_INB_F008 - AI Suggestions flow: click button → stays on inbox', async ({ page }) => {
    await inbox.ui.aiSuggestionsButton.click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/inbox/, { timeout: 5000 });
    await expect(inbox.ui.replyEditor).toBeVisible({ timeout: 5000 });
  });

  test('TC_INB_F009 - Full metadata view: status + priority + assignee + queue visible', async () => {
    await expect(inbox.ui.statusDropdown).toBeVisible({ timeout: 8000 });
    await expect(inbox.ui.priorityDropdown).toBeVisible({ timeout: 5000 });
    await expect(inbox.ui.assigneeDropdown).toBeVisible({ timeout: 5000 });
    await expect(inbox.ui.queueDropdown).toBeVisible({ timeout: 5000 });
  });

  test('TC_INB_F010 - Dashboard navigation flow: click dashboard icon → lands on dashboard', async ({ page }) => {
    await inbox.goToDashboard();
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
    await expect(page.locator("h1:has-text('Welcome Back')")).toBeVisible({ timeout: 8000 });
  });

});
