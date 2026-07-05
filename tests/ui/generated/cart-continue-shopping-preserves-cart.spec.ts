// spec: specs/saucedemo-checkout.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/login.page';
import { InventoryPage } from '../../../pages/inventory.page';
import { CartPage } from '../../../pages/cart.page';

test.describe('Cart Page', () => {
  test('Continue Shopping returns to the inventory with the cart preserved', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    // 1. Log in, add 'Sauce Labs Backpack' (slug sauce-labs-backpack), and open the cart.
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.openCart();
    // The cart page at '/cart.html' lists 'Sauce Labs Backpack' and the badge shows '1'.
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(cartPage.itemNames).toHaveText(['Sauce Labs Backpack']);
    await expect(cartPage.cartBadge).toHaveText('1');

    // 2. Click the 'Continue Shopping' button.
    await cartPage.continueShopping();
    // The browser navigates back to '/inventory.html'.
    await expect(page).toHaveURL(/\/inventory\.html$/);
    // The cart badge still shows '1' (cart contents are preserved).
    await expect(inventoryPage.cartBadge).toHaveText('1');
    // The Backpack's button on the inventory page reads 'Remove', confirming it is still in the cart.
    await expect(inventoryPage.removeButton('sauce-labs-backpack')).toHaveText('Remove');
  });
});
