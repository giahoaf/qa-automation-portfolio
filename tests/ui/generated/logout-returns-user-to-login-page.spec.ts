// spec: specs/saucedemo-login-and-inventory.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/login.page';
import { InventoryPage } from '../../../pages/inventory.page';

test.describe('Login', () => {
  test('Logout returns user to the login page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // The hamburger menu button and side-menu links are not covered by any
    // page object, so they use inline locators (SauceDemo data-test / role).
    const menuButton = page.getByRole('button', { name: 'Open Menu' });
    const logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    const resetLink = page.locator('[data-test="reset-sidebar-link"]');

    // 1. Start from the seed file state and log in with valid credentials
    //    (standard_user / secret_sauce).
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    // expect: navigates to '/inventory.html' and at least one product is visible.
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.inventoryItems.first()).toBeVisible();

    // 2. Click the hamburger menu button (#react-burger-menu-btn) in the top-left corner.
    await menuButton.click();
    // expect: the side menu shows the Logout and Reset App State links.
    await expect(logoutLink).toBeVisible();
    await expect(resetLink).toBeVisible();

    // 3. Click the 'Logout' link (#logout_sidebar_link).
    await logoutLink.click();
    // expect: navigates back to the login page at the base URL ('/'), with the
    //         Username/Password fields and Login button visible again.
    await expect(page).toHaveURL(/saucedemo\.com\/$/);
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();

    // expect: navigating directly to '/inventory.html' redirects back to the
    //         login page, confirming the session was cleared.
    await page.goto('/inventory.html');
    await expect(page).toHaveURL(/saucedemo\.com\/$/);
    await expect(loginPage.loginButton).toBeVisible();
  });
});
