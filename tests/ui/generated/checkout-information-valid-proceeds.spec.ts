// spec: specs/saucedemo-checkout.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Checkout Step One: Customer Information', () => {
  test('Valid customer information proceeds to the order overview', async ({ page }) => {
    const firstName = page.locator('[data-test="firstName"]');
    const lastName = page.locator('[data-test="lastName"]');
    const postalCode = page.locator('[data-test="postalCode"]');

    // 1. Log in with 'standard_user' / 'secret_sauce', add 'Sauce Labs Backpack' to the cart, open the cart, and click 'Checkout'.
    await page.goto('/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    // The checkout information page at '/checkout-step-one.html' is displayed with an empty form.
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(firstName).toHaveValue('');
    await expect(lastName).toHaveValue('');
    await expect(postalCode).toHaveValue('');

    // 2. Fill First Name with 'Bosco', Last Name with 'Nguyen', and Zip/Postal Code with '70000', then click 'Continue'.
    await firstName.fill('Bosco');
    await lastName.fill('Nguyen');
    await postalCode.fill('70000');
    await page.locator('[data-test="continue"]').click();
    // No error banner is shown.
    await expect(page.locator('[data-test="error"]')).toHaveCount(0);
    // The browser navigates to '/checkout-step-two.html'.
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    // The page title reads 'Checkout: Overview'.
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview');
  });
});
