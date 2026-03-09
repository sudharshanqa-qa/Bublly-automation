import { test } from '@playwright/test';
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

test('TC_DASH_006 Verify Search Functionality', async ({ page }) => {

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
