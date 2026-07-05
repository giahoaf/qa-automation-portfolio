// spec: specs/saucedemo-checkout.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/login.page';
import { InventoryPage } from '../../../pages/inventory.page';
import { CartPage } from '../../../pages/cart.page';
import { CheckoutInformationPage } from '../../../pages/checkout-information.page';
import { CheckoutOverviewPage } from '../../../pages/checkout-overview.page';

test.describe('Checkout Step Two: Order Overview', () => {
  test('Cancel on the overview page returns to the inventory with the cart intact', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutInfo = new CheckoutInformationPage(page);
    const checkoutOverview = new CheckoutOverviewPage(page);

    // 1. Log in, add 'Sauce Labs Backpack' and 'Sauce Labs Bike Light', and proceed through checkout step one with valid customer info to reach the overview.
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.addToCart('sauce-labs-bike-light');
    await inventoryPage.openCart();
    await cartPage.checkout();
    await checkoutInfo.submitInformation('Bosco', 'Nguyen', '70000');
    // The overview page is displayed with the cart badge showing '2'.
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(checkoutOverview.cartBadge).toHaveText('2');

    // 2. Click the 'Cancel' button.
    await checkoutOverview.cancel();
    // Cancel from the overview goes to the inventory, NOT back to the cart.
    await expect(page).toHaveURL(/\/inventory\.html$/);
    // The cart badge still shows '2' — the order was not placed and the cart contents are preserved.
    await expect(inventoryPage.cartBadge).toHaveText('2');
  });
});
