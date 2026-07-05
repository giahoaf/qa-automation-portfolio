// spec: specs/saucedemo-checkout.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/login.page';
import { InventoryPage } from '../../../pages/inventory.page';
import { CartPage } from '../../../pages/cart.page';

test.describe('Cart Page', () => {
  test('Cart page displays all added items with quantities, prices, and actions', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    // 1. Start from the seed file state on '/' and log in with 'standard_user' / 'secret_sauce'.
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    // The browser navigates to '/inventory.html' with no cart badge visible.
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.cartBadge).toHaveCount(0);

    // 2. Add two products: 'Sauce Labs Backpack' and 'Sauce Labs Bike Light'.
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.addToCart('sauce-labs-bike-light');
    // The cart badge shows '2'.
    await expect(inventoryPage.cartBadge).toHaveText('2');

    // 3. Open the cart.
    await inventoryPage.openCart();
    // The browser navigates to '/cart.html'.
    await expect(page).toHaveURL(/\/cart\.html$/);
    // The page title reads 'Your Cart'.
    await expect(cartPage.title).toHaveText('Your Cart');
    // The list header shows 'QTY' and 'Description'.
    await expect(cartPage.qtyLabel).toHaveText('QTY');
    await expect(cartPage.descLabel).toHaveText('Description');

    // 4. Inspect the cart item rows.
    // Exactly 2 items are listed: 'Sauce Labs Backpack' and 'Sauce Labs Bike Light'.
    await expect(cartPage.itemRows).toHaveCount(2);
    await expect(cartPage.itemNames).toHaveText(['Sauce Labs Backpack', 'Sauce Labs Bike Light']);
    // Each item shows quantity '1'.
    await expect(cartPage.itemQuantities).toHaveText(['1', '1']);
    // The Backpack row shows price '$29.99' and the Bike Light row shows '$9.99' (rows are in add order).
    await expect(cartPage.itemPrices).toHaveText(['$29.99', '$9.99']);
    // Each row has a 'Remove' button.
    await expect(cartPage.removeButton('sauce-labs-backpack')).toBeVisible();
    await expect(cartPage.removeButton('sauce-labs-bike-light')).toBeVisible();
    // 'Continue Shopping' and 'Checkout' buttons are visible.
    await expect(cartPage.continueShoppingButton).toBeVisible();
    await expect(cartPage.checkoutButton).toBeVisible();
  });
});
