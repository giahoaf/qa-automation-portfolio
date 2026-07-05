// spec: specs/saucedemo-checkout.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Checkout Step Two: Order Overview', () => {
  test('Overview lists the ordered items with payment, shipping, and correct totals for a two-item cart', async ({ page }) => {
    const cartItems = page.locator('[data-test="inventory-item"]');
    const backpackRow = cartItems.filter({ hasText: 'Sauce Labs Backpack' });
    const bikeLightRow = cartItems.filter({ hasText: 'Sauce Labs Bike Light' });

    // 1. Log in with 'standard_user' / 'secret_sauce', add 'Sauce Labs Backpack' ($29.99) and 'Sauce Labs Bike Light' ($9.99) to the cart, open the cart, click 'Checkout', fill the customer form (First Name 'Bosco', Last Name 'Nguyen', Zip/Postal Code '70000'), and click 'Continue'.
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
    // The browser navigates to '/checkout-step-two.html'.
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    // The page title reads 'Checkout: Overview'.
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview');

    // 2. Inspect the item list on the overview page.
    // Both items are listed with quantity '1' each: 'Sauce Labs Backpack' at '$29.99' and 'Sauce Labs Bike Light' at '$9.99'.
    await expect(cartItems).toHaveCount(2);
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText([
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
    ]);
    await expect(page.locator('[data-test="item-quantity"]')).toHaveText(['1', '1']);
    await expect(backpackRow.locator('[data-test="inventory-item-price"]')).toHaveText('$29.99');
    await expect(bikeLightRow.locator('[data-test="inventory-item-price"]')).toHaveText('$9.99');
    // The item rows show no 'Remove' buttons (items cannot be removed on this page).
    await expect(cartItems.locator('button')).toHaveCount(0);

    // 3. Inspect the payment and shipping information block.
    // 'Payment Information:' shows the value 'SauceCard #31337'.
    await expect(page.locator('[data-test="payment-info-value"]')).toHaveText('SauceCard #31337');
    // 'Shipping Information:' shows the value 'Free Pony Express Delivery!'.
    await expect(page.locator('[data-test="shipping-info-value"]')).toHaveText('Free Pony Express Delivery!');

    // 4. Inspect the 'Price Total' block.
    // The subtotal reads exactly 'Item total: $39.98'.
    await expect(page.locator('[data-test="subtotal-label"]')).toHaveText('Item total: $39.98');
    // The tax reads exactly 'Tax: $3.20'.
    await expect(page.locator('[data-test="tax-label"]')).toHaveText('Tax: $3.20');
    // The total reads exactly 'Total: $43.18'.
    await expect(page.locator('[data-test="total-label"]')).toHaveText('Total: $43.18');
    // 'Cancel' and 'Finish' buttons are displayed.
    await expect(page.locator('[data-test="cancel"]')).toBeVisible();
    await expect(page.locator('[data-test="finish"]')).toBeVisible();
  });
});
