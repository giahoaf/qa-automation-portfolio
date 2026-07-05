// spec: specs/saucedemo-checkout.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Cart Page', () => {
  test('Cart page displays all added items with quantities, prices, and actions', async ({ page }) => {
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    const cartItems = page.locator('[data-test="inventory-item"]');
    const backpackRow = cartItems.filter({ hasText: 'Sauce Labs Backpack' });
    const bikeLightRow = cartItems.filter({ hasText: 'Sauce Labs Bike Light' });

    // 1. Start from the seed file state on '/' and log in with 'standard_user' / 'secret_sauce'.
    await page.goto('/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    // The browser navigates to '/inventory.html' with the product list displayed and no cart badge visible.
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('[data-test="inventory-list"]')).toBeVisible();
    await expect(cartBadge).toHaveCount(0);

    // 2. Add two products to the cart: click add-to-cart for the Backpack and the Bike Light.
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    // The cart badge shows '2'.
    await expect(cartBadge).toHaveText('2');

    // 3. Click the shopping cart link.
    await page.locator('[data-test="shopping-cart-link"]').click();
    // The browser navigates to '/cart.html'.
    await expect(page).toHaveURL(/\/cart\.html$/);
    // The page title reads 'Your Cart'.
    await expect(page.locator('[data-test="title"]')).toHaveText('Your Cart');
    // The list header shows 'QTY' and 'Description'.
    await expect(page.locator('[data-test="cart-quantity-label"]')).toHaveText('QTY');
    await expect(page.locator('[data-test="cart-desc-label"]')).toHaveText('Description');

    // 4. Inspect the cart item rows.
    // Exactly 2 items are listed: 'Sauce Labs Backpack' and 'Sauce Labs Bike Light'.
    await expect(cartItems).toHaveCount(2);
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText([
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
    ]);
    // Each item shows quantity '1'.
    await expect(page.locator('[data-test="item-quantity"]')).toHaveText(['1', '1']);
    // The Backpack row shows '$29.99' and the Bike Light row shows '$9.99'.
    await expect(backpackRow.locator('[data-test="inventory-item-price"]')).toHaveText('$29.99');
    await expect(bikeLightRow.locator('[data-test="inventory-item-price"]')).toHaveText('$9.99');
    // Each row has a 'Remove' button.
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toBeVisible();
    // A 'Continue Shopping' button and a 'Checkout' button are visible below the list.
    await expect(page.locator('[data-test="continue-shopping"]')).toBeVisible();
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
  });
});
