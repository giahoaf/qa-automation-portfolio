// spec: specs/saucedemo-checkout.md
// seed: tests/ui/seed.spec.ts
//
// NOTE: This test intentionally PINS currently-observed quirky behavior of SauceDemo:
// the app does NOT block checkout for an empty cart and lets a zero-item order be
// completed (subtotal 'Item total: $0' with no decimals, '$0.00' tax and total).
// If the product later blocks empty-cart checkout, this test SHOULD fail and be updated.

import { test, expect } from '@playwright/test';

test.describe('Checkout Edge Cases', () => {
  test('Checkout with an empty cart is permitted and produces a $0 order (known product quirk)', async ({ page }) => {
    const cartItems = page.locator('[data-test="inventory-item"]');
    const checkoutButton = page.locator('[data-test="checkout"]');

    // 1. Log in with 'standard_user' / 'secret_sauce' (do NOT add any products) and click the shopping cart link.
    await page.goto('/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    // The cart page at '/cart.html' is displayed with zero item rows.
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(cartItems).toHaveCount(0);
    // The 'Checkout' button is still visible and enabled — the app does not block checkout for an empty cart (documented quirk).
    await expect(checkoutButton).toBeVisible();
    await expect(checkoutButton).toBeEnabled();

    // 2. Click 'Checkout', then fill the customer form (First Name 'Empty', Last Name 'Cart', Zip/Postal Code '00000') and click 'Continue'.
    await checkoutButton.click();
    await page.locator('[data-test="firstName"]').fill('Empty');
    await page.locator('[data-test="lastName"]').fill('Cart');
    await page.locator('[data-test="postalCode"]').fill('00000');
    await page.locator('[data-test="continue"]').click();
    // The browser reaches '/checkout-step-two.html' with an empty item list.
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(cartItems).toHaveCount(0);
    // The subtotal reads exactly 'Item total: $0' (note: no decimal places, unlike non-zero subtotals).
    await expect(page.locator('[data-test="subtotal-label"]')).toHaveText('Item total: $0');
    // The tax reads exactly 'Tax: $0.00'.
    await expect(page.locator('[data-test="tax-label"]')).toHaveText('Tax: $0.00');
    // The total reads exactly 'Total: $0.00'.
    await expect(page.locator('[data-test="total-label"]')).toHaveText('Total: $0.00');

    // 3. Click the 'Finish' button.
    await page.locator('[data-test="finish"]').click();
    // The browser navigates to '/checkout-complete.html' and shows the heading 'Thank you for your order!' — the app currently allows completing a zero-item order.
    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
  });
});
