// spec: specs/saucedemo-checkout.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/login.page';
import { InventoryPage } from '../../../pages/inventory.page';
import { CartPage } from '../../../pages/cart.page';
import { CheckoutInformationPage } from '../../../pages/checkout-information.page';
import { CheckoutOverviewPage } from '../../../pages/checkout-overview.page';

test.describe('Checkout Step One: Customer Information', () => {
  test('Valid customer information proceeds to the order overview', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutInfo = new CheckoutInformationPage(page);
    const checkoutOverview = new CheckoutOverviewPage(page);

    // 1. Log in with 'standard_user' / 'secret_sauce', add 'Sauce Labs Backpack' to the cart, open the cart, and click 'Checkout'.
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.openCart();
    await cartPage.checkout();
    // The checkout information page at '/checkout-step-one.html' is displayed with an empty form.
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(checkoutInfo.firstNameInput).toHaveValue('');
    await expect(checkoutInfo.lastNameInput).toHaveValue('');
    await expect(checkoutInfo.postalCodeInput).toHaveValue('');

    // 2. Submit the customer form with First Name 'Bosco', Last Name 'Nguyen', Zip/Postal Code '70000'.
    await checkoutInfo.submitInformation('Bosco', 'Nguyen', '70000');
    // No error banner is shown.
    await expect(checkoutInfo.errorBanner).toHaveCount(0);
    // The browser navigates to '/checkout-step-two.html'.
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    // The page title reads 'Checkout: Overview'.
    await expect(checkoutOverview.title).toHaveText('Checkout: Overview');
  });
});
