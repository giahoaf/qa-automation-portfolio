// spec: specs/saucedemo-checkout.md
// seed: tests/ui/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/login.page';
import { InventoryPage } from '../../../pages/inventory.page';
import { CartPage } from '../../../pages/cart.page';

test.describe('Cart Page', () => {
  test('Removing items from the cart updates the list and the cart badge', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    // 1. Log in, add 'Sauce Labs Backpack' and 'Sauce Labs Bike Light', and open the cart.
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.addToCart('sauce-labs-bike-light');
    await inventoryPage.openCart();
    // The cart page at '/cart.html' lists 2 items and the cart badge shows '2'.
    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(cartPage.itemNames).toHaveText(['Sauce Labs Backpack', 'Sauce Labs Bike Light']);
    await expect(cartPage.cartBadge).toHaveText('2');

    // 2. Remove the Bike Light (slug sauce-labs-bike-light).
    await cartPage.removeItem('sauce-labs-bike-light');
    // The Bike Light row disappears immediately; only 'Sauce Labs Backpack' remains.
    await expect(cartPage.itemNames).toHaveText(['Sauce Labs Backpack']);
    // The cart badge decrements to '1'.
    await expect(cartPage.cartBadge).toHaveText('1');

    // 3. Remove the Backpack (slug sauce-labs-backpack).
    await cartPage.removeItem('sauce-labs-backpack');
    // The cart list is empty (zero item rows).
    await expect(cartPage.itemRows).toHaveCount(0);
    // The cart badge element is removed entirely.
    await expect(cartPage.cartBadge).toHaveCount(0);
    // The 'Continue Shopping' and 'Checkout' buttons are still displayed.
    await expect(cartPage.continueShoppingButton).toBeVisible();
    await expect(cartPage.checkoutButton).toBeVisible();
  });
});
