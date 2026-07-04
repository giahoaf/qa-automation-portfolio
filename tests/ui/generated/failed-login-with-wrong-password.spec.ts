// spec: specs/saucedemo-login-and-inventory.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('Failed login with wrong password', async ({ page }) => {
    // 1. Start from the seed file state on the login page ('/').
    await page.goto('/');
    const loginButton = page.getByRole('button', { name: 'Login' });
    await expect(loginButton).toBeVisible();

    // 2. Fill the Username field with the valid username 'standard_user'.
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');

    // 3. Fill the Password field with an incorrect password, e.g. 'wrong_password'.
    await page.getByRole('textbox', { name: 'Password' }).fill('wrong_password');

    // 4. Click the Login button (#login-button).
    await loginButton.click();

    // - expect: The page remains on the login URL ('/'); no navigation to the inventory page occurs.
    await expect(page).toHaveURL('https://www.saucedemo.com/');

    // - expect: An error banner is displayed with the exact text.
    const errorBanner = page.locator('[data-test="error"]');
    await expect(errorBanner).toBeVisible();
    await expect(errorBanner).toHaveText(
      'Epic sadface: Username and password do not match any user in this service'
    );

    // 5. Click the 'X' icon on the error banner to dismiss it.
    await page.locator('[data-test="error-button"]').click();

    // - expect: The error banner is no longer visible.
    await expect(errorBanner).toBeHidden();
  });
});
