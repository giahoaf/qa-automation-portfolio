// spec: specs/saucedemo-login-and-inventory.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/login.page';

test.describe('Login', () => {
  test('Failed login with empty credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // 1. Start from the seed file state on the login page ('/'), leaving both the Username and Password fields empty.
    await loginPage.goto();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.usernameInput).toHaveValue('');
    await expect(loginPage.passwordInput).toHaveValue('');

    // 2. Click the Login button without entering any credentials.
    await loginPage.loginButton.click();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.errorBanner).toHaveText('Epic sadface: Username is required');
  });
});
