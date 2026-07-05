// spec: specs/saucedemo-checkout.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Order Completion', () => {
  test('Finishing the order shows the confirmation page, empties the cart, and Back Home returns to the inventory', async ({ page }) => {
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');

    // 1. Log in with 'standard_user' / 'secret_sauce', add 'Sauce Labs Backpack' and 'Sauce Labs Bike Light' to the cart, open the cart, click 'Checkout', fill the customer form (First Name 'Bosco', Last Name 'Nguyen', Zip/Postal Code '70000'), click 'Continue' to reach the overview.
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
    // The overview page at '/checkout-step-two.html' shows 'Total: $43.18' and a 'Finish' button.
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(page.locator('[data-test="total-label"]')).toHaveText('Total: $43.18');
    await expect(page.locator('[data-test="finish"]')).toBeVisible();

    // 2. Click the 'Finish' button.
    await page.locator('[data-test="finish"]').click();
    // The browser navigates to '/checkout-complete.html'.
    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    // The page title reads 'Checkout: Complete!'.
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Complete!');
    // A 'Pony Express' image is displayed.
    await expect(page.locator('[data-test="pony-express"]')).toBeVisible();
    // A heading reads exactly 'Thank you for your order!'.
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
    // The confirmation text reads exactly 'Your order has been dispatched, and will arrive just as fast as the pony can get there!'.
    await expect(page.locator('[data-test="complete-text"]')).toHaveText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
    // The cart badge is no longer displayed in the header — the cart was emptied by placing the order.
    await expect(cartBadge).toHaveCount(0);
    // A 'Back Home' button is displayed.
    await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();

    // 3. Click the 'Back Home' button.
    await page.locator('[data-test="back-to-products"]').click();
    // The browser navigates to '/inventory.html'.
    await expect(page).toHaveURL(/\/inventory\.html$/);
    // No cart badge is displayed (cart is empty).
    await expect(cartBadge).toHaveCount(0);
    // The Backpack's button reads 'Add to cart' again, confirming the app state was reset for a new purchase.
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible();
  });
});
