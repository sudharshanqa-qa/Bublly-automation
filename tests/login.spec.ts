import { test } from '@playwright/test';
import { loginPage} from '../pages/loginPage';
import { testdata } from '../utils/testdata';

test('User login to Bublly Desk', async ({ page }) => {

  const loginPageInstance = new loginPage(page);

  await loginPageInstance.navigateToLogin();
  await loginPageInstance.enterEmail(testdata.email);
  await loginPageInstance.clickEmailSignIn();
  await loginPageInstance.enterPassword(testdata.password);
  await loginPageInstance.clickPasswordSignIn();

});