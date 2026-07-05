// spec: specs/saucedemo-checkout.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Checkout Step Two: Order Overview', () => {
  test('Cancel on the overview page returns to the inventory with the cart intact', async ({ page }) => {
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');

    // 1. Log in with 'standard_user' / 'secret_sauce', add 'Sauce Labs Backpack' and 'Sauce Labs Bike Light' to the cart, and proceed through checkout step one with valid customer info (First Name 'Bosco', Last Name 'Nguyen', Zip/Postal Code '70000') to reach '/checkout-step-two.html'.
    await page.goto('/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="firstName"]').fill('Bosco');
    await page.locator('[data-test="lastName"]').fill('Nguyen');
    await page.locator('[data-test="postalCode"]').fill('70000');
    await page.locator('[data-test="continue"]').click();
    // The overview page is displayed with the cart badge showing '2'.
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview');
    await expect(cartBadge).toHaveText('2');

    // 2. Click the 'Cancel' button.
    await page.locator('[data-test="cancel"]').click();
    // The browser navigates to '/inventory.html' (cancel from the overview goes to the inventory, NOT back to the cart).
    await expect(page).toHaveURL(/\/inventory\.html$/);
    // The cart badge still shows '2' — the order was not placed and the cart contents are preserved.
    await expect(cartBadge).toHaveText('2');
  });
});
