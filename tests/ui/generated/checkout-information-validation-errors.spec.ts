// spec: specs/saucedemo-checkout.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Checkout Step One: Customer Information', () => {
  test('Validation errors are shown for each missing required field, in order', async ({ page }) => {
    const firstName = page.locator('[data-test="firstName"]');
    const lastName = page.locator('[data-test="lastName"]');
    const postalCode = page.locator('[data-test="postalCode"]');
    const continueButton = page.locator('[data-test="continue"]');
    const errorBanner = page.locator('[data-test="error"]');
    const errorButton = page.locator('[data-test="error-button"]');

    // 1. Log in with 'standard_user' / 'secret_sauce', add 'Sauce Labs Backpack' to the cart, open the cart, and click 'Checkout'.
    await page.goto('/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    // The browser navigates to '/checkout-step-one.html'.
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    // The page title reads 'Checkout: Your Information'.
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Your Information');
    // Three empty inputs are shown with their placeholders, plus 'Cancel' and 'Continue' buttons.
    await expect(firstName).toHaveValue('');
    await expect(firstName).toHaveAttribute('placeholder', 'First Name');
    await expect(lastName).toHaveValue('');
    await expect(lastName).toHaveAttribute('placeholder', 'Last Name');
    await expect(postalCode).toHaveValue('');
    await expect(postalCode).toHaveAttribute('placeholder', 'Zip/Postal Code');
    await expect(page.locator('[data-test="cancel"]')).toBeVisible();
    await expect(continueButton).toBeVisible();

    // 2. Click 'Continue' with all three fields empty.
    await continueButton.click();
    // The page stays on '/checkout-step-one.html'.
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    // An error banner shows the exact text 'Error: First Name is required'.
    await expect(errorBanner).toHaveText('Error: First Name is required');
    // The banner has a dismiss 'X' button.
    await expect(errorButton).toBeVisible();

    // 3. Fill only First Name with 'Bosco' and click 'Continue' again.
    await firstName.fill('Bosco');
    await continueButton.click();
    // The error banner text changes to exactly 'Error: Last Name is required'.
    await expect(errorBanner).toHaveText('Error: Last Name is required');

    // 4. Fill Last Name with 'Nguyen', leave Zip/Postal Code empty, and click 'Continue' again.
    await lastName.fill('Nguyen');
    await continueButton.click();
    // The error banner text changes to exactly 'Error: Postal Code is required'.
    await expect(errorBanner).toHaveText('Error: Postal Code is required');

    // 5. Click the 'X' button on the error banner.
    await errorButton.click();
    // The error banner is removed from the page.
    await expect(errorBanner).toHaveCount(0);
    // The previously entered values ('Bosco', 'Nguyen') are retained in their fields.
    await expect(firstName).toHaveValue('Bosco');
    await expect(lastName).toHaveValue('Nguyen');
  });
});
