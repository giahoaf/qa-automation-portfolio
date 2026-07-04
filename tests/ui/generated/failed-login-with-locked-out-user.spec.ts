// spec: specs/saucedemo-login-and-inventory.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('Failed login with locked_out_user', async ({ page }) => {
    // 1. Start from the seed file state on the login page ('/').
    await page.goto('/');
    const loginButton = page.getByRole('button', { name: 'Login' });
    await expect(loginButton).toBeVisible();

    // 2. Fill the Username field with 'locked_out_user'.
    await page.getByRole('textbox', { name: 'Username' }).fill('locked_out_user');

    // 3. Fill the Password field with the correct shared password 'secret_sauce'.
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');

    // 4. Click the Login button (#login-button).
    await loginButton.click();

    // - expect: The page remains on the login URL ('/'); no navigation to the inventory page occurs.
    await expect(page).toHaveURL('https://www.saucedemo.com/');

    // - expect: An error banner is displayed with the exact locked-out text.
    const errorBanner = page.locator('[data-test="error"]');
    await expect(errorBanner).toBeVisible();
    await expect(errorBanner).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
  });
});
