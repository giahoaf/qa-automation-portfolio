// spec: specs/saucedemo-login-and-inventory.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('Failed login with empty credentials', async ({ page }) => {
    // 1. Start from the seed file state on the login page ('/'), leaving both the Username and Password fields empty.
    await page.goto('/');
    const usernameField = page.getByRole('textbox', { name: 'Username' });
    const passwordField = page.getByRole('textbox', { name: 'Password' });
    await expect(usernameField).toBeVisible();
    await expect(passwordField).toBeVisible();
    await expect(usernameField).toHaveValue('');
    await expect(passwordField).toHaveValue('');

    // 2. Click the Login button (#login-button) without entering any credentials.
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Username is required');
  });
});
