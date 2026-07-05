// spec: specs/saucedemo-checkout.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/login.page';
import { InventoryPage } from '../../../pages/inventory.page';
import { CartPage } from '../../../pages/cart.page';
import { CheckoutInformationPage } from '../../../pages/checkout-information.page';

test.describe('Checkout Step One: Customer Information', () => {
  test('Validation errors are shown for each missing required field, in order', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutInfo = new CheckoutInformationPage(page);

    // 1. Log in with 'standard_user' / 'secret_sauce', add 'Sauce Labs Backpack' to the cart, open the cart, and click 'Checkout'.
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.openCart();
    await cartPage.checkout();
    // The browser navigates to '/checkout-step-one.html'.
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    // The page title reads 'Checkout: Your Information'.
    await expect(checkoutInfo.title).toHaveText('Checkout: Your Information');
    // Three empty inputs plus 'Cancel' and 'Continue' buttons are shown.
    await expect(checkoutInfo.firstNameInput).toHaveValue('');
    await expect(checkoutInfo.lastNameInput).toHaveValue('');
    await expect(checkoutInfo.postalCodeInput).toHaveValue('');
    await expect(checkoutInfo.cancelButton).toBeVisible();
    await expect(checkoutInfo.continueButton).toBeVisible();

    // 2. Click 'Continue' with all three fields empty.
    await checkoutInfo.continueButton.click();
    // The page stays on '/checkout-step-one.html'.
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    // An error banner shows the exact text: 'Error: First Name is required'.
    await expect(checkoutInfo.errorBanner).toHaveText('Error: First Name is required');
    // The banner has a dismiss 'X' button.
    await expect(checkoutInfo.errorDismissButton).toBeVisible();

    // 3. Fill only First Name with 'Bosco' and click 'Continue' again.
    await checkoutInfo.firstNameInput.fill('Bosco');
    await checkoutInfo.continueButton.click();
    // The error banner text changes to exactly: 'Error: Last Name is required'.
    await expect(checkoutInfo.errorBanner).toHaveText('Error: Last Name is required');

    // 4. Fill Last Name with 'Nguyen', leave Zip/Postal Code empty, and click 'Continue' again.
    await checkoutInfo.lastNameInput.fill('Nguyen');
    await checkoutInfo.continueButton.click();
    // The error banner text changes to exactly: 'Error: Postal Code is required'.
    await expect(checkoutInfo.errorBanner).toHaveText('Error: Postal Code is required');

    // 5. Click the dismiss 'X' button on the error banner.
    await checkoutInfo.errorDismissButton.click();
    // The error banner is removed from the page.
    await expect(checkoutInfo.errorBanner).toHaveCount(0);
    // The previously entered values ('Bosco', 'Nguyen') are retained in their fields.
    await expect(checkoutInfo.firstNameInput).toHaveValue('Bosco');
    await expect(checkoutInfo.lastNameInput).toHaveValue('Nguyen');
  });
});
