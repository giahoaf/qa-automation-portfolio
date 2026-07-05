// spec: specs/saucedemo-checkout.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Checkout Step One: Customer Information', () => {
  test('Cancel on the information page returns to the cart with contents intact', async ({ page }) => {
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    const cartItemNames = page.locator('[data-test="inventory-item-name"]');

    // 1. Log in with 'standard_user' / 'secret_sauce', add 'Sauce Labs Backpack' to the cart, open the cart, and click 'Checkout'.
    await page.goto('/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    // The checkout information page at '/checkout-step-one.html' is displayed.
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);

    // 2. Click the 'Cancel' button.
    await page.locator('[data-test="cancel"]').click();
    // The browser navigates back to '/cart.html'.
    await expect(page).toHaveURL(/\/cart\.html$/);
    // The cart still lists 'Sauce Labs Backpack' and the cart badge still shows '1' (canceling does not clear the cart).
    await expect(cartItemNames).toHaveText(['Sauce Labs Backpack']);
    await expect(cartBadge).toHaveText('1');
  });
});
