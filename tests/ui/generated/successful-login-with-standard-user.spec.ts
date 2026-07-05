// spec: specs/saucedemo-login-and-inventory.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/login.page';
import { InventoryPage } from '../../../pages/inventory.page';

test.describe('Login', () => {
  test('Successful login with standard_user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // 1. Start from the seed file state: navigate to the base URL '/' (the SauceDemo login page).
    await loginPage.goto();
    // Page-level title 'Swag Labs' is not exposed by any page object.
    await expect(page).toHaveTitle('Swag Labs');
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();

    // 2. Fill the Username field with 'standard_user', fill the Password field
    //    with 'secret_sauce', and click the Login button.
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.title).toHaveText('Products');
    // At least one product item is visible (the list rendered).
    await expect(inventoryPage.inventoryItems.first()).toBeVisible();
    // No error banner is displayed.
    await expect(loginPage.errorBanner).toHaveCount(0);
  });
});
