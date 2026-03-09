import { test, expect } from '@playwright/test';
import { loginPage } from '../pages/loginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { testdata } from '../utils/testdata';

//tc 001
//tc to verify the welcome message on the dashboard after successful login
test('Verify dashboard welcome message', async ({ page }) => {

  const login = new loginPage(page);
  const dashboardPage = new DashboardPage(page);

  await login.navigateToLogin();
  await login.enterEmail(testdata.email);
  await login.clickEmailSignIn();
  await login.enterPassword(testdata.password);
  await login.clickPasswordSignIn();
  await dashboardPage.navigateToDashboard();

  await dashboardPage.verifyWelcomeMessage();

});
//tc 002
//tc to verify the active workspace dropdown and the create new workspace option
test('Verify Active Workspace dropdown functionality', async ({ page }) => {

  const login = new loginPage(page);
  const dashboardPage = new DashboardPage(page);

  await login.navigateToLogin();
  await login.enterEmail(testdata.email);
  await login.clickEmailSignIn();
  await login.enterPassword(testdata.password);
  await login.clickPasswordSignIn();
  await dashboardPage.navigateToDashboard();

  await dashboardPage.openWorkspaceDropdown();
  await dashboardPage.verifyCreateWorkspaceOption();

});

//tc 003
//tc to verify the project dropdown and the create project option
test('Verify project selector functionality', async ({ page }) => {

  const login = new loginPage(page);
  const dashboardPage = new DashboardPage(page);

  await login.navigateToLogin();
  await login.enterEmail(testdata.email);
  await login.clickEmailSignIn();
  await login.enterPassword(testdata.password);
  await login.clickPasswordSignIn();

  await dashboardPage.navigateToDashboard();

  await dashboardPage.openProjectDropdown();
  await dashboardPage.verifyCreateProjectOption();

});
//tc 004
test('TC_DASH_004 Verify switching project', async ({ page }) => {

  const login = new loginPage(page);
  const dashboard = new DashboardPage(page);

  await login.navigateToLogin();
  await login.enterEmail(testdata.email);
  await login.clickEmailSignIn();
  await login.enterPassword(testdata.password);
  await login.clickPasswordSignIn();

  await dashboard.navigateToDashboard();

  await dashboard.openProjectDropdown();

  await dashboard.selectSecondProject();

  await dashboard.verifyProjectChanged();

});

test('TC_DASH_005Verify Search Functionality', async ({ page }) => {

  const login = new loginPage(page);
  const dashboard = new DashboardPage(page);

  await login.navigateToLogin();
  await login.enterEmail(testdata.email);
  await login.clickEmailSignIn();
  await login.enterPassword(testdata.password);
  await login.clickPasswordSignIn();

  await dashboard.navigateToDashboard();

  await dashboard.searchKeyword();

  await dashboard.verifySearchResults();

});

test('TC_DASH_006 Verify Assigned To Me ticket list', async ({ page }) => {

  const login = new loginPage(page);
  const dashboard = new DashboardPage(page);

  await login.navigateToLogin();
  await login.enterEmail(testdata.email);
  await login.clickEmailSignIn();
  await login.enterPassword(testdata.password);
  await login.clickPasswordSignIn();

  await dashboard.navigateToDashboard();

  await dashboard.verifyAssignedTicketsSection();

  await dashboard.verifyTicketRowsExist();

});

test('TC_DASH_007 Verify ticket click opens conversation', async ({ page }) => {

  const login = new loginPage(page);
  const dashboard = new DashboardPage(page);

  await login.navigateToLogin();
  await login.enterEmail(testdata.email);
  await login.clickEmailSignIn();
  await login.enterPassword(testdata.password);
  await login.clickPasswordSignIn();

  await dashboard.navigateToDashboard();

  await dashboard.openFirstTicket();

  await dashboard.verifyTicketPageOpened();

});

test('TC_DASH_008 Verify Create Project button opens project creation', async ({ page }) => {

  const login = new loginPage(page);
  const dashboard = new DashboardPage(page);

  await login.navigateToLogin();
  await login.enterEmail(testdata.email);
  await login.clickEmailSignIn();
  await login.enterPassword(testdata.password);
  await login.clickPasswordSignIn();

  await dashboard.navigateToDashboard();

  await dashboard.openProjectDropdown();

  await dashboard.clickCreateProject();

  await dashboard.verifyCreateProjectModal();

});
test('TC_DASH_009 Verify Assigned Tickets count matches View All', async ({ page }) => {

  const login = new loginPage(page);
  const dashboard = new DashboardPage(page);

  await login.navigateToLogin();
  await login.enterEmail(testdata.email);
  await login.clickEmailSignIn();
  await login.enterPassword(testdata.password);
  await login.clickPasswordSignIn();

  await dashboard.navigateToDashboard();

  const dashboardCount = await dashboard.getAssignedTicketCount();

  await dashboard.clickViewAllTickets();

  const tableCount = await dashboard.getTicketRowCount();

  expect(tableCount).toBe(dashboardCount);

});
test('TC_DASH_010 Verify Notification Icon Opens Panel', async ({ page }) => {

  const login = new loginPage(page);
  const dashboard = new DashboardPage(page);

  await login.navigateToLogin();
  await login.enterEmail(testdata.email);
  await login.clickEmailSignIn();
  await login.enterPassword(testdata.password);
  await login.clickPasswordSignIn();

  await dashboard.navigateToDashboard();

  await dashboard.openNotificationPanel();

  await dashboard.verifyNotificationPanelOpened();

});
