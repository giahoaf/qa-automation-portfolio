// spec: specs/saucedemo-login-and-inventory.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('Logout returns user to the login page', async ({ page }) => {
    // 1. Start from the seed file state and log in with valid credentials: fill Username with
    //    'standard_user', fill Password with 'secret_sauce', and click the Login button (#login-button).
    await page.goto('/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // expect: The browser navigates to '/inventory.html' and the product list is displayed.
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.getByText('Products')).toBeVisible();
    await expect(page.locator('.inventory_item')).toHaveCount(6);

    // 2. Click the hamburger menu button (#react-burger-menu-btn) in the top-left corner.
    await page.getByRole('button', { name: 'Open Menu' }).click();

    // expect: A side menu panel slides in, showing links: 'All Items', 'About', 'Logout', and 'Reset App State'.
    const logoutLink = page.getByRole('link', { name: 'Logout' });
    await expect(page.getByRole('link', { name: 'All Items' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(logoutLink).toBeVisible();
    await expect(page.getByRole('link', { name: 'Reset App State' })).toBeVisible();

    // 3. Click the 'Logout' link (#logout_sidebar_link).
    await logoutLink.click();

    // expect: The browser navigates back to the login page at the base URL ('/').
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    // expect: The Username and Password fields and the Login button are visible again.
    await expect(page.locator('[data-test="username"]')).toBeVisible();
    await expect(page.locator('[data-test="password"]')).toBeVisible();
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();

    // expect: Navigating directly back to '/inventory.html' redirects back to the login page
    // rather than showing the inventory, confirming the session was cleared.
    await page.goto('/inventory.html');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="error"]')).toHaveText(
      "Epic sadface: You can only access '/inventory.html' when you are logged in.",
    );
  });
});
