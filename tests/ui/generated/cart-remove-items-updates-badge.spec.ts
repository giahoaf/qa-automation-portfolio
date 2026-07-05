// spec: specs/saucedemo-checkout.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Cart Page', () => {
  test('Removing items from the cart updates the list and the cart badge', async ({ page }) => {
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    const cartItems = page.locator('[data-test="inventory-item"]');
    const itemNames = page.locator('[data-test="inventory-item-name"]');

    // 1. Log in with 'standard_user' / 'secret_sauce', add 'Sauce Labs Backpack' and 'Sauce Labs Bike Light' to the cart, and open the cart.
    await page.goto('/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    // The cart page at '/cart.html' lists 2 items and the cart badge shows '2'.
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(cartItems).toHaveCount(2);
    await expect(cartBadge).toHaveText('2');

    // 2. Click the 'Remove' button for the Bike Light.
    await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();
    // The 'Sauce Labs Bike Light' row disappears and only 'Sauce Labs Backpack' remains in the cart.
    await expect(cartItems).toHaveCount(1);
    await expect(itemNames).toHaveText(['Sauce Labs Backpack']);
    // The cart badge decrements to '1'.
    await expect(cartBadge).toHaveText('1');

    // 3. Click the 'Remove' button for the Backpack.
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    // The cart list is now empty (zero inventory-item rows).
    await expect(cartItems).toHaveCount(0);
    // The cart badge element is removed entirely (no badge is rendered on the cart icon).
    await expect(cartBadge).toHaveCount(0);
    // The 'Continue Shopping' and 'Checkout' buttons are still displayed.
    await expect(page.locator('[data-test="continue-shopping"]')).toBeVisible();
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
  });
});
