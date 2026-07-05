// spec: specs/saucedemo-checkout.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/login.page';
import { InventoryPage } from '../../../pages/inventory.page';
import { CartPage } from '../../../pages/cart.page';
import { CheckoutInformationPage } from '../../../pages/checkout-information.page';
import { CheckoutOverviewPage } from '../../../pages/checkout-overview.page';

test.describe('Checkout Step Two: Order Overview', () => {
  test('Overview lists the ordered items with payment, shipping, and correct totals for a two-item cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutInfo = new CheckoutInformationPage(page);
    const checkoutOverview = new CheckoutOverviewPage(page);

    // 1. Log in with 'standard_user' / 'secret_sauce', add 'Sauce Labs Backpack' ($29.99) and 'Sauce Labs Bike Light' ($9.99) to the cart, open the cart, click 'Checkout', and submit the customer form (First Name 'Bosco', Last Name 'Nguyen', Zip/Postal Code '70000').
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.addToCart('sauce-labs-bike-light');
    await inventoryPage.openCart();
    await cartPage.checkout();
    await checkoutInfo.submitInformation('Bosco', 'Nguyen', '70000');
    // The browser navigates to '/checkout-step-two.html'.
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    // The page title reads 'Checkout: Overview'.
    await expect(checkoutOverview.title).toHaveText('Checkout: Overview');

    // 2. Inspect the item list on the overview page.
    // Both items are listed with quantity '1' each: 'Sauce Labs Backpack' at '$29.99' and 'Sauce Labs Bike Light' at '$9.99'.
    await expect(checkoutOverview.itemNames).toHaveText([
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
    ]);

    const backpackRow = checkoutOverview.itemByName('Sauce Labs Backpack');
    await expect(backpackRow.locator('[data-test="item-quantity"]')).toHaveText('1');
    await expect(backpackRow.locator('[data-test="inventory-item-price"]')).toHaveText('$29.99');

    const bikeLightRow = checkoutOverview.itemByName('Sauce Labs Bike Light');
    await expect(bikeLightRow.locator('[data-test="item-quantity"]')).toHaveText('1');
    await expect(bikeLightRow.locator('[data-test="inventory-item-price"]')).toHaveText('$9.99');

    // The item rows show no 'Remove' buttons (items cannot be removed on this page).
    await expect(page.locator('[data-test^="remove"]')).toHaveCount(0);

    // 3. Inspect the payment and shipping information block.
    // 'Payment Information:' shows the value 'SauceCard #31337'.
    await expect(checkoutOverview.paymentInfoValue).toHaveText('SauceCard #31337');
    // 'Shipping Information:' shows the value 'Free Pony Express Delivery!'.
    await expect(checkoutOverview.shippingInfoValue).toHaveText('Free Pony Express Delivery!');

    // 4. Inspect the 'Price Total' block.
    // The subtotal reads exactly 'Item total: $39.98'.
    await expect(checkoutOverview.subtotalLabel).toHaveText('Item total: $39.98');
    // The tax reads exactly 'Tax: $3.20'.
    await expect(checkoutOverview.taxLabel).toHaveText('Tax: $3.20');
    // The total reads exactly 'Total: $43.18'.
    await expect(checkoutOverview.totalLabel).toHaveText('Total: $43.18');
    // 'Cancel' and 'Finish' buttons are displayed.
    await expect(checkoutOverview.cancelButton).toBeVisible();
    await expect(checkoutOverview.finishButton).toBeVisible();
  });
});
