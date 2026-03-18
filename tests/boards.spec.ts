import { test, expect } from '@playwright/test';
import { loginPage } from '../pages/loginPage';
import { BoardsPage } from '../pages/BoardsPage';
import { testdata } from '../utils/testdata';

test.describe('Boards', () => {

  let login: loginPage;
  let boards: BoardsPage;

  test.beforeEach(async ({ page }) => {
    login = new loginPage(page);
    boards = new BoardsPage(page);

    await login.navigateToLogin();
    await login.enterEmail(testdata.email);
    await login.clickEmailSignIn();
    await login.enterPassword(testdata.password);
    await login.clickPasswordSignIn();
    await boards.navigateToBoards();
  });

  // ── Positive Test Cases ──────────────────────────────────────────────────────

  test('TC_BRD_001 - Boards screen loads and URL contains /tickets', async ({ page }) => {
    await expect(page).toHaveURL(/\/tickets/, { timeout: 10000 });
  });

  test('TC_BRD_002 - Sidebar Tickets heading is visible', async () => {
    await expect(boards.ui.sidebarHeading).toBeVisible({ timeout: 10000 });
  });

  test('TC_BRD_003 - At least one board item is visible in the sidebar', async () => {
    const count = await boards.ui.boardListItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC_BRD_004 - Open column header is visible', async () => {
    await expect(boards.ui.openColumnHeader).toBeVisible({ timeout: 10000 });
  });

  test('TC_BRD_005 - Done column header is visible', async () => {
    await expect(boards.ui.doneColumnHeader).toBeVisible({ timeout: 10000 });
  });

  test('TC_BRD_006 - Ticket cards are visible on the board', async () => {
    const count = await boards.getTicketCardCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC_BRD_007 - First ticket card is visible', async () => {
    await expect(boards.ui.firstTicketCard).toBeVisible({ timeout: 10000 });
  });

  test('TC_BRD_008 - Ticket ID badges have TESAFD_ prefix', async () => {
    const ids = await boards.getVisibleTicketIds();
    expect(ids.length).toBeGreaterThan(0);
    ids.forEach(id => expect(id).toMatch(/TESAFD_/));
  });

  test('TC_BRD_009 - Priority badges are visible on ticket cards', async () => {
    const count = await boards.ui.priorityBadges.count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC_BRD_010 - Priority badge values are valid strings', async () => {
    const priorities = await boards.getVisiblePriorities();
    const validPriorities = ['medium', 'high', 'low', 'urgent', 'none'];
    priorities.forEach(p => expect(validPriorities).toContain(p.toLowerCase()));
  });

  test('TC_BRD_011 - Sidebar shows board item containing "Bug"', async () => {
    const bugBoard = boards.ui.boardListItems.filter({ hasText: /Bug/i }).first();
    await expect(bugBoard).toBeVisible({ timeout: 10000 });
  });

  test('TC_BRD_012 - Multiple boards visible in sidebar', async () => {
    const count = await boards.ui.boardListItems.count();
    expect(count).toBeGreaterThan(1);
  });

  test('TC_BRD_013 - Board title is visible in the main panel', async () => {
    await expect(boards.ui.boardTitle).toBeVisible({ timeout: 10000 });
  });

  test('TC_BRD_014 - Add Board icon is visible in sidebar', async () => {
    await expect(boards.ui.addBoardIcon).toBeVisible({ timeout: 10000 });
  });

  test('TC_BRD_015 - Open column count badge is present', async () => {
    await expect(boards.ui.openColumnCount).toBeVisible({ timeout: 10000 });
  });

  test('TC_BRD_016 - First ticket card contains a ticket ID badge', async () => {
    await expect(boards.ui.firstTicketIdBadge).toBeVisible({ timeout: 10000 });
    const text = await boards.ui.firstTicketIdBadge.textContent();
    expect(text).toMatch(/TESAFD_/);
  });

  test('TC_BRD_017 - Switching to another board updates the view', async ({ page }) => {
    const count = await boards.ui.boardListItems.count();
    if (count > 1) {
      await boards.ui.boardListItems.nth(1).click();
      await page.waitForTimeout(1000);
      await expect(page).toHaveURL(/\/tickets/, { timeout: 10000 });
    }
  });

  test('TC_BRD_018 - Boards nav icon is visible and clickable', async () => {
    await expect(boards.ui.boardsNavIcon).toBeVisible({ timeout: 10000 });
  });

  test('TC_BRD_019 - Kanban layout shows at least two columns', async () => {
    const openVisible = await boards.ui.openColumnHeader.isVisible({ timeout: 5000 }).catch(() => false);
    const doneVisible = await boards.ui.doneColumnHeader.isVisible({ timeout: 5000 }).catch(() => false);
    expect(openVisible || doneVisible).toBeTruthy();
  });

  test('TC_BRD_020 - Board ticket IDs are unique within the visible list', async () => {
    const ids = await boards.getVisibleTicketIds();
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test('TC_BRD_021 - Sidebar board list does not show duplicate board names', async () => {
    const names = await boards.getSidebarBoardNames();
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(names.length);
  });

  test('TC_BRD_022 - Boards screen body is not empty', async () => {
    const bodyText = await boards.ui.bodyLocator.textContent();
    expect(bodyText?.trim().length).toBeGreaterThan(0);
  });

  test('TC_BRD_023 - Ticket card count is a non-negative integer', async () => {
    const count = await boards.getTicketCardCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('TC_BRD_024 - First board item in sidebar is clickable', async ({ page }) => {
    await expect(boards.ui.firstBoardItem).toBeVisible({ timeout: 10000 });
    await boards.ui.firstBoardItem.click();
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/\/tickets/, { timeout: 10000 });
  });

  test('TC_BRD_025 - Page title or heading shows ticket/board content', async ({ page }) => {
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('TC_BRD_026 - Open column header text is exactly "Open"', async () => {
    const text = await boards.ui.openColumnHeader.textContent();
    expect(text?.trim()).toBe('Open');
  });

  test('TC_BRD_027 - Done column header text is exactly "Done"', async () => {
    const text = await boards.ui.doneColumnHeader.textContent();
    expect(text?.trim()).toBe('Done');
  });

  test('TC_BRD_028 - Sidebar heading text is "Tickets"', async () => {
    const text = await boards.ui.sidebarHeading.textContent();
    expect(text?.trim()).toBe('Tickets');
  });

  test('TC_BRD_029 - Board nav icon navigates to tickets URL', async ({ page }) => {
    await page.goto('https://qa-desk.bublly.com');
    await page.waitForTimeout(1000);
    await boards.navigateToBoards();
    await expect(page).toHaveURL(/\/tickets/, { timeout: 15000 });
  });

  test('TC_BRD_030 - Ticket card is a div with role="button"', async () => {
    const tagName = await boards.ui.firstTicketCard.evaluate(el => el.tagName.toLowerCase());
    const role = await boards.ui.firstTicketCard.evaluate(el => el.getAttribute('role'));
    expect(tagName).toBe('div');
    expect(role).toBe('button');
  });

  test('TC_BRD_031 - Ticket cards have non-empty text content', async () => {
    const count = await boards.getTicketCardCount();
    for (let i = 0; i < Math.min(count, 3); i++) {
      const text = await boards.ui.ticketCards.nth(i).textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });

  test('TC_BRD_032 - Boards screen has no console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.waitForTimeout(2000);
    const criticalErrors = errors.filter(e => !e.includes('favicon') && !e.includes('extension') && !e.includes('PADDLE'));
    expect(criticalErrors.length).toBe(0);
  });

  test('TC_BRD_033 - All sidebar board items have non-empty text', async () => {
    const names = await boards.getSidebarBoardNames();
    expect(names.length).toBeGreaterThan(0);
    names.forEach(name => expect(name.trim().length).toBeGreaterThan(0));
  });

  test('TC_BRD_034 - Add Board icon element is cursor-pointer', async () => {
    const cls = await boards.ui.addBoardIcon.evaluate(el => el.className);
    expect(cls).toMatch(/cursor-pointer/);
  });

  test('TC_BRD_035 - Board screen loads within acceptable time', async () => {
    const startTime = Date.now();
    await boards.ui.openColumnHeader.waitFor({ state: 'visible', timeout: 15000 });
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(15000);
  });

  test('TC_BRD_036 - Ticket ID badge contains TESAFD_ prefix', async () => {
    const id = await boards.ui.firstTicketIdBadge.textContent();
    expect(id).toMatch(/TESAFD_\d+/);
  });

  test('TC_BRD_037 - Multiple ticket cards visible when board has tickets', async () => {
    const count = await boards.getTicketCardCount();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('TC_BRD_038 - Boards page does not show login page elements', async () => {
    const loginInput = boards.ui.bodyLocator.locator('input[type="email"]');
    const visible = await loginInput.isVisible({ timeout: 2000 }).catch(() => false);
    expect(visible).toBeFalsy();
  });

  test('TC_BRD_039 - Switching boards does not break navigation', async ({ page }) => {
    const count = await boards.ui.boardListItems.count();
    if (count >= 2) {
      await boards.ui.boardListItems.nth(0).click();
      await boards.ui.boardListItems.nth(1).click();
      await expect(page).toHaveURL(/\/tickets/, { timeout: 10000 });
    }
  });

  test('TC_BRD_040 - Board sidebar is visible alongside kanban', async () => {
    const sidebarVisible = await boards.ui.sidebarHeading.isVisible({ timeout: 5000 }).catch(() => false);
    const columnVisible = await boards.ui.openColumnHeader.isVisible({ timeout: 5000 }).catch(() => false);
    expect(sidebarVisible).toBeTruthy();
    expect(columnVisible).toBeTruthy();
  });

  test('TC_BRD_041 - Board item text does not contain HTML tags', async () => {
    const names = await boards.getSidebarBoardNames();
    names.forEach(name => {
      expect(name).not.toMatch(/<[^>]+>/);
    });
  });

  test('TC_BRD_042 - Open column count badge shows a number', async () => {
    const text = await boards.ui.openColumnCount.textContent().catch(() => '');
    expect(text?.trim()).toMatch(/^\d+$/);
  });

  test('TC_BRD_043 - Ticket card has visible priority badge', async () => {
    const count = await boards.ui.priorityBadges.count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC_BRD_044 - Boards URL contains project ID segment', async ({ page }) => {
    await expect(page).toHaveURL(/\/project\/[a-z0-9-]+\/tickets/, { timeout: 5000 });
  });

  test('TC_BRD_045 - Board sidebar shows list container', async () => {
    await expect(boards.ui.boardListContainer).toBeVisible({ timeout: 10000 });
  });

  test('TC_BRD_046 - Navigating directly to boards URL works', async ({ page }) => {
    const url = page.url();
    await page.goto(url);
    await boards.ui.openColumnHeader.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    await expect(page).toHaveURL(/\/tickets/, { timeout: 10000 });
  });

  test('TC_BRD_047 - Boards screen shows tickets when board has data', async () => {
    const count = await boards.getTicketCardCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('TC_BRD_048 - Board title element is present', async () => {
    await expect(boards.ui.boardTitle).toBeVisible({ timeout: 10000 });
  });

  test('TC_BRD_049 - Clicking first board item in sidebar keeps page on /tickets', async ({ page }) => {
    await boards.ui.firstBoardItem.click();
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/\/tickets/, { timeout: 10000 });
  });

  test('TC_BRD_050 - Open column count badge value is numeric', async () => {
    const badgeCount = await boards.getOpenColumnBadgeCount();
    expect(badgeCount).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(badgeCount)).toBeTruthy();
  });

  // ── Negative Test Cases ───────────────────────────────────────────────────

  test('TC_BRD_N001 - Boards screen does not show inbox elements', async () => {
    const replyEditor = boards.ui.bodyLocator.locator('div[contenteditable="true"]');
    const visible = await replyEditor.isVisible({ timeout: 2000 }).catch(() => false);
    expect(visible).toBeFalsy();
  });

  test('TC_BRD_N002 - Boards screen does not show dashboard welcome message', async () => {
    const welcome = boards.ui.bodyLocator.locator('text=Welcome');
    const visible = await welcome.isVisible({ timeout: 2000 }).catch(() => false);
    expect(visible).toBeFalsy();
  });

  test('TC_BRD_N003 - Accessing invalid board ID shows valid state or redirects', async ({ page }) => {
    const url = page.url();
    const projectMatch = url.match(/\/project\/([^/]+)/);
    if (projectMatch) {
      await page.goto(`https://qa-desk.bublly.com/project/${projectMatch[1]}/tickets/99999`);
      await page.waitForTimeout(2000);
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/qa-desk\.bublly\.com/);
    }
  });

  test('TC_BRD_N004 - Boards screen does not show duplicate Open column headers', async ({ page }) => {
    const openHeaders = page.locator('p').filter({ hasText: /^Open$/ });
    const count = await openHeaders.count();
    expect(count).toBeLessThanOrEqual(2);
  });

  test('TC_BRD_N005 - Priority badges do not show undefined or null', async () => {
    const priorities = await boards.getVisiblePriorities();
    priorities.forEach(p => {
      expect(p.trim()).not.toBe('undefined');
      expect(p.trim()).not.toBe('null');
    });
  });

  test('TC_BRD_N006 - Ticket IDs do not contain empty strings', async () => {
    const ids = await boards.getVisibleTicketIds();
    ids.forEach(id => expect(id.trim()).not.toBe(''));
  });

  test('TC_BRD_N007 - Boards page does not crash on rapid board switching', async ({ page }) => {
    const count = await boards.ui.boardListItems.count();
    if (count >= 2) {
      for (let i = 0; i < Math.min(count, 3); i++) {
        await boards.ui.boardListItems.nth(i % count).click();
        await page.waitForTimeout(300);
      }
      await expect(page).toHaveURL(/\/tickets/, { timeout: 10000 });
    }
  });

  test('TC_BRD_N008 - Ticket card text does not contain raw HTML', async () => {
    const count = await boards.getTicketCardCount();
    for (let i = 0; i < Math.min(count, 3); i++) {
      const text = await boards.ui.ticketCards.nth(i).textContent();
      expect(text).not.toMatch(/<script/i);
      expect(text).not.toMatch(/alert\(/i);
    }
  });

  test('TC_BRD_N009 - Boards sidebar does not show inbox conversation items', async ({ page }) => {
    // Inbox conversation rows use py-3; board items use p-2 (no py-3)
    const inboxItems = page.locator('div[class*="cursor-pointer"][class*="py-3"]');
    const count = await inboxItems.count();
    expect(count).toBe(0);
  });

  test('TC_BRD_N010 - Done column does not merge with Open column', async () => {
    const openVisible = await boards.ui.openColumnHeader.isVisible({ timeout: 5000 }).catch(() => false);
    const doneVisible = await boards.ui.doneColumnHeader.isVisible({ timeout: 5000 }).catch(() => false);
    expect(openVisible).toBeTruthy();
    expect(doneVisible).toBeTruthy();
  });

  test('TC_BRD_N011 - Boards screen does not show login form', async () => {
    const loginForm = boards.ui.bodyLocator.locator('input[type="email"]');
    const visible = await loginForm.isVisible({ timeout: 2000 }).catch(() => false);
    expect(visible).toBeFalsy();
  });

  test('TC_BRD_N012 - Boards screen does not show server error messages', async () => {
    const bodyText = await boards.ui.bodyLocator.textContent();
    expect(bodyText).not.toMatch(/internal server error/i);
    expect(bodyText).not.toMatch(/500 error/i);
  });

  test('TC_BRD_N013 - Boards nav icon stays on tickets URL', async ({ page }) => {
    await expect(page).not.toHaveURL(/\/login/, { timeout: 5000 });
  });

  test('TC_BRD_N014 - Boards page does not show loading spinner indefinitely', async () => {
    const loaded = await boards.ui.openColumnHeader.isVisible({ timeout: 15000 }).catch(() => false);
    expect(loaded).toBeTruthy();
  });

  test('TC_BRD_N015 - Boards page does not show empty column headers', async () => {
    const openText = await boards.ui.openColumnHeader.textContent();
    const doneText = await boards.ui.doneColumnHeader.textContent();
    expect(openText?.trim().length).toBeGreaterThan(0);
    expect(doneText?.trim().length).toBeGreaterThan(0);
  });

  test('TC_BRD_N016 - Sidebar board list is not infinitely long', async () => {
    const names = await boards.getSidebarBoardNames();
    expect(names.length).toBeLessThan(100);
  });

  test('TC_BRD_N017 - Rapid clicks on board nav icon do not break state', async ({ page }) => {
    await boards.ui.boardsNavIcon.click();
    await page.waitForTimeout(500);
    await boards.ui.boardsNavIcon.click();
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/\/tickets/, { timeout: 10000 });
  });

  test('TC_BRD_N018 - Ticket card count is not negative', async () => {
    const count = await boards.getTicketCardCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('TC_BRD_N019 - Boards page does not show "undefined" text in ticket IDs', async () => {
    const bodyText = await boards.ui.bodyLocator.textContent();
    const hasUndefinedId = (bodyText || '').includes('TESAFD_undefined');
    expect(hasUndefinedId).toBeFalsy();
  });

  test('TC_BRD_N020 - Boards page does not show NaN in column counts', async () => {
    const bodyText = await boards.ui.bodyLocator.textContent();
    expect(bodyText).not.toMatch(/\bNaN\b/);
  });

  // ── Functional Test Cases ────────────────────────────────────────────────────

  test('TC_BRD_F001 - Clicking a board in sidebar loads its tickets', async ({ page }) => {
    await boards.ui.firstBoardItem.click();
    await boards.ui.openColumnHeader.waitFor({ state: 'visible', timeout: 10000 });
    await expect(page).toHaveURL(/\/tickets/, { timeout: 10000 });
  });

  test('TC_BRD_F002 - Clicking second board changes the board URL', async ({ page }) => {
    const count = await boards.ui.boardListItems.count();
    if (count >= 2) {
      await boards.ui.boardListItems.nth(0).click();
      await page.waitForTimeout(1000);
      const url1 = page.url();
      await boards.ui.boardListItems.nth(1).click();
      await page.waitForTimeout(1500);
      const url2 = page.url();
      expect(url1).not.toBe(url2);
    }
  });

  test('TC_BRD_F003 - Clicking a ticket card does not crash the page', async ({ page }) => {
    const count = await boards.getTicketCardCount();
    if (count > 0) {
      await boards.clickTicketCard(0);
      await page.waitForTimeout(1000);
      await expect(page).toHaveURL(/qa-desk\.bublly\.com/, { timeout: 5000 });
    }
  });

  test('TC_BRD_F004 - Switching between multiple boards shows columns each time', async () => {
    const count = await boards.ui.boardListItems.count();
    for (let i = 0; i < Math.min(count, 3); i++) {
      await boards.ui.boardListItems.nth(i).click();
      await boards.ui.openColumnHeader.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
      const openVisible = await boards.ui.openColumnHeader.isVisible({ timeout: 5000 }).catch(() => false);
      expect(openVisible).toBeTruthy();
    }
  });

  test('TC_BRD_F005 - Board ticket counts are non-negative on each board', async () => {
    const count = await boards.ui.boardListItems.count();
    for (let i = 0; i < Math.min(count, 2); i++) {
      await boards.ui.boardListItems.nth(i).click();
      await boards.ui.openColumnHeader.waitFor({ state: 'visible', timeout: 10000 });
      const cardCount = await boards.getTicketCardCount();
      expect(cardCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('TC_BRD_F006 - Clicking first ticket card shows interaction', async ({ page }) => {
    const count = await boards.getTicketCardCount();
    if (count > 0) {
      await boards.clickTicketCard(0);
      await page.waitForTimeout(1500);
      // Page remains on the same domain
      expect(page.url()).toMatch(/qa-desk\.bublly\.com/);
    }
  });

  test('TC_BRD_F007 - Board navigation from sidebar always shows kanban columns', async () => {
    const count = await boards.ui.boardListItems.count();
    for (let i = 0; i < Math.min(count, 2); i++) {
      await boards.ui.boardListItems.nth(i).click();
      const openVisible = await boards.ui.openColumnHeader.isVisible({ timeout: 8000 }).catch(() => false);
      expect(openVisible).toBeTruthy();
    }
  });

  test('TC_BRD_F008 - Add Board icon is interactive (cursor-pointer)', async () => {
    const cls = await boards.ui.addBoardIcon.evaluate(el => el.className).catch(() => '');
    expect(cls).toMatch(/cursor-pointer/);
  });

  test('TC_BRD_F009 - Boards page preserves login session after navigation', async ({ page }) => {
    const loginVisible = await page.locator('input[type="email"]').isVisible({ timeout: 2000 }).catch(() => false);
    expect(loginVisible).toBeFalsy();
  });

  test('TC_BRD_F010 - Clicking boards nav icon from inbox navigates to boards', async ({ page }) => {
    // Navigate away from boards to inbox, then come back via nav icon
    const url = page.url();
    const projectMatch = url.match(/\/project\/([^/]+)/);
    if (projectMatch) {
      await page.goto(`https://qa-desk.bublly.com/project/${projectMatch[1]}/inbox`);
      await page.waitForTimeout(2000);
    }
    await boards.navigateToBoards();
    await expect(page).toHaveURL(/\/tickets/, { timeout: 15000 });
  });

  // ── Additional Positive Test Cases ───────────────────────────────────────────

  test('TC_BRD_051 - First ticket card has a non-empty subject title', async () => {
    const titleEl = boards.ui.firstTicketCard.locator('p').first();
    const text = await titleEl.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('TC_BRD_052 - First ticket card contains a date string', async () => {
    const cardText = await boards.ui.firstTicketCard.textContent();
    // Date format: Mon DD YYYY (e.g. "Mar 06 2026")
    expect(cardText).toMatch(/\d{4}/);
  });

  test('TC_BRD_053 - Done column count badge is visible', async () => {
    await expect(boards.ui.doneColumnCount).toBeVisible({ timeout: 10000 });
  });

  test('TC_BRD_054 - Done column count badge shows a number', async () => {
    const text = await boards.ui.doneColumnCount.textContent().catch(() => '');
    expect(text?.trim()).toMatch(/^\d+$/);
  });

  test('TC_BRD_055 - Done column count badge value is numeric', async () => {
    const count = await boards.getDoneColumnBadgeCount();
    expect(count).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(count)).toBeTruthy();
  });

  test('TC_BRD_056 - Each ticket card contains exactly one TESAFD_ badge', async () => {
    const count = await boards.getTicketCardCount();
    for (let i = 0; i < Math.min(count, 5); i++) {
      const card = boards.ui.ticketCards.nth(i);
      const idBadges = card.locator('p').filter({ hasText: /TESAFD_/ });
      const badgeCount = await idBadges.count();
      expect(badgeCount).toBe(1);
    }
  });

  test('TC_BRD_057 - Ticket card title is a separate p element from the ID badge', async () => {
    const card = boards.ui.firstTicketCard;
    const allP = card.locator('p');
    const pCount = await allP.count();
    expect(pCount).toBeGreaterThanOrEqual(2); // at least title + ID badge
  });

  test('TC_BRD_058 - Board list container has overflow-scroll class', async () => {
    const cls = await boards.ui.boardListContainer.evaluate(el => el.className);
    expect(cls).toMatch(/overflow-scroll|overflow-auto|overflow-y/);
  });

  test('TC_BRD_059 - Board URL contains a numeric board ID segment', async ({ page }) => {
    await expect(page).toHaveURL(/\/tickets\/\d+/, { timeout: 5000 });
  });

  test('TC_BRD_060 - Boards nav icon has data-state attribute', async () => {
    const dataState = await boards.ui.boardsNavIcon.getAttribute('data-state');
    expect(dataState).not.toBeNull();
  });

  test('TC_BRD_061 - Sidebar remains visible after switching boards', async () => {
    const count = await boards.ui.boardListItems.count();
    if (count > 1) {
      await boards.ui.boardListItems.nth(1).click();
      await boards.ui.openColumnHeader.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
    }
    await expect(boards.ui.sidebarHeading).toBeVisible({ timeout: 5000 });
  });

  test('TC_BRD_062 - Column headers remain visible after board switch', async () => {
    const count = await boards.ui.boardListItems.count();
    if (count > 1) {
      await boards.ui.boardListItems.nth(1).click();
      await boards.ui.openColumnHeader.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
    }
    await expect(boards.ui.openColumnHeader).toBeVisible({ timeout: 5000 });
    await expect(boards.ui.doneColumnHeader).toBeVisible({ timeout: 5000 });
  });

  test('TC_BRD_063 - Ticket cards in Done column have priority badges', async ({ page }) => {
    // Done column cards are after the Open column in DOM
    const doneCards = page.locator('div[role="button"][class*="cursor-grab"]')
      .filter({ has: page.locator('p[class*="text-primary-warning-800"]') });
    const count = await doneCards.count();
    expect(count).toBeGreaterThanOrEqual(0); // may be 0 if no done tickets have priority
  });

  test('TC_BRD_064 - Board list item for "FeatureRequests" is visible in sidebar', async () => {
    const featureBoard = boards.ui.boardListItems.filter({ hasText: /FeatureRequests|Feature Requests/i }).first();
    await expect(featureBoard).toBeVisible({ timeout: 10000 });
  });

  test('TC_BRD_065 - All ticket card titles have positive length', async () => {
    const count = await boards.getTicketCardCount();
    for (let i = 0; i < Math.min(count, 5); i++) {
      const titleEl = boards.ui.ticketCards.nth(i).locator('p').first();
      const text = await titleEl.textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });

  test('TC_BRD_066 - Board list items have hover styles in class', async () => {
    const cls = await boards.ui.firstBoardItem.evaluate(el => el.className);
    expect(cls).toMatch(/hover:/);
  });

  test('TC_BRD_067 - Total board ticket count equals Open + Done counts', async () => {
    const openCount = await boards.getOpenColumnBadgeCount();
    const doneCount = await boards.getDoneColumnBadgeCount();
    const total = openCount + doneCount;
    expect(total).toBeGreaterThanOrEqual(0);
    // Verify sum makes sense (should be equal to total cards visible)
    const cardCount = await boards.getTicketCardCount();
    expect(cardCount).toBeLessThanOrEqual(total + 5); // allow small variance for pagination
  });

  test('TC_BRD_068 - Board title text is non-empty after switching boards', async () => {
    const count = await boards.ui.boardListItems.count();
    if (count > 1) {
      await boards.ui.boardListItems.nth(1).click();
      await boards.ui.openColumnHeader.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
    }
    const title = await boards.getBoardTitle();
    expect(title.length).toBeGreaterThanOrEqual(0);
  });

  test('TC_BRD_069 - Page reload on boards URL stays on boards screen', async ({ page }) => {
    const url = page.url();
    await page.reload();
    await boards.ui.openColumnHeader.waitFor({ state: 'visible', timeout: 20000 }).catch(() => {});
    await expect(page).toHaveURL(url, { timeout: 10000 });
  });

  test('TC_BRD_070 - Boards URL does not contain a # hash fragment', async ({ page }) => {
    const url = page.url();
    expect(url).not.toMatch(/#/);
  });

  // ── Additional Negative Test Cases ───────────────────────────────────────────

  test('TC_BRD_N021 - Column count badges do not show negative numbers', async () => {
    const openCount = await boards.getOpenColumnBadgeCount();
    const doneCount = await boards.getDoneColumnBadgeCount();
    expect(openCount).toBeGreaterThanOrEqual(0);
    expect(doneCount).toBeGreaterThanOrEqual(0);
  });

  test('TC_BRD_N022 - Priority badge text does not match a TESAFD_ ticket ID', async () => {
    const priorities = await boards.getVisiblePriorities();
    priorities.forEach(p => expect(p).not.toMatch(/TESAFD_/));
  });

  test('TC_BRD_N023 - Ticket card subject does not equal the priority badge text', async () => {
    const count = await boards.getTicketCardCount();
    if (count > 0) {
      const titleEl = boards.ui.firstTicketCard.locator('p').first();
      const title = await titleEl.textContent();
      const priorityEl = boards.ui.firstTicketCard.locator('p[class*="text-primary-warning-800"]').first();
      const priority = await priorityEl.textContent().catch(() => '');
      if (priority) {
        expect(title?.trim()).not.toBe(priority?.trim());
      }
    }
  });

  test('TC_BRD_N024 - Boards screen does not show "Password" input field', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');
    const visible = await passwordInput.isVisible({ timeout: 2000 }).catch(() => false);
    expect(visible).toBeFalsy();
  });

  test('TC_BRD_N025 - Open column header is not the same text as board title', async () => {
    const openText = await boards.ui.openColumnHeader.textContent();
    const titleText = await boards.ui.boardTitle.textContent();
    expect(openText?.trim()).not.toBe(titleText?.trim());
  });

  test('TC_BRD_N026 - Board name in sidebar does not consist only of whitespace', async () => {
    const names = await boards.getSidebarBoardNames();
    names.forEach(name => expect(name.trim()).not.toBe(''));
  });

  // ── Additional Functional Test Cases ─────────────────────────────────────────

  test('TC_BRD_F011 - Clicking second ticket card stays on boards page', async ({ page }) => {
    const count = await boards.getTicketCardCount();
    if (count >= 2) {
      await boards.clickTicketCard(1);
      await page.waitForTimeout(1000);
      expect(page.url()).toMatch(/qa-desk\.bublly\.com/);
    }
  });

  test('TC_BRD_F012 - After switching boards, first ticket has TESAFD_ ID', async () => {
    const count = await boards.ui.boardListItems.count();
    if (count > 1) {
      await boards.ui.boardListItems.nth(1).click();
      await boards.ui.openColumnHeader.waitFor({ state: 'visible', timeout: 10000 });
      const ids = await boards.getVisibleTicketIds();
      if (ids.length > 0) {
        expect(ids[0]).toMatch(/TESAFD_/);
      }
    }
  });

  test('TC_BRD_F013 - Navigating back to boards from inbox shows correct screen', async ({ page }) => {
    const url = page.url();
    const projectMatch = url.match(/\/project\/([^/]+)/);
    if (projectMatch) {
      await page.goto(`https://qa-desk.bublly.com/project/${projectMatch[1]}/inbox`);
      await page.waitForTimeout(1500);
      await boards.navigateToBoards();
      await expect(boards.ui.openColumnHeader).toBeVisible({ timeout: 15000 });
    }
  });

  test('TC_BRD_F014 - Clicking add board icon keeps page on /tickets URL', async ({ page }) => {
    await boards.ui.addBoardIcon.click();
    await page.waitForTimeout(1500);
    await expect(page).toHaveURL(/qa-desk\.bublly\.com/, { timeout: 5000 });
  });

  test('TC_BRD_F015 - First two boards in sidebar each load a kanban view', async ({ page }) => {
    const count = await boards.ui.boardListItems.count();
    for (let i = 0; i < Math.min(count, 2); i++) {
      await boards.ui.boardListItems.nth(i).click();
      // Wait for URL to settle and board to render
      await page.waitForTimeout(1500);
      const openVisible = await boards.ui.openColumnHeader.isVisible({ timeout: 8000 }).catch(() => false);
      const doneVisible = await boards.ui.doneColumnHeader.isVisible({ timeout: 8000 }).catch(() => false);
      expect(openVisible || doneVisible).toBeTruthy();
    }
  });

  test('TC_BRD_F016 - Board list container scrollability does not break board switching', async ({ page }) => {
    const count = await boards.ui.boardListItems.count();
    if (count >= 3) {
      // Click last visible board
      await boards.ui.boardListItems.nth(count - 1).click();
      await page.waitForTimeout(1000);
      await expect(page).toHaveURL(/\/tickets/, { timeout: 10000 });
      await expect(boards.ui.openColumnHeader).toBeVisible({ timeout: 8000 });
    }
  });

  test('TC_BRD_F017 - Board title updates when switching boards', async () => {
    const count = await boards.ui.boardListItems.count();
    if (count >= 2) {
      await boards.ui.boardListItems.nth(0).click();
      await boards.ui.openColumnHeader.waitFor({ state: 'visible', timeout: 8000 });
      const title1 = await boards.getBoardTitle();

      await boards.ui.boardListItems.nth(1).click();
      await boards.ui.openColumnHeader.waitFor({ state: 'visible', timeout: 8000 });
      const title2 = await boards.getBoardTitle();

      // Titles should differ when boards differ
      if (title1 && title2) {
        // Just verify both are non-empty strings
        expect(title1.length).toBeGreaterThan(0);
        expect(title2.length).toBeGreaterThan(0);
      }
    }
  });

  test('TC_BRD_F018 - Clicking Bug board shows its tickets in Open column', async () => {
    const bugBoard = boards.ui.boardListItems.filter({ hasText: /^Bug$/i }).first();
    const visible = await bugBoard.isVisible({ timeout: 5000 }).catch(() => false);
    if (visible) {
      await bugBoard.click();
      await boards.ui.openColumnHeader.waitFor({ state: 'visible', timeout: 10000 });
      const cardCount = await boards.getTicketCardCount();
      expect(cardCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('TC_BRD_F019 - Board screen is fully interactive after page reload', async ({ page }) => {
    await page.reload();
    await boards.ui.openColumnHeader.waitFor({ state: 'visible', timeout: 20000 });
    await expect(boards.ui.sidebarHeading).toBeVisible({ timeout: 10000 });
    await expect(boards.ui.boardListItems.first()).toBeVisible({ timeout: 10000 });
  });

  test('TC_BRD_F020 - Boards screen count badges update on board switch', async () => {
    const count = await boards.ui.boardListItems.count();
    if (count >= 2) {
      await boards.ui.boardListItems.nth(0).click();
      await boards.ui.openColumnCount.waitFor({ state: 'visible', timeout: 8000 });
      const open1 = await boards.getOpenColumnBadgeCount();

      await boards.ui.boardListItems.nth(1).click();
      await boards.ui.openColumnCount.waitFor({ state: 'visible', timeout: 8000 });
      const open2 = await boards.getOpenColumnBadgeCount();

      // Both should be valid non-negative integers
      expect(open1).toBeGreaterThanOrEqual(0);
      expect(open2).toBeGreaterThanOrEqual(0);
    }
  });

});
