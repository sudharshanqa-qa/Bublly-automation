const { chromium } = require('@playwright/test');
const { testdata } = require('./utils/testdata');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://qa-desk.bublly.com/login');
    // From loginPage:
    // email input: page.locator('input[name="email"]') or something - let's check loginPage.ts if needed
    // Let me just import loginPage
    const { loginPage } = require('./pages/loginPage');
    const login = new loginPage(page);
    await login.navigateToLogin();
    await login.enterEmail(testdata.email);
    await login.clickEmailSignIn();
    await login.enterPassword(testdata.password);
    await login.clickPasswordSignIn();

    // Wait for dashboard
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Dump the button html
    const buttons = await page.$$eval('button', btns => btns.map(b => b.outerHTML));
    const projectButton = buttons.find(h => h.includes('Bublly Project') && h.includes('img') && !h.includes('Projects (2)'));

    console.log("Found buttons with 'Project':", buttons.filter(b => b.toLowerCase().includes('project')));

    await browser.close();
})();
