// spec: specs/saucedemo-checkout.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/login.page';
import { InventoryPage } from '../../../pages/inventory.page';
import { CartPage } from '../../../pages/cart.page';
import { CheckoutInformationPage } from '../../../pages/checkout-information.page';

test.describe('Checkout Step One: Customer Information', () => {
  test('Cancel on the information page returns to the cart with contents intact', async ({ page }) => {
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
    // The checkout information page at '/checkout-step-one.html' is displayed.
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);

    // 2. Click the 'Cancel' button.
    await checkoutInfo.cancelButton.click();
    // The browser navigates back to '/cart.html'.
    await expect(page).toHaveURL(/\/cart\.html$/);
    // The cart still lists 'Sauce Labs Backpack' and the cart badge still shows '1' (canceling does not clear the cart).
    await expect(cartPage.itemByName('Sauce Labs Backpack')).toBeVisible();
    await expect(cartPage.cartBadge).toHaveText('1');
  });
});
