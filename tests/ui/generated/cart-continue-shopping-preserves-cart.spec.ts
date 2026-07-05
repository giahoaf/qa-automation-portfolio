// spec: specs/saucedemo-checkout.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Cart Page', () => {
  test('Continue Shopping returns to the inventory with the cart preserved', async ({ page }) => {
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    const cartItemNames = page.locator('[data-test="inventory-item-name"]');

    // 1. Log in with 'standard_user' / 'secret_sauce', add 'Sauce Labs Backpack' to the cart, and open the cart.
    await page.goto('/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    // The cart page at '/cart.html' lists 'Sauce Labs Backpack' and the badge shows '1'.
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(cartItemNames).toHaveText(['Sauce Labs Backpack']);
    await expect(cartBadge).toHaveText('1');

    // 2. Click the 'Continue Shopping' button.
    await page.locator('[data-test="continue-shopping"]').click();
    // The browser navigates back to '/inventory.html'.
    await expect(page).toHaveURL(/\/inventory\.html$/);
    // The cart badge still shows '1' (cart contents are preserved).
    await expect(cartBadge).toHaveText('1');
    // The Backpack's button on the inventory page reads 'Remove', confirming it is still in the cart.
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toHaveText('Remove');
  });
});
