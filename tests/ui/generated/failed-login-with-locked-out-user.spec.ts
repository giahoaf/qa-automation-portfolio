// spec: specs/saucedemo-login-and-inventory.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/login.page';

test.describe('Login', () => {
  test('Failed login with locked_out_user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // 1. Start from the seed file state on the login page ('/').
    await loginPage.goto();
    // The login form is visible.
    await expect(loginPage.loginButton).toBeVisible();

    // 2. Fill the Username field with 'locked_out_user' and the Password field
    //    with the correct shared password 'secret_sauce', then click Login.
    await loginPage.login('locked_out_user', 'secret_sauce');

    // The page remains on the login URL ('/'); no navigation to inventory occurs.
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    // An error banner is displayed with the exact locked-out text.
    await expect(loginPage.errorBanner).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.',
    );
  });
});
