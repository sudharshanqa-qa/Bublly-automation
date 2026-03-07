import { test , expect} from '@playwright/test';
import { loginPage} from '../pages/loginPage';
import { testdata } from '../utils/testdata';




test('User login to Bublly Desk', async ({ page }) => {

  const loginPageInstance = new loginPage(page);

  await loginPageInstance.navigateToLogin();
  await loginPageInstance.enterEmail(testdata.email);
  await loginPageInstance.clickEmailSignIn();
  await loginPageInstance.enterPassword(testdata.password);
  await loginPageInstance.clickPasswordSignIn();
  await expect(page).toHaveURL("https://qa-desk.bublly.com/project/5be97a2e-e12e-4339-aab4-f2f2271098fb/inbox/81");

});