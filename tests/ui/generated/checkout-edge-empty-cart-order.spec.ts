// spec: specs/saucedemo-checkout.md
// seed: tests/ui/seed.spec.ts

// CHARACTERIZATION TEST: this intentionally PINS currently-observed quirky behavior —
// SauceDemo lets you check out with an empty cart and complete a zero-item ($0) order.
// If the product is later fixed to block empty-cart checkout, this test should fail
// and be updated to assert the new (blocking) behavior.

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/login.page';
import { InventoryPage } from '../../../pages/inventory.page';
import { CartPage } from '../../../pages/cart.page';
import { CheckoutInformationPage } from '../../../pages/checkout-information.page';
import { CheckoutOverviewPage } from '../../../pages/checkout-overview.page';
import { CheckoutCompletePage } from '../../../pages/checkout-complete.page';

test.describe('Checkout Edge Cases', () => {
  test('Checkout with an empty cart is permitted and produces a $0 order (known product quirk)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutInfo = new CheckoutInformationPage(page);
    const checkoutOverview = new CheckoutOverviewPage(page);
    const checkoutComplete = new CheckoutCompletePage(page);

    // 1. Log in with 'standard_user' / 'secret_sauce' (do NOT add any products), and open the cart.
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.openCart();
    // The cart page at '/cart.html' is displayed with zero item rows.
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(cartPage.itemRows).toHaveCount(0);
    // The 'Checkout' button is still visible and enabled — the app does not block empty-cart checkout (quirk).
    await expect(cartPage.checkoutButton).toBeVisible();
    await expect(cartPage.checkoutButton).toBeEnabled();

    // 2. Click 'Checkout', then submit the customer form (First Name 'Empty', Last Name 'Cart', Zip/Postal Code '00000').
    await cartPage.checkout();
    await checkoutInfo.submitInformation('Empty', 'Cart', '00000');
    // The browser reaches '/checkout-step-two.html' with an empty item list (zero item rows).
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(checkoutOverview.itemRows).toHaveCount(0);
    // The subtotal reads exactly 'Item total: $0' (no decimal places, unlike non-zero subtotals).
    await expect(checkoutOverview.subtotalLabel).toHaveText('Item total: $0');
    // The tax reads exactly 'Tax: $0.00'.
    await expect(checkoutOverview.taxLabel).toHaveText('Tax: $0.00');
    // The total reads exactly 'Total: $0.00'.
    await expect(checkoutOverview.totalLabel).toHaveText('Total: $0.00');

    // 3. Click the 'Finish' button.
    await checkoutOverview.finish();
    // The browser navigates to '/checkout-complete.html' and shows the heading 'Thank you for your order!'.
    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(checkoutComplete.completeHeader).toHaveText('Thank you for your order!');
  });
});
