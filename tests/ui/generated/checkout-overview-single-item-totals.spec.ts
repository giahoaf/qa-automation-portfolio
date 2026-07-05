// spec: specs/saucedemo-checkout.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/login.page';
import { InventoryPage } from '../../../pages/inventory.page';
import { CartPage } from '../../../pages/cart.page';
import { CheckoutInformationPage } from '../../../pages/checkout-information.page';
import { CheckoutOverviewPage } from '../../../pages/checkout-overview.page';

test.describe('Checkout Step Two: Order Overview', () => {
  test('Totals are computed correctly for a single-item cart (8% tax)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutInfo = new CheckoutInformationPage(page);
    const checkoutOverview = new CheckoutOverviewPage(page);

    // 1. Log in with 'standard_user' / 'secret_sauce', add only 'Sauce Labs Backpack' to the cart, open the cart, click 'Checkout', and submit the customer form with valid values.
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.openCart();
    await cartPage.checkout();
    await checkoutInfo.submitInformation('Bosco', 'Nguyen', '70000');
    // The overview page at '/checkout-step-two.html' lists exactly one item: 'Sauce Labs Backpack' at '$29.99'.
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(checkoutOverview.itemRows).toHaveCount(1);
    await expect(checkoutOverview.itemNames).toHaveText('Sauce Labs Backpack');
    await expect(checkoutOverview.itemPrices).toHaveText('$29.99');

    // 2. Inspect the 'Price Total' block.
    // The subtotal reads exactly 'Item total: $29.99'.
    await expect(checkoutOverview.subtotalLabel).toHaveText('Item total: $29.99');
    // The tax reads exactly 'Tax: $2.40' (8% of $29.99 = 2.3992, rounded to 2.40).
    await expect(checkoutOverview.taxLabel).toHaveText('Tax: $2.40');
    // The total reads exactly 'Total: $32.39'.
    await expect(checkoutOverview.totalLabel).toHaveText('Total: $32.39');
  });
});
