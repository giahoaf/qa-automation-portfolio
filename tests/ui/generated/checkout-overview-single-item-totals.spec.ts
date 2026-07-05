// spec: specs/saucedemo-checkout.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Checkout Step Two: Order Overview', () => {
  test('Totals are computed correctly for a single-item cart (8% tax)', async ({ page }) => {
    const cartItems = page.locator('[data-test="inventory-item"]');
    const backpackRow = cartItems.filter({ hasText: 'Sauce Labs Backpack' });

    // 1. Log in with 'standard_user' / 'secret_sauce', add only 'Sauce Labs Backpack' ($29.99) to the cart, open the cart, click 'Checkout', fill the customer form (First Name 'Bosco', Last Name 'Nguyen', Zip/Postal Code '70000'), and click 'Continue'.
    await page.goto('/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="firstName"]').fill('Bosco');
    await page.locator('[data-test="lastName"]').fill('Nguyen');
    await page.locator('[data-test="postalCode"]').fill('70000');
    await page.locator('[data-test="continue"]').click();
    // The overview page at '/checkout-step-two.html' lists exactly one item: 'Sauce Labs Backpack' at '$29.99'.
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(cartItems).toHaveCount(1);
    await expect(backpackRow.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
    await expect(backpackRow.locator('[data-test="inventory-item-price"]')).toHaveText('$29.99');

    // 2. Inspect the 'Price Total' block.
    // The subtotal reads exactly 'Item total: $29.99'.
    await expect(page.locator('[data-test="subtotal-label"]')).toHaveText('Item total: $29.99');
    // The tax reads exactly 'Tax: $2.40' (8% of $29.99 = 2.3992, rounded to 2.40).
    await expect(page.locator('[data-test="tax-label"]')).toHaveText('Tax: $2.40');
    // The total reads exactly 'Total: $32.39'.
    await expect(page.locator('[data-test="total-label"]')).toHaveText('Total: $32.39');
  });
});
