// spec: specs/saucedemo-login-and-inventory.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('Successful login with standard_user', async ({ page }) => {
    // 1. Start from the seed file state: navigate to the base URL '/' (the SauceDemo login page).
    await page.goto('/');
    await expect(page).toHaveTitle('Swag Labs');

    const usernameInput = page.getByRole('textbox', { name: 'Username' });
    const passwordInput = page.getByRole('textbox', { name: 'Password' });
    const loginButton = page.getByRole('button', { name: 'Login' });

    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();

    // 2. Fill the Username field (#user-name) with 'standard_user'.
    await usernameInput.fill('standard_user');

    // 3. Fill the Password field (#password) with 'secret_sauce'.
    await passwordInput.fill('secret_sauce');

    // 4. Click the Login button (#login-button).
    await loginButton.click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');

    await expect(page.locator('.inventory_item').first()).toBeVisible();

    await expect(page.locator('[data-test="error"]')).toHaveCount(0);
  });
});
