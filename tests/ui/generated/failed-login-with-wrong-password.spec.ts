// spec: specs/saucedemo-login-and-inventory.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/login.page';

test.describe('Login', () => {
  test('Failed login with wrong password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // 1. Start from the seed file state on the login page ('/').
    await loginPage.goto();
    // The login form is visible.
    await expect(loginPage.loginButton).toBeVisible();

    // 2. Fill the Username field with the valid username 'standard_user'.
    // 3. Fill the Password field with an incorrect password, e.g. 'wrong_password'.
    // 4. Click the Login button (#login-button).
    await loginPage.login('standard_user', 'wrong_password');

    // The page remains on the login URL ('/'); no navigation to the inventory page occurs.
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    // An error banner is displayed with the exact expected text.
    await expect(loginPage.errorBanner).toHaveText(
      'Epic sadface: Username and password do not match any user in this service',
    );

    // 5. Click the 'X' icon on the error banner to dismiss it.
    // The dismiss control is not part of LoginPage, so an inline locator is used.
    await page.locator('[data-test="error-button"]').click();
    // The error banner is no longer visible.
    await expect(loginPage.errorBanner).toBeHidden();
  });
});
